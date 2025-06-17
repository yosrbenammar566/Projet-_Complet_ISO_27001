const mongoose = require('mongoose');

const complianceControlSchema = new mongoose.Schema({
  reference: { type: String, required: true }, // R�f�rence du contr�le (exemple : A.5.1.1)
  description: { type: String, required: true }, // Description du contr�le
  status: { type: String, enum: ['conforme', 'non-conforme', 'en cours'], default: 'en cours' }, // Statut du contr�le
  checklist: { type: mongoose.Schema.Types.ObjectId, ref: 'Checklist', required: true } // Checklist associ�e
});

module.exports = mongoose.model('ComplianceControl', complianceControlSchema);