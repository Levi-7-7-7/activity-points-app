// models/Tutor.js
const mongoose = require('mongoose');

const tutorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  registerNumber: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  },
  otp: {
    type: String
  },
  otpExpiry: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Tutor', tutorSchema);
