const NonconformingNotification = require('../../models/NonconformingNotification');

// Create a new nonconforming notification
const createNonconformingNotification = async (req, res) => {
    try {
        const newNotification = new NonconformingNotification(req.body);
        await newNotification.save();
        res.status(201).json(newNotification);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Retrieve all nonconforming notifications
const getAllNonconformingNotifications = async (req, res) => {
    try {
        const notifications = await NonconformingNotification.find();
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Retrieve a single nonconforming notification by ID
const getNonconformingNotificationById = async (req, res) => {
    try {
        const notification = await NonconformingNotification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: 'Nonconforming notification not found' });
        }
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a nonconforming notification
const updateNonconformingNotification = async (req, res) => {
    try {
        const updatedNotification = await NonconformingNotification.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedNotification) {
            return res.status(404).json({ message: 'Nonconforming notification not found' });
        }
        res.status(200).json(updatedNotification);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a nonconforming notification
const deleteNonconformingNotification = async (req, res) => {
    try {
        const deletedNotification = await NonconformingNotification.findByIdAndDelete(req.params.id);
        if (!deletedNotification) {
            return res.status(404).json({ message: 'Nonconforming notification not found' });
        }
        res.status(200).json({ message: 'Nonconforming notification deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createNonconformingNotification,
    getAllNonconformingNotifications,
    getNonconformingNotificationById,
    updateNonconformingNotification,
    deleteNonconformingNotification,
};
