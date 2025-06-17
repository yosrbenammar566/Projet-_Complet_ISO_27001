const express = require('express');
const complianceController = require('../controllers/complianceController');
const router = express.Router();

// Créer un contrôle de conformité
router.post('/', complianceController.createComplianceControl);

// Récupérer tous les contrôles de conformité d'une checklist
router.get('/', complianceController.getComplianceControls);

module.exports = router;