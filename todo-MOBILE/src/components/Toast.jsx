import React from 'react';
import { CheckCircle2, RotateCcw, X } from 'lucide-react';

export function Toast({ toast, onUndo, onClose }) {
  if (!toast) return null;

  return (
    <div className="toast-container">
      <div className="toast">
        <CheckCircle2 size={18} style={{ color: 'var(--accent-emerald)' }} />
        <span style={{ fontSize: '0.88rem' }}>{toast.message}</span>

        {toast.undoAction && (
          <button 
            onClick={onUndo} 
            className="btn-secondary" 
            style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', marginLeft: '0.5rem' }}
          >
            <RotateCcw size={13} />
            <span>Undo</span>
          </button>
        )}

        <button onClick={onClose} style={{ color: 'var(--text-muted)', marginLeft: '0.4rem' }}>
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
