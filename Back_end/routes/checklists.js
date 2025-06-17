const express = require('express');
const checklistController = require('../controllers/checklistController');

const router = express.Router();

// ✅ Créer une nouvelle checklist
router.post('/', checklistController.createChecklist);

// 📥 Récupérer toutes les checklists
router.get('/', checklistController.getChecklists);

// ❌ Les routes suivantes sont commentées car les fonctions n'existent pas dans le controller

// 📥 Récupérer toutes les checklists d’un utilisateur (avec ?userId=...)
// router.get('/by-user', checklistController.getChecklistsByUser);

// 📌 Obtenir une checklist par ID
// router.get('/:id', checklistController.getChecklistById);

module.exports = router;
