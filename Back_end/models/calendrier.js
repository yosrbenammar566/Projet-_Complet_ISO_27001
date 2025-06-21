const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  type: { type: String },
  priority: { type: String },
  auditor: { type: String },
  department: { type: String },
  description: { type: String },
  scope: { type: String },
  checklist: { type: Array, default: [] },
  status: { type: String, default: "planned" }
});

// 👇 à la fin du fichier
module.exports = mongoose.model('Calendrier', eventSchema); // ✅ remplace "Event" par "Calendrier"

