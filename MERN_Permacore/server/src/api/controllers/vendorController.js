const Vendor = require('../../models/Vendor');
const Certification = require('../../models/Certification');
const { generatePDF } = require('../../utils/pdfUtils');
const fs = require('fs');
const path = require('path');

// Function to save PDF to file system and return the file path
async function savePDFToFileSystem(pdfBuffer, vendorId) {
    const filename = `certification-${vendorId}-${Date.now()}.pdf`;
    const filepath = path.join(__dirname, '../uploads', filename);
    fs.writeFileSync(filepath, pdfBuffer);
    return filepath;
}

// Add a new vendor
exports.addVendor = async (req, res) => {
    try {
        const newVendor = new Vendor(req.body);
        await newVendor.save();
        res.status(201).json(newVendor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Retrieve all vendors
exports.getAllVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find().populate('certifications');
        res.status(200).json(vendors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Retrieve a single vendor by ID
exports.getVendorById = async (req, res) => {
    try {
        const vendor = await Vendor.findById(req.params.id).populate('certifications');
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }
        res.status(200).json(vendor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a vendor's details
exports.updateVendor = async (req, res) => {
    try {
        const updatedVendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedVendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }
        res.status(200).json(updatedVendor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a vendor
exports.deleteVendor = async (req, res) => {
    try {
        const deletedVendor = await Vendor.findByIdAndDelete(req.params.id);
        if (!deletedVendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }
        res.status(200).json({ message: 'Vendor deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a new certification for a vendor
exports.addCertification = async (req, res) => {
    try {
        const { vendorId, certificateText } = req.body;
        const pdfBuffer = await generatePDF(certificateText);
        const fileReference = await savePDFToFileSystem(pdfBuffer, vendorId);

        const newCertification = new Certification({
            ...req.body,
            vendorId,
            fileReference
        });
        await newCertification.save();

        res.status(201).json(newCertification);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Other certification-related functions can be added here as needed
