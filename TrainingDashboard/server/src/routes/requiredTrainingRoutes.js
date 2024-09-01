const express = require('express');
const requiredTrainingController = require('../controllers/requiredTrainingController');
const RequiredTraining = require('../models/RequiredTraining'); 

const router = express.Router();

// Define routes and link to controller functions
router.post('/', requiredTrainingController.createRequiredTraining);
router.get('/frequencies', requiredTrainingController.getDistinctFrequencies);
router.get('/', requiredTrainingController.getAllTrainings); // Corrected line
router.put('/:id', requiredTrainingController.updateRequiredTraining);
router.delete('/:id', requiredTrainingController.deleteRequiredTraining);
router.post('/record', requiredTrainingController.createTrainingRecord);
router.get('/required', requiredTrainingController.getAllRequiredTrainingTitles);


module.exports = router;
