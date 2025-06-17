const express = require('express');
const router = express.Router();
const Control = require('../models/Control');

// Récupérer tous les contrôles
router.get('/', async (req, res) => {
  try {
    const controls = await Control.find();
    res.json(controls);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des contrôles' });
  }
});

module.exports = router;
