// src/controllers/vendorController.js
const Vendor = require('../../models/Vendor');
const Certification = require('../../models/Certification');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const savePDFToFileSystem = async (file, vendorId, fileName) => {
  const uploadPath = path.join(__dirname, '../../uploads', String(vendorId));
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
  const filePath = path.join(uploadPath, fileName);
  await fs.promises.rename(file.path, filePath); // Use rename instead of writeFile to move the file from multer's temp location
  return filePath;
};

// Add a new certification
const addCertification = async (req, res) => {
  try {
    const { id } = req.params;
    const { certificateName, issuedBy, issuedDate, expirationDate, notes, fileName } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid vendor ID format.' });
    }

    const fileReference = await savePDFToFileSystem(req.file, id, fileName || req.file.originalname);

    const newCertification = new Certification({
      vendorId: id,
      certificateName,
      issuedBy,
      issuedDate,
      expirationDate,
      notes,
      fileReference
    });

    await newCertification.save();

    const updatedVendor = await Vendor.findByIdAndUpdate(id, { $push: { certifications: newCertification._id } }, { new: true }).populate('certifications');

    res.status(201).json({ message: 'Certification added successfully', certifications: updatedVendor.certifications });
  } catch (error) {
    console.error('Error adding certification:', error);
    res.status(400).json({ message: 'Error adding certification.', error: error.message });
  }
};

// Add a new vendor
const addVendor = async (req, res) => {
  try {
    const {
      vendorName,
      vendorNumber,
      lastAuditDate,
      nextAuditDate,
      status,
      vendorCapabilities,
      approvalType,
      comments,
      email,
      streetAddress,
      city,
      state,
      zipCode,
      country,
      phone,
      qualityRepName,
      salesRepName
    } = req.body;

    if (!vendorName || !vendorNumber || !status || !email || !streetAddress || !city || !state || !zipCode || !country || !phone || !qualityRepName || !salesRepName) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const newVendor = new Vendor({
      vendorName,
      vendorNumber: parseInt(vendorNumber, 10),
      lastAuditDate,
      nextAuditDate,
      status,
      vendorCapabilities,
      approvalType,
      comments,
      email,
      streetAddress,
      city,
      state,
      zipCode,
      country,
      phone,
      qualityRepName,
      salesRepName,
      certifications: []
    });

    if (req.file) {
      const fileReference = await savePDFToFileSystem(req.file, newVendor._id);
      newVendor.certifications.push({ certificateName: req.file.originalname, fileReference });
    }

    await newVendor.save();
    res.status(201).json({ message: 'Vendor added successfully', vendor: newVendor });
  } catch (error) {
    console.error('Error adding vendor:', error);
    res.status(400).json({ message: 'Error adding vendor.', error: error.message });
  }
};

// Retrieve all vendors
const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().populate('certifications');
    res.status(200).json(vendors);
  } catch (error) {
    console.error('Error retrieving vendors:', error);
    res.status(500).json({ message: 'Error retrieving vendors.', error: error.message });
  }
};

// Retrieve a single vendor by ID
const getVendorById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid vendor ID format.' });
  }

  try {
    const vendor = await Vendor.findById(id).populate('certifications');
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found.' });
    }
    res.status(200).json(vendor);
  } catch (error) {
    console.error('Error retrieving vendor:', error);
    res.status(500).json({ message: 'Error retrieving vendor.', error: error.message });
  }
};

// Update a vendor's details
const updateVendor = async (req, res) => {
  const { id } = req.params;
  const { lastAuditDate, nextAuditDate, status, comments } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid vendor ID format.' });
  }

  try {
    const updatedVendor = await Vendor.findByIdAndUpdate(id, { lastAuditDate, nextAuditDate, status, comments }, { new: true });
    if (!updatedVendor) {
      return res.status(404).json({ message: 'Vendor not found.' });
    }
    res.status(200).json(updatedVendor);
  } catch (error) {
    console.error('Error updating vendor:', error);
    res.status(400).json({ message: 'Error updating vendor.', error: error.message });
  }
};

// Delete a vendor
const deleteVendor = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid vendor ID format.' });
  }

  try {
    const deletedVendor = await Vendor.findByIdAndDelete(id);
    if (!deletedVendor) {
      return res.status(404).json({ message: 'Vendor not found.' });
    }
    res.status(200).json({ message: 'Vendor deleted successfully.' });
  } catch (error) {
    console.error('Error deleting vendor:', error);
    res.status(500).json({ message: 'Error deleting vendor.', error: error.message });
  }
};

// Retrieve all certifications for a specific vendor
const getCertificationsByVendor = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid vendor ID format.' });
    }

    const vendor = await Vendor.findById(id).populate('certifications');
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found.' });
    }
    res.status(200).json(vendor.certifications);
  } catch (error) {
    console.error('Error retrieving certifications:', error);
    res.status(500).json({ message: 'Error retrieving certifications.', error: error.message });
  }
};

// Fetch vendor details with inspections and shipments
const fetchVendorDetailsWithInspections = async (req, res) => {
  const { vendorId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(vendorId)) {
    return res.status(400).json({ message: 'Invalid vendor ID format.' });
  }

  try {
    const vendor = await Vendor.findById(vendorId)
      .populate({
        path: 'performance',
        populate: {
          path: 'inspections',
          populate: {
            path: 'shipment'
          }
        }
      });

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found.' });
    }

    res.status(200).json(vendor);
  } catch (error) {
    console.error('Error fetching vendor details:', error);
    res.status500.json({ message: 'Error fetching vendor details.', error: error.message });
  }
};


const updateCertification = async (req, res) => {
  try {
    const { vendorId, certificationId } = req.params;
    const { certificateName, issuedBy, issuedDate, expirationDate, notes, fileName } = req.body;

    if (!mongoose.Types.ObjectId.isValid(vendorId) || !mongoose.Types.ObjectId.isValid(certificationId)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }

    let fileReference;
    if (req.file) {
      fileReference = await savePDFToFileSystem(req.file, vendorId, fileName || req.file.originalname);
    }

    const updatedCertification = await Certification.findByIdAndUpdate(certificationId, {
      certificateName,
      issuedBy,
      issuedDate,
      expirationDate,
      notes,
      ...(fileReference && { fileReference })
    }, { new: true });

    if (!updatedCertification) {
      return res.status(404).json({ message: 'Certification not found.' });
    }

    res.status(200).json({ message: 'Certification updated successfully', certification: updatedCertification });
  } catch (error) {
    console.error('Error updating certification:', error);
    res.status(400).json({ message: 'Error updating certification.', error: error.message });
  }
};

const deleteCertification = async (req, res) => {
  try {
    const { vendorId, certificationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(vendorId) || !mongoose.Types.ObjectId.isValid(certificationId)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }

    const deletedCertification = await Certification.findByIdAndDelete(certificationId);

    if (!deletedCertification) {
      return res.status(404).json({ message: 'Certification not found.' });
    }

    await Vendor.findByIdAndUpdate(vendorId, { $pull: { certifications: certificationId } });

    res.status(200).json({ message: 'Certification deleted successfully' });
  } catch (error) {
    console.error('Error deleting certification:', error);
    res.status(500).json({ message: 'Error deleting certification.', error: error.message });
  }
};





module.exports = {
  addVendor,
  getAllVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
  addCertification,
  getCertificationsByVendor,
  fetchVendorDetailsWithInspections,
  deleteCertification,
  updateCertification
};
