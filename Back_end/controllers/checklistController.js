const Checklist = require('../models/Checklist');

// Créer une checklist
exports.createChecklist = async (req, res) => {
  try {
    const { control, items } = req.body;
    const newChecklist = new Checklist({ control, items });
    await newChecklist.save();
    res.status(201).json(newChecklist);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de la checklist", error });
  }
};

// Obtenir toutes les checklists
exports.getChecklists = async (req, res) => {
  try {
    const checklists = await Checklist.find();
    res.status(200).json(checklists);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des checklists", error });
  }
};
