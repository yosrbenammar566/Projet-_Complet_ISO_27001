const mongoose = require('mongoose');

const rapportSchema = new mongoose.Schema({
  title: String,
  auditType: String,
  auditor: String,
  department: String,
  auditStartDate: String,
  auditEndDate: String,
  auditProgress: String,
  auditDuration: Number,
  notes: String,
  checklistItems: [
    {
      control: String,
      status: { type: String, enum: ['conform', 'non-conform', 'pending'] }
    }
  ],
  nonConformities: [
    {
      title: String,
      severity: String,
      correctiveAction: String
    }
  ],
  actionPlanItems: [
    {
      action: String,
      responsible: String,
      plannedDate: String,
      status: String
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Rapport', rapportSchema);
