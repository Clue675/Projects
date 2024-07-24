// supplierQualityController.js

// Sample data model - replace with your actual Mongoose model for supplier quality records
const SupplierQuality = require('../../models/SupplierQuality');

// Assuming this is in metricsController.js
exports.getVendorPerformanceMetrics = async (req, res) => {
    const { vendorId } = req.params; // Assuming vendorId is passed as a URL parameter
    const { startDate, endDate } = req.query; // Assuming the frontend passes these as query parameters
  
    try {
      const metrics = await getPerformanceMetrics(vendorId, new Date(startDate), new Date(endDate));
      res.json(metrics);
    } catch (error) {
      console.error('Failed to retrieve performance metrics:', error);
      res.status(500).json({ message: "Failed to retrieve performance metrics." });
    }
  };

  exports.getVendorPerformanceMetrics = async (req, res) => {
    const { vendorId } = req.params; // Assuming vendorId is passed as a URL parameter
    const { startDate, endDate } = req.query; // Assuming the frontend passes these as query parameters
  
    try {
      const metrics = await getPerformanceMetrics(new mongoose.Types.ObjectId(vendorId), new Date(startDate), new Date(endDate));
      res.json(metrics);
    } catch (error) {
      console.error('Failed to retrieve performance metrics:', error);
      res.status(500).json({ message: "Failed to retrieve performance metrics." });
    }
  };
  
// Function to calculate overall supplier quality rating
const calculateOverallSupplierQualityRating = async () => {
    try {
        const records = await SupplierQuality.find();
        let totalOTD = 0, totalQuality = 0, count = 0;

        records.forEach(record => {
            if(record.otdRating && record.qualityRating) {
                totalOTD += record.otdRating;
                totalQuality += record.qualityRating;
                count++;
            }
        });

        const averageOTD = totalOTD / count;
        const averageQuality = totalQuality / count;
        
        // Assuming equal weight for OTD and Quality
        const overallRating = (averageOTD + averageQuality) / 2;
        return overallRating;
    } catch (error) {
        console.error('Error calculating overall supplier quality rating:', error);
        return null;
    }
};

const getAllSupplierQualityRecords = async (req, res) => {
    try {
        const records = await SupplierQuality.find();
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSupplierQualityRecordById = async (req, res) => {
    try {
        const record = await SupplierQuality.findById(req.params.id);
        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }
        res.json(record);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createSupplierQualityRecord = async (req, res) => {
    try {
        const newRecord = new SupplierQuality(req.body);
        const savedRecord = await newRecord.save();
        res.status(201).json(savedRecord);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateSupplierQualityRecord = async (req, res) => {
    try {
        const updatedRecord = await SupplierQuality.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedRecord) {
            return res.status(404).json({ message: 'Record not found' });
        }
        res.json(updatedRecord);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteSupplierQualityRecord = async (req, res) => {
    try {
        const record = await SupplierQuality.findByIdAndDelete(req.params.id);
        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }
        res.json({ message: 'Record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllSupplierQualityRecords,
    getSupplierQualityRecordById,
    createSupplierQualityRecord,
    updateSupplierQualityRecord,
    deleteSupplierQualityRecord,
    calculateOverallSupplierQualityRating
};

