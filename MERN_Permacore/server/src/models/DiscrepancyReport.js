const mongoose = require('mongoose');

// Define the schema for a discrepancy report
const discrepancyReportSchema = new mongoose.Schema({
    // A unique identifier for the report
    reportId: {
        type: String,
        required: true,
        unique: true
    },

    // Reference to the inspection from which this report is generated
    inspectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inspection',
        required: true
    },

    // Details of the discrepancy found during the inspection
    discrepancyDetails: String,

    // The vendor associated with the inspected shipment or item
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor'
    },

    // Indicate if the discrepancy is the vendor's fault or internal
    atFault: {
        type: String,
        enum: ['Vendor', 'Internal'],
        required: true
    },

    // Any additional notes or comments about the discrepancy
    notes: String,

    // Timestamps for when the report was created and last updated
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware to automatically update the 'updatedAt' field on save
discrepancyReportSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Export the model
module.exports = mongoose.model('DiscrepancyReport', discrepancyReportSchema);
