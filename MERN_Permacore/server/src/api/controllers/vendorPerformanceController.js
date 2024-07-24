const VendorPerformance = require('../../models/VendorPerformance');
const Vendor = require('../../models/Vendor');
const mongoose = require('mongoose');

// Add a new vendor performance record
const addVendorPerformance = async (req, res) => {
  try {
    const newPerformanceRecord = new VendorPerformance(req.body);
    await newPerformanceRecord.save();
    res.status(201).json(newPerformanceRecord);
  } catch (error) {
    console.error('Error adding vendor performance:', error);
    res.status(400).json({ message: 'Error adding vendor performance.' });
  }
};

// Retrieve all vendor performance records
const getAllVendorPerformances = async (req, res) => {
  try {
    const performances = await VendorPerformance.find().populate('vendorId');
    res.status(200).json(performances);
  } catch (error) {
    console.error('Error retrieving vendor performances:', error);
    res.status(500).json({ message: 'Error retrieving vendor performances.' });
  }
};

// Retrieve a single vendor performance record by vendor ID
const getVendorPerformanceByVendorId = async (req, res) => {
  const { vendorId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(vendorId)) {
    return res.status(400).json({ message: 'Invalid vendor ID format.' });
  }

  try {
    const performance = await VendorPerformance.findOne({ vendorId }).populate('vendorId');
    if (!performance) {
      return res.status(404).json({ message: 'Vendor performance record not found.' });
    }
    res.status(200).json(performance);
  } catch (error) {
    console.error('Error fetching vendor performance by ID:', error);
    res.status(500).json({ message: 'Error fetching vendor performance by ID.' });
  }
};

const getVendorPerformanceSearch = async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim() === "") {
    return res.status(400).json({ message: "Query parameter is required." });
  }

  try {
    const vendorQuery = {
      $or: [
        { vendorName: { $regex: query, $options: 'i' } },
        { vendorNumber: query.match(/^\d+$/) ? parseInt(query) : undefined }
      ]
    };

    const vendor = await Vendor.findOne(vendorQuery);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found." });
    }

    const performances = await VendorPerformance.find({
      vendorId: vendor._id
    }).sort({ createdAt: -1 });

    if (performances.length === 0) {
      return res.status(404).json({ message: "No performance records found for this vendor." });
    }

    res.json(performances);
  } catch (error) {
    console.error("Error searching vendor performance:", error);
    res.status(500).json({ message: "Server error while retrieving data" });
  }
};

const getVendorPerformanceByDate = async (req, res) => {
  const { vendorId } = req.params;
  const { startDate, endDate } = req.query;

  if (!mongoose.Types.ObjectId.isValid(vendorId)) {
    return res.status(400).json({ message: "Invalid vendor ID" });
  }

  if (!startDate || !endDate) {
    return res.status(400).json({ message: "Start date and end date are required." });
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({ message: "Invalid date format. Please use YYYY-MM-DD." });
  }

  try {
    const performances = await VendorPerformance.find({
      vendorId,
      createdAt: { $gte: start, $lte: end }
    }).sort({ createdAt: -1 });

    if (performances.length === 0) {
      return res.status(404).json({ message: "No performance records found for this vendor within the given date range." });
    }

    res.json(performances);
  } catch (error) {
    console.error("Error retrieving vendor performance by date:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// Update a vendor performance record
const updateVendorPerformance = async (req, res) => {
  try {
    const updatedPerformance = await VendorPerformance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPerformance) {
      return res.status(404).json({ message: 'Vendor performance record not found.' });
    }
    res.status(200).json(updatedPerformance);
  } catch (error) {
    console.error('Error updating vendor performance:', error);
    res.status(400).json({ message: 'Error updating vendor performance.' });
  }
};

// Delete a vendor performance record
const deleteVendorPerformance = async (req, res) => {
  try {
    const deletedPerformance = await VendorPerformance.findByIdAndDelete(req.params.id);
    if (!deletedPerformance) {
      return res.status(404).json({ message: 'Vendor performance record not found.' });
    }
    res.status(200).json({ message: 'Vendor performance record deleted successfully.' });
  } catch (error) {
    console.error('Error deleting vendor performance:', error);
    res.status(500).json({ message: 'Error deleting vendor performance.' });
  }
};

const getVendorPerformanceDetails = async (req, res) => {
  const { vendorId } = req.params;
  const { startDate, endDate } = req.query;

  if (!mongoose.Types.ObjectId.isValid(vendorId)) {
    return res.status(400).json({ message: "Invalid vendor ID" });
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({ message: "Invalid date format. Please use YYYY-MM-DD." });
  }

  try {
    const vendorDetails = await VendorPerformance.find({
      vendorId,
      createdAt: { $gte: start, $lte: end }
    }).sort({ createdAt: -1 }).lean();

    if (vendorDetails.length === 0) {
      return res.status(404).json({ message: "No performance records found for this vendor within the given date range." });
    }

    res.json(vendorDetails);
  } catch (error) {
    console.error("Error retrieving vendor performance details:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  addVendorPerformance,
  getAllVendorPerformances,
  getVendorPerformanceByVendorId,
  getVendorPerformanceByDate,
  getVendorPerformanceSearch,
  updateVendorPerformance,
  deleteVendorPerformance,
  getVendorPerformanceDetails
};
