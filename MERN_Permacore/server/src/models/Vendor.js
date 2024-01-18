const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
    vendorId: {
        type: Number,
        required: true,
        unique: true
    },
    vendorName: {
        type: String,
        required: true
    },
    contactInfo: {
        email: String,
        streetAddress: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
        phone: String,
        qualityRepName: String,
        salesRepName: String
    },
    // Performance score and other quality-related metrics
    performanceScore: {
        type: Number,
        default: 0 // Default value set to 0
    },
    qualityScore: {
        type: Number,
        default: 0 // Default value set to 0
    },
    deliveryScore: {
        type: Number,
        default: 0 // Default value set to 0
    },
    lastAuditDate: Date,
    nextAuditDate: Date,
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Probation, Disqualified, On-Hold'],
        default: 'Active'
    },
    riskCode: Number,
    comments: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    certifications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Certification'
    }]
});

// Middleware for updatedAt field. Used this also in timestamp in mongodb collections.
vendorSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

let Vendor;
if (mongoose.models.Vendor) {
    Vendor = mongoose.model('Vendor');
} else {
    Vendor = mongoose.model('Vendor', vendorSchema);
}

module.exports = Vendor;
