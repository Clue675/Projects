const mongoose = require("mongoose");
const DiscrepancyReport = require('../../models/DiscrepancyReport');
const Inspection = require('../../models/Inspection');
const Shipment = require('../../models/Shipment'); // Ensure Shipment model is imported
const { updateVendorPerformance } = require("../../models/updateVendorPerformance");

// Util function for handling responses
const handleResponse = (res, status, data, message) => {
  if (message) {
    return res.status(status).json({ message, ...data });
  }
  return res.status(status).json(data);
};

// Error handler for async functions
const catchError = (res, error) => {
  console.error(error); // Log the error for debugging
  return handleResponse(res, 500, {}, "An error occurred while processing your request.");
};

// Create a new discrepancy report
const createDiscrepancyReport = async (req, res) => {
  try {
    const { inspectionId, quantityRejected, inspectionNotes, atFault, rejectionCodes, reworkOperations } = req.body;

    const inspection = await Inspection.findById(inspectionId).populate('shipment').populate('vendor');
    if (!inspection) {
      return handleResponse(res, 404, {}, "Inspection not found");
    }

    const shipment = inspection.shipment;
    const vendor = inspection.vendor;
    const totalCost = shipment.unitCost * quantityRejected;

    const count = await DiscrepancyReport.countDocuments(); // Get the count of documents
    const discrepancyId = 1000 + count + 1; // Start at 1000 and increment
    const newReport = new DiscrepancyReport({
      inspectionId,
      shipmentId: shipment._id,
      vendorId: vendor._id,
      vendorName: vendor.vendorName,
      shipmentDetails: `PO Number: ${shipment.purchaseOrderNumber}, Part Number: ${shipment.partNumber}`,
      discrepancyDetails: inspectionNotes,
      atFault,
      quantityRejected,
      rejectionCodes,
      totalCost,
      reportId: `DR-${discrepancyId}`,
      isDescription: inspection.isDescription,
      shouldBeDescription: inspection.shouldBeDescription,
      reworkOperations // Save rework operations
    });

    await newReport.save();
    await updateVendorPerformance(vendor._id, {
      quantityReceived: inspection.quantityReceived,
      quantityAccepted: inspection.quantityAccepted,
      quantityRejected,
      dateReceived: shipment.dateReceived,
      expectedDeliveryDate: shipment.expectedDeliveryDate
    });

    return handleResponse(res, 201, newReport);
  } catch (error) {
    return catchError(res, error);
  }
};

// Retrieve all discrepancy reports
const getAllDiscrepancyReports = async (req, res) => {
  try {
    const reports = await DiscrepancyReport.find()
      .populate('inspectionId')
      .populate('shipmentId')
      .populate('vendorId');
    return handleResponse(res, 200, reports);
  } catch (error) {
    return catchError(res, error);
  }
};

// Retrieve a single discrepancy report by ID
const getDiscrepancyReportById = async (req, res) => {
  try {
    const report = await DiscrepancyReport.findById(req.params.id).populate('inspectionId').populate('shipmentId');
    if (!report) {
      return handleResponse(res, 404, {}, 'Discrepancy report not found');
    }
    return handleResponse(res, 200, report);
  } catch (error) {
    return catchError(res, error);
  }
};

// Update a discrepancy report
const updateDiscrepancyReport = async (req, res) => {
  try {
    const updatedReport = await DiscrepancyReport.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedReport) {
      return handleResponse(res, 404, {}, 'Discrepancy report not found');
    }

    // Fetch updated inspection and shipment data to update vendor performance
    const inspection = await Inspection.findById(updatedReport.inspectionId).populate('shipment');
    if (inspection) {
      const shipment = inspection.shipment;
      await updateVendorPerformance(updatedReport.vendorId, {
        quantityReceived: inspection.quantityReceived,
        quantityAccepted: inspection.quantityAccepted,
        quantityRejected: updatedReport.quantityRejected,
        dateReceived: shipment.dateReceived,
        expectedDeliveryDate: shipment.expectedDeliveryDate
      });
    }

    return handleResponse(res, 200, updatedReport);
  } catch (error) {
    return catchError(res, error);
  }
};

// Delete a discrepancy report
const deleteDiscrepancyReport = async (req, res) => {
  try {
    const deletedReport = await DiscrepancyReport.findByIdAndDelete(req.params.id);
    if (!deletedReport) {
      return handleResponse(res, 404, {}, 'Discrepancy report not found');
    }
    return handleResponse(res, 200, {}, 'Discrepancy report deleted successfully');
  } catch (error) {
    return catchError(res, error);
  }
};

module.exports = {
  createDiscrepancyReport,
  getAllDiscrepancyReports,
  getDiscrepancyReportById,
  updateDiscrepancyReport,
  deleteDiscrepancyReport
};
