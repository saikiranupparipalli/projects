import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Star } from 'lucide-react';
import { getTodayISOString } from '../utils/dates';

export function TaskModal({ isOpen, onClose, onSave, taskToEdit, initialData }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState(getTodayISOString());
  const [dueTime, setDueTime] = useState('');
  const [starred, setStarred] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [subtasks, setSubtasks] = useState([]);
  const [subtaskInput, setSubtaskInput] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');
      setPriority(taskToEdit.priority || 'medium');
      setDueDate(taskToEdit.dueDate || getTodayISOString());
      setDueTime(taskToEdit.dueTime || '');
      setStarred(!!taskToEdit.starred);
      setTags(taskToEdit.tags || []);
      setSubtasks(taskToEdit.subtasks || []);
    } else if (initialData) {
      setTitle(initialData.title || '');
      setPriority(initialData.priority || 'medium');
      setDueDate(initialData.dueDate || getTodayISOString());
      setDescription('');
      setDueTime('');
      setStarred(false);
      setTags([]);
      setSubtasks([]);
    } else {
      resetForm();
    }
  }, [taskToEdit, initialData, isOpen]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate(getTodayISOString());
    setDueTime('');
    setStarred(false);
    setTags([]);
    setTagInput('');
    setSubtasks([]);
    setSubtaskInput('');
  };

  if (!isOpen) return null;

  const handleAddTag = (e) => {
    if (e) e.preventDefault();
    const trimmed = tagInput.trim().toLowerCase().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleAddSubtask = (e) => {
    if (e) e.preventDefault();
    if (subtaskInput.trim()) {
      setSubtasks([
        ...subtasks,
        { id: `sub-${Date.now()}`, title: subtaskInput.trim(), completed: false }
      ]);
      setSubtaskInput('');
    }
  };

  const handleRemoveSubtask = (subtaskId) => {
    setSubtasks(subtasks.filter((s) => s.id !== subtaskId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: taskToEdit ? taskToEdit.id : undefined,
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate,
      dueTime,
      starred,
      tags,
      subtasks
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ fontSize: '1.15rem' }}>{taskToEdit ? 'Edit Task' : 'Create New Task'}</h2>
          <button onClick={onClose} className="icon-btn">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Title */}
          <div className="form-group">
            <label className="form-label">Task Title *</label>
            <input
              type="text"
              required
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description / Notes</label>
            <textarea
              rows={2}
              placeholder="Add extra context or notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
            />
          </div>

          {/* Priority */}
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="form-select"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          {/* Due Date & Time */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Due Time (Optional)</label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          {/* Subtasks */}
          <div className="form-group">
            <label className="form-label">Subtasks / Checklist</label>
            <div style={{ display: 'flex', gap: '0.45rem' }}>
              <input
                type="text"
                placeholder="Add subtask item..."
                value={subtaskInput}
                onChange={(e) => setSubtaskInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                className="form-input"
              />
              <button type="button" onClick={handleAddSubtask} className="btn-secondary">
                <Plus size={15} />
              </button>
            </div>

            {subtasks.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.4rem' }}>
                {subtasks.map((st) => (
                  <div 
                    key={st.id} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      padding: '0.35rem 0.6rem',
                      background: '#121215',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <span style={{ fontSize: '0.82rem' }}>{st.title}</span>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveSubtask(st.id)}
                      style={{ color: 'var(--priority-urgent)' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="form-group">
            <label className="form-label">Tags</label>
            <div style={{ display: 'flex', gap: '0.45rem' }}>
              <input
                type="text"
                placeholder="Add tag (e.g. urgent)..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="form-input"
              />
              <button type="button" onClick={handleAddTag} className="btn-secondary">
                Add Tag
              </button>
            </div>

            {tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.4rem' }}>
                {tags.map((tag) => (
                  <span key={tag} className="tag-chip" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    #{tag}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveTag(tag)}
                      style={{ color: 'var(--text-muted)', display: 'flex' }}
                    >
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Starred */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setStarred(!starred)}
              className="icon-btn"
              style={{ color: starred ? '#fbbf24' : 'var(--text-muted)' }}
            >
              <Star size={16} fill={starred ? '#fbbf24' : 'transparent'} />
            </button>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Mark as Important / Starred
            </span>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.4rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {taskToEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
