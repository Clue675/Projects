const mongoose = require("mongoose");
const Inspection = require("../../models/Inspection");
const Vendor = require('../../models/Vendor');
const Shipment = require("../../models/Shipment");
const logger = require("../../utils/logger");
const {
  updateVendorPerformance,
} = require("../../models/updateVendorPerformance");
const {
  generateDiscrepancyReport,
} = require("../../utils/discrepancyReportService");

// Retrieve all inspections
const getAllInspections = async (req, res) => {
  try {
    const inspections = await Inspection.find().lean();
    res.status(200).json(inspections);
  } catch (error) {
    console.error("Error fetching inspections:", error);
    res.status(500).json({ message: "Error fetching inspections" });
  }
};

const createInspection = async (req, res) => {
  const {
    inspectorFirstName,
    inspectorLastName,
    inspectorBadgeNumber,
    partNumber,
    orderNumber,
    vendorName,
    vendorId,
    workOrderNumber,
    reworkNumber,
    purchaseOrderNumber,
    inspectionDetails,
    quantityRejected,
    rejectionCodes,
    atFault,
    discrepancyDetails,
    notes,
    shipmentId,
    quantityReceived,
    isDescription,
    shouldBeDescription,
  } = req.body;

  console.log("Received request body:", req.body);

  if (!inspectorFirstName || !inspectorLastName || !inspectorBadgeNumber || !vendorName || !quantityReceived || !shipmentId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (!mongoose.Types.ObjectId.isValid(vendorId) || !mongoose.Types.ObjectId.isValid(shipmentId)) {
    return res.status(400).json({ message: "Invalid vendor or shipment ID" });
  }

  try {
    const vendor = await Vendor.findById(vendorId);
    const shipment = await Shipment.findById(shipmentId);

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }

    // Check if an inspection already exists for this shipment and vendor
    const existingInspection = await Inspection.findOne({ vendor: vendorId, shipment: shipmentId });
    if (existingInspection) {
      return res.status(400).json({ message: 'An inspection already exists for this shipment and vendor' });
    }

    const processedRejectionCodes = rejectionCodes.map(code => {
      if (mongoose.Types.ObjectId.isValid(code)) {
        return {
          codeId: new mongoose.Types.ObjectId(code),
          description: "" // Add description if available
        };
      }
      // Handle the invalid ObjectId case
      return {
        codeId: null,
        description: code // Store the invalid code as description
      };
    }).filter(code => code.codeId !== null); // Remove invalid codes

    const inspection = await Inspection.create({
      inspectorFirstName,
      inspectorLastName,
      inspectorBadgeNumber,
      partNumber,
      orderNumber,
      vendorName: vendor.vendorName,
      vendor: vendorId,
      workOrderNumber,
      reworkNumber,
      purchaseOrderNumber,
      inspectionDetails,
      quantityRejected,
      rejectionCodes: processedRejectionCodes,
      atFault,
      discrepancyDetails,
      notes,
      shipment: shipmentId,
      quantityReceived,
      quantityAccepted: quantityReceived - quantityRejected,
      isDescription,
      shouldBeDescription,
    });

    console.log("Inspection created successfully:", inspection);

    // Update Shipment as inspected
    await Shipment.findByIdAndUpdate(shipmentId, { inspected: true });

    let discrepancyReportId = null;
    if (quantityRejected > 0) {
      const discrepancyReport = await generateDiscrepancyReport({
        inspectionId: inspection._id,
        quantityRejected,
        inspectionNotes: notes,
        atFault,
        rejectionCodes: processedRejectionCodes,
        vendorId
      });
      discrepancyReportId = discrepancyReport._id;
      console.log("Discrepancy report created successfully:", discrepancyReport);
    }

    // Update vendor performance based on the type of rejection
    if (vendorId) {
      let quantityAccepted = quantityReceived - quantityRejected;
      let quantityRejectedVendor = 0;

      if (atFault === "Vendor") {
        quantityRejectedVendor = quantityRejected;
      } else {
        quantityAccepted = quantityReceived; // Vendor gets full credit for internal or customer return
      }

      await updateVendorPerformance(vendorId, {
        dateReceived: shipment.dateReceived,
        expectedDeliveryDate: shipment.expectedDeliveryDate,
        quantityReceived,
        quantityAccepted,
        quantityRejected: quantityRejectedVendor // Only count vendor-related rejections
      });
      console.log("Vendor performance updated successfully for vendor:", vendorId);
    }

    return res.status(201).json({
      message: 'Inspection created successfully',
      inspectionId: inspection._id,
      discrepancyReportId
    });
  } catch (error) {
    console.error('Error creating inspection:', error);
    return res.status(500).json({ message: 'Failed to create inspection.', error: error.toString() });
  }
};

// Retrieve all inspections
const getPendingInspections = async (req, res) => {
  try {
    const pendingInspections = await Inspection.find({
      status: "Pending Inspection",
    }).lean();
    res.status(200).json(pendingInspections);
  } catch (error) {
    console.error("Error fetching pending inspections:", error);
    res.status(500).json({ message: "Error fetching pending inspections" });
  }
};

// Retrieve a single inspection by ID
const getInspectionById = async (req, res) => {
  try {
    const inspection = await Inspection.findById(req.params.id);
    if (!inspection) {
      return res.status(404).json({ message: "Inspection not found" });
    }
    res.status(200).json(inspection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an inspection
const updateInspection = async (req, res) => {
  try {
    const updatedInspection = await Inspection.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedInspection) {
      return res.status(404).json({ message: "Inspection not found" });
    }

    // Update vendor performance if the shipment is linked to a vendor
    if (updatedInspection.shipmentId) {
      const shipment = await Shipment.findById(updatedInspection.shipmentId);
      if (shipment && shipment.vendorId) {
        await updateVendorPerformance(shipment.vendorId);
      }
    }

    res.status(200).json(updatedInspection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Assign an inspection to an inspector
const assignInspection = async (req, res) => {
  try {
    const { inspectionId, inspectorId } = req.body;
    const inspection = await Inspection.findById(inspectionId);
    if (!inspection) {
      return res.status(404).json({ message: "Inspection not found" });
    }
    inspection.inspectorId = inspectorId;
    inspection.status = "WIP"; // Work in Progress
    await inspection.save();
    res
      .status(200)
      .json({ message: "Inspection assigned successfully", inspection });
  } catch (error) {
    console.error("Error assigning inspection:", error);
    res.status(500).json({ message: "Error assigning inspection" });
  }
};

// Delete an inspection
const deleteInspection = async (req, res) => {
  try {
    const deletedInspection = await Inspection.findByIdAndDelete(req.params.id);
    if (!deletedInspection) {
      return res.status(404).json({ message: "Inspection not found" });
    }
    res.status(200).json({ message: "Inspection deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createInspection,
  getPendingInspections,
  getInspectionById,
  updateInspection,
  deleteInspection,
  assignInspection,
  getAllInspections,
};
