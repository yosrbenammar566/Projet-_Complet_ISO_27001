const Action = require('../models/Action');

// ✅ Créer une action
exports.createAction = async (req, res) => {
  try {
    const {
      action,
      responsible,
      Description,
      plannedDate,
      recommendation,
      correctionDate,
      status,
      nonConformities,
    } = req.body;

    const newAction = new Action({
      action,
      responsible,
      Description,
      plannedDate,
      recommendation,
      correctionDate,
      status,
      nonConformities,
    });

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
// ✅ Récupérer UNE seule action avec non-conformité (par ID)
exports.getActionById = async (req, res) => {
  try {
    const action = await Action.findById(req.params.id).populate("nonConformities");
    if (!action) return res.status(404).json({ message: "Not found" });
    res.json(action);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur", details: err });
  }
};
// ✅ Modifier une action
exports.updateAction = async (req, res) => {
  try {
    const updated = await Action.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("nonConformities");
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: "Erreur modification", details: err });
  }
};
