import React, { useState } from 'react';
import { 
  Check, Star, Calendar, ChevronDown, ChevronUp, 
  Edit3, Trash2, Copy, CheckSquare, Square, AlertCircle, Clock
} from 'lucide-react';
import { formatRelativeDate } from '../utils/dates';

export function TimelineItem({ 
  task, 
  onToggleComplete, 
  onToggleStar, 
  onEdit, 
  onDuplicate, 
  onDelete,
  onToggleSubtask
}) {
  const [expanded, setExpanded] = useState(false);

  const relativeDate = formatRelativeDate(
    task.dueTime ? `${task.dueDate}T${task.dueTime}` : task.dueDate
  );

  const totalSubtasks = task.subtasks?.length || 0;
  const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;
  const subtaskPercent = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  // Timeline node style based on status
  const getNodeConfig = () => {
    if (task.completed) {
      return { bg: 'var(--accent-emerald)', icon: Check, glow: 'rgba(16, 185, 129, 0.4)' };
    }
    if (relativeDate?.status === 'overdue') {
      return { bg: 'var(--priority-urgent)', icon: AlertCircle, glow: 'rgba(244, 63, 94, 0.4)' };
    }
    if (relativeDate?.status === 'today') {
      return { bg: 'var(--primary)', icon: Clock, glow: 'var(--primary-glow)' };
    }
    return { bg: '#334155', icon: Square, glow: 'transparent' };
  };

  const nodeConfig = getNodeConfig();
  const NodeIcon = nodeConfig.icon;

  return (
    <div className="timeline-item">
      {/* Timeline Node Icon */}
      <div 
        className="timeline-node" 
        style={{ 
          backgroundColor: nodeConfig.bg,
          boxShadow: `0 0 16px ${nodeConfig.glow}`
        }}
        onClick={() => onToggleComplete(task.id)}
        title={task.completed ? "Mark incomplete" : "Mark complete"}
      >
        <NodeIcon size={14} style={{ color: '#fff' }} />
      </div>

      {/* Timeline Task Card Content */}
      <div className={`task-card glass-card ${task.completed ? 'completed' : ''}`} style={{ flex: 1 }}>
        <div className="task-main-row">
          <div className="task-details">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
              <span className="task-title-text">{task.title}</span>

              {/* Quick Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <button 
                  onClick={() => onToggleStar(task.id)}
                  style={{ color: task.starred ? '#fbbf24' : 'var(--text-subtle)' }}
                  className="icon-btn"
                  title={task.starred ? "Unstar" : "Star"}
                >
                  <Star size={15} fill={task.starred ? '#fbbf24' : 'transparent'} />
                </button>
                
                <button onClick={() => onEdit(task)} className="icon-btn" title="Edit item">
                  <Edit3 size={14} />
                </button>

                <button onClick={() => onDuplicate(task)} className="icon-btn" title="Duplicate">
                  <Copy size={14} />
                </button>

                <button onClick={() => onDelete(task.id)} className="icon-btn" title="Delete">
                  <Trash2 size={14} style={{ color: 'var(--priority-urgent)' }} />
                </button>

                {totalSubtasks > 0 && (
                  <button 
                    onClick={() => setExpanded(!expanded)} 
                    className="icon-btn"
                    title={expanded ? "Hide checklist" : "Show checklist"}
                  >
                    {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </button>
                )}
              </div>
            </div>

            {task.description && (
              <p className="task-description">{task.description}</p>
            )}

            {/* Meta Row */}
            <div className="task-meta-row" style={{ marginTop: '0.2rem' }}>
              <span className={`badge priority-badge ${task.priority}`}>
                {task.priority}
              </span>

              {relativeDate && (
                <span className={`date-badge ${relativeDate.status}`}>
                  <Calendar size={12} />
                  <span>{relativeDate.label}</span>
                </span>
              )}

              {totalSubtasks > 0 && (
                <span className="badge" style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--text-muted)' }}>
                  <CheckSquare size={12} />
                  <span>{completedSubtasks}/{totalSubtasks} Checklist</span>
                </span>
              )}

              {task.tags && task.tags.map((tag) => (
                <span key={tag} className="tag-chip">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Subtask Progress Bar */}
            {totalSubtasks > 0 && (
              <div className="subtask-progress-bar" style={{ marginTop: '0.4rem' }}>
                <div className="subtask-progress-fill" style={{ width: `${subtaskPercent}%` }} />
              </div>
            )}

            {/* Expanded Subtask List */}
            {expanded && totalSubtasks > 0 && (
              <div className="subtasks-container">
                {task.subtasks.map((st) => (
                  <div 
                    key={st.id} 
                    onClick={() => onToggleSubtask(task.id, st.id)}
                    className={`subtask-item ${st.completed ? 'completed' : ''}`}
                    style={{ cursor: 'pointer' }}
                  >
                    {st.completed ? (
                      <CheckSquare size={14} style={{ color: 'var(--primary)' }} />
                    ) : (
                      <Square size={14} />
                    )}
                    <span>{st.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
