const Action = require('../models/Action');

// ✅ Créer une action
exports.createAction = async (req, res) => {
  try {
    const newAction = new Action(req.body);
    const saved = await newAction.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: "Erreur création action", details: err });
  }
};

// 📥 Toutes les actions
exports.getActions = async (req, res) => {
  try {
    const actions = await Action.find().populate("nonConformities");

    res.status(200).json(actions);
  } catch (err) {
    res.status(500).json({ error: "Erreur récupération actions", details: err });
  }
};

// 🗑️ Supprimer
exports.deleteAction = async (req, res) => {
  try {
    await Action.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Action supprimée" });
  } catch (err) {
    res.status(500).json({ error: "Erreur suppression", details: err });
  }
};
