const mongoose = require("mongoose");
const Department = require('./Department');
const TrainingSession = require('./Training');
const RequiredTraining = require('../models/RequiredTraining');

const { Schema } = mongoose; // Destructuring to get Schema directly

const employeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  badgeNumber: { type: String, required: true, unique: true },
  department: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
  isActive: { type: Boolean, default: true }, // Adding a default value of true
  completedTrainings: [{
    trainingSession: { type: Schema.Types.ObjectId, ref: 'TrainingSession' },
    title: { type: String, required: true },
    completionDate: { type: Date, default: null },
  }],
  
  requiredTrainings: [{
    requiredTrainingSession: { type: Schema.Types.ObjectId, ref: 'RequiredTraining' },
    title: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
    completionDate: { type: Date, default: null },
  }],
  
}, { timestamps: true });



const Employee = mongoose.model("Employee", employeeSchema);
module.exports = Employee;