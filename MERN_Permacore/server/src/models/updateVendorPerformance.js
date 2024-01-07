const VendorPerformance = require('./VendorPerformance'); // Adjust path as needed
const Shipment = require('./Shipment');
const Inspection = require('./Inspection');

async function updateVendorPerformance(vendorId) {
    // Aggregate data from Shipments and Inspections
    const shipments = await Shipment.find({ vendorId: vendorId });
    const inspections = await Inspection.find({ 'shipmentId.vendorId': vendorId });

    // Compute necessary metrics
    let quantityReceived = 0;
    let quantityAccepted = 0;
    let poReceivedOnTime = 0;

    inspections.forEach(inspect => {
        quantityReceived += inspect.quantityReceived;
        quantityAccepted += inspect.quantityAccepted;
    });

    shipments.forEach(shipment => {
        if (isWithinDeliveryTolerance(shipment.expectedDeliveryDate, shipment.dateReceived)) {
            poReceivedOnTime++;
        }
    });

    // Calculate Quality and Delivery Ratings
    const qualityRating = calculateQualityRating(quantityAccepted, quantityReceived);
    const deliveryRating = calculateDeliveryRating(poReceivedOnTime, shipments.length);

    // Update or Create VendorPerformance record
    const performanceData = {
        vendorId,
        quantityReceived,
        quantityAccepted,
        poReceived: shipments.length,
        poReceivedOnTime,
        qualityRating,
        deliveryRating,
        overallRating: calculateOverallRating(qualityRating, deliveryRating),
        // Calculated in model's pre-save middleware
    };

    await VendorPerformance.updateOne({ vendorId: vendorId }, performanceData, { upsert: true });
}

function calculateQualityRating(quantityAccepted, quantityReceived) {
    return (quantityAccepted / quantityReceived) * 100;
}

function calculateDeliveryRating(poReceivedOnTime, poReceived) {
    return (poReceivedOnTime / poReceived) * 100;
}

function calculateOverallRating(qualityRating, deliveryRating) {
    return (qualityRating * 0.6) + (deliveryRating * 0.4);
}

function isWithinDeliveryTolerance(expectedDate, receivedDate) {
    const earlyTolerance = 20; // days
    const lateTolerance = 3; // days
    const diffDays = (receivedDate - expectedDate) / (1000 * 3600 * 24);
    return diffDays >= -earlyTolerance && diffDays <= lateTolerance;
}

module.exports = updateVendorPerformance;
