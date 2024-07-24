const mongoose = require('mongoose');

const supplierQualitySchema = new mongoose.Schema({
    vendorName: { type: String, required: true },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId, // Use ObjectId for references
        required: true,
        ref: 'Vendor' // Reference to Vendor collection
    },
    performanceScore: { type: Number, required: true },
    status: { type: String, required: true },
    riskCode: { type: String, required: false },
    lastAuditDate: { type: Date, required: false },
    nextAuditDate: { type: Date, required: false },
    comments: { type: String, required: false },
    nonconformingNotifications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NonconformingNotification'
    }],
    correctiveActions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CorrectiveAction'
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Middleware for updatedAt field
supplierQualitySchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('SupplierQuality', supplierQualitySchema);
