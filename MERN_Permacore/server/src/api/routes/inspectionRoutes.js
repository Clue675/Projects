const express = require('express');
const router = express.Router();

// Import the inspection controller
const inspectionController = require('../controllers/inspectionController');

// GET all inspections
router.get('/', inspectionController.getAllInspections);

// GET a single inspection by id
router.get('/:id', inspectionController.getInspectionById);

// POST a new inspection
router.post('/', inspectionController.createInspection);

// PUT to update an inspection
router.put('/:id', inspectionController.updateInspection);

// DELETE an inspection
router.delete('/:id', inspectionController.deleteInspection);

module.exports = router;
