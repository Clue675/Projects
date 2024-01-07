const express = require('express');
const router = express.Router();

// Import the internal corrective action controller
const internalCorrectiveActionController = require('../controllers/internalCorrectiveActionController');

// GET all internal corrective actions
router.get('/', internalCorrectiveActionController.getAllInternalCorrectiveActions);

// GET a single internal corrective action by id
router.get('/:id', internalCorrectiveActionController.getInternalCorrectiveActionById);

// POST a new internal corrective action
router.post('/', internalCorrectiveActionController.createInternalCorrectiveAction);

// PUT to update an internal corrective action
router.put('/:id', internalCorrectiveActionController.updateInternalCorrectiveAction);

// DELETE an internal corrective action
router.delete('/:id', internalCorrectiveActionController.deleteInternalCorrectiveAction);

module.exports = router;
