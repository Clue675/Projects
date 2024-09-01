const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
  certificateName: {
    type: String,
    required: true
  },
  certificateText: String,
  issuedDate: {
    type: Date,
    required: true
  },
  issuedBy: String,
  expirationDate: {
    type: Date,
    required: true
  },
  notes: String
});

const vendorSchema = new mongoose.Schema({
  vendorName: {
    type: String,
    required: true
  },
  vendorNumber: {
    type: Number,
    required: true
  },
  vendorCapabilities: [String],
  approvalType: String,
  lastAuditDate: {
    type: Date,
    required: true
  },
  nextAuditDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  comments: String,
  email: {
    type: String,
    required: true
  },
  streetAddress: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zipCode: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  qualityRepName: {
    type: String,
    required: true
  },
  salesRepName: {
    type: String,
    required: true
  },
  certifications: [certificationSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

vendorSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Vendor', vendorSchema);
