const mongoose = require('mongoose');
const DiscrepancyReport = require('../models/DiscrepancyReport');
const RejectionCode = require('../models/RejectionCode');
const Inspection = require('../models/Inspection');
const Shipment = require('../models/Shipment');
const Vendor = require('../models/Vendor');

/**
 * Generates a detailed discrepancy report based on inspection findings.
 * This includes information about the vendor, shipment, faults, and rejection codes.
 * 
 * @param {Object} params - The parameters needed for the report.
 * @param {mongoose.Types.ObjectId} params.inspectionId - ID of the related inspection.
 * @param {Number} params.quantityRejected - Quantity rejected during the inspection.
 * @param {String} params.inspectionNotes - Notes from the inspection.
 * @param {String} params.atFault - Party at fault for the discrepancy.
 * @param {String[]} params.rejectionCodes - Array of rejection code IDs or numbers.
 * @returns {Promise<mongoose.Document>} - The created discrepancy report document.
 */
async function generateDiscrepancyReport({ inspectionId, quantityRejected, inspectionNotes, atFault, rejectionCodes }) {
  try {
    // Populate both the vendor and shipment to ensure all necessary data is loaded
    const inspection = await Inspection.findById(inspectionId)
      .populate('vendor')
      .populate('shipment')
      .lean();

    if (!inspection) throw new Error('Inspection not found');
    if (!inspection.vendor) throw new Error(`Vendor with ID ${inspection.vendorId} not found`);
    if (!inspection.shipment) throw new Error(`Shipment with ID ${inspection.shipmentId} not found`);

    // Fetch detailed information for the rejection codes
    const rejectionDetails = await RejectionCode.find({
      'codeId': { $in: rejectionCodes }
    });

    const totalCost = inspection.shipment.unitCost * quantityRejected;

    const discrepancyReport = new DiscrepancyReport({
      reportId: `DR-${Date.now()}`,
      inspectionId,
      shipmentId: inspection.shipment._id,
      vendorId: inspection.vendor._id,
      vendorName: inspection.vendor.vendorName,
      shipmentDetails: `PO Number: ${inspection.shipment.purchaseOrderNumber}, Received: ${inspection.shipment.dateReceived.toDateString()}`,
      discrepancyDetails: `Rejected Quantity: ${quantityRejected}. Notes: ${inspectionNotes}`,
      atFault,
      quantityRejected,
      rejectionCodes: rejectionDetails.map(code => code._id),
      correctiveActions: [], // Initialize with an empty array
      totalCost,
    });

    await discrepancyReport.save();
    return discrepancyReport;
  } catch (error) {
    console.error('Error generating discrepancy report:', error);
    throw new Error('Failed to generate discrepancy report: ' + error.message);
  }
}

module.exports = {
  generateDiscrepancyReport
};
