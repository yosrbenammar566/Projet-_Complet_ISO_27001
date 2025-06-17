const Audit = require('../models/Audit');
const fs = require('fs');

// 🔐 Logger sécurisé
let logger = console;
try {
  logger = require('../utils/logger');
} catch (err) {
  console.warn("⚠️ Fichier logger non trouvé. Utilisation de console.log par défaut.");
}

// 📝 Créer un nouvel audit
exports.createAudit = async (req, res) => {
  try {
    console.log("▶️ Champs reçus dans le backend :", req.body);

    const {
      name,
      type,
      startDate,
      endDate,
      auditor,
      department,
      priority,
      category,
      scope,
      description,
      status,
    } = req.body;

    const newAudit = new Audit({
      name,
      type,
      startDate,
      endDate,
      auditor,
      department,
      priority,
      category,
      scope,
      description,
      status,
    });

    await newAudit.save();
    res.status(201).json(newAudit);
  } catch (error) {
    logger.error("❌ Erreur lors de la création de l'audit :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 📋 Récupérer tous les audits
exports.getAudits = async (req, res) => {
  try {
    const audits = await Audit.find();
    res.status(200).json(audits);
  } catch (error) {
    logger.error("❌ Erreur lors de la récupération des audits :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 📤 Exporter un audit en JSON
exports.exportAudit = async (req, res) => {
  try {
    const audit = await Audit.findById(req.params.id);

    if (!audit) {
      return res.status(404).json({ message: "Audit non trouvé" });
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=audit_${audit._id}.json`);
    res.status(200).send(JSON.stringify(audit, null, 2));
  } catch (error) {
    logger.error("❌ Erreur export audit :", error);
    res.status(500).json({ message: "Erreur serveur lors de l'export" });
  }
};

// ✏️ Mettre à jour un audit
exports.updateAudit = async (req, res) => {
  try {
    const auditId = req.params.id;
    const updatedAudit = await Audit.findByIdAndUpdate(auditId, req.body, { new: true });

    if (!updatedAudit) {
      return res.status(404).json({ message: "Audit non trouvé" });
    }

    res.status(200).json(updatedAudit);
  } catch (error) {
    logger.error("❌ Erreur mise à jour audit :", error);
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour" });
  }
};

// 📥 Importer un audit via fichier JSON
exports.importAudit = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier reçu" });
    }

    const jsonData = fs.readFileSync(req.file.path, 'utf8');
    const auditData = JSON.parse(jsonData);

    const newAudit = new Audit(auditData);
    await newAudit.save();

    res.status(201).json(newAudit);
  } catch (error) {
    logger.error("❌ Erreur lors de l'import de l'audit :", error);
    res.status(500).json({ message: "Erreur serveur lors de l'import" });
  }
};
exports.deleteAudit = async (req, res) => {
  try {
    console.log("🗑️ Requête DELETE reçue pour ID :", req.params.id);

    const deletedAudit = await Audit.findByIdAndDelete(req.params.id);

    if (!deletedAudit) {
      console.log("❌ Aucun audit trouvé avec cet ID.");
      return res.status(404).json({ message: "Audit non trouvé" });
    }

    console.log("✅ Audit supprimé :", deletedAudit);
    res.status(200).json({ message: "Audit supprimé avec succès" });

  } catch (error) {
    console.error("❌ Erreur lors de la suppression de l'audit :", error);
    res.status(500).json({ message: "Erreur serveur lors de la suppression", error });
  }
};


