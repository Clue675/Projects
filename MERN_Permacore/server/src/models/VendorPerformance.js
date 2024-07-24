const mongoose = require('mongoose');

// Schema definition for VendorPerformance
const vendorPerformanceSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true, index: true },
  quantityReceived: { type: Number, default: 0 },
  quantityAccepted: { type: Number, default: 0 },
  quantityRejected: { type: Number, default: 0 },  // Tracks the number of rejected items
  poReceived: { type: Number, default: 0 },
  poReceivedOnTime: { type: Number, default: 0 },
  qualityRating: { type: Number, default: 0 },
  deliveryRating: { type: Number, default: 0 },
  overallRating: { type: Number, default: 0 },
  qualityPerformance: String,
  deliveryPerformance: String,
  overallPerformance: String,
}, { timestamps: true });

// Middleware to recalculate ratings before saving
vendorPerformanceSchema.pre('save', function(next) {
  const needsRecalculation = this.isModified('quantityReceived') || this.isModified('quantityAccepted') ||
                             this.isModified('poReceived') || this.isModified('poReceivedOnTime');

  if (needsRecalculation) {
    this.qualityRating = this.quantityReceived > 0 ? (this.quantityAccepted / this.quantityReceived) * 100 : 0;
    this.deliveryRating = this.poReceived > 0 ? (this.poReceivedOnTime / this.poReceived) * 100 : 0;
    this.overallRating = (this.qualityRating * 0.6) + (this.deliveryRating * 0.4);

    this.qualityPerformance = categorizePerformance(this.qualityRating);
    this.deliveryPerformance = categorizePerformance(this.deliveryRating);
    this.overallPerformance = categorizePerformance(this.overallRating);
  }

  next();
});

// Helper function to categorize performance based on rating
function categorizePerformance(rating) {
  if (rating >= 98) return 'Excellent';
  if (rating >= 95) return 'Satisfactory';
  return 'Unacceptable';
}

// Compile and export the model
module.exports = mongoose.model("VendorPerformance", vendorPerformanceSchema);
