const mongoose = require('mongoose');

// Define the schema for an internal notification
const internalNotificationSchema = new mongoose.Schema({
    // Unique identifier for the notification
    internalNotificationId: {
        type: String,
        required: true,
        unique: true
    },

    // Details of the issue or nonconformity
    issueDetails: String,

    // Indication of whether a corrective action is required
    correctiveActionRequired: Boolean,

    // Timestamps for when the notification was created and last updated
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
internalNotificationSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('InternalNotification', internalNotificationSchema);
