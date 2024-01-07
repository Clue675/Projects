const InternalCorrectiveAction = require('../../models/InternalCorrectiveAction');

// Create a new internal corrective action
const createInternalCorrectiveAction = async (req, res) => {
    try {
        const newAction = new InternalCorrectiveAction(req.body);
        await newAction.save();
        res.status(201).json(newAction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Retrieve all internal corrective actions
const getAllInternalCorrectiveActions = async (req, res) => {
    try {
        const actions = await InternalCorrectiveAction.find();
        res.status(200).json(actions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Retrieve a single internal corrective action by ID
const getInternalCorrectiveActionById = async (req, res) => {
    try {
        const action = await InternalCorrectiveAction.findById(req.params.id);
        if (!action) {
            return res.status(404).json({ message: 'Internal corrective action not found' });
        }
        res.status(200).json(action);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an internal corrective action
const updateInternalCorrectiveAction = async (req, res) => {
    try {
        const updatedAction = await InternalCorrectiveAction.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedAction) {
            return res.status(404).json({ message: 'Internal corrective action not found' });
        }
        res.status(200).json(updatedAction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete an internal corrective action
const deleteInternalCorrectiveAction = async (req, res) => {
    try {
        const deletedAction = await InternalCorrectiveAction.findByIdAndDelete(req.params.id);
        if (!deletedAction) {
            return res.status(404).json({ message: 'Internal corrective action not found' });
        }
        res.status(200).json({ message: 'Internal corrective action deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createInternalCorrectiveAction,
    getAllInternalCorrectiveActions,
    getInternalCorrectiveActionById,
    updateInternalCorrectiveAction,
    deleteInternalCorrectiveAction
};
