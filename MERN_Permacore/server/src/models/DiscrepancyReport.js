const mongoose = require('mongoose');

const reworkOperationSchema = new mongoose.Schema({
  os: String,
  workCenter: String,
  reworkInstructions: String,
  date: Date,
  operatorId: String,
  runHr: Number,
  quantityAccept: Number,
  quantityReject: Number,
  quantityScrap: Number,
}, { _id: false });

const discrepancyReportSchema = new mongoose.Schema({
  reportId: {
    type: String,
    required: true,
    unique: true
  },
  inspectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inspection',
    required: true
  },
  shipmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shipment',
    required: true
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  vendorName: {
    type: String,
    required: true
  },
  shipmentDetails: String,
  discrepancyDetails: {
    type: String,
    required: true
  },
  atFault: {
    type: String,
    enum: ['Vendor', 'Internal', 'Customer Return', 'N/A'],
    required: true
  },
  quantityRejected: {
    type: Number,
    required: true
  },
  rejectionCodes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RejectionCode'
  }],
  correctiveActions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CorrectiveAction'
  }],
  nonconformingNotifications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NonconformingNotification'
  }],
  totalCost: {
    type: Number,
    required: true
  },
  notes: String,
  rejectionDescription: String,
  reworkOperations: [reworkOperationSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

discrepancyReportSchema.pre('save', function(next) {
  if (!this.isNew) {
    this.updatedAt = Date.now();
  }
  next();
});

module.exports = mongoose.model('DiscrepancyReport', discrepancyReportSchema);
