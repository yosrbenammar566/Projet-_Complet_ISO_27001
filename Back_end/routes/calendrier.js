const express = require('express');
const router = express.Router();
const controllercalendrier = require('../controllers/calendrierController');

router.get('/', controllercalendrier.getAllEvents);
router.post('/', controllercalendrier.createEvent);
router.delete('/:id', controllercalendrier.deleteEvent);

module.exports = router;
