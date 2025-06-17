const express = require("express");
const router = express.Router();

const sites = [
  {
    id: 1,
    nom: "Paris HQ",
    lat: 48.8566,
    lng: 2.3522,
    description: "Site principal certifié ISO 27001.",
  },
  {
    id: 2,
    nom: "Lyon Office",
    lat: 45.75,
    lng: 4.85,
    description: "Audit prévu pour Q3 2025.",
  },
];

router.get("/", (req, res) => {
  res.json(sites);
});

module.exports = router;
