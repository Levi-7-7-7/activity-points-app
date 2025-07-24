// models/Student.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  registerNumber: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    default: null // Will be set after OTP verification
  },
  otp: {
    type: String,
    default: null
  },
  otpExpiry: {
    type: Date,
    default: null
  },
  totalPoints: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);
