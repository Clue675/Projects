const mongoose = require('mongoose');
const Inspection = require('../../models/Inspection');
const Shipment = require('../../models/Shipment');
const RejectionCode = require('../../models/RejectionCode');
const updateVendorPerformance = require('../../models/updateVendorPerformance');
const DiscrepancyReport = require('../../models/DiscrepancyReport');


const createInspection = async (req, res) => {
    try {
        const shipment = await Shipment.findOne({ purchaseOrderNumber: req.body.purchaseOrderNumber });
        if (!shipment) return res.status(404).send('Shipment not found');

        const newInspection = new Inspection({
            ...req.body,
            shipmentId: shipment._id,
            vendorName: shipment.vendorName,
            vendorId: shipment.vendorId
        });
        await newInspection.save();

        // If discrepancies are found, create a discrepancy report
        if (req.body.quantityRejected > 0) {
            const newDiscrepancyReport = new DiscrepancyReport({
                reportId: generateReportId(), // Function to generate a unique report ID
                inspectionId: newInspection._id,
                discrepancyDetails: req.body.notes,
                atFault: 'Vendor', // or derive this from inspection details
                notes: 'Additional details about the discrepancy'
            });
            await newDiscrepancyReport.save();
        }

        if (shipment.vendorId) await updateVendorPerformance(shipment.vendorId);
        res.status(201).json(newInspection);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Helper function to generate a unique report ID
function generateReportId() {
    return 'REPORT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Retrieve all inspections
const getPendingInspections = async (req, res) => {
    try {
        const pendingInspections = await Inspection.find({ status: 'Pending Inspection' });
        res.status(200).json(pendingInspections);
    } catch (error) {
        console.error('Error fetching pending inspections:', error);
        res.status(500).json({ message: 'Error fetching pending inspections' });
    }
};

// Retrieve a single inspection by ID
const getInspectionById = async (req, res) => {
    try {
        const inspection = await Inspection.findById(req.params.id);
        if (!inspection) {
            return res.status(404).json({ message: 'Inspection not found' });
        }
        res.status(200).json(inspection);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an inspection
const updateInspection = async (req, res) => {
    try {
        const updatedInspection = await Inspection.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedInspection) {
            return res.status(404).json({ message: 'Inspection not found' });
        }

        // Update vendor performance if the shipment is linked to a vendor
        if (updatedInspection.shipmentId) {
            const shipment = await Shipment.findById(updatedInspection.shipmentId);
            if (shipment && shipment.vendorId) {
                await updateVendorPerformance(shipment.vendorId);
            }
        }

        res.status(200).json(updatedInspection);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Assign an inspection to an inspector
const assignInspection = async (req, res) => {
    try {
        const { inspectionId, inspectorId } = req.body;
        const inspection = await Inspection.findById(inspectionId);
        if (!inspection) {
            return res.status(404).json({ message: 'Inspection not found' });
        }
        inspection.inspectorId = inspectorId;
        inspection.status = 'WIP'; // Work in Progress
        await inspection.save();
        res.status(200).json({ message: 'Inspection assigned successfully', inspection });
    } catch (error) {
        console.error('Error assigning inspection:', error);
        res.status(500).json({ message: 'Error assigning inspection' });
    }
};

// Delete an inspection
const deleteInspection = async (req, res) => {
    try {
        const deletedInspection = await Inspection.findByIdAndDelete(req.params.id);
        if (!deletedInspection) {
            return res.status(404).json({ message: 'Inspection not found' });
        }
        res.status(200).json({ message: 'Inspection deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createInspection,
    getPendingInspections,
    getInspectionById,
    updateInspection,
    deleteInspection,
    assignInspection
};
