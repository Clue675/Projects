const mongoose = require('mongoose');

// Define the schema for a nonconforming notification
const nonconformingNotificationSchema = new mongoose.Schema({
    // Unique identifier for the notification
    notificationId: {
        type: String,
        required: true,
        unique: true
    },

    // Details about the nonconformity
    nonconformityDetails: String,

    // Reference to the discrepancy report related to this notification
    discrepancyReportId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DiscrepancyReport',
        required: true
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
nonconformingNotificationSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('NonconformingNotification', nonconformingNotificationSchema);
