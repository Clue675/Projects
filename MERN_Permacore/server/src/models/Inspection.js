const mongoose = require('mongoose');
const logger = require("../utils/logger");
const VendorPerformance = require('../models/VendorPerformance');
const Shipment = require('../models/Shipment');

const rejectionCodeSubdocument = new mongoose.Schema({
  codeId: { type: String, ref: "RejectionCode" },
  description: String,
}, { _id: false });

const inspectionSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  shipment: { // Use shipment here instead of shipmentId
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Shipment",
  },
  inspectorFirstName: { type: String, required: true },
  inspectorLastName: { type: String, required: true },
  inspectorBadgeNumber: { type: String, required: true },
  quantityReceived: { type: Number, required: true },
  quantityAccepted: { type: Number, required: true },
  quantityRejected: { type: Number, default: 0 },
  rejectionCodes: [rejectionCodeSubdocument],
  atFault: {
    type: String,
    enum: ["Vendor", "Internal", "Customer Return", "N/A"],
    default: "N/A",
  },
  notes: String,
  discrepancyReport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DiscrepancyReport",
    default: null,
  },
}, { timestamps: true });


inspectionSchema.pre("save", function (next) {
  if (!this.inspectorFirstName || !this.inspectorLastName || !this.inspectorBadgeNumber) {
    const err = new Error("Inspector details are required.");
    logger.error("Validation error in inspection schema: Missing inspector details.");
    next(err);
  } else {
    next();
  }
});

inspectionSchema.post("save", async function (doc) {
  const vendorPerformance = await VendorPerformance.findOne({ vendorId: doc.vendor });
  if (vendorPerformance) {
    vendorPerformance.quantityAccepted += doc.quantityAccepted;
    vendorPerformance.quantityRejected += doc.quantityRejected;
    await vendorPerformance.save();
  }
});

module.exports = mongoose.model("Inspection", inspectionSchema);
