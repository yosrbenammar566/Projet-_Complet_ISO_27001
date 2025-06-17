const mongoose = require('mongoose');

const ControlSchema = new mongoose.Schema({
  controlId: String,
  name: String
});

module.exports = mongoose.model('Control', ControlSchema);
