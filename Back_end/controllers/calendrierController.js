const Calendrier = require('../models/calendrier');

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Calendrier.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const newEvent = new Calendrier(req.body);
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEvent = await Calendrier.findByIdAndDelete(id);
    if (!deletedEvent) {
      return res.status(404).json({ message: "Événement non trouvé" });
    }
    res.json({ message: "Événement supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
