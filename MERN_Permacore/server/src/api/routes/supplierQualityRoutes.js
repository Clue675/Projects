const express = require('express');
const router = express.Router();
const vendorPerformanceController = require('../controllers/vendorPerformanceController');

// Import the supplier quality controller
const supplierQualityController = require('../controllers/supplierQualityController');

// GET all supplier quality records
router.get('/', supplierQualityController.getAllSupplierQualityRecords);

router.get('/:id', vendorPerformanceController.getVendorPerformanceByVendorId);

// GET a single supplier quality record by id
router.get('/:id', supplierQualityController.getSupplierQualityRecordById);

// POST a new supplier quality record
router.post('/', supplierQualityController.createSupplierQualityRecord);

// PUT to update a supplier quality record
router.put('/:id', supplierQualityController.updateSupplierQualityRecord);

// DELETE a supplier quality record
router.delete('/:id', supplierQualityController.deleteSupplierQualityRecord);

module.exports = router;
