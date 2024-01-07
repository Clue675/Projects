const mongoose = require('mongoose');

const vendorPerformanceSchema = new mongoose.Schema({
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    evaluationDate: {
        type: Date,
        default: Date.now
    },
    quantityReceived: {
        type: Number,
        required: true
    },
    quantityAccepted: {
        type: Number,
        required: true
    },
    poReceived: {
        type: Number,
        required: true
    },
    poReceivedOnTime: {
        type: Number,
        required: true
    },
    qualityRating: Number, // Calculated field
    deliveryRating: Number, // Calculated field
    overallRating: Number, // Calculated field
    qualityPerformance: String, // Categorized based on qualityRating
    deliveryPerformance: String, // Categorized based on deliveryRating
    overallPerformance: String, // Categorized based on overallRating
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

vendorPerformanceSchema.pre('save', function(next) {
    this.qualityRating = (this.quantityAccepted / this.quantityReceived) * 100;
    this.deliveryRating = (this.poReceivedOnTime / this.poReceived) * 100;
    this.overallRating = (this.qualityRating * 0.6) + (this.deliveryRating * 0.4);
    this.qualityPerformance = categorizePerformance(this.qualityRating);
    this.deliveryPerformance = categorizePerformance(this.deliveryRating);
    this.overallPerformance = categorizePerformance(this.overallRating);
    this.updatedAt = Date.now();
    next();
});

function categorizePerformance(rating) {
    if (rating >= 98.0) {
        return 'Excellent';
    } else if (rating >= 95.0) {
        return 'Satisfactory';
    } else {
        return 'Unacceptable';
    }
}

module.exports = mongoose.model('VendorPerformance', vendorPerformanceSchema);
