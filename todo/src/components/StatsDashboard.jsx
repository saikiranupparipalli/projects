import React from 'react';
import { X, Flame, CheckCircle2, Award, PieChart, TrendingUp } from 'lucide-react';

export function StatsDashboard({ isOpen, onClose, tasks, stats }) {
  if (!isOpen) return null;

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  const urgentCount = tasks.filter((t) => t.priority === 'urgent' && !t.completed).length;
  const highCount = tasks.filter((t) => t.priority === 'high' && !t.completed).length;

  // SVG Circular Meter math
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Award size={22} style={{ color: 'var(--primary)' }} />
            <h2>Productivity Analytics</h2>
          </div>
          <button onClick={onClose} className="icon-btn">
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {/* Progress Circular Meter */}
          <div className="glass-card" style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r={radius}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="60"
                cy="60"
                r={radius}
                stroke="url(#progressGradient)"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                transform="rotate(-90 60 60)"
                style={{ transition: 'stroke-dashoffset 0.6s ease' }}
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
              <text x="60" y="65" textAnchor="middle" fill="var(--text-main)" fontSize="20" fontWeight="bold">
                {percent}%
              </text>
            </svg>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Completion Rate
            </span>
          </div>

          {/* Streak & Counters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="glass-card" style={{ padding: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ padding: '0.6rem', background: 'rgba(245, 158, 11, 0.15)', borderRadius: 'var(--radius-md)', color: '#fbbf24' }}>
                <Flame size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.2rem' }}>{stats.streakCount} Days</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Daily Streak</span>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ padding: '0.6rem', background: 'rgba(16, 185, 129, 0.15)', borderRadius: 'var(--radius-md)', color: '#10b981' }}>
                <CheckCircle2 size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.2rem' }}>{completed} / {total}</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tasks Completed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="glass-card" style={{ padding: '1rem' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            Active Task Priorities
          </h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span className="category-dot" style={{ backgroundColor: 'var(--priority-urgent)' }} />
              <span>Urgent: <strong>{urgentCount}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span className="category-dot" style={{ backgroundColor: 'var(--priority-high)' }} />
              <span>High: <strong>{highCount}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span className="category-dot" style={{ backgroundColor: 'var(--accent-emerald)' }} />
              <span>Pending Total: <strong>{pending}</strong></span>
            </div>
          </div>
        </div>

        {/* Advice / Motivational Tip */}
        <div style={{ textAlign: 'center', padding: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {percent >= 80 ? "🚀 Outstanding work! You're crushing your goals today." :
           percent >= 50 ? "⚡ Great momentum! Over half of your tasks are completed." :
           "💡 Pro tip: Break large tasks into subtasks to build momentum quickly."}
        </div>
      </div>
    </div>
  );
}
