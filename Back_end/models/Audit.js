const mongoose = require('mongoose');

const AuditSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: [
      "Audit interne",
      "Audit de certification",
      "Audit de surveillance",
      "Audit de tierce partie"
    ],
    required: true,
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  auditor: { type: String, required: true },
  department: { type: String, required: true },
  priority: {
    type: String,
    enum: ["Faible", "Moyenne", "Élevée", "Critique"],
    required: true,
  },
  category: {
    type: String,
     enum: ["Physique", "Opérationnelle", "Administrative"],
    required: true,
  },
  scope: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ["En cours", "Terminé", "Non conforme"],
    default: "En cours"
  },
  ecartPercentage: { type: Number, default: null },
  recommendations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recommendation' }],
}, {
  timestamps: true
});


module.exports = mongoose.model('Audit', AuditSchema);
