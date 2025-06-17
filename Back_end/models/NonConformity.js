// models/NonConformity.js
const mongoose = require('mongoose');

const NonConformitySchema = new mongoose.Schema({
  
  title: String,
  control: String,
  severity: { type: String, enum: ['minor', 'major', 'critical'], default: 'minor' },
  responsible: String,
  discoveredDate: Date,
  dueDate: Date,
  description: String,
  correctiveAction: String,
  verificationMethod: String,
  verificationDate: Date,
  notes: String,
  status: { 
    type: String, 
    enum: ['open', 'in-progress', 'closed', 'verified'], // statuts adaptés au front
    default: 'open' 
  },
}, { timestamps: true });
module.exports = mongoose.model('NonConformity', NonConformitySchema);

