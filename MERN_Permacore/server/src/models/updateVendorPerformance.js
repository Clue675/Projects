const mongoose = require("mongoose");
const VendorPerformance = require("../models/VendorPerformance");
const logger = require("../utils/logger");

// Calculate the quality score based on accepted and received quantities
function calculateQualityScore(quantityAccepted, quantityReceived) {
  return quantityReceived > 0 ? (quantityAccepted / quantityReceived) * 100 : 0;
}

// Calculate the delivery score based on on-time and total purchase orders received
function calculateDeliveryScore(poReceivedOnTime, poReceived) {
  return poReceived > 0 ? (poReceivedOnTime / poReceived) * 100 : 0;
}

// Calculate the overall score combining quality and delivery scores
function calculateOverallScore(qualityScore, deliveryScore) {
  return qualityScore * 0.6 + deliveryScore * 0.4;
}

function isOnTime(dateReceived, expectedDeliveryDate) {
  const received = new Date(dateReceived);
  const expected = new Date(expectedDeliveryDate);
  const earlyTolerance = new Date(expected);
  earlyTolerance.setDate(expected.getDate() - 20); // 20 days early tolerance
  const lateTolerance = new Date(expected);
  lateTolerance.setDate(expected.getDate() + 3); // 3 days late tolerance
  return received >= earlyTolerance && received <= lateTolerance;
}

// Categorize the performance based on the calculated score
function categorizePerformance(rating) {
  if (rating >= 98) return "Excellent";
  if (rating >= 95) return "Satisfactory";
  return "Unacceptable";
}

// Main function to update vendor performance based on new shipment details
async function updateVendorPerformance(vendorId, shipmentDetails) {
  const { quantityReceived, quantityAccepted, dateReceived, expectedDeliveryDate } = shipmentDetails;
  const deliveryIsOnTime = isOnTime(dateReceived, expectedDeliveryDate);

  const update = {
    $inc: {
      quantityReceived: parseInt(quantityReceived) || 0,
      quantityAccepted: parseInt(quantityAccepted) || 0,
      poReceived: 1,
      poReceivedOnTime: deliveryIsOnTime ? 1 : 0
    }
  };

  const options = { new: true, upsert: true, setDefaultsOnInsert: true };

  try {
    let vendorPerformance = await VendorPerformance.findOneAndUpdate({ vendorId }, update, options);

    // Recalculate scores only if needed
    if (vendorPerformance) {
      vendorPerformance.qualityRating = calculateQualityScore(vendorPerformance.quantityAccepted, vendorPerformance.quantityReceived);
      vendorPerformance.deliveryRating = calculateDeliveryScore(vendorPerformance.poReceivedOnTime, vendorPerformance.poReceived);
      vendorPerformance.overallRating = calculateOverallScore(vendorPerformance.qualityRating, vendorPerformance.deliveryRating);

      vendorPerformance.qualityCategory = categorizePerformance(vendorPerformance.qualityRating);
      vendorPerformance.deliveryCategory = categorizePerformance(vendorPerformance.deliveryRating);
      vendorPerformance.overallCategory = categorizePerformance(vendorPerformance.overallRating);

      await vendorPerformance.save();
    }

    logger.info(`Performance updated for vendorId: ${vendorId}`);
  } catch (error) {
    logger.error(`Error updating performance for vendorId: ${vendorId}`, error);
  }
}

module.exports = { updateVendorPerformance, isOnTime };
