const mongoose = require('mongoose');
const VendorPerformance = require('./VendorPerformance'); // Assuming this is the correct path

const vendorSchema = new mongoose.Schema({
    vendorNumber: { type: Number, required: true, unique: true },
    vendorName: { type: String, required: true },
    vendorCapabilities: { type: [String], required: true, default: ["General"] },
    approvalType: { type: String, enum: ['Supplier Survey', 'Certification'], required: true },
    performance: { type: mongoose.Schema.Types.ObjectId, ref: 'VendorPerformance' },
    lastAuditDate: Date,
    nextAuditDate: Date,
    status: { type: String, enum: ['Active', 'Inactive', 'Probation', 'Disqualified', 'On-Hold'], default: 'Active' },
    comments: String,
    email: { type: String, required: true },
    streetAddress: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true },
    qualityRepName: { type: String, required: true },
    salesRepName: { type: String, required: true },
    certifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Certification' }]
}, { timestamps: true });

vendorSchema.pre('save', async function (next) {
    if (this.performance) {
        try {
            const performanceData = await VendorPerformance.findById(this.performance);
            if (performanceData) {
                this.performanceScore = (performanceData.qualityRating * 0.6) + (performanceData.deliveryRating * 0.4);
            }
        } catch (error) {
            console.error('Error fetching performance data:', error);
            next(error);
        }
    }
    next();
});

const Vendor = mongoose.model('Vendor', vendorSchema);
module.exports = Vendor;
