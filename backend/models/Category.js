// models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. "Sports & Games"
  description: { type: String },
  maxPoints: { type: Number },
  minDuration: { type: String }, // e.g. "2 Year", "40 hrs"
  requiredDocuments: { type: [String] }, // ["a", "b", "c"]

  subcategories: [
    {
      name: { type: String, required: true }, // e.g. "First Prize"
      points: { type: Number, required: true }, // e.g. 10
      level: { type: String }, // e.g. "National", "State", "Institution"
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
