const express = require('express');
const router = express.Router();
const vendorPerformanceController = require('../controllers/vendorPerformanceController');

// POST - Add a new vendor performance record
router.post('/vendorPerformance', vendorPerformanceController.addVendorPerformance);

// GET - Retrieve all vendor performance records
router.get('/vendorPerformance', vendorPerformanceController.getAllVendorPerformances);

// GET a single vendor performance record by vendor ID
router.get('/vendorPerformance/:vendorId', vendorPerformanceController.getVendorPerformanceByVendorId);

// PUT - Update a vendor performance record
router.put('/vendorPerformance/:id', vendorPerformanceController.updateVendorPerformance);

// DELETE - Delete a vendor performance record
router.delete('/vendorPerformance/:id', vendorPerformanceController.deleteVendorPerformance);

module.exports = router;
