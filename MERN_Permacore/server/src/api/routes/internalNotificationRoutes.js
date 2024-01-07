const express = require('express');
const router = express.Router();

// Import the internal notification controller
const internalNotificationController = require('../controllers/internalNotificationController');

// GET all internal notifications
router.get('/', internalNotificationController.getAllInternalNotifications);

// GET a single internal notification by id
router.get('/:id', internalNotificationController.getInternalNotificationById);

// POST a new internal notification
router.post('/', internalNotificationController.createInternalNotification);

// PUT to update an internal notification
router.put('/:id', internalNotificationController.updateInternalNotification);

// DELETE an internal notification
router.delete('/:id', internalNotificationController.deleteInternalNotification);

module.exports = router;
