// models/Certificate.js
const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  subcategory: {
    name: String,
    points: Number,
    level: String
  },
  documentUrl: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  tutorRemarks: {
    type: String,
    default: ''
  },
  assignedPoints: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);
