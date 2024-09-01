// Import the necessary library
const mongoose = require('mongoose');

// Define the schema for a training record
const trainingRecordSchema = new mongoose.Schema({
  trainee: {
    type: mongoose.Schema.Types.ObjectId, // Reference to an Employee model
    ref: 'Employee',
    required: true
  },
  trainingTitle: {
    type: String, // Storing the training title directly
    required: true
  },
  dateCompleted: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Completed', 'Past Due', 'Due This Week', 'Due This Month', 'Due This Year'],
  },
  remarks: String,
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps automatically
});

// Conditionally compile the model to avoid recompilation errors
const TrainingRecord = mongoose.models.TrainingRecord || mongoose.model('TrainingRecord', trainingRecordSchema);



// Export the model
module.exports = TrainingRecord;
