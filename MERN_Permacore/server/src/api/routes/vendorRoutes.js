const express = require('express');
const router = express.Router();
const multer = require('multer');

// Import the vendor controller
const vendorController = require('../controllers/vendorController');
const storage = multer.memoryStorage();
const upload = multer({ storage });

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

// POST a new certification to a vendor
router.post('/:id/certifications', upload.single('certificationFile'), vendorController.addCertification);

// PUT to update a certification
router.put('/:vendorId/certifications/:certificationId', upload.single('certificationFile'), vendorController.updateCertification);

// DELETE a certification
router.delete('/:vendorId/certifications/:certificationId', vendorController.deleteCertification);

// GET certifications for a specific vendor
router.get('/:id/certifications', vendorController.getCertificationsByVendor);

// GET detailed vendor information including inspections and their shipments
router.get('/:vendorId/details', vendorController.fetchVendorDetailsWithInspections);

module.exports = router;
