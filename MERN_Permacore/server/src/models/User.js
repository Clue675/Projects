const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the schema for a user
const userSchema = new mongoose.Schema({
    // User's name
    name: {
        type: String,
        required: true
    },

    // User's email, used for login
    email: {
        type: String,
        required: true,
        unique: true
    },

    // Password for authentication
    password: {
        type: String,
        required: true
    },

    // Role of the user (e.g., inspector, supplier quality engineer)
    role: {
        type: String,
        enum: ['Inspecton', 'SupplierQuality', 'Shipping',],
        default: 'Shipping'
    },

    // Timestamps for record creation and modification
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Pre-save middleware to hash the password
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

module.exports = mongoose.model('User', userSchema);
