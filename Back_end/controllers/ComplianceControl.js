const ComplianceControl = require('../models/ComplianceControl');

// Créer un contrôle de conformité
exports.createComplianceControl = async (req, res) => {
  const { reference, description, checklistId } = req.body;

  try {
    const newControl = new ComplianceControl({ reference, description, checklist: checklistId });
    await newControl.save();
    res.status(201).json({ message: 'Contrôle de conformité créé avec succès.', control: newControl });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du contrôle de conformité.', error });
  }
};

// Récupérer tous les contrôles de conformité d'une checklist
exports.getComplianceControls = async (req, res) => {
  const { checklistId } = req.query;

  try {
    const controls = await ComplianceControl.find({ checklist: checklistId });
    res.json(controls);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des contrôles de conformité.', error });
  }
};