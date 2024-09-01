const Vendor = require('../../models/Vendor');
const mongoose = require('mongoose');

// Helper function to parse and validate dates
const parseDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date format: ${dateString}`);
  }
  return date.toISOString();
};

// Add a new certification to a vendor
const addCertification = async (req, res) => {
  try {
    const { id } = req.params;
    const { certificateName, issuedBy, issuedDate, expirationDate, notes, certificateText } = req.body;

    const newCertification = {
      _id: new mongoose.Types.ObjectId(),
      certificateName,
      issuedBy,
      issuedDate: parseDate(issuedDate),
      expirationDate: parseDate(expirationDate),
      notes,
      certificateText,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedVendor = await Vendor.findByIdAndUpdate(
      id,
      { $push: { certifications: newCertification } },
      { new: true, useFindAndModify: false }
    ).populate('certifications');

    if (!updatedVendor) {
      return res.status(404).json({ message: 'Vendor not found.' });
    }

    res.status(201).json({ message: 'Certification added successfully', vendor: updatedVendor });
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
      salesRepName,
      certificationName,
      certificationText,
      issuedDate,
      issuedBy,
      expirationDate,
      certificationNotes,
    } = req.body;

    if (!vendorName || !vendorNumber || !status || !email || !streetAddress || !city || !state || !zipCode || !country || !phone || !qualityRepName || !salesRepName) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const newVendor = new Vendor({
      vendorName,
      vendorNumber: parseInt(vendorNumber, 10),
      lastAuditDate: parseDate(lastAuditDate),
      nextAuditDate: parseDate(nextAuditDate),
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

    if (certificationName && issuedDate && expirationDate) {
      const newCertification = {
        _id: new mongoose.Types.ObjectId(),
        certificateName: certificationName,
        certificateText: certificationText,
        issuedDate: parseDate(issuedDate),
        issuedBy: issuedBy,
        expirationDate: parseDate(expirationDate),
        notes: certificationNotes,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      newVendor.certifications.push(newCertification);
    }

    await newVendor.save();
    res.status(201).json({ message: 'Vendor added successfully', vendor: newVendor });
  } catch (error) {
    console.error('Error adding vendor:', error);
    res.status(400).json({ message: 'Error adding vendor.', error: error.message });
  }
};

// Other functions (getAllVendors, getVendorById, updateVendor, deleteVendor, getCertificationsByVendor, fetchVendorDetailsWithInspections, updateCertification, deleteCertification) should be defined here in the same way before the module.exports

const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.status(200).json(vendors);
  } catch (error) {
    console.error('Error retrieving vendors:', error);
    res.status(500).json({ message: 'Error retrieving vendors.', error: error.message });
  }
};

const getVendorById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid vendor ID format.' });
  }

  try {
    const vendor = await Vendor.findById(id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found.' });
    }
    res.status(200).json(vendor);
  } catch (error) {
    console.error('Error retrieving vendor:', error);
    res.status(500).json({ message: 'Error retrieving vendor.', error: error.message });
  }
};

const updateVendor = async (req, res) => {
  const { id } = req.params;
  const { lastAuditDate, nextAuditDate, status, comments } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid vendor ID format.' });
  }

  try {
    const updatedVendor = await Vendor.findByIdAndUpdate(id, {
      lastAuditDate: parseDate(lastAuditDate),
      nextAuditDate: parseDate(nextAuditDate),
      status,
      comments,
      updatedAt: new Date()
    }, { new: true });
    if (!updatedVendor) {
      return res.status(404).json({ message: 'Vendor not found.' });
    }
    res.status(200).json(updatedVendor);
  } catch (error) {
    console.error('Error updating vendor:', error);
    res.status(400).json({ message: 'Error updating vendor.', error: error.message });
  }
};

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

const getCertificationsByVendor = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid vendor ID format.' });
    }

    const vendor = await Vendor.findById(id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found.' });
    }
    res.status(200).json(vendor.certifications);
  } catch (error) {
    console.error('Error retrieving certifications:', error);
    res.status(500).json({ message: 'Error retrieving certifications.', error: error.message });
  }
};

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
    res.status(500).json({ message: 'Error fetching vendor details.', error: error.message });
  }
};

const updateCertification = async (req, res) => {
  try {
    const { vendorId, certificationId } = req.params;
    const { certificateName, issuedBy, issuedDate, expirationDate, notes, certificateText } = req.body;

    if (!mongoose.Types.ObjectId.isValid(vendorId) || !mongoose.Types.ObjectId.isValid(certificationId)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }

    const updatedVendor = await Vendor.findOneAndUpdate(
      { _id: vendorId, 'certifications._id': certificationId },
      {
        $set: {
          'certifications.$.certificateName': certificateName,
          'certifications.$.issuedBy': issuedBy,
          'certifications.$.issuedDate': parseDate(issuedDate),
          'certifications.$.expirationDate': parseDate(expirationDate),
          'certifications.$.notes': notes,
          'certifications.$.certificateText': certificateText,
          updatedAt: new Date()
        }
      },
      { new: true }
    );

    if (!updatedVendor) {
      return res.status(404).json({ message: 'Certification not found.' });
    }

    res.status(200).json({ message: 'Certification updated successfully', vendor: updatedVendor });
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

    const updatedVendor = await Vendor.findByIdAndUpdate(
      vendorId,
      { $pull: { certifications: { _id: certificationId } } },
      { new: true }
    );

    if (!updatedVendor) {
      return res.status(404).json({ message: 'Certification not found.' });
    }

    res.status(200).json({ message: 'Certification deleted successfully', vendor: updatedVendor });
  } catch (error) {
    console.error('Error deleting certification:', error);
    res.status(500).json({ message: 'Error deleting certification.', error: error.message });
  }
};

module.exports = {
  addVendor,
  getAllVendors,
  getVendorById,
  addCertification,
  updateVendor,
  deleteVendor,
  getCertificationsByVendor,
  fetchVendorDetailsWithInspections,
  deleteCertification,
  updateCertification
};

