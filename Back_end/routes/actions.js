const express = require("express");
const router = express.Router();
const Action = require("../models/Action");

// ✅ Route pour récupérer toutes les actions avec leurs non-conformités liées
router.get("/", async (req, res) => {
  try {
    const actions = await Action.find().populate("nonConformities");
    res.json(actions);
  } catch (err) {
    console.error("Erreur lors du chargement des actions :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
