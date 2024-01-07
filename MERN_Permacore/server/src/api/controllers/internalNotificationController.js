const InternalNotification = require('../../models/InternalNotification');

// Create a new internal notification
const createInternalNotification = async (req, res) => {
    try {
        const newNotification = new InternalNotification(req.body);
        await newNotification.save();
        res.status(201).json(newNotification);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Retrieve all internal notifications
const getAllInternalNotifications = async (req, res) => {
    try {
        const notifications = await InternalNotification.find();
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Retrieve a single internal notification by ID
const getInternalNotificationById = async (req, res) => {
    try {
        const notification = await InternalNotification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: 'Internal notification not found' });
        }
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an internal notification
const updateInternalNotification = async (req, res) => {
    try {
        const updatedNotification = await InternalNotification.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedNotification) {
            return res.status(404).json({ message: 'Internal notification not found' });
        }
        res.status(200).json(updatedNotification);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete an internal notification
const deleteInternalNotification = async (req, res) => {
    try {
        const deletedNotification = await InternalNotification.findByIdAndDelete(req.params.id);
        if (!deletedNotification) {
            return res.status(404).json({ message: 'Internal notification not found' });
        }
        res.status(200).json({ message: 'Internal notification deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createInternalNotification,
    getAllInternalNotifications,
    getInternalNotificationById,
    updateInternalNotification,
    deleteInternalNotification
};
