// routes/nonConformities.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/nonConformityController');

// GET toutes les non-conformités
router.get('/', controller.getAll);

// POST ajouter une non-conformité
router.post('/', controller.create);

// DELETE supprimer par ID
router.delete('/:id', controller.remove);

// PUT mise à jour du statut uniquement
router.put('/:id/status', controller.updateStatus);

// PUT mise à jour complète
router.put('/:id', controller.update);

module.exports = router;
