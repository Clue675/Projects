// const mongoose = require('mongoose');

// const certificationSchema = new mongoose.Schema({
//   vendorId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Vendor',
//     required: true
//   },
//   certificateName: {
//     type: String,
//     required: true
//   },
//   issuedDate: {
//     type: Date,
//     required: true
//   },
//   issuedBy: String,
//   expirationDate: {
//     type: Date,
//     required: true
//   },
//   notes: String,
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// certificationSchema.pre('save', function(next) {
//   this.updatedAt = Date.now();
//   next();
// });

// module.exports = mongoose.model('Certification', certificationSchema);