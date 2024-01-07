const express = require('express');
const router = express.Router();

// Import the corrective action controller
const correctiveActionController = require('../controllers/correctiveActionController');

// GET all corrective actions
router.get('/', correctiveActionController.getAllCorrectiveActions);

// GET a single corrective action by id
router.get('/:id', correctiveActionController.getCorrectiveActionById);

// POST a new corrective action
router.post('/', correctiveActionController.createCorrectiveAction);

// PUT to update a corrective action
router.put('/:id', correctiveActionController.updateCorrectiveAction);

// DELETE a corrective action
router.delete('/:id', correctiveActionController.deleteCorrectiveAction);

module.exports = router;
