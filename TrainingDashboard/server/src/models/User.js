const mongoose = require('mongoose');
const argon2 = require('argon2');
const Division = require('../models/Divisions');


const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please provide your first name'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Please provide your last name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email address'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
  },
  divisionRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Division',
    required: [true, 'Please select a division'],
  }
}, {
  timestamps: true,
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await argon2.hash(this.password);
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
