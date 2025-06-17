const Document = require('../models/Document');
const fs = require('fs');
const path = require('path');

exports.uploadDocument = async (req, res) => {
  try {
    const doc = new Document(req.file);
    await doc.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ message: "Erreur upload", error: err });
  }
};

exports.getDocuments = async (req, res) => {
  try {
    const docs = await Document.find().sort({ uploadedAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: "Erreur récupération", error: err });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findByIdAndDelete(req.params.id);
    if (doc) {
      fs.unlinkSync(path.join(__dirname, '..', 'uploads', doc.filename));
      res.json({ message: 'Supprimé avec succès' });
    } else {
      res.status(404).json({ message: "Document non trouvé" });
    }
  } catch (err) {
    res.status(500).json({ message: "Erreur suppression", error: err });
  }
};
