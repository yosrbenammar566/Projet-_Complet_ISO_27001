const Recommendation = require('../models/Recommendation');
const Audit = require('../models/Audit');

// Cr�er une nouvelle recommandation
exports.createRecommendation = async (req, res) => {
    try {
        const { description, auditId } = req.body;
        const recommendation = new Recommendation({ description, audit: auditId }); // Cr�ation d'une nouvelle recommandation
        await recommendation.save(); // Sauvegarde dans la base de donn�es

        // Ajouter la recommandation � l'audit correspondant
        await Audit.findByIdAndUpdate(auditId, { $push: { recommendations: recommendation._id } });

        res.status(201).json(recommendation); // R�ponse avec la recommandation cr��e
    } catch (error) {
        res.status(500).json({ message: error.message }); // Gestion des erreurs
    }
};

// Obtenir les recommandations d'un audit
exports.getRecommendationsByAudit = async (req, res) => {
    try {
        const { auditId } = req.params;
        const recommendations = await Recommendation.find({ audit: auditId }); // R�cup�re les recommandations associ�es � un audit
        res.status(200).json(recommendations); // R�ponse avec la liste des recommandations
    } catch (error) {
        res.status(500).json({ message: error.message }); // Gestion des erreurs
    }
};