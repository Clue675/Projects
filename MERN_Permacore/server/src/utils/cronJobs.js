const cron = require('node-cron');
const mongoose = require('mongoose');
const Vendor = require('../models/Vendor');
const VendorPerformance = require('../models/VendorPerformance');
const Shipment = require('../models/Shipment');
const Inspection = require('../models/Inspection');
const logger = require('./logger');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    logger.info('MongoDB successfully connected.');
}).catch(err => {
    logger.error('Error connecting to MongoDB:', err);
});

// Update vendor performance scores
async function updateVendorPerformanceScores() {
    const vendors = await Vendor.find({});
    logger.info('Initiating update of vendor performance scores.');

    for (const vendor of vendors) {
        const qualityScore = await calculateQualityScore(vendor._id);
        const deliveryScore = await calculateDeliveryScore(vendor._id);
        const overallScore = (qualityScore * 0.6) + (deliveryScore * 0.4);

        // Find or create the VendorPerformance document
        let vendorPerformance = await VendorPerformance.findOne({ vendorId: vendor._id });
        if (!vendorPerformance) {
            vendorPerformance = new VendorPerformance({ vendorId: vendor._id });
        }

        vendorPerformance.qualityRating = qualityScore;
        vendorPerformance.deliveryRating = deliveryScore;
        vendorPerformance.overallRating = overallScore;
        vendorPerformance.qualityPerformance = categorizePerformance(qualityScore);
        vendorPerformance.deliveryPerformance = categorizePerformance(deliveryScore);
        vendorPerformance.overallPerformance = categorizePerformance(overallScore);
        
        await vendorPerformance.save();
        logger.info(`Performance updated for ${vendor.vendorName}: Quality ${qualityScore}%, Delivery ${deliveryScore}%, Overall ${overallScore}%`);
    }
    logger.info('All vendor performance scores have been successfully updated.');
}


async function calculateQualityScore(vendorId) {
    const inspections = await Inspection.find({ vendor: vendorId });
    if (inspections.length === 0) return 100;
    
    let totalAccepted = inspections.reduce((acc, cur) => acc + cur.quantityAccepted, 0);
    let totalInspected = inspections.reduce((acc, cur) => acc + cur.quantityReceived, 0);
    
    return (totalAccepted / totalInspected) * 100;
}

async function calculateDeliveryScore(vendorId) {
    const shipments = await Shipment.find({ vendor: vendorId });
    if (shipments.length === 0) return 100;
    
    let onTimeDeliveries = shipments.filter(shipment => {
        const receivedDate = new Date(shipment.dateReceived);
        const expectedDate = new Date(shipment.expectedDeliveryDate);
        return receivedDate <= expectedDate;
    }).length;
    
    return (onTimeDeliveries / shipments.length) * 100;
}

function categorizePerformance(score) {
    if (score >= 98) return 'Excellent';
    if (score >= 95) return 'Satisfactory';
    return 'Unacceptable';
}

const schedulePerformanceUpdate = () => {
    cron.schedule('0 0 * * *', async () => {
        logger.info('Scheduled task started: Updating vendor performance scores.');
        await updateVendorPerformanceScores();
    });
};

schedulePerformanceUpdate();

module.exports = {
    updateVendorPerformanceScores,
    schedulePerformanceUpdate
};
