const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema({
  action: { type: String, required: true },
  responsible: { type: String, required: true },
  plannedDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ["À faire", "En cours", "Terminé"],
    default: "À faire"
  },
  nonConformities: [
    {
      type: mongoose.Schema.Types.ObjectId, // ou un sous-document
      ref: "NonConformity" // si tu as un modèle séparé
    }
  ]
}, { timestamps: true });


module.exports = mongoose.model('Action', actionSchema);
