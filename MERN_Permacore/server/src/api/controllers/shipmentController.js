const Shipment = require('../../models/Shipment');
const updateVendorPerformance = require('../../models/updateVendorPerformance'); // Assuming this is the correct path

// Create a new shipment
const createShipment = async (req, res) => {
    try {
        const newShipment = new Shipment(req.body);
        await newShipment.save();

        // Update vendor performance
        await updateVendorPerformance(newShipment.vendorId);

        res.status(201).json(newShipment);
    } catch (error) {
        res.status(400).json({ message: error.message });
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
