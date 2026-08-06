import React from 'react';
import { TimelineItem } from './TimelineItem';
import { Sparkles, ArrowUpDown, Trash2, CheckSquare } from 'lucide-react';

export function TaskList({ 
  tasks, 
  sortBy, 
  setSortBy, 
  onToggleComplete, 
  onToggleStar, 
  onEdit, 
  onDuplicate, 
  onDelete,
  onToggleSubtask,
  onClearCompleted,
  onMarkAllCompleted,
  viewTitle
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      {/* Toolbar Controls */}
      <div className="task-toolbar">
        <h3 className="view-heading">
          <span>{viewTitle}</span>
          <span className="count-pill">{tasks.length}</span>
        </h3>

        <div className="toolbar-controls">
          {tasks.length > 0 && (
            <div className="toolbar-action-buttons">
              <button 
                onClick={onMarkAllCompleted} 
                className="btn-secondary" 
                style={{ fontSize: '0.78rem', padding: '0.4rem 0.65rem', justifyContent: 'center' }}
                title="Mark all items in view as completed"
              >
                <CheckSquare size={14} />
                <span>Mark All Done</span>
              </button>

              <button 
                onClick={onClearCompleted} 
                className="btn-secondary" 
                style={{ fontSize: '0.78rem', padding: '0.4rem 0.65rem', color: 'var(--priority-urgent)', justifyContent: 'center' }}
                title="Remove completed items"
              >
                <Trash2 size={14} />
                <span>Clear Completed</span>
              </button>
            </div>
          )}

          <div className="toolbar-sort-group">
            <ArrowUpDown size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="custom-select"
              style={{ width: '100%' }}
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="title">Sort Alphabetically</option>
              <option value="createdAt">Sort by Date Added</option>
            </select>
          </div>
        </div>
      </div>

      {/* Timeline View Layout */}
      {tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Sparkles size={28} />
          </div>
          <h4 style={{ fontSize: '1.05rem' }}>No log items found</h4>
          <p style={{ maxWidth: '340px', fontSize: '0.88rem' }}>
            All clear! You've completed everything in this view or no items match your search.
          </p>
        </div>
      ) : (
        <div className="timeline-wrapper">
          <div className="timeline-stem" />
          <div className="timeline-list">
            {tasks.map((task) => (
              <TimelineItem
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onToggleStar={onToggleStar}
                onEdit={onEdit}
                onDuplicate={onDuplicate}
                onDelete={onDelete}
                onToggleSubtask={onToggleSubtask}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
