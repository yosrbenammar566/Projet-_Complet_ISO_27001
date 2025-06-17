const express = require('express');
const recommendationController = require('../controllers/recommendationController');

const router = express.Router();

// Route pour créer une recommandation
router.post('/', recommendationController.createRecommendation);

// Route pour obtenir les recommandations d'un audit
router.get('/:auditId', recommendationController.getRecommendationsByAudit);

module.exports = router;