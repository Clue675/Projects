const mongoose = require('mongoose');

// Define the schema for a vendor's certification
const certificationSchema = new mongoose.Schema({
    // Reference to the vendor this certification belongs to
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },

    // Name of the certification
    certificateName: {
        type: String,
        required: true
    },

    // Detailed text or description of the certification
    certificateText: String,

    // Date when the certification was issued
    issuedDate: {
        type: Date,
        required: true
    },

    // The entity or authority that issued the certification
    issuedBy: String,

    // Expiration date of the certification
    expirationDate: Date,

    // Reference to the file/document of the certification (e.g., URL if stored externally)
    fileReference: String,

    // Additional notes regarding the certification
    notes: String,

    // Timestamps for when the certification record was created or last updated
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Before saving, update the 'updatedAt' field to the current time
certificationSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Create and export the model based on the schema
module.exports = mongoose.model('Certification', certificationSchema);

