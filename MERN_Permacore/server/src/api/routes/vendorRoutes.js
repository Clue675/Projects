const express = require('express');
const router = express.Router();

// Import the vendor controller
const vendorController = require('../controllers/vendorController');

// GET all vendors
router.get('/', vendorController.getAllVendors);

// GET a single vendor by id
router.get('/:id', vendorController.getVendorById);

// POST a new vendor
router.post('/', vendorController.addVendor);

// PUT to update a vendor
router.put('/:id', vendorController.updateVendor);

// DELETE a vendor
router.delete('/:id', vendorController.deleteVendor);

module.exports = router;
