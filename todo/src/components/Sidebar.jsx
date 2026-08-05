import React from 'react';
import { 
  CheckCircle2, Calendar, Clock, Star, AlertTriangle, 
  Inbox, Tag 
} from 'lucide-react';

export function Sidebar({ 
  currentFilter, 
  setCurrentFilter, 
  selectedTag,
  setSelectedTag,
  counts,
  tags
}) {
  const smartNav = [
    { id: 'all', label: 'All Tasks', icon: Inbox, count: counts.all },
    { id: 'today', label: 'Today', icon: Calendar, count: counts.today },
    { id: 'upcoming', label: 'Upcoming', icon: Clock, count: counts.upcoming },
    { id: 'important', label: 'Important', icon: Star, count: counts.important },
    { id: 'overdue', label: 'Overdue', icon: AlertTriangle, count: counts.overdue },
    { id: 'completed', label: 'Completed', icon: CheckCircle2, count: counts.completed },
  ];

  return (
    <aside className="sidebar glass-panel">
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
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', padding: '0.2rem 0.2rem' }}>
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
                    background: isSelected ? 'var(--primary)' : '#18181b',
                    color: isSelected ? '#fff' : 'var(--text-muted)',
                    border: isSelected ? 'none' : '1px solid var(--border-color)'
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
