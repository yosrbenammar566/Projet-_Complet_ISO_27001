const express = require('express');
const router = express.Router();
const {
  createRapport,
  getAllRapports,
  getRapportById,
  deleteRapport
} = require('../controllers/rapportController');

router.post('/', createRapport);
router.get('/', getAllRapports);
router.get('/:id', getRapportById);
router.delete('/:id', deleteRapport);

module.exports = router;
