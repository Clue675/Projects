// src/models/Certification.js
const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',  // Ensures a link to the Vendor model
        required: true
    },
    certificateName: {
        type: String,
        required: true
    },
    certificateText: String,
    issuedDate: {
        type: Date,
        required: true
    },
    issuedBy: String,
    expirationDate: Date,
    fileReference: String,
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

certificationSchema.pre('save', function(next) {
    this.updatedAt = Date.now(); // Ensure the updated date is set on each save
    next();
});

module.exports = mongoose.model('Certification', certificationSchema);
