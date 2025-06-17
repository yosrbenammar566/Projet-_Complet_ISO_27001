const express = require('express');
const complianceController = require('../controllers/complianceController');
const router = express.Router();

// Cr�er un contr�le de conformit�
router.post('/', complianceController.createComplianceControl);

// R�cup�rer tous les contr�les de conformit� d'une checklist
router.get('/', complianceController.getComplianceControls);

module.exports = router;