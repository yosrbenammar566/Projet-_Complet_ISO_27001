const Recommendation = require('../models/Recommendation');
const Audit = require('../models/Audit');

// Créer une nouvelle recommandation
exports.createRecommendation = async (req, res) => {
    try {
        const { description, auditId } = req.body;
        const recommendation = new Recommendation({ description, audit: auditId }); // Création d'une nouvelle recommandation
        await recommendation.save(); // Sauvegarde dans la base de données

        // Ajouter la recommandation à l'audit correspondant
        await Audit.findByIdAndUpdate(auditId, { $push: { recommendations: recommendation._id } });

        res.status(201).json(recommendation); // Réponse avec la recommandation créée
    } catch (error) {
        res.status(500).json({ message: error.message }); // Gestion des erreurs
    }
};

// Obtenir les recommandations d'un audit
exports.getRecommendationsByAudit = async (req, res) => {
    try {
        const { auditId } = req.params;
        const recommendations = await Recommendation.find({ audit: auditId }); // Récupère les recommandations associées à un audit
        res.status(200).json(recommendations); // Réponse avec la liste des recommandations
    } catch (error) {
        res.status(500).json({ message: error.message }); // Gestion des erreurs
    }
};