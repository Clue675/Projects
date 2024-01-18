const mongoose = require('mongoose');

// Define the schema for an inspection
const inspectionSchema = new mongoose.Schema({
    // Unique identifier for the inspection
    inspectionId: {
        type: String,
        required: true,
        unique: true
    },
    vendorId: {
        type: Number, // Ensure this is a Number to match your vendor ID strategy
        required: true
    },
    vendorName: {
        type: String,
        required: true
    },

    // Reference to the shipment that is being inspected
    purchaseOrderNumber: {
        type: Number,
        required: true
    },

    // Date when the inspection was conducted
    inspectionDate: {
        type: Date,
        default: Date.now
    },

    // Name or identifier of the inspector
    inspectorName: String,

    // Quantities related to the inspection
    quantityReceived: Number,
    quantityAccepted: Number,
    quantityRejected: Number,

    // Rejection codes associated with this inspection
    rejectionCodes: [{
        type: String,
        ref: 'RejectionCode'
    }],

    // At-fault determination for discrepancies (if any)
    atFault: {
        type: String,
        enum: ['Vendor', 'Internal','Customer Return','N/A'],
        default: 'Vendor'
    },

    // Additional notes or findings from the inspection
    notes: String,

    // Timestamps for when the inspection record was created and last updated
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware to automatically update the 'updatedAt' field on save
inspectionSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Export the model
module.exports = mongoose.model('Inspection', inspectionSchema);
