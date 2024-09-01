// server/src/models/Certification.js

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const certificationSchema = new mongoose.Schema({
  certificationNumber: {
    type: String,
    required: [true, 'Please provide a certification number'],
    unique: true,
  },
  employeeBadgeNumber: {
    type: String,
    required: [true, 'Certification must be associated with an employee badge number'],
  },
  trainingCode: {
    type: String,
    required: [true, 'Certification must be associated with a training code'],
  },
  dateOfCompletion: {
    type: Date,
    required: [true, 'Please provide the date of completion'],
  },
  expirationDate: {
    type: Date,
  },
  certificateDocument: { // Optional field for storing a document or link
    type: String,
  },
  // You can add additional fields as needed
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
});

// Pre-save hook for generating a unique certification number
certificationSchema.pre('save', function (next) {
  if (this.isNew) {
    this.certificationNumber = `CERT-${uuidv4()}-${Date.now()}`;
  }
  next();
});

const Certification = mongoose.model('Certification', certificationSchema);

module.exports = Certification;

function checkIfRequiredTraining(trainingCode) {
  // Placeholder for the actual logic to determine if the training is required
  // This could involve a database lookup or checking against a list of required trainings
  const requiredTrainings = ['CODE123', 'CODE456']; // Example training codes
  return requiredTrainings.includes(trainingCode);
}
