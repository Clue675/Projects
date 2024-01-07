/**
 * Calculates a quality score based on provided metrics.
 * This could be based on factors like defect rates, customer feedback, etc.
 * @param {Object} metrics - The quality metrics for the calculation.
 * @returns {number} - The calculated quality score.
 */
const calculateQualityScore = (metrics) => {
    // Example calculation (replace with your actual logic)
    // Let's say the quality score inversely depends on the defect rate
    if (!metrics.defectRate) return 100; // Perfect score if no defect rate provided
    return Math.max(0, 100 - metrics.defectRate * 10); // Example formula
};

/**
 * Calculates a delivery score based on provided metrics.
 * This could be based on on-time delivery rate, shipping times, etc.
 * @param {Object} metrics - The delivery metrics for the calculation.
 * @returns {number} - The calculated delivery score.
 */
const calculateDeliveryScore = (metrics) => {
    // Example calculation (replace with your actual logic)
    // Let's say the delivery score directly depends on the on-time delivery rate
    if (!metrics.onTimeDeliveryRate) return 0; // Worst score if no rate provided
    return Math.min(100, metrics.onTimeDeliveryRate * 100); // Example formula
};

/**
 * Calculates an overall performance score based on quality and delivery scores.
 * @param {number} qualityScore - The quality score.
 * @param {number} deliveryScore - The delivery score.
 * @returns {number} - The overall performance score.
 */
const calculateOverallPerformanceScore = (qualityScore, deliveryScore) => {
    return (qualityScore + deliveryScore) / 2; // Simple average
};

module.exports = {
    calculateQualityScore,
    calculateDeliveryScore,
    calculateOverallPerformanceScore
};
