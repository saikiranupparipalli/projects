import React, { useState } from 'react';
import { 
  Check, Star, Calendar, ChevronDown, ChevronUp, 
  Edit3, Trash2, Copy, CheckSquare, Square, AlertCircle
} from 'lucide-react';
import { formatRelativeDate } from '../utils/dates';

export function TaskCard({ 
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

  return (
    <div className={`task-card glass-card ${task.completed ? 'completed' : ''}`}>
      <div className="task-main-row">
        {/* Minimal Checkbox */}
        <button 
          onClick={() => onToggleComplete(task.id)}
          className={`custom-checkbox ${task.completed ? 'checked' : ''}`}
          aria-label={task.completed ? "Mark as incomplete" : "Mark as completed"}
        >
          {task.completed && <Check size={13} strokeWidth={3} />}
        </button>

        {/* Details */}
        <div className="task-details">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
            <span className="task-title-text">{task.title}</span>

            {/* Quick Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <button 
                onClick={() => onToggleStar(task.id)}
                style={{ color: task.starred ? '#fbbf24' : 'var(--text-subtle)' }}
                className="icon-btn"
                title={task.starred ? "Unstar task" : "Star task"}
              >
                <Star size={15} fill={task.starred ? '#fbbf24' : 'transparent'} />
              </button>
              
              <button onClick={() => onEdit(task)} className="icon-btn" title="Edit task">
                <Edit3 size={14} />
              </button>

              <button onClick={() => onDuplicate(task)} className="icon-btn" title="Duplicate task">
                <Copy size={14} />
              </button>

              <button onClick={() => onDelete(task.id)} className="icon-btn" title="Delete task">
                <Trash2 size={14} style={{ color: 'var(--priority-urgent)' }} />
              </button>

              {totalSubtasks > 0 && (
                <button 
                  onClick={() => setExpanded(!expanded)} 
                  className="icon-btn"
                  title={expanded ? "Hide subtasks" : "Show subtasks"}
                >
                  {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </button>
              )}
            </div>
          </div>

          {task.description && (
            <p className="task-description">{task.description}</p>
          )}

          {/* Meta Bar */}
          <div className="task-meta-row" style={{ marginTop: '0.15rem' }}>
            {/* Priority */}
            <span className={`badge priority-badge ${task.priority}`}>
              {task.priority}
            </span>

            {/* Due Date */}
            {relativeDate && (
              <span className={`date-badge ${relativeDate.status}`}>
                {relativeDate.status === 'overdue' ? <AlertCircle size={12} /> : <Calendar size={12} />}
                <span>{relativeDate.label}</span>
              </span>
            )}

            {/* Subtask count */}
            {totalSubtasks > 0 && (
              <span className="badge" style={{ background: '#18181b', color: 'var(--text-muted)' }}>
                <CheckSquare size={12} />
                <span>{completedSubtasks}/{totalSubtasks} Subtasks</span>
              </span>
            )}

            {/* Tags */}
            {task.tags && task.tags.map((tag) => (
              <span key={tag} className="tag-chip">
                #{tag}
              </span>
            ))}
          </div>

          {/* Subtask Progress Bar */}
          {totalSubtasks > 0 && (
            <div className="subtask-progress-bar" style={{ marginTop: '0.35rem' }}>
              <div 
                className="subtask-progress-fill" 
                style={{ width: `${subtaskPercent}%` }} 
              />
            </div>
          )}

          {/* Subtasks Checklist */}
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
  );
}
