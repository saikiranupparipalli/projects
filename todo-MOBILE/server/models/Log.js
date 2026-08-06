const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: [true, 'Log action is required'],
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Log title is required'],
      trim: true,
    },
    details: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error', 'create', 'update', 'delete', 'auth'],
      default: 'info',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Log', LogSchema);
