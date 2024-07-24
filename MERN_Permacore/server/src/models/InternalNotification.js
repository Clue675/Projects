const mongoose = require('mongoose');

const internalNotificationSchema = new mongoose.Schema({
    internalNotificationId: {
        type: String,
        required: true,
        unique: true
    },
    issueDetails: String,
    correctiveActionRequired: Boolean,
    targetAudience: {
        department: String,
        individuals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    },
    acknowledgments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        acknowledgedAt: Date
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

internalNotificationSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});
