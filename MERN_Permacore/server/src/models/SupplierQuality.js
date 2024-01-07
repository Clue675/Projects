const mongoose = require('mongoose');

const supplierQualitySchema = new mongoose.Schema({
    vendorName: { type: String, required: true },
    vendorId: { type: String, required: true },
    performanceScore: { type: Number, required: true },
    status: { type: String, required: true },
    riskCode: { type: String, required: false },
    lastAuditDate: { type: Date, required: false },
    nextAuditDate: { type: Date, required: false },
    comments: { type: String, required: false },
    // Add other fields as necessary
    // For example: correctiveActions, nonConformities, etc.
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// If you need middleware (e.g., for updatedAt), add it here
supplierQualitySchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('SupplierQuality', supplierQualitySchema);
