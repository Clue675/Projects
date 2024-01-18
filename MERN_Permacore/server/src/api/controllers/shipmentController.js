const Shipment = require('../../models/Shipment');
const Vendor = require('../../models/Vendor'); // Make sure you have this model imported
const mongoose = require('mongoose');
const updateVendorPerformance = require('../../models/updateVendorPerformance'); // Assuming this is the correct path

// Create a new shipment
const createShipment = async (req, res) => {
    try {
        // Find the vendor by the provided numerical vendor ID
        const vendor = await Vendor.findOne({ vendorId: req.body.vendorId });
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        // Create a new shipment using the numerical vendor ID and purchase order number
        const newShipment = new Shipment({
            ...req.body,
            vendorId: req.body.vendorId, // Using the numerical vendor ID
            purchaseOrderNumber: req.body.purchaseOrderNumber
        });

        // Save the new shipment
        await newShipment.save();

        // Update the vendor's performance based on the new shipment
        await updateVendorPerformance(req.body.vendorId);

        res.status(201).json(newShipment);
    } catch (error) {
        res.status(500).json({ message: `Error creating shipment: ${error.message}` });
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
            return res.status(404).json({ message: 'Shipment not found' });
        }
        res.status(200).json(shipment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a shipment
const updateShipment = async (req, res) => {
    try {
        const updatedShipment = await Shipment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedShipment) {
            return res.status(404).json({ message: 'Shipment not found' });
        }

        // Update vendor performance
        await updateVendorPerformance(updatedShipment.vendorId);

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
            return res.status(404).json({ message: 'Shipment not found' });
        }
        res.status(200).json({ message: 'Shipment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createShipment,
    getAllShipments,
    getShipmentById,
    updateShipment,
    deleteShipment
};
