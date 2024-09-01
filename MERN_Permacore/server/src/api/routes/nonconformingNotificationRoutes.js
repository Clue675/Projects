const express = require('express');
const router = express.Router();
const nonconformingNotificationController = require('../controllers/nonconformingNotificationController');

// GET all nonconforming notifications
router.get('/', nonconformingNotificationController.getAllNonconformingNotifications);

// GET a single nonconforming notification by id
router.get('/:id', nonconformingNotificationController.getNonconformingNotificationById);

// POST a new nonconforming notification
router.post('/', nonconformingNotificationController.createNonconformingNotification);

// PUT to update a nonconforming notification
router.put('/:id', nonconformingNotificationController.updateNonconformingNotification);

// DELETE a nonconforming notification
router.delete('/:id', nonconformingNotificationController.deleteNonconformingNotification);

module.exports = router;
