const Vendor = require('../../models/Vendor');
const Certification = require('../../models/Certification');
const mongoose = require('mongoose');

// Helper function to parse and validate dates
const parseDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date format: ${dateString}`);
  }
  return date;
};

// Add a new certification
const addCertification = async (req, res) => {
  try {
    const { id } = req.params;
    const { certificateName, issuedBy, issuedDate, expirationDate, notes, fileName } = req.body;

    console.log(`Received issuedDate: ${issuedDate}, expirationDate: ${expirationDate}`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid vendor ID format.' });
    }

    const parsedIssuedDate = parseDate(issuedDate);
    const parsedExpirationDate = parseDate(expirationDate);

    console.log(`Parsed issuedDate: ${parsedIssuedDate}, parsed expirationDate: ${parsedExpirationDate}`);

    const fileReference = req.file ? req.file.originalname : "";

    const newCertification = new Certification({
      vendorId: id,
      certificateName,
      issuedBy,
      issuedDate: parsedIssuedDate,
      expirationDate: parsedExpirationDate,
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
      fileName
    } = req.body;

    console.log(`Received lastAuditDate: ${lastAuditDate}, nextAuditDate: ${nextAuditDate}, issuedDate: ${issuedDate}, expirationDate: ${expirationDate}`);

    if (!vendorName || !vendorNumber || !status || !email || !streetAddress || !city || !state || !zipCode || !country || !phone || !qualityRepName || !salesRepName) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const parsedLastAuditDate = parseDate(lastAuditDate);
    const parsedNextAuditDate = parseDate(nextAuditDate);
    const parsedIssuedDate = certificationName && issuedDate ? parseDate(issuedDate) : null;
    const parsedExpirationDate = certificationName && expirationDate ? parseDate(expirationDate) : null;

    console.log(`Parsed lastAuditDate: ${parsedLastAuditDate}, parsed nextAuditDate: ${parsedNextAuditDate}, parsed issuedDate: ${parsedIssuedDate}, parsed expirationDate: ${parsedExpirationDate}`);

    const newVendor = new Vendor({
      vendorName,
      vendorNumber: parseInt(vendorNumber, 10),
      lastAuditDate: parsedLastAuditDate,
      nextAuditDate: parsedNextAuditDate,
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

    if (certificationName && parsedIssuedDate && parsedExpirationDate) {
      const newCertification = new Certification({
        vendorId: newVendor._id,
        certificateName: certificationName,
        certificateText: certificationText,
        issuedDate: parsedIssuedDate,
        issuedBy: issuedBy,
        expirationDate: parsedExpirationDate,
        fileReference: fileName,
        notes: certificationNotes
      });

      await newCertification.save();
      newVendor.certifications.push(newCertification._id);
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
    const vendors = await Vendor.find().populate('certifications');
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

const updateVendor = async (req, res) => {
  const { id } = req.params;
  const { lastAuditDate, nextAuditDate, status, comments } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid vendor ID format.' });
  }

  try {
    const updatedVendor = await Vendor.findByIdAndUpdate(id, {
      lastAuditDate: new Date(lastAuditDate),
      nextAuditDate: new Date(nextAuditDate),
      status,
      comments
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
    const { certificateName, issuedBy, issuedDate, expirationDate, notes, fileName } = req.body;

    if (!mongoose.Types.ObjectId.isValid(vendorId) || !mongoose.Types.ObjectId.isValid(certificationId)) {
      return res.status(400).json({ message: 'Invalid ID format.' });
    }

    const updatedCertification = await Certification.findByIdAndUpdate(certificationId, {
      certificateName,
      issuedBy,
      issuedDate: new Date(issuedDate),
      expirationDate: new Date(expirationDate),
      notes,
      fileReference: fileName
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
