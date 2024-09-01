const mongoose = require('mongoose');
const Schema = mongoose.Schema; // Correctly reference Schema

const divisionSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  departments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Department' }]
}, { timestamps: true });

module.exports = mongoose.model('Division', divisionSchema);
