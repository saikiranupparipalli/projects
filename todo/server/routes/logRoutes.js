const express = require('express');
const router = express.Router();
const Log = require('../models/Log');
const authMiddleware = require('../middleware/authMiddleware');

// Apply JWT auth middleware to all log routes
router.use(authMiddleware);

// @route   GET /api/logs
// @desc    Get user logs for current user
router.get('/', async (req, res) => {
  try {
    const logs = await Log.find({ userId: req.user.id }).sort({ createdAt: -1 });
    const formatted = logs.map((l) => ({
      id: l._id.toString(),
      action: l.action,
      title: l.title,
      details: l.details,
      type: l.type,
      metadata: l.metadata,
      createdAt: l.createdAt
    }));
    res.json(formatted);
  } catch (err) {
    console.error('Error fetching logs:', err);
    res.status(500).json({ message: 'Failed to fetch user logs' });
  }
});

// @route   POST /api/logs
// @desc    Create a user log entry
router.post('/', async (req, res) => {
  try {
    const { action, title, details, type, metadata } = req.body;
    if (!action || !title) {
      return res.status(400).json({ message: 'Action and title are required for log entry' });
    }

    const newLog = await Log.create({
      userId: req.user.id,
      action: action.trim(),
      title: title.trim(),
      details: details || '',
      type: type || 'info',
      metadata: metadata || {}
    });

    res.status(201).json({
      id: newLog._id.toString(),
      action: newLog.action,
      title: newLog.title,
      details: newLog.details,
      type: newLog.type,
      metadata: newLog.metadata,
      createdAt: newLog.createdAt
    });
  } catch (err) {
    console.error('Error creating log:', err);
    res.status(500).json({ message: 'Failed to create log entry' });
  }
});

// @route   DELETE /api/logs/:id
// @desc    Delete a specific log entry
router.delete('/:id', async (req, res) => {
  try {
    const result = await Log.deleteOne({ _id: req.params.id, userId: req.user.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Log entry not found' });
    }
    res.json({ message: 'Log entry deleted successfully' });
  } catch (err) {
    console.error('Error deleting log:', err);
    res.status(500).json({ message: 'Failed to delete log entry' });
  }
});

// @route   DELETE /api/logs
// @desc    Clear all logs for current user
router.delete('/', async (req, res) => {
  try {
    await Log.deleteMany({ userId: req.user.id });
    res.json({ message: 'All user logs cleared successfully' });
  } catch (err) {
    console.error('Error clearing logs:', err);
    res.status(500).json({ message: 'Failed to clear user logs' });
  }
});

module.exports = router;
