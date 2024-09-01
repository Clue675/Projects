// server/src/routes/trainingCharts.js
const express = require('express');
const trainingCharts = require('../controllers/trainingCharts'); // Ensure this path matches your file structure

const router = express.Router();

// Route to get training completion rate by department
router.get('/completion-rate-by-department', trainingCharts.getTrainingCompletionRateByDepartment);

module.exports = router;
