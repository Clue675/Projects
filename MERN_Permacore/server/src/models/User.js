const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, // Automatically convert email to lowercase
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['Purchasing', 'Supplier Quality', 'Inspection', 'Shipping'],
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

