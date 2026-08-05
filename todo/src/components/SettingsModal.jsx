import React from 'react';
import { X, Download, Upload, RefreshCw, Trash2, Volume2, Moon } from 'lucide-react';

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
      <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
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
          </div>

          {/* Backup & Export */}
          <div className="glass-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Backup & Export</h4>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={onExportJSON} className="btn-secondary" style={{ flex: 1 }}>
                <Download size={16} />
                <span>Export JSON</span>
              </button>
              
              <button onClick={onExportCSV} className="btn-secondary" style={{ flex: 1 }}>
                <Download size={16} />
                <span>Export CSV</span>
              </button>
            </div>

            <label className="btn-secondary" style={{ justifyContent: 'center', cursor: 'pointer' }}>
              <Upload size={16} />
              <span>Import from JSON</span>
              <input type="file" accept=".json" onChange={handleFileChange} style={{ display: 'none' }} />
            </label>
          </div>

          {/* Reset & Wipe Data */}
          <div className="glass-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--priority-urgent)' }}>Danger Zone</h4>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={onResetSampleData} className="btn-secondary" style={{ flex: 1 }}>
                <RefreshCw size={15} />
                <span>Reset Sample Data</span>
              </button>

              <button 
                onClick={onClearAllData} 
                className="btn-secondary" 
                style={{ flex: 1, color: 'var(--priority-urgent)' }}
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
