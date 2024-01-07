const RejectionCode = require('../../models/RejectionCode');

// Create a new rejection code
const createRejectionCode = async (req, res) => {
    try {
        const newCode = new RejectionCode(req.body);
        await newCode.save();
        res.status(201).json(newCode);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Retrieve all rejection codes
const getAllRejectionCodes = async (req, res) => {
    try {
        const codes = await RejectionCode.find();
        res.status(200).json(codes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Retrieve a single rejection code by ID
const getRejectionCodeById = async (req, res) => {
    try {
        const code = await RejectionCode.findById(req.params.id);
        if (!code) {
            return res.status(404).json({ message: 'Rejection code not found' });
        }
        res.status(200).json(code);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a rejection code
const updateRejectionCode = async (req, res) => {
    try {
        const updatedCode = await RejectionCode.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCode) {
            return res.status(404).json({ message: 'Rejection code not found' });
        }
        res.status(200).json(updatedCode);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a rejection code
const deleteRejectionCode = async (req, res) => {
    try {
        const deletedCode = await RejectionCode.findByIdAndDelete(req.params.id);
        if (!deletedCode) {
            return res.status(404).json({ message: 'Rejection code not found' });
        }
        res.status(200).json({ message: 'Rejection code deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createRejectionCode,
    getAllRejectionCodes,
    getRejectionCodeById,
    updateRejectionCode,
    deleteRejectionCode
};
