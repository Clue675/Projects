const express = require('express');
const router = express.Router();
const vendorPerformanceController = require('../controllers/vendorPerformanceController');

// POST - Add a new vendor performance record
router.post('/', vendorPerformanceController.addVendorPerformance);

// GET - Retrieve all vendor performance records
router.get('/', vendorPerformanceController.getAllVendorPerformances);

// GET - Retrieve a single vendor performance record by vendor ID
router.get('/:vendorId', vendorPerformanceController.getVendorPerformanceByVendorId);

// GET - Retrieve vendor performance records by date range for a specific vendor ID
router.get('/:vendorId/byDate', vendorPerformanceController.getVendorPerformanceByDate);

// PUT - Update a vendor performance record
router.put('/:id', vendorPerformanceController.updateVendorPerformance);

// DELETE - Delete a vendor performance record
router.delete('/:id', vendorPerformanceController.deleteVendorPerformance);

// GET - Search vendor performance records
router.get('/search', vendorPerformanceController.getVendorPerformanceSearch);

router.get('/:vendorId/details', vendorPerformanceController.getVendorPerformanceDetails);

module.exports = router;
