import React from 'react';
import { 
  CheckCircle2, Calendar, Clock, Star, AlertTriangle, 
  Inbox, Tag, X, Sun 
} from 'lucide-react';

export function Sidebar({ 
  currentFilter, 
  setCurrentFilter, 
  selectedTag,
  setSelectedTag,
  counts,
  tags,
  onCloseMobileSidebar
}) {
  const smartNav = [
    { id: 'all', label: 'ls', icon: Inbox, count: counts.all },
    { id: 'today', label: 'Today', icon: Calendar, count: counts.today },
    { id: 'upcoming', label: 'Upcoming', icon: Clock, count: counts.upcoming },
    { id: 'important', label: 'Important', icon: Star, count: counts.important },
    { id: 'overdue', label: 'Overdue', icon: AlertTriangle, count: counts.overdue },
    { id: 'completed', label: 'Completed', icon: CheckCircle2, count: counts.completed },
  ];

  return (
    <aside className="sidebar glass-panel">
      {/* Mobile Drawer Header */}
      <div className="mobile-drawer-header">
        <span className="mobile-drawer-title">Navigation</span>
        {onCloseMobileSidebar && (
          <button 
            onClick={onCloseMobileSidebar}
            className="icon-btn mobile-drawer-close"
            title="Close Drawer"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Smart Views */}
      <div className="sidebar-section">
        <h4 className="sidebar-title">Views</h4>
        {smartNav.map((item) => {
          const Icon = item.icon;
          const isActive = currentFilter === item.id && !selectedTag;
          return (
            <button
              key={item.id}
              onClick={() => {
                setCurrentFilter(item.id);
                setSelectedTag(null);
              }}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <div className="nav-item-left">
                <Icon size={17} />
                <span>{item.label}</span>
              </div>
              <span className="count-pill">{item.count}</span>
            </button>
          );
        })}
      </div>

      {/* Tags Section */}
      {tags.length > 0 && (
        <div className="sidebar-section">
          <h4 className="sidebar-title">Tags</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', padding: '0.2rem 0.2rem' }}>
            {tags.map((tag) => {
              const isSelected = selectedTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedTag(isSelected ? null : tag);
                  }}
                  className="tag-chip"
                  style={{
                    cursor: 'pointer',
                    background: isSelected ? 'var(--primary)' : 'var(--bg-surface)',
                    color: isSelected ? '#ffffff' : 'var(--text-muted)',
                    border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                    padding: '0.3rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                    fontWeight: isSelected ? '600' : '500',
                    transition: 'var(--transition)'
                  }}
                >
                  #{tag}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
}
