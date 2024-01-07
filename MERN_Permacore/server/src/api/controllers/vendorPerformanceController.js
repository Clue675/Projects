const VendorPerformance = require('../../models/VendorPerformance');

// Add a new vendor performance record
const addVendorPerformance = async (req, res) => {
    try {
        const newPerformanceRecord = new VendorPerformance(req.body);
        await newPerformanceRecord.save();
        res.status(201).json(newPerformanceRecord);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Retrieve all vendor performance records
const getAllVendorPerformances = async (req, res) => {
    try {
        const performances = await VendorPerformance.find();
        res.status(200).json(performances);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Retrieve a single vendor performance record by ID
const getVendorPerformanceById = async (req, res) => {
    try {
        const performance = await VendorPerformance.findById(req.params.id);
        if (!performance) {
            return res.status(404).json({ message: 'Vendor performance record not found' });
        }
        res.status(200).json(performance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a vendor performance record
const updateVendorPerformance = async (req, res) => {
    try {
        const updatedPerformance = await VendorPerformance.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPerformance) {
            return res.status(404).json({ message: 'Vendor performance record not found' });
        }
        res.status(200).json(updatedPerformance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a vendor performance record
const deleteVendorPerformance = async (req, res) => {
    try {
        const deletedPerformance = await VendorPerformance.findByIdAndDelete(req.params.id);
        if (!deletedPerformance) {
            return res.status(404).json({ message: 'Vendor performance record not found' });
        }
        res.status(200).json({ message: 'Vendor performance record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addVendorPerformance,
    getAllVendorPerformances,
    getVendorPerformanceById,
    updateVendorPerformance,
    deleteVendorPerformance
};
