const Shipment = require("../../models/Shipment");
const Vendor = require("../../models/Vendor"); //
const Inspection = require("../../models/Inspection");
const mongoose = require("mongoose");
const {
  updateVendorPerformance,isOnTime 
} = require("../../models/updateVendorPerformance");
const logger = require("../../utils/logger");

//Create Shipment

async function createShipment(req, res) {
  const {
      vendorId,
      purchaseOrderNumber,
      partNumber,
      quantityShipped,
      unitCost,
      dateReceived,
      expectedDeliveryDate,
      notes,
      workOrderNumber,
      reworkNumber,
  } = req.body;

  const session = await mongoose.startSession();
  try {
      session.startTransaction();
      const vendor = await Vendor.findById(vendorId).session(session);
      if (!vendor) {
          throw new Error("Vendor not found");
      }

      const formattedDateReceived = new Date(dateReceived);
      const formattedExpectedDeliveryDate = new Date(expectedDeliveryDate);
      if (isNaN(formattedDateReceived.getTime()) || isNaN(formattedExpectedDeliveryDate.getTime())) {
          throw new Error("Invalid date format");
      }

      const existingShipment = await Shipment.findOne({ purchaseOrderNumber }).session(session);
      if (existingShipment) {
          throw new Error("Shipment for this purchase order number already exists");
      }

      const deliveryIsOnTime = isOnTime(formattedDateReceived, formattedExpectedDeliveryDate);

      const newShipment = new Shipment({
          vendorId: vendor._id,
          vendorName: vendor.vendorName,
          purchaseOrderNumber,
          partNumber,
          quantityShipped,
          unitCost,
          dateReceived: formattedDateReceived,
          expectedDeliveryDate: formattedExpectedDeliveryDate,
          notes,
          workOrderNumber,
          reworkNumber,
          onTimeDelivery: deliveryIsOnTime
      });
 
      await newShipment.save({ session });

      await updateVendorPerformance(vendor._id, {
          quantityReceived: quantityShipped,
          quantityAccepted: quantityShipped,
          dateReceived: formattedDateReceived,
          expectedDeliveryDate: formattedExpectedDeliveryDate,
          onTimeDelivery: deliveryIsOnTime
      });

      await session.commitTransaction();
      res.status(201).json(newShipment);
  } catch (error) {
      await session.abortTransaction();
      logger.error('Error creating shipment', { error: error.toString() });
      res.status(500).json({ message: `Error creating shipment: ${error.message}` });
  } finally {
      session.endSession();
  }
}


const getOpenShipments = async (req, res) => {
  try {
    // Fetch all shipments that have not been marked as inspected
    const allShipments = await Shipment.find({
      inspected: { $ne: true },
    }).lean();

    // Optionally, if you still want to double-check against actual inspection records:
    // Fetch all inspected shipment IDs
    const inspectedShipmentsIds = await Inspection.find({
      $or: [
        { quantityAccepted: { $gt: 0 } },
        { quantityRejected: { $gt: 0 } },
        {
          inspectorFirstName: { $exists: true, $ne: "" },
          inspectorBadgeNumber: { $exists: true, $ne: "" },
        },
      ],
    })
      .distinct("shipmentId")
      .lean();

    // Further filter out any shipments that may have been inspected but not marked as such
    const openShipments = allShipments.filter(
      (shipment) => !inspectedShipmentsIds.includes(String(shipment._id))
    );

    res.status(200).json(openShipments);
  } catch (error) {
    console.error("Error fetching open shipments:", error);
    res
      .status(500)
      .json({ message: "Error fetching open shipments", error: error.message });
  }
};

// Retrieve all shipments
const getAllShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find();
    res.status(200).json(shipments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Retrieve a single shipment by ID
const getShipmentById = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }
    res.status(200).json(shipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a shipment with a focus on OTD performance
const updateShipment = async (req, res) => {
  const { onTimeDelivery } = req.body; // A boolean indicating if the shipment was on time

  try {
    const updatedShipment = await Shipment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedShipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }

    // Update the vendor's OTD score based on this shipment's on-time delivery status
    await updateVendorPerformance(updatedShipment.vendorId, onTimeDelivery);

    res.status(200).json(updatedShipment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a shipment
const deleteShipment = async (req, res) => {
  try {
    const deletedShipment = await Shipment.findByIdAndDelete(req.params.id);
    if (!deletedShipment) {
      return res.status(404).json({ message: "Shipment not found" });
    }
    res.status(200).json({ message: "Shipment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const checkInspectionStatus = async (shipmentId) => {
  try {
    // Retrieve the shipment by ID
    const shipment = await Shipment.findById(shipmentId);

    // Check if the shipment has been inspected
    const isInspected = shipment.inspected; // Assuming 'inspected' is a property that indicates inspection status

    return isInspected;
  } catch (error) {
    console.error(`Error checking inspection status: ${error.message}`);
    return false; // Return false in case of an error
  }
};

module.exports = {
  createShipment,
  getAllShipments,
  getShipmentById,
  updateShipment,
  deleteShipment,
  checkInspectionStatus,
  getOpenShipments,
};
