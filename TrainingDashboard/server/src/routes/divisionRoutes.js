const express = require('express');
const router = express.Router();
const divisionController = require('../controllers/DivisionController');


// Route to create a new division
router.post('/', divisionController.createDivision);

// Route to get all divisions
router.get('/', divisionController.getAllDivisions);

// Route to get a specific division by ID
router.get('/:id', divisionController.getDivision);

// Route to update a division
router.put('/:id', divisionController.updateDivision);

// Route to delete a division
router.delete('/:id', divisionController.deleteDivision);

module.exports = router;
