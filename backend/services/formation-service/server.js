const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5003;

app.use(cors({ origin: '*' }));
app.use(express.json());

const getMongoUri = (defaultDb) => {
  return `mongodb://ofppt_admin:ofppt_pass_2024@mongodb:27017/${defaultDb}?authSource=admin`;
};

const connectMongo = async (defaultDb) => {
  const uri = getMongoUri(defaultDb);
  try {
    console.log(`🔌 Tentative connexion MongoDB sur ${uri}`);
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ Formation Service connecté à MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connexion échouée:', err.message);
    throw err;
  }
};

connectMongo('ofppt_formations').catch(err => console.error('❌ Formation Service final MongoDB error:', err));

const themeSchema = new mongoose.Schema({
  domaine:         { type: String, required: true },
  intitule:        { type: String, required: true },
  nbJours:         { type: Number, required: true, min: 1 },
  maxParticipants: { type: Number, required: true, min: 1 },
  description:     { type: String },
  objectifs:       [String],
  prerequis:       String,
  niveau:          { type: String, enum: ['débutant', 'intermédiaire', 'avancé'], default: 'intermédiaire' },
  actif:           { type: Boolean, default: true },
}, { timestamps: true });

const Theme = mongoose.model('Theme', themeSchema);

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Token requis.' });
  try { req.user = jwt.verify(token, process.env.JWT_SECRET || 'ofppt_secret'); next(); }
  catch { res.status(403).json({ success: false, message: 'Token invalide.' }); }
};


app.get('/api/themes', async (req, res) => {
  try {
    const filter = {};
    if (req.query.domaine) filter.domaine = req.query.domaine;
    if (req.query.actif !== undefined) filter.actif = req.query.actif === 'true';
    const themes = await Theme.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: themes, count: themes.length });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.get('/api/themes/:id', async (req, res) => {
  try {
    const theme = await Theme.findById(req.params.id);
    if (!theme) return res.status(404).json({ success: false, message: 'Thème introuvable.' });
    res.json({ success: true, data: theme });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.get('/api/formations/domaines', async (req, res) => {
  try {
    const domaines = await Theme.distinct('domaine');
    res.json({ success: true, data: domaines });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.post('/api/themes', async (req, res) => {
  try {
    const theme = await Theme.create(req.body);
    res.status(201).json({ success: true, data: theme });
  } catch (e) { res.status(400).json({ success: false, message: e.message }); }
});

app.put('/api/themes/:id', async (req, res) => {
  try {
    const theme = await Theme.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!theme) return res.status(404).json({ success: false, message: 'Thème introuvable.' });
    res.json({ success: true, data: theme });
  } catch (e) { res.status(400).json({ success: false, message: e.message }); }
});

app.delete('/api/themes/:id', async (req, res) => {
  try {
    const theme = await Theme.findByIdAndDelete(req.params.id);
    if (!theme) return res.status(404).json({ success: false, message: 'Thème introuvable.' });
    res.json({ success: true, message: 'Thème supprimé.' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

const seed = async () => {
  const count = await Theme.countDocuments();
  if (count === 0) {
    await Theme.create([
      { domaine: 'Digital', intitule: 'Développement Web React.js', nbJours: 5, maxParticipants: 15, description: 'Formation complète sur React.js et l\'écosystème moderne du développement web.' },
      { domaine: 'Digital', intitule: 'Cybersécurité & Protection des données', nbJours: 3, maxParticipants: 20, description: 'Sensibilisation et pratiques de cybersécurité pour les entreprises.' },
      { domaine: 'Industriel', intitule: 'Lean Manufacturing & 5S', nbJours: 4, maxParticipants: 25, description: 'Méthodes d\'optimisation de la production industrielle.' },
      { domaine: 'Génie Civil', intitule: 'BIM & AutoCAD Avancé', nbJours: 5, maxParticipants: 12, description: 'Modélisation des bâtiments avec les outils BIM et AutoCAD.' },
      { domaine: 'Management', intitule: 'Leadership & Management d\'équipe', nbJours: 2, maxParticipants: 20, description: 'Développement des compétences managériales.' },
      { domaine: 'Digital', intitule: 'Cloud Computing & DevOps', nbJours: 5, maxParticipants: 15, description: 'Infrastructure Cloud AWS/Azure et pratiques DevOps.' },
      { domaine: 'Industriel', intitule: 'Maintenance Industrielle Préventive', nbJours: 3, maxParticipants: 20, description: 'Techniques de maintenance pour équipements industriels.' },
      { domaine: 'Management', intitule: 'Gestion de Projet Agile', nbJours: 3, maxParticipants: 20, description: 'Méthodes agiles Scrum et Kanban pour la gestion de projets.' },
    ]);
    console.log('✅ Themes seeded');
  }
};
mongoose.connection.once('open', seed);

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'formation-service' }));
app.listen(PORT, () => console.log(`📚 Formation Service running on port ${PORT}`));
