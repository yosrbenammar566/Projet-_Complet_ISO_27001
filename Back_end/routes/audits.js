// ✅ routes/audits.js
const express = require('express');
const multer = require('multer');
const auditController = require('../controllers/auditController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', auditController.createAudit);
router.get('/', auditController.getAudits);
router.get('/:id/export', auditController.exportAudit);
router.put('/:id', auditController.updateAudit);
router.post('/import', upload.single('file'), auditController.importAudit);
router.delete('/:id', auditController.deleteAudit);


module.exports = router;
