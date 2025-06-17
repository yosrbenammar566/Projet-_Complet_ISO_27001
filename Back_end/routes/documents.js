const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const Document = require('../models/Document');
const fs = require('fs');
const path = require('path');

// 📤 Upload d'un document
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Aucun fichier fourni." });
    }

    const document = new Document({
      filename: file.originalname,
      size: file.size,
      uploadDate: new Date(),
      path: file.path,
      mimetype: file.mimetype
    });

    await document.save();

    res.status(201).json({ message: "Fichier uploadé avec succès", document });
  } catch (error) {
    console.error('Erreur upload :', error);
    res.status(500).json({ message: "Erreur lors de l'upload du fichier." });
  }
});

// 📥 Liste des documents
router.get('/', async (req, res) => {
  try {
    const documents = await Document.find().sort({ uploadDate: -1 });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: "Erreur récupération des documents." });
  }
});

// 🗑️ Supprimer un document
router.delete('/:id', async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document non trouvé" });

    // Supprimer le fichier physique
    fs.unlink(path.resolve(doc.path), async (err) => {
      if (err) console.warn("Erreur suppression fichier :", err);

      await doc.deleteOne();
      res.json({ message: "Document supprimé avec succès." });
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur suppression document." });
  }
});

module.exports = router;
