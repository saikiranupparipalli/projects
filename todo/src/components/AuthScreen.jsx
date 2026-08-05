import React, { useState } from 'react';
import { ListTodo, ArrowRight, Lock, Mail, User, Loader2 } from 'lucide-react';
import { loginUser, registerUser } from '../utils/auth';

export function AuthScreen({ onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (!name.trim()) {
          setError('Please enter your name.');
          setLoading(false);
          return;
        }
        const res = await registerUser(name, email, password);
        if (res.success && res.user) {
          onLoginSuccess(res.user);
        } else {
          setError(res.message || 'Registration failed.');
        }
      } else {
        const res = await loginUser(email, password);
        if (res.success && res.user) {
          onLoginSuccess(res.user);
        } else {
          setError(res.message || 'Invalid email or password.');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f3efe6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      color: '#23211e'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        padding: '2.25rem',
        borderRadius: '24px',
        background: '#f8f6f0',
        border: '1px solid #dcd4c5',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        boxShadow: '0 16px 40px rgba(0,0,0,0.05)'
      }}>
        {/* Minimalist Logo & Brand */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', textAlign: 'center' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '16px',
            background: '#eae4d8',
            border: '1px solid #dcd4c5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#8c6d58'
          }}>
            <ListTodo size={26} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '0.04em', fontFamily: 'Cinzel, serif' }}>c inbox</h1>
            <p style={{ fontSize: '0.86rem', color: '#6e675f', marginTop: '0.2rem' }}>
              {isSignUp ? 'Create your personal account' : 'Sign in to access your backlogs'}
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            padding: '0.65rem 0.85rem',
            borderRadius: '12px',
            background: 'rgba(225, 29, 72, 0.1)',
            border: '1px solid rgba(225, 29, 72, 0.25)',
            color: '#e11d48',
            fontSize: '0.82rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {isSignUp && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#9c9388' }} />
                <input
                  type="text"
                  required
                  placeholder="Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2.5rem', borderRadius: '9999px' }}
                  disabled={loading}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#9c9388' }} />
              <input
                type="email"
                required
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem', borderRadius: '9999px' }}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#9c9388' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem', borderRadius: '9999px' }}
                disabled={loading}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ justifyContent: 'center', padding: '0.7rem', marginTop: '0.2rem', borderRadius: '9999px' }}>
            {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : (
              <>
                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Toggle Login/Sign Up */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '0.75rem', borderTop: '1px solid #dcd4c5' }}>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            disabled={loading}
            style={{ fontSize: '0.82rem', color: '#6e675f', textDecoration: 'underline', cursor: 'pointer' }}
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}
