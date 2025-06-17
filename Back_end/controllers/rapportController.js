const Rapport = require('../models/Rapport');

exports.createRapport = async (req, res) => {
  try {
    const rapport = new Rapport(req.body);
    await rapport.save();
    res.status(201).json(rapport);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la création', error: err });
  }
};

exports.getAllRapports = async (req, res) => {
  try {
    const rapports = await Rapport.find().sort({ createdAt: -1 });
    res.json(rapports);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération', error: err });
  }
};

exports.getRapportById = async (req, res) => {
  try {
    const rapport = await Rapport.findById(req.params.id);
    if (!rapport) return res.status(404).json({ message: 'Non trouvé' });
    res.json(rapport);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
};

exports.deleteRapport = async (req, res) => {
  try {
    await Rapport.findByIdAndDelete(req.params.id);
    res.json({ message: 'Rapport supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression', error: err });
  }
};
