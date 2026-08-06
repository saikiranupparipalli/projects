const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Log = require('../models/Log');
const authMiddleware = require('../middleware/authMiddleware');

const JWT_SECRET = process.env.JWT_SECRET || 'backlogs_secret_key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'backlogs_refresh_secret_key_2026';

// Helper function to generate AccessToken (2 days) and RefreshToken (2 months)
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '2d' }
  );

  const refreshToken = jwt.sign(
    { id: user._id, email: user.email },
    JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '60d' }
  );

  return { accessToken, refreshToken };
};

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields (name, email, password)' });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name: cleanName,
      email: cleanEmail,
      passwordHash
    });

    // Record registration user log
    try {
      await Log.create({
        userId: newUser._id,
        action: 'USER_REGISTER',
        title: 'Account created',
        details: `Registered account for ${newUser.name} (${cleanEmail})`,
        type: 'auth'
      });
    } catch (logErr) {
      console.error('Failed to log registration:', logErr);
    }

    const { accessToken, refreshToken } = generateTokens(newUser);

    res.status(201).json({
      accessToken,
      refreshToken,
      token: accessToken,
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (err) {
    console.error('Registration error details:', err);
    if (err.code === 11000 || (err.name === 'MongoServerError' && err.code === 11000)) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }
    if (err.name === 'ValidationError') {
      const msg = Object.values(err.errors || {}).map(e => e.message).join(', ') || 'Validation error during registration';
      return res.status(400).json({ message: msg });
    }
    res.status(500).json({ message: err.message || 'Server error during registration', error: err.toString() });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!user.passwordHash) {
      return res.status(400).json({ message: 'Invalid account data' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Record login user log
    try {
      await Log.create({
        userId: user._id,
        action: 'USER_LOGIN',
        title: 'User logged in',
        details: `Successful login for ${user.email}`,
        type: 'auth'
      });
    } catch (logErr) {
      console.error('Failed to log login:', logErr);
    }

    const { accessToken, refreshToken } = generateTokens(user);

    res.json({
      accessToken,
      refreshToken,
      token: accessToken,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Login error details:', err);
    res.status(500).json({ message: err.message || 'Server error during login', error: err.toString() });
  }
});

// @route   POST /api/auth/refresh
// @desc    Generate a new access token using a valid refresh token (valid for 2 months)
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token is required' });
    }

    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const tokens = generateTokens(user);

    res.json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      token: tokens.accessToken,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Refresh token error details:', err);
    return res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching user profile' });
  }
});

module.exports = router;
