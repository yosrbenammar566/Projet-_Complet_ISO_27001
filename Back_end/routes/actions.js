const express = require("express");
const router = express.Router();
const {
  getActions,
  createAction,
  deleteAction,
  getActionById, 
  updateAction,// ← ✅ la nouvelle fonction qu'on ajoute
} = require("../controllers/actionController");



// ✅ Toutes les actions
router.get("/", getActions);

// ✅ Créer une action
router.post("/", createAction);

// ✅ Supprimer une action
router.delete("/:id", deleteAction);

// ✅ Nouvelle route : Obtenir une seule action par ID avec ses non-conformités
router.get("/:id", getActionById);
// ✅ Modifier une action
router.put("/:id", updateAction);


module.exports = router;

