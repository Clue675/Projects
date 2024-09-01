const mongoose = require('mongoose');

const nonconformingNotificationSchema = new mongoose.Schema({
    notificationId: {
        type: String,
        required: true,
        unique: true
    },
    nonconformityDetails: String,
    severityLevel: {
        type: String,
        enum: ['Critical', 'Major', 'Minor'],
        required: true
    },
    discrepancyReportId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DiscrepancyReport',
        required: true
    },
    followUpActions: [{
        action: String,
        dueDate: Date,
        responsiblePerson: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }],
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

nonconformingNotificationSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('NonconformingNotification', nonconformingNotificationSchema);
