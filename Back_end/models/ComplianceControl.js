const mongoose = require('mongoose');

const complianceControlSchema = new mongoose.Schema({
  reference: { type: String, required: true }, // Référence du contrôle (exemple : A.5.1.1)
  description: { type: String, required: true }, // Description du contrôle
  status: { type: String, enum: ['conforme', 'non-conforme', 'en cours'], default: 'en cours' }, // Statut du contrôle
  checklist: { type: mongoose.Schema.Types.ObjectId, ref: 'Checklist', required: true } // Checklist associée
});

module.exports = mongoose.model('ComplianceControl', complianceControlSchema);