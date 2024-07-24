const mongoose = require('mongoose');
const VendorPerformance = require('../models/VendorPerformance'); // Adjust the path as necessary


const shipmentSchema = new mongoose.Schema({
    vendorId: {
        type: mongoose.Schema.Types.ObjectId, // Use ObjectId for references
        required: true,
        ref: 'Vendor' // Reference to Vendor collection
    },
    inspected: {
        type: Boolean,
        default: false
      },
    vendorName: {
        type: String,
        required: true
    },
    purchaseOrderNumber: { type: Number, required: true, unique: true, index: true },
    partNumber: {
        type: String,
        required: true
    },
    workOrderNumber: {
        type: String,
        required: false // Optional, kept as Number
    },
    reworkNumber: {
        type: String,
        required: false // Optional, kept as Number
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
    notes: {
        type: String,
        default: '' // Provide a default value for optional field
    }
}, { timestamps: true }); // Utilize built-in handling for creation and update timestamps

shipmentSchema.post("save", async function (doc) {
    const vendorPerformance = await VendorPerformance.findOne({ vendorId: doc.vendorId });
    if (vendorPerformance) {
      vendorPerformance.quantityReceived += doc.quantityShipped;
      vendorPerformance.poReceived += 1;  // Assuming every shipment relates to a new PO
      if (doc.onTimeDelivery) {
        vendorPerformance.poReceivedOnTime += 1;
      }
      await vendorPerformance.save();
    }
  });
  
// Define the virtual property 'totalCost'
shipmentSchema.virtual('totalCost').get(function() {
    return this.unitCost * this.quantityShipped;
  });

const Shipment = mongoose.model('Shipment', shipmentSchema);

module.exports = Shipment;

