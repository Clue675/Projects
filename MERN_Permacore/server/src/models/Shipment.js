const mongoose = require('mongoose');

// Define the schema for a shipment
const shipmentSchema = new mongoose.Schema({
    // Unique identifier for the shipment
    shipmentId: {
        type: String,
        required: true,
        unique: true
    },

    // Reference to the vendor associated with this shipment
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },

    // Purchase order number related to this shipment
    purchaseOrderNumber: String,

    // Expected and actual delivery dates
    expectedDeliveryDate: Date,
    dateReceived: Date,

    // Details about the shipment contents
    partNumber: String,
    quantityShipped: Number,
    unitCost: Number,

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
shipmentSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Shipment', shipmentSchema);
