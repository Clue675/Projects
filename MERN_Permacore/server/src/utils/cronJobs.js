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
    // Convert vendorId to a number if it's not already
    const numericVendorId = Number(vendorId);
    if (isNaN(numericVendorId)) {
        console.error(`Invalid vendorId (not a number): ${vendorId}`);
        return 0; // Or handle this case as you see fit
    }
    
    const shipments = await Shipment.find({ vendorId: numericVendorId });
    let onTimeDeliveries = 0;

    shipments.forEach(shipment => {
        const deliveryTime = (new Date(shipment.dateReceived) - new Date(shipment.expectedDeliveryDate)) / (1000 * 3600 * 24);
        if (deliveryTime >= -20 && deliveryTime <= 3) {
            onTimeDeliveries++;
        }
    });

    return onTimeDeliveries / (shipments.length || 1) * 100; // Avoid division by zero
};


// Task: Update vendor performance scores
const updateVendorPerformanceScores = async () => {
    try {
        const vendors = await Vendor.find();

        for (const vendor of vendors) {
            const vendorNumericId = Number(vendor.vendorId); // Ensure it's a number
            const qualityScore = await calculateQualityScore(vendorNumericId);
            const deliveryScore = await calculateDeliveryScore(vendorNumericId);
            const overallScore = (qualityScore * 0.6) + (deliveryScore * 0.4);

            await VendorPerformance.findOneAndUpdate(
                { vendorId: vendorNumericId },
                { qualityScore, deliveryScore, overallScore, evaluationDate: new Date() },
                { upsert: true, new: true }
            );
        }
        console.log('Vendor performance scores updated');
    } catch (error) {
        console.error('Error updating vendor performance scores:', error);
    }
};

// Schedule the task to run daily at midnight
cron.schedule('0 0 * * *', () => {
    console.log('Running the vendor performance update task');
    updateVendorPerformanceScores();
});

module.exports = {
    updateVendorPerformanceScores
};
