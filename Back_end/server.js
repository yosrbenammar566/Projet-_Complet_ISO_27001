// Import des dépendances
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Initialisation de l'application
const app = express();

// Middleware CORS pour autoriser le frontend React
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware pour parser le JSON
app.use(express.json());

// 🔗 Connexion à MongoDB locale
mongoose.connect('mongodb://localhost:27017/ciso_app')
  .then(() => {
    console.log('✅ Connexion à MongoDB réussie (via Compass/local) !');
  })
  .catch((error) => {
    console.error('❌ Erreur de connexion à MongoDB :', error);
  });

app.use((req, res, next) => {
  console.log(`📩 ${req.method} ${req.url}`);
  if (req.method === "POST" || req.method === "PUT") {
    console.log("📦 Corps :", req.body);
  }
  next();
});

// 📦 Routes de test
app.get('/api/test', (req, res) => {
  res.json({
    status: 'success',
    message: 'Backend connecté avec succès à MongoDB !',
    timestamp: new Date().toISOString()
  });
});

// ✅ Connexion aux routes (déclaration une seule fois)
const userRoutes = require('./routes/users'); // ✅ UNE SEULE FOIS
const auditRoutes = require('./routes/audits');
const checklistRoutes = require("./routes/checklists");
const actionRoutes = require('./routes/actions');
const nonConformitiesRoutes = require('./routes/nonconformities');
const controlsRoutes = require('./routes/controls');

const rapportRoutes = require('./routes/rapports');
const documentRoutes = require('./routes/documents');
const mapRoutes = require('./routes/maps'); 
const calendrierRouter = require('./routes/calendrier');
;

// ✅ Utilisation
app.use('/api', userRoutes);
app.use('/api/audits', auditRoutes);
app.use('/api/checklists', checklistRoutes);
app.use('/api/actions', actionRoutes);
app.use('/api/nonconformities', nonConformitiesRoutes);
app.use('/api/controls', controlsRoutes);
app.use('/api/documents', documentRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/rapports', rapportRoutes);
app.use('/api/maps', mapRoutes);
app.use('/api/calendar-events', calendrierRouter);

// 🚀 Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🟢 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`🔵 Route test : http://localhost:${PORT}/api/test\n`);
});
