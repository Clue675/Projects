const mongoose = require('mongoose');

// Define the schema for a rejection code
const rejectionCodeSchema = new mongoose.Schema({
    // A unique identifier for the rejection code
    codeId: {
        type: String,
        required: true,
        unique: true
    },

    // A numerical representation of the rejection code
    codeNumber: {
        type: Number,
        required: true,
        unique: true
    },

    // Category of the rejection
    category: String,

    // Detailed description of what the code represents
    description: String
});

module.exports = mongoose.model('RejectionCode', rejectionCodeSchema);
