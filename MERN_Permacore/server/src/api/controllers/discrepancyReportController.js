const DiscrepancyReport = require('../../models/DiscrepancyReport');

// Create a new discrepancy report
const createDiscrepancyReport = async (req, res) => {
    try {
        const newReport = new DiscrepancyReport(req.body);
        await newReport.save();
        res.status(201).json(newReport);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Retrieve all discrepancy reports
const getAllDiscrepancyReports = async (req, res) => {
    try {
        const reports = await DiscrepancyReport.find();
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Retrieve a single discrepancy report by ID
const getDiscrepancyReportById = async (req, res) => {
    try {
        const report = await DiscrepancyReport.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ message: 'Discrepancy report not found' });
        }
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a discrepancy report
const updateDiscrepancyReport = async (req, res) => {
    try {
        const updatedReport = await DiscrepancyReport.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedReport) {
            return res.status(404).json({ message: 'Discrepancy report not found' });
        }
        res.status(200).json(updatedReport);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a discrepancy report
const deleteDiscrepancyReport = async (req, res) => {
    try {
        const deletedReport = await DiscrepancyReport.findByIdAndDelete(req.params.id);
        if (!deletedReport) {
            return res.status(404).json({ message: 'Discrepancy report not found' });
        }
        res.status(200).json({ message: 'Discrepancy report deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createDiscrepancyReport,
    getAllDiscrepancyReports,
    getDiscrepancyReportById,
    updateDiscrepancyReport,
    deleteDiscrepancyReport
};
