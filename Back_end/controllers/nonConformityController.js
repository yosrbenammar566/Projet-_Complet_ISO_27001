// controllers/nonConformityController.js
const NonConformity = require('../models/NonConformity');

// Récupérer toutes les non-conformités triées par date décroissante
exports.getAll = async (req, res) => {
  try {
    const list = await NonConformity.find().sort({ createdAt: -1 });
    // On peut renvoyer directement sans transformer
    res.json(list);
  } catch (err) {
    console.error("❌ Erreur lors de la récupération :", err);
    res.status(500).json({ error: "Erreur serveur", detail: err });
  }
};

// Créer une non-conformité
exports.create = async (req, res) => {
  try {
    const newOne = new NonConformity(req.body);
    const saved = await newOne.save();
    res.status(201).json(saved); // renvoie l'objet complet créé
  } catch (err) {
    console.error("❌ Erreur pendant la création :", err);
    res.status(400).json({ error: "Données invalides", detail: err });
  }
};

// Supprimer une non-conformité par ID
exports.remove = async (req, res) => {
  try {
    await NonConformity.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Non-conformité supprimée" });
  } catch (err) {
    console.error("❌ Erreur lors de la suppression :", err);
    res.status(500).json({ error: "Erreur suppression", detail: err });
  }
};

// Mettre à jour uniquement le statut d'une non-conformité
exports.updateStatus = async (req, res) => {
  try {
    const updated = await NonConformity.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error("❌ Erreur lors de la mise à jour du statut :", err);
    res.status(500).json({ error: "Erreur mise à jour", detail: err });
  }
};

// Mise à jour complète d'une non-conformité
exports.update = async (req, res) => {
  try {
    const updated = await NonConformity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error("❌ Erreur lors de la mise à jour :", err);
    res.status(500).json({ error: "Erreur mise à jour", detail: err });
  }
};
