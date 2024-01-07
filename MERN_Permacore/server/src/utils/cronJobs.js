const cron = require('node-cron');
const VendorPerformance = require('../models/VendorPerformance');
const Vendor = require('../models/Vendor');
const Shipment = require('../models/Shipment'); // Assuming you have a Shipment model
const Inspection = require('../models/Inspection'); // Assuming you have an Inspection model

/**
 * Function to calculate quality score based on inspection data.
 */
const calculateQualityScore = async (vendorId) => {
    const inspections = await Inspection.find({ 'shipmentId.vendorId': vendorId });
    let totalInspected = 0;
    let totalAccepted = 0;

    inspections.forEach(inspect => {
        totalInspected += inspect.quantityReceived;
        totalAccepted += inspect.quantityAccepted;
    });

    return totalAccepted / totalInspected * 100;
};

/**
 * Function to calculate delivery score based on shipment data.
 */
const calculateDeliveryScore = async (vendorId) => {
    const shipments = await Shipment.find({ vendorId });
    let onTimeDeliveries = 0;

    shipments.forEach(shipment => {
        const deliveryTime = (shipment.dateReceived - shipment.expectedDeliveryDate) / (1000 * 3600 * 24);
        if (deliveryTime >= -20 && deliveryTime <= 3) { // Assuming -20 to +3 days as tolerance
            onTimeDeliveries++;
        }
    });

    return onTimeDeliveries / shipments.length * 100;
};

// Task: Update vendor performance scores
const updateVendorPerformanceScores = async () => {
    try {
        const vendors = await Vendor.find();

        for (const vendor of vendors) {
            const qualityScore = await calculateQualityScore(vendor._id);
            const deliveryScore = await calculateDeliveryScore(vendor._id);
            const overallScore = (qualityScore * 0.6) + (deliveryScore * 0.4);

            await VendorPerformance.findOneAndUpdate(
                { vendorId: vendor._id },
                {
                    qualityScore,
                    deliveryScore,
                    overallScore,
                    evaluationDate: new Date()
                },
                { upsert: true }
            );
        }
        console.log('Vendor performance scores updated');
    } catch (error) {
        console.error('Error updating vendor performance scores:', error);
    }
};

// Schedule the task to run every day at midnight (00:00)
cron.schedule('0 0 * * *', () => {
    console.log('Running the vendor performance update task');
    updateVendorPerformanceScores();
});

module.exports = {
    updateVendorPerformanceScores
};
