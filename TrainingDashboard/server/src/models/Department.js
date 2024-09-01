const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Assuming Division schema is defined in 'Division.js'
const Division = require('./Divisions');
const Employee = require('./Employee');

const departmentSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  division: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Division', // Corrected the reference name
    required: true
  },
  employees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }],
  workCenter: {
    type: String,
    required: true, // Only add if workCenter is required for every department
    trim: true // Optional, but useful to remove leading/trailing whitespace. Trust me, this  will save you time and debugging headaches!
  }
  
}, { timestamps: true });

module.exports = mongoose.model('Department', departmentSchema);
