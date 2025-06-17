const ComplianceControl = require('../models/ComplianceControl');

// Cr�er un contr�le de conformit�
exports.createComplianceControl = async (req, res) => {
  const { reference, description, checklistId } = req.body;

  try {
    const newControl = new ComplianceControl({ reference, description, checklist: checklistId });
    await newControl.save();
    res.status(201).json({ message: 'Contr�le de conformit� cr�� avec succ�s.', control: newControl });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la cr�ation du contr�le de conformit�.', error });
  }
};

// R�cup�rer tous les contr�les de conformit� d'une checklist
exports.getComplianceControls = async (req, res) => {
  const { checklistId } = req.query;

  try {
    const controls = await ComplianceControl.find({ checklist: checklistId });
    res.json(controls);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la r�cup�ration des contr�les de conformit�.', error });
  }
};