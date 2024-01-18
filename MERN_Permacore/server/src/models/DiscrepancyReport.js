const mongoose = require('mongoose');

const discrepancyReportSchema = new mongoose.Schema({
    reportId: {
        type: String,
        required: true,
        unique: true
    },
    inspectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inspection',
        required: true
    },
    discrepancyDetails: String,
    atFault: {
        type: String,
        enum: ['Vendor', 'Internal', 'Customer Return', 'N/A'],
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
});

discrepancyReportSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('DiscrepancyReport', discrepancyReportSchema);
