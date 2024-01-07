const mongoose = require('mongoose');

// Define the schema for a vendor
const vendorSchema = new mongoose.Schema({
    // Vendor name
    vendorName: {
        type: String,
        required: true
    },

    // Contact information
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
    performanceScore: Number,
    qualityScore: Number,
    deliveryScore: Number,

    // Audit dates and status
    lastAuditDate: Date,
    nextAuditDate: Date,
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'UnderReview'],
        default: 'Active'
    },

    // Risk assessment
    riskCode: String,

    // Comments or additional notes
    comments: String,

    // Timestamps for record creation and modification
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },

    // References to certifications held by the vendor
    certifications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Certification'
    }]
});

// Middleware for updatedAt field
vendorSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Vendor', vendorSchema);
