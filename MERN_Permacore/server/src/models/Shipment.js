const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
    shipmentId: {
        type: String,
        required: true,
        unique: true
    },
    vendorId: {
        type: Number, // Ensuring vendorId is a Number
        required: true
    },
    vendorName: {
        type: String,
        required: true
    },
    purchaseOrderNumber: {
        type: Number,
        required: true
    },
    partNumber: {
        type: String,
        required: true
    },
    workOrderNumber: {
        type: Number, // Optional
        required: false
    },
    reworkNumber: {
        type: Number, // Optional
        required: false
    },
    dateReceived: {
        type: Date,
        required: true
    },
    quantityShipped: {
        type: Number,
        required: true
    },
    unitCost: {
        type: Number,
        required: true
    },
    expectedDeliveryDate: {
        type: Date,
        required: true
    },
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true }); // Enable automatic handling of createdAt and updatedAt

const Shipment = mongoose.model('Shipment', shipmentSchema);

module.exports = Shipment;
