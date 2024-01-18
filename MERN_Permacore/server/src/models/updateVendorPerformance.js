const VendorPerformance = require('./VendorPerformance'); // Adjust path as needed
const Shipment = require('./Shipment');
const Inspection = require('./Inspection');

async function updateVendorPerformance(vendorId) {
    try {
        // Aggregate data from Shipments and Inspections
        const shipments = await Shipment.find({ vendorId: vendorId });
        const inspections = await Inspection.find({ vendorId: vendorId });

        let quantityReceived = 0, quantityAccepted = 0, poReceivedOnTime = 0;

        // Sum up quantities from inspections
        inspections.forEach(inspect => {
            quantityReceived += inspect.quantityReceived;
            quantityAccepted += inspect.quantityAccepted;
        });
        console.log(`Found ${inspections.length} inspections for vendor ID ${vendorId}`);
    inspections.forEach(inspect => {
        console.log(`Inspection ID: ${inspect._id}, Quantity Received: ${inspect.quantityReceived}, Quantity Accepted: ${inspect.quantityAccepted}`);
        // Sum up quantities
        quantityReceived += inspect.quantityReceived;
        quantityAccepted += inspect.quantityAccepted;
    });

        // Calculate on-time deliveries from shipments
        shipments.forEach(shipment => {
            if (isWithinDeliveryTolerance(shipment.expectedDeliveryDate, shipment.dateReceived)) {
                poReceivedOnTime++;
            }
        });

        // Calculate ratings
        const qualityRating = calculateQualityRating(quantityAccepted, quantityReceived);
        const deliveryRating = calculateDeliveryRating(poReceivedOnTime, shipments.length);
        const overallRating = calculateOverallRating(qualityRating, deliveryRating);

        // Update VendorPerformance record
        await VendorPerformance.updateOne(
            { vendorId: vendorId }, 
            { 
                vendorId, 
                quantityReceived, 
                quantityAccepted, 
                poReceived: shipments.length, 
                poReceivedOnTime, 
                qualityRating, 
                deliveryRating, 
                overallRating 
            }, 
            { upsert: true }
        );
    } catch (error) {
        console.error(`Error updating vendor performance for vendor ID ${vendorId}: ${error}`);
    }
}

function calculateQualityRating(quantityAccepted, quantityReceived) {
    return quantityReceived > 0 ? (quantityAccepted / quantityReceived) * 100 : 0;
}

function calculateDeliveryRating(poReceivedOnTime, poReceived) {
    return poReceived > 0 ? (poReceivedOnTime / poReceived) * 100 : 0;
}

function calculateOverallRating(qualityRating, deliveryRating) {
    return (qualityRating * 0.6) + (deliveryRating * 0.4);
}

function isWithinDeliveryTolerance(expectedDate, receivedDate) {
    const earlyTolerance = -20; // days
    const lateTolerance = 3; // days
    const diffDays = (new Date(receivedDate) - new Date(expectedDate)) / (1000 * 3600 * 24);
    return diffDays >= earlyTolerance && diffDays <= lateTolerance;
}

module.exports = updateVendorPerformance;
