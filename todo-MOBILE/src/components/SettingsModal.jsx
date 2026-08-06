import React from 'react';
import { X, RefreshCw, Trash2, Volume2, Moon, Sun, AlertTriangle } from 'lucide-react';

export function SettingsModal({ 
  isOpen, 
  onClose, 
  settings, 
  setSettings, 
  onExportJSON, 
  onExportCSV,
  onImportJSON,
  onResetSampleData,
  onClearAllData
}) {
  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (Array.isArray(parsed)) {
            onImportJSON(parsed);
          } else {
            alert('Invalid backup format. Expected a JSON array of tasks.');
          }
        } catch (err) {
          alert('Failed to parse JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-card mobile-bottom-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div className="mobile-sheet-drag-handle" />
        <div className="modal-header">
          <h2>App Settings & Data</h2>
          <button onClick={onClose} className="icon-btn">
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {/* Preferences */}
          <div className="glass-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Preferences</h4>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.9rem' }}>Sound Effects</span>
              <button 
                onClick={() => setSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
                className="btn-secondary"
                style={{ padding: '0.35rem 0.75rem' }}
              >
                {settings.soundEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.3rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.9rem' }}>Screen Brightness</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)' }}>
                  {settings.brightness || 100}%
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Sun size={14} style={{ color: 'var(--text-subtle)' }} />
                <input
                  type="range"
                  min="40"
                  max="120"
                  step="5"
                  value={settings.brightness || 100}
                  onChange={(e) => setSettings({ ...settings, brightness: Number(e.target.value) })}
                  className="brightness-slider"
                  style={{ flex: 1 }}
                />
                <Sun size={18} style={{ color: 'var(--primary)' }} />
              </div>
              <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.2rem' }}>
                {[
                  { label: '50% Dim', val: 50 },
                  { label: '80% Soft', val: 80 },
                  { label: '100% Default', val: 100 },
                  { label: '115% Max', val: 115 }
                ].map((p) => (
                  <button
                    key={p.val}
                    type="button"
                    onClick={() => setSettings({ ...settings, brightness: p.val })}
                    style={{
                      flex: 1,
                      padding: '0.25rem 0.2rem',
                      fontSize: '0.7rem',
                      borderRadius: 'var(--radius-sm)',
                      background: (settings.brightness || 100) === p.val ? 'var(--primary)' : 'var(--bg-surface)',
                      color: (settings.brightness || 100) === p.val ? '#ffffff' : 'var(--text-muted)',
                      border: '1px solid var(--border-color)',
                      cursor: 'pointer'
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Reset & Wipe Data (Danger Zone) */}
          <div 
            className="glass-card" 
            style={{ 
              padding: '1.1rem', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '0.85rem',
              background: 'rgba(225, 29, 72, 0.04)',
              borderColor: 'rgba(225, 29, 72, 0.25)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--priority-urgent)' }}>
              <AlertTriangle size={17} />
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--priority-urgent)', letterSpacing: '0.04em' }}>Danger Zone</h4>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              Careful! Resetting restores initial sample data, while wiping removes all logs permanently.
            </p>

            <div className="danger-zone-buttons">
              <button 
                type="button" 
                onClick={onResetSampleData} 
                className="btn-secondary" 
                style={{ padding: '0.65rem 0.85rem', justifyContent: 'center', fontSize: '0.84rem' }}
              >
                <RefreshCw size={15} />
                <span>Reset Sample Data</span>
              </button>

              <button 
                type="button" 
                onClick={onClearAllData} 
                className="btn-secondary" 
                style={{ padding: '0.65rem 0.85rem', justifyContent: 'center', fontSize: '0.84rem', color: 'var(--priority-urgent)', borderColor: 'rgba(225, 29, 72, 0.3)' }}
              >
                <Trash2 size={15} />
                <span>Wipe All Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
