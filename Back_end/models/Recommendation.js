const mongoose = require('mongoose');

// Définition du schéma pour les recommandations
const RecommendationSchema = new mongoose.Schema({
    description: { type: String, required: true }, // Description de la recommandation
    audit: { type: mongoose.Schema.Types.ObjectId, ref: 'Audit' }, // Référence à l'audit associé
    status: { type: String, enum: ['Ouverte', 'En cours', 'Fermée'], default: 'Ouverte' }, // Statut de la recommandation
    date: { type: Date, default: Date.now } // Date de création de la recommandation
});

// Exportation du modèle Recommendation
module.exports = mongoose.model('Recommendation', RecommendationSchema);