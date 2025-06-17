const mongoose = require('mongoose');

// D�finition du sch�ma pour les recommandations
const RecommendationSchema = new mongoose.Schema({
    description: { type: String, required: true }, // Description de la recommandation
    audit: { type: mongoose.Schema.Types.ObjectId, ref: 'Audit' }, // R�f�rence � l'audit associ�
    status: { type: String, enum: ['Ouverte', 'En cours', 'Ferm�e'], default: 'Ouverte' }, // Statut de la recommandation
    date: { type: Date, default: Date.now } // Date de cr�ation de la recommandation
});

// Exportation du mod�le Recommendation
module.exports = mongoose.model('Recommendation', RecommendationSchema);