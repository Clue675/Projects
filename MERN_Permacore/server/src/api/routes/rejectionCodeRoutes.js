const express = require('express');
const router = express.Router();

// Import the rejection code controller
const rejectionCodeController = require('../controllers/rejectionCodeController');

// GET all rejection codes
router.get('/', rejectionCodeController.getAllRejectionCodes);

// GET a single rejection code by id
router.get('/:id', rejectionCodeController.getRejectionCodeById);

// POST a new rejection code
router.post('/', rejectionCodeController.createRejectionCode);

// PUT to update a rejection code
router.put('/:id', rejectionCodeController.updateRejectionCode);

// DELETE a rejection code
router.delete('/:id', rejectionCodeController.deleteRejectionCode);

module.exports = router;

