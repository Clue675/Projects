const RejectionCode = require('../../models/RejectionCode');

// Function to create multiple rejection codes
const createMultipleRejectionCodes = async (req, res) => {
    try {
        const newCodes = await RejectionCode.insertMany(req.body);
        res.status(201).json(newCodes);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const createRejectionCode = async (req, res) => {
    try {
        const { codeId, codeNumber, category } = req.body;
        
        // Check for duplicates
        const existingCode = await RejectionCode.findOne({ codeId, codeNumber, category });
        if (existingCode) {
            return res.status(400).json({ message: 'Rejection code with this ID and number already exists in the specified category.' });
        }

        const newCode = new RejectionCode(req.body);
        await newCode.save();
        res.status(201).json(newCode);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateRejectionCode = async (req, res) => {
    try {
        const { codeId, codeNumber, category } = req.body;
        
        // Check for duplicates, excluding the current document
        const existingCode = await RejectionCode.findOne({ _id: { $ne: req.params.id }, codeId, codeNumber, category });
        if (existingCode) {
            return res.status(400).json({ message: 'Rejection code with this ID and number already exists in the specified category.' });
        }

        const updatedCode = await RejectionCode.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCode) {
            return res.status(404).json({ message: 'Rejection code not found' });
        }
        res.status(200).json(updatedCode);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const getAllRejectionCodes = async (req, res) => {
    try {
        const codes = await RejectionCode.find();
        res.status(200).json(codes);
    } catch (error) {
        console.error("Failed to retrieve rejection codes:", error);
        res.status(500).json({ message: error.message });
    }
};


// Function to retrieve a single rejection code by ID
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



// Function to delete a rejection code
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
    createMultipleRejectionCodes,
    createRejectionCode,
    getAllRejectionCodes,
    getRejectionCodeById,
    updateRejectionCode,
    deleteRejectionCode
};
