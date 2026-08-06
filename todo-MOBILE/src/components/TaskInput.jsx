import React, { useState } from 'react';
import { Plus, Expand } from 'lucide-react';
import { getTodayISOString } from '../utils/dates';

export function TaskInput({ onAddTask, onOpenFullModal }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState(getTodayISOString());

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      description: '',
      priority,
      dueDate,
      dueTime: '',
      starred: false,
      tags: [],
      subtasks: []
    });

    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="quick-add-bar glass-card">
      <Plus size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
      <input
        type="text"
        placeholder="Add a task... (Type title & press Enter)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="quick-add-input"
      />

      <div className="quick-add-controls">
        <select 
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="custom-select quick-add-select"
          title="Select Priority"
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
          <option value="urgent">Urgent</option>
        </select>

        <input 
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="custom-select quick-add-date"
        />

        <button 
          type="button"
          onClick={() => onOpenFullModal({ title, priority, dueDate })} 
          className="icon-btn"
          title="Expand detailed options"
        >
          <Expand size={15} />
        </button>

        <button type="submit" className="btn-primary quick-add-btn" style={{ padding: '0.45rem 0.95rem' }}>
          Add
        </button>
      </div>
    </form>
  );
}
