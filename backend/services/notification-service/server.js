const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5005;

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
    console.log('✅ Notification Service connecté à MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connexion échouée:', err.message);
    throw err;
  }
};

connectMongo('ofppt_notifications').catch(err => console.error('❌ Notification Service final MongoDB error:', err));

const notificationSchema = new mongoose.Schema({
  type:          { type: String, enum: ['info', 'success', 'warning', 'formation', 'affectation', 'validation'], default: 'info' },
  titre:         { type: String, required: true },
  message:       { type: String, required: true },
  date:          { type: String, default: () => new Date().toISOString().split('T')[0] },
  destinataires: [{ type: String }], // ['admin','regional','company','intervenant','all']
  lu:            { type: Boolean, default: false },
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Token requis.' });
  try { req.user = jwt.verify(token, process.env.JWT_SECRET || 'ofppt_secret'); next(); }
  catch { res.status(403).json({ success: false, message: 'Token invalide.' }); }
};


app.get('/api/notifications', async (req, res) => {
  try {
    const filter = {};
    if (req.query.lu !== undefined) filter.lu = req.query.lu === 'true';

    const notifications = await Notification.find(filter).sort({ createdAt: -1 }).limit(100);
    const unreadCount = await Notification.countDocuments({ ...filter, lu: false });

    res.json({ success: true, data: notifications, count: notifications.length, unreadCount });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.post('/api/notifications', async (req, res) => {
  try {
    const notif = await Notification.create(req.body);
    res.status(201).json({ success: true, data: notif });
  } catch (e) { res.status(400).json({ success: false, message: e.message }); }
});

app.post('/api/notifications/internal', async (req, res) => {
  try {
    const notif = await Notification.create(req.body);
    res.status(201).json({ success: true, data: notif });
  } catch (e) { res.status(400).json({ success: false, message: e.message }); }
});

app.patch('/api/notifications/:id/read', async (req, res) => {
  try {
    const notif = await Notification.findByIdAndUpdate(req.params.id, { lu: true }, { new: true });
    if (!notif) return res.status(404).json({ success: false, message: 'Notification introuvable.' });
    res.json({ success: true, data: notif });
  } catch (e) { res.status(400).json({ success: false, message: e.message }); }
});

app.patch('/api/notifications/read-all', async (req, res) => {
  try {
    await Notification.updateMany({}, { lu: true });
    res.json({ success: true, message: 'Toutes les notifications marquées comme lues.' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.delete('/api/notifications/:id', async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Notification supprimée.' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

const seed = async () => {
  const count = await Notification.countDocuments();
  if (count === 0) {
    await Notification.create([
      { type: 'formation', titre: 'Nouvelle offre de formation', message: "L'offre de formation 2024 est maintenant disponible", date: '2024-01-15', destinataires: ['company', 'intervenant'], lu: false },
      { type: 'affectation', titre: 'Affectation confirmée', message: 'Vous avez été affecté à la formation React.js', date: '2024-01-20', destinataires: ['intervenant'], lu: true },
      { type: 'validation', titre: 'Plan validé', message: 'Votre plan de formation a été approuvé', date: '2024-01-22', destinataires: ['company'], lu: false },
      { type: 'info', titre: 'Rappel de session', message: 'La formation Lean Manufacturing commence demain', date: '2024-01-19', destinataires: ['all'], lu: false },
    ]);
    console.log('✅ Notifications seeded');
  }
};
mongoose.connection.once('open', seed);

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'notification-service' }));
app.listen(PORT, () => console.log(`🔔 Notification Service running on port ${PORT}`));
