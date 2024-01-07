const mongoose = require('mongoose');

// Define the schema for an internal corrective action
const internalCorrectiveActionSchema = new mongoose.Schema({
    // Unique identifier for the corrective action
    internalCorrectiveActionId: {
        type: String,
        required: true,
        unique: true
    },

    // Reference to the internal notification that initiated this corrective action
    internalNotificationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InternalNotification',
        required: true
    },

    // Detailed description of the corrective action
    actionDetails: String,

    // The current status of the corrective action
    status: {
        type: String,
        enum: ['Issued', 'Under Review', 'Completed', 'Canceled'],
        default: 'Issued'
    },

    // Additional notes or comments
    notes: String,

    // Timestamps for record creation and modification
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware for updatedAt field
internalCorrectiveActionSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('InternalCorrectiveAction', internalCorrectiveActionSchema);
