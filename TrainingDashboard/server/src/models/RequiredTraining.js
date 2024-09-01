const mongoose = require('mongoose');
const Department = require('./Department'); // Make sure to import the Department model
const Division = require('./Divisions'); // Make sure to import the Department model
const Schema = mongoose.Schema; // Add this line to define Schema

const requiredTrainingSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  departments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Department' }],
  divisions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Division' }], // Add reference to Division model
  frequency: {
    type: String,
    enum: ['Annually', 'Semi-Annually', 'Quarterly','Two Years'], // Add your frequency options
    default: 'Annually'
  }
}, { timestamps: true });

module.exports = mongoose.model('RequiredTraining', requiredTrainingSchema);

