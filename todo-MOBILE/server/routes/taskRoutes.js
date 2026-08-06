const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const authMiddleware = require('../middleware/authMiddleware');

// Apply JWT auth middleware to all task routes
router.use(authMiddleware);

// @route   GET /api/tasks
// @desc    Get all tasks for current user
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
    const formatted = tasks.map((t) => ({
      id: t._id.toString(),
      title: t.title,
      description: t.description,
      priority: t.priority,
      dueDate: t.dueDate,
      dueTime: t.dueTime,
      starred: t.starred,
      completed: t.completed,
      tags: t.tags,
      subtasks: t.subtasks.map((s) => ({
        id: s._id.toString(),
        title: s.title,
        completed: s.completed
      })),
      createdAt: t.createdAt
    }));
    res.json(formatted);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
router.post('/', async (req, res) => {
  try {
    const { title, description, priority, dueDate, dueTime, starred, tags, subtasks } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Task title is required' });
    }

    const newTask = await Task.create({
      userId: req.user.id,
      title: title.trim(),
      description: description || '',
      priority: priority || 'medium',
      dueDate: dueDate || '',
      dueTime: dueTime || '',
      starred: !!starred,
      completed: false,
      tags: tags || [],
      subtasks: (subtasks || []).map((s) => ({ title: s.title, completed: !!s.completed }))
    });

    res.status(201).json({
      id: newTask._id.toString(),
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      dueDate: newTask.dueDate,
      dueTime: newTask.dueTime,
      starred: newTask.starred,
      completed: newTask.completed,
      tags: newTask.tags,
      subtasks: newTask.subtasks.map((s) => ({ id: s._id.toString(), title: s.title, completed: s.completed })),
      createdAt: newTask.createdAt
    });
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ message: 'Failed to create task' });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const fields = ['title', 'description', 'priority', 'dueDate', 'dueTime', 'starred', 'completed', 'tags'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) {
        task[f] = req.body[f];
      }
    });

    if (req.body.subtasks !== undefined) {
      task.subtasks = req.body.subtasks.map((s) => ({
        title: s.title,
        completed: !!s.completed
      }));
    }

    await task.save();

    res.json({
      id: task._id.toString(),
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      dueTime: task.dueTime,
      starred: task.starred,
      completed: task.completed,
      tags: task.tags,
      subtasks: task.subtasks.map((s) => ({ id: s._id.toString(), title: s.title, completed: s.completed })),
      createdAt: task.createdAt
    });
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ message: 'Failed to update task' });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const result = await Task.deleteOne({ _id: req.params.id, userId: req.user.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ message: 'Failed to delete task' });
  }
});

// @route   POST /api/tasks/clear-completed
// @desc    Clear all completed tasks for user
router.post('/clear-completed', async (req, res) => {
  try {
    await Task.deleteMany({ userId: req.user.id, completed: true });
    res.json({ message: 'Cleared all completed tasks' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to clear completed tasks' });
  }
});

module.exports = router;
