const mongoose = require('mongoose');

const correctiveActionSchema = new mongoose.Schema({
    correctiveActionId: {
        type: String,
        required: true,
        unique: true
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor'
    },
    discrepancyReportId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DiscrepancyReport',
        required: true
    },
    actionDetails: String,
    actionPriority: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        default: 'Medium'
    },
    dueDate: Date,
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['Issued', 'Containment', 'Response Received', 'Under Review', 'Response Accepted', 'Objective Evidence Requested', 'Validation', 'Closed', 'Canceled'],
        default: 'Issued'
    },
    notes: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

correctiveActionSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('CorrectiveAction', correctiveActionSchema);
