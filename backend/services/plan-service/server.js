const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5004;

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
    console.log('✅ Plan Service connecté à MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connexion échouée:', err.message);
    throw err;
  }
};

connectMongo('ofppt_plans').catch(err => console.error('❌ Plan Service final MongoDB error:', err));

const planSchema = new mongoose.Schema({
  entrepriseId:  { type: String, required: true },
  entreprise:    { type: String, required: true },
  themeId:       { type: String, required: true },
  theme:         { type: String, required: true },
  groupes:       { type: Number, required: true, min: 1 },
  dateDebut:     { type: String, required: true },
  statut:        { type: String, enum: ['planifie', 'en_cours', 'termine', 'annule'], default: 'planifie' },
  intervenantId: { type: String, default: null },
  intervenant:   { type: String, default: null },
  region:        { type: String, required: true },
  progression:   { type: Number, min: 0, max: 100, default: 0 },
  commentaire:   String,
}, { timestamps: true });

const Plan = mongoose.model('Plan', planSchema);

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Token requis.' });
  try { req.user = jwt.verify(token, process.env.JWT_SECRET || 'ofppt_secret'); next(); }
  catch { res.status(403).json({ success: false, message: 'Token invalide.' }); }
};

const sendNotification = async (notification) => {
  try {
    const url = process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:5005';
    await axios.post(`${url}/api/notifications/internal`, notification);
  } catch (e) {
    console.warn('[Plan] Could not send notification:', e.message);
  }
};


app.get('/api/plans', async (req, res) => {
  try {
    const filter = {};
    if (req.query.statut)       filter.statut = req.query.statut;
    if (req.query.region)       filter.region = req.query.region;
    if (req.query.entrepriseId) filter.entrepriseId = req.query.entrepriseId;

    const plans = await Plan.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: plans, count: plans.length });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.get('/api/plans/:id', async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ success: false, message: 'Plan introuvable.' });
    res.json({ success: true, data: plan });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.post('/api/plans', async (req, res) => {
  try {
    const plan = await Plan.create({
      ...req.body,
      statut: req.body.statut || 'planifie',
      progression: req.body.progression || 0
    });

    await sendNotification({
      type: 'validation',
      titre: 'Nouveau plan de formation',
      message: `Nouveau plan de formation soumis: ${plan.theme}`,
      destinataires: ['admin', 'regional'],
    });

    res.status(201).json({ success: true, data: plan });
  } catch (e) { res.status(400).json({ success: false, message: e.message }); }
});

app.put('/api/plans/:id', async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!plan) return res.status(404).json({ success: false, message: 'Plan introuvable.' });
    res.json({ success: true, data: plan });
  } catch (e) { res.status(400).json({ success: false, message: e.message }); }
});

app.delete('/api/plans/:id', async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ success: false, message: 'Plan introuvable.' });
    if (plan.statut === 'en_cours') {
      return res.status(400).json({ success: false, message: 'Impossible de supprimer une formation en cours.' });
    }
    await Plan.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Plan supprimé.' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.patch('/api/plans/:id/affecter', async (req, res) => {
  try {
    const { intervenantId, intervenant } = req.body;
    const plan = await Plan.findByIdAndUpdate(
      req.params.id,
      { intervenantId, intervenant },
      { new: true }
    );
    if (!plan) return res.status(404).json({ success: false, message: 'Plan introuvable.' });

    await sendNotification({
      type: 'affectation',
      titre: 'Affectation confirmée',
      message: `Vous avez été affecté à la formation: ${plan.theme}`,
      destinataires: ['intervenant'],
    });

    res.json({ success: true, data: plan });
  } catch (e) { res.status(400).json({ success: false, message: e.message }); }
});

app.patch('/api/plans/:id/status', async (req, res) => {
  try {
    const { statut } = req.body;
    const updates = { statut };
    if (statut === 'termine') updates.progression = 100;
    if (statut === 'en_cours' && req.body.progression === undefined) updates.progression = 0;

    const plan = await Plan.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!plan) return res.status(404).json({ success: false, message: 'Plan introuvable.' });
    res.json({ success: true, data: plan });
  } catch (e) { res.status(400).json({ success: false, message: e.message }); }
});

app.get('/api/plans/stats/global', verifyToken, async (req, res) => {
  try {
    const [total, enCours, planifie, termine, annule] = await Promise.all([
      Plan.countDocuments(),
      Plan.countDocuments({ statut: 'en_cours' }),
      Plan.countDocuments({ statut: 'planifie' }),
      Plan.countDocuments({ statut: 'termine' }),
      Plan.countDocuments({ statut: 'annule' }),
    ]);

    const byRegion = await Plan.aggregate([
      { $group: { _id: '$region', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({ success: true, data: { total, enCours, planifie, termine, annule, byRegion } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

const seed = async () => {
  const count = await Plan.countDocuments();
  if (count === 0) {
    await Plan.create([
      { entrepriseId: 'seed-1', entreprise: 'Textile Maroc SA', themeId: 'seed-1', theme: 'Développement Web React.js', groupes: 2, dateDebut: '2024-02-15', statut: 'en_cours', intervenant: 'Ahmed Rami', region: 'Casablanca-Settat', progression: 65 },
      { entrepriseId: 'seed-1', entreprise: 'Textile Maroc SA', themeId: 'seed-5', theme: 'Leadership & Management', groupes: 1, dateDebut: '2024-03-01', statut: 'planifie', region: 'Casablanca-Settat', progression: 0 },
      { entrepriseId: 'seed-2', entreprise: 'Auto Nejma', themeId: 'seed-3', theme: 'Lean Manufacturing & 5S', groupes: 3, dateDebut: '2024-01-20', statut: 'termine', intervenant: 'Khalid Moussaoui', region: 'Casablanca-Settat', progression: 100 },
      { entrepriseId: 'seed-3', entreprise: 'BTP Constructions', themeId: 'seed-4', theme: 'BIM & AutoCAD Avancé', groupes: 1, dateDebut: '2024-02-28', statut: 'en_cours', intervenant: 'Sara Idrissi', region: 'Casablanca-Settat', progression: 40 },
    ]);
    console.log('✅ Plans seeded');
  }
};
mongoose.connection.once('open', seed);

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'plan-service' }));
app.listen(PORT, () => console.log(`📋 Plan Service running on port ${PORT}`));
