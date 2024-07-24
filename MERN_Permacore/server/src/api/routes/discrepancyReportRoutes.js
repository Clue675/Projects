const express = require('express');
const router = express.Router();

// Import the discrepancy report controller
const discrepancyReportController = require('../controllers/discrepancyReportController');

// GET all discrepancy reports
router.get('/', discrepancyReportController.getAllDiscrepancyReports);

// GET a single discrepancy report by id
router.get('/:id', discrepancyReportController.getDiscrepancyReportById);

// POST a new discrepancy report
router.post('/', discrepancyReportController.createDiscrepancyReport);

// PUT to update a discrepancy report
router.put('/:id', discrepancyReportController.updateDiscrepancyReport);

// DELETE a discrepancy report
router.delete('/:id', discrepancyReportController.deleteDiscrepancyReport);

module.exports = router;
