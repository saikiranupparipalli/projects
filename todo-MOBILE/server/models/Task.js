const mongoose = require('mongoose');
// import mongoose from "mongoose"
const SubtaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const TaskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    dueDate: {
      type: String,
      default: ''
    },
    dueTime: {
      type: String,
      default: ''
    },
    starred: {
      type: Boolean,
      default: false
    },
    completed: {
      type: Boolean,
      default: false
    },
    tags: [{
      type: String,
      trim: true
    }],
    subtasks: [SubtaskSchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Task', TaskSchema);
