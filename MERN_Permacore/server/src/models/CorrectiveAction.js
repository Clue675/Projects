const mongoose = require('mongoose');

// Define the schema for a corrective action
const correctiveActionSchema = new mongoose.Schema({
    // A unique ID for this corrective action, could be auto-generated or manually entered
    correctiveActionId: {
        type: String,
        required: true,
        unique: true
    },

    // Reference to the vendor this corrective action is associated with
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor'
    },

    // Reference to the discrepancy report that initiated this corrective action
    discrepancyReportId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DiscrepancyReport',
        required: true
    },

    // Specific details about the corrective action
    actionDetails: String,

    // The current status of the corrective action
    status: {
        type: String,
        enum: ['Issued', 'Containment', 'Response Received', 'Under Review', 'Response Accepted', 'Objective Evidence Requested', 'Validation', 'Closed', 'Canceled'],
        default: 'Issued'
    },

    // Additional notes or comments
    notes: String,

    // Timestamps for when the corrective action was created and last updated
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
correctiveActionSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Export the model
module.exports = mongoose.model('CorrectiveAction', correctiveActionSchema);
