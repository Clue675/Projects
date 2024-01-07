const Inspection = require('../../models/Inspection');
const Shipment = require('../../models/Shipment'); // If needed for linking inspections to shipments
const updateVendorPerformance = require('../../models/updateVendorPerformance');

// Create a new inspection
const createInspection = async (req, res) => {
    try {
        const newInspection = new Inspection(req.body);
        await newInspection.save();

        // Update vendor performance if the shipment is linked to a vendor
        if (newInspection.shipmentId) {
            const shipment = await Shipment.findById(newInspection.shipmentId);
            if (shipment && shipment.vendorId) {
                await updateVendorPerformance(shipment.vendorId);
            }
        }

        res.status(201).json(newInspection);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Retrieve all inspections
const getAllInspections = async (req, res) => {
    try {
        const inspections = await Inspection.find();
        res.status(200).json(inspections);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Retrieve a single inspection by ID
const getInspectionById = async (req, res) => {
    try {
        const inspection = await Inspection.findById(req.params.id);
        if (!inspection) {
            return res.status(404).json({ message: 'Inspection not found' });
        }
        res.status(200).json(inspection);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an inspection
const updateInspection = async (req, res) => {
    try {
        const updatedInspection = await Inspection.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedInspection) {
            return res.status(404).json({ message: 'Inspection not found' });
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

// Delete an inspection
const deleteInspection = async (req, res) => {
    try {
        const deletedInspection = await Inspection.findByIdAndDelete(req.params.id);
        if (!deletedInspection) {
            return res.status(404).json({ message: 'Inspection not found' });
        }
        res.status(200).json({ message: 'Inspection deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createInspection,
    getAllInspections,
    getInspectionById,
    updateInspection,
    deleteInspection
};
