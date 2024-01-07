const CorrectiveAction = require('../../models/CorrectiveAction');

// Create a new corrective action
const createCorrectiveAction = async (req, res) => {
    try {
        const newCorrectiveAction = new CorrectiveAction(req.body);
        await newCorrectiveAction.save();
        res.status(201).json(newCorrectiveAction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Retrieve all corrective actions
const getAllCorrectiveActions = async (req, res) => {
    try {
        const correctiveActions = await CorrectiveAction.find();
        res.status(200).json(correctiveActions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Retrieve a single corrective action by ID
const getCorrectiveActionById = async (req, res) => {
    try {
        const correctiveAction = await CorrectiveAction.findById(req.params.id);
        if (!correctiveAction) {
            return res.status(404).json({ message: 'Corrective action not found' });
        }
        res.status(200).json(correctiveAction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a corrective action
const updateCorrectiveAction = async (req, res) => {
    try {
        const updatedAction = await CorrectiveAction.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedAction) {
            return res.status(404).json({ message: 'Corrective action not found' });
        }
        res.status(200).json(updatedAction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a corrective action
const deleteCorrectiveAction = async (req, res) => {
    try {
        const deletedAction = await CorrectiveAction.findByIdAndDelete(req.params.id);
        if (!deletedAction) {
            return res.status(404).json({ message: 'Corrective action not found' });
        }
        res.status(200).json({ message: 'Corrective action deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createCorrectiveAction,
    getAllCorrectiveActions,
    getCorrectiveActionById,
    updateCorrectiveAction,
    deleteCorrectiveAction
};
