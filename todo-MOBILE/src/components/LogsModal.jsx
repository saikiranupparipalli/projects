import React, { useState, useEffect } from 'react';
import { X, FileText, Plus, Trash2, RefreshCw, Filter, Shield, Activity, Info, CheckCircle, AlertTriangle, XCircle, Edit, PlusCircle, LogOut } from 'lucide-react';
import { api } from '../utils/api';

export function LogsModal({ isOpen, onClose }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Custom Log Form State
  const [actionInput, setActionInput] = useState('MANUAL_LOG');
  const [titleInput, setTitleInput] = useState('');
  const [detailsInput, setDetailsInput] = useState('');
  const [typeInput, setTypeInput] = useState('info');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    const res = await api.getLogs();
    if (res.success && Array.isArray(res.data)) {
      setLogs(res.data);
    } else {
      setLogs([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchLogs();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCreateLog = async (e) => {
    e.preventDefault();
    if (!titleInput.trim()) {
      setErrorMsg('Log title is required');
      return;
    }
    setErrorMsg('');
    setSubmitting(true);

    const res = await api.createLog({
      action: actionInput || 'MANUAL_LOG',
      title: titleInput.trim(),
      details: detailsInput.trim(),
      type: typeInput
    });

    if (res.success && res.data) {
      setLogs([res.data, ...logs]);
      setTitleInput('');
      setDetailsInput('');
      setShowAddForm(false);
    } else {
      setErrorMsg(res.message || 'Failed to create log entry');
    }
    setSubmitting(false);
  };

  const handleDeleteLog = async (id) => {
    setLogs(logs.filter((l) => l.id !== id));
    await api.deleteLog(id);
  };

  const handleClearLogs = async () => {
    if (confirm('Are you sure you want to clear all user logs?')) {
      setLogs([]);
      await api.clearLogs();
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'create':
        return { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981', icon: PlusCircle, label: 'Create' };
      case 'update':
        return { bg: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', icon: Edit, label: 'Update' };
      case 'delete':
        return { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', icon: Trash2, label: 'Delete' };
      case 'auth':
        return { bg: 'rgba(168, 85, 247, 0.15)', color: '#a855f7', icon: Shield, label: 'Auth' };
      case 'success':
        return { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981', icon: CheckCircle, label: 'Success' };
      case 'warning':
        return { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', icon: AlertTriangle, label: 'Warning' };
      case 'error':
        return { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', icon: XCircle, label: 'Error' };
      default:
        return { bg: 'rgba(148, 163, 184, 0.15)', color: '#94a3b8', icon: Info, label: 'Info' };
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (filterType !== 'all' && log.type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = log.title?.toLowerCase().includes(q);
      const matchAction = log.action?.toLowerCase().includes(q);
      const matchDetails = log.details?.toLowerCase().includes(q);
      if (!matchTitle && !matchAction && !matchDetails) return false;
    }
    return true;
  });

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="glass-panel modal-card" 
        style={{ maxWidth: '720px', width: '90%', maxHeight: '85vh', display: 'flex', flexDirection: 'column', gap: '1rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)' }}>
              <FileText size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Account Activity Logs</h3>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>Recorded actions and custom log entries for your account</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button onClick={fetchLogs} className="icon-btn" title="Refresh Logs">
              <RefreshCw size={16} className={loading ? 'spin' : ''} />
            </button>
            <button onClick={onClose} className="icon-btn" title="Close">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Toolbar & Filter Controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '220px' }}>
            <input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.82rem' }}
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="search-input"
              style={{ padding: '0.4rem 0.5rem', width: 'auto', fontSize: '0.82rem' }}
            >
              <option value="all">All Types</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
              <option value="auth">Auth</option>
              <option value="info">Info</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button 
              onClick={() => setShowAddForm(!showAddForm)} 
              className="btn-primary"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.82rem' }}
            >
              <Plus size={14} />
              <span>{showAddForm ? 'Cancel' : 'Create Log'}</span>
            </button>
            {logs.length > 0 && (
              <button 
                onClick={handleClearLogs}
                className="btn-secondary"
                style={{ padding: '0.4rem 0.75rem', fontSize: '0.82rem', color: 'var(--priority-urgent)' }}
                title="Clear all logs"
              >
                <Trash2 size={14} />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>

        {/* Add Custom Log Form */}
        {showAddForm && (
          <form 
            onSubmit={handleCreateLog}
            style={{
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem'
            }}
          >
            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--primary)' }}>New User Log Entry</div>
            {errorMsg && <div style={{ color: 'var(--priority-urgent)', fontSize: '0.8rem' }}>{errorMsg}</div>}
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Action Code</label>
                <input
                  type="text"
                  value={actionInput}
                  onChange={(e) => setActionInput(e.target.value)}
                  placeholder="e.g. MANUAL_LOG"
                  className="search-input"
                  style={{ width: '100%', fontSize: '0.82rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Log Category / Type</label>
                <select
                  value={typeInput}
                  onChange={(e) => setTypeInput(e.target.value)}
                  className="search-input"
                  style={{ width: '100%', fontSize: '0.82rem' }}
                >
                  <option value="info">Info</option>
                  <option value="create">Create</option>
                  <option value="update">Update</option>
                  <option value="delete">Delete</option>
                  <option value="auth">Auth</option>
                  <option value="warning">Warning</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Log Title / Summary</label>
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                placeholder="Enter log message or summary..."
                className="search-input"
                style={{ width: '100%', fontSize: '0.82rem' }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Additional Details (Optional)</label>
              <textarea
                value={detailsInput}
                onChange={(e) => setDetailsInput(e.target.value)}
                placeholder="Describe details or notes..."
                className="search-input"
                style={{ width: '100%', fontSize: '0.82rem', height: '60px', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem', marginTop: '0.2rem' }}>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={submitting}
                style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}
              >
                {submitting ? 'Saving...' : 'Save Log Entry'}
              </button>
            </div>
          </form>
        )}

        {/* Logs List Container */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingRight: '0.2rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Loading user logs...
            </div>
          ) : filteredLogs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
              <Activity size={32} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
              <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>No user logs found</div>
              <div style={{ fontSize: '0.78rem', marginTop: '0.25rem' }}>
                {searchQuery || filterType !== 'all' ? 'Try adjusting your search filters' : 'Actions in your account will be recorded here'}
              </div>
            </div>
          ) : (
            filteredLogs.map((log) => {
              const badge = getTypeBadge(log.type);
              const BadgeIcon = badge.icon;
              const formattedTime = new Date(log.createdAt).toLocaleString();

              return (
                <div
                  key={log.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-color)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', flex: 1 }}>
                    <div
                      style={{
                        padding: '0.35rem',
                        borderRadius: '6px',
                        background: badge.bg,
                        color: badge.color,
                        marginTop: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <BadgeIcon size={15} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-main)' }}>{log.title}</span>
                        <span 
                          style={{ 
                            fontSize: '0.68rem', 
                            fontWeight: 700, 
                            padding: '0.15rem 0.4rem', 
                            borderRadius: '4px', 
                            background: badge.bg, 
                            color: badge.color,
                            textTransform: 'uppercase'
                          }}
                        >
                          {log.action || badge.label}
                        </span>
                      </div>

                      {log.details && (
                        <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {log.details}
                        </p>
                      )}

                      <div style={{ marginTop: '0.25rem', fontSize: '0.7rem', color: 'var(--text-subtle)' }}>
                        {formattedTime}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteLog(log.id)}
                    className="icon-btn"
                    title="Delete log entry"
                    style={{ padding: '0.3rem', color: 'var(--text-muted)' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
