const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
  },
  description: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['todo', 'inProgress', 'done'],
    default: 'todo',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
    set: v => v.toLowerCase() // Ensure value is converted to lowercase before saving
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required'],
  },
  assignee: {
    type: String, // Changed from ObjectId to String if you're not linking to a User model
    required: [true, 'Assignee is required'],
  },
  labels: [String],
}, { timestamps: true });

// Virtual property for days until due or overdue
taskSchema.virtual('daysUntilDue').get(function() {
  const now = new Date();
  const due = new Date(this.dueDate);
  const diff = due - now;
  const daysUntilDue = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return daysUntilDue < 0 ? 0 : daysUntilDue; // Adjusted to return 0 instead of negative values.
});

// Include virtuals in toJSON and toObject for API responses
taskSchema.set('toJSON', { virtuals: true });
taskSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Task', taskSchema);
