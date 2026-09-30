const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5002;

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
    console.log('✅ User Service connecté à MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connexion échouée:', err.message);
    throw err;
  }
};

connectMongo('ofppt_users').catch(err => console.error('❌ User Service final MongoDB error:', err));

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service:5001';

const competenceSchema = new mongoose.Schema({ nom: String, niveau: String, description: String });
const diplomeSchema    = new mongoose.Schema({ intitule: String, ecole: String, annee: String, niveau: String, specialite: String });
const certifSchema     = new mongoose.Schema({ code: String, intitule: String, type: String, domaine: String, dateObtention: String, organisme: String });

const intervenantSchema = new mongoose.Schema({
  matricule:      { type: String, required: true, unique: true },
  nom:            { type: String, required: true },
  prenom:         { type: String, required: true },
  email:          { type: String, required: true, unique: true },
  telephone:      String,
  genre:          { type: String, enum: ['M', 'F'] },
  dateNaissance:  Date,
  affectation:    String,
  type:           { type: String, enum: ['interne', 'externe'], default: 'interne' },
  competences:    [competenceSchema],
  diplomes:       [diplomeSchema],
  certifications: [certifSchema],
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  email:        { type: String, required: true, unique: true },
  role:         { type: String, enum: ['admin', 'regional', 'local', 'company', 'intervenant'] },
  status:       { type: String, enum: ['actif', 'inactif'], default: 'actif' },
  region:       String,
  centre:       String,
  dateCreation: { type: Date, default: Date.now },
}, { timestamps: true });

const postulationSchema = new mongoose.Schema({
  intervenantId: { type: String, required: true },
  themeId:       { type: String, required: true },
  statut:        { type: String, enum: ['en_attente', 'acceptee', 'refusee'], default: 'en_attente' },
  date:          { type: Date, default: Date.now },
}, { timestamps: true });

const Intervenant  = mongoose.model('Intervenant', intervenantSchema);
const User         = mongoose.model('User', userSchema);
const Postulation  = mongoose.model('Postulation', postulationSchema);

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Token requis.' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'ofppt_secret');
    next();
  } catch { res.status(403).json({ success: false, message: 'Token invalide.' }); }
};

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().sort({ dateCreation: -1 });
    res.json({ success: true, data: users, count: users.length });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.post('/api/users', async (req, res) => {
  try {
    const { name, email, role, status, region, centre, raisonSociale, secteur, specialite } = req.body;
   
    
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email déjà utilisé.' });
    }
    
    const user = await User.create({ 
      name, 
      email, 
      role, 
      status: status || 'actif',
      region,
      centre,
      dateCreation: new Date()
    });
    res.status(201).json({ success: true, data: user });
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ success: false, message: 'Email déjà utilisé.' });
    res.status(400).json({ success: false, message: e.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur introuvable.' });
    res.json({ success: true, data: user });
  } catch (e) { res.status(400).json({ success: false, message: e.message }); }
});

const deleteAuthUserByEmail = async (email) => {
  if (!email) return;
  try {
    const url = `${AUTH_SERVICE_URL}/api/auth/users/by-email?email=${encodeURIComponent(email)}`;
    const resp = await fetch(url, { method: 'DELETE' });
    if (!resp.ok) {
      const body = await resp.json().catch(() => ({}));
      console.warn('[User-service] Auth delete failed', email, resp.status, body);
    }
  } catch (err) {
    console.warn('[User-service] Auth delete error', err.message);
  }
};

app.delete('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur introuvable.' });

    await deleteAuthUserByEmail(user.email);

    res.json({ success: true, message: 'Utilisateur supprimé.' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});


app.get('/api/intervenants', async (req, res) => {
  try {
    const intervenants = await Intervenant.find().sort({ createdAt: -1 });
    res.json({ success: true, data: intervenants, count: intervenants.length });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.get('/api/intervenants/:id', async (req, res) => {
  try {
    const intervenant = await Intervenant.findById(req.params.id);
    if (!intervenant) return res.status(404).json({ success: false, message: 'Intervenant introuvable.' });
    res.json({ success: true, data: intervenant });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

app.post('/api/intervenants', async (req, res) => {
  try {
    const { nom, prenom, email, telephone, dateNaissance, genre, affectation, specialite, region } = req.body;
    
    const existing = await Intervenant.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email déjà utilisé.' });
    }
    
    const matricule = `INT-${Date.now().toString().slice(-6)}`;
    
    const intervenant = await Intervenant.create({
      matricule,
      nom,
      prenom,
      email,
      telephone: telephone || '',
      dateNaissance: dateNaissance || null,
      genre: genre || 'M',
      affectation: affectation || region || '',
      type: 'externe',
      competences: [],
      diplomes: [],
      certifications: []
    });
    res.status(201).json({ success: true, data: intervenant });
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ success: false, message: 'Email déjà utilisé.' });
    res.status(400).json({ success: false, message: e.message });
  }
});

app.put('/api/intervenants/:id', async (req, res) => {
  try {
    const intervenant = await Intervenant.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!intervenant) return res.status(404).json({ success: false, message: 'Intervenant introuvable.' });
    res.json({ success: true, data: intervenant });
  } catch (e) { res.status(400).json({ success: false, message: e.message }); }
});

app.delete('/api/intervenants/:id', async (req, res) => {
  try {
    const intervenant = await Intervenant.findByIdAndDelete(req.params.id);
    if (!intervenant) return res.status(404).json({ success: false, message: 'Intervenant introuvable.' });

    await deleteAuthUserByEmail(intervenant.email);

    res.json({ success: true, message: 'Intervenant supprimé.' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});
app.get('/api/postulations', async (req, res) => {
  try {
    const filter = {};
    if (req.query.intervenantId) filter.intervenantId = req.query.intervenantId;
    if (req.query.themeId)       filter.themeId = req.query.themeId;
    const postulations = await Postulation.find(filter).sort({ date: -1 });
    res.json({ success: true, data: postulations });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});


app.post('/api/postulations', async (req, res) => {
  try {
    const { intervenantId, themeId } = req.body;
    const existing = await Postulation.findOne({ intervenantId, themeId });
    if (existing) return res.status(409).json({ success: false, message: 'Déjà postulé à cette formation.' });
    const post = await Postulation.create({ intervenantId, themeId });
    res.status(201).json({ success: true, data: post });
  } catch (e) { res.status(400).json({ success: false, message: e.message }); }
});


app.patch('/api/postulations/:id', async (req, res) => {
  try {
    const post = await Postulation.findByIdAndUpdate(req.params.id, { statut: req.body.statut }, { new: true });
    if (!post) return res.status(404).json({ success: false, message: 'Postulation introuvable.' });
    res.json({ success: true, data: post });
  } catch (e) { res.status(400).json({ success: false, message: e.message }); }
});

const seed = async () => {
  const count = await Intervenant.countDocuments();
  if (count === 0) {
    await Intervenant.create([
      { matricule: 'INT-001', nom: 'Rami', prenom: 'Ahmed', email: 'a.rami@ofppt.ma', telephone: '0661234567', genre: 'M', affectation: 'Casablanca', type: 'interne', competences: [{ nom: 'React.js', niveau: 'expert' }, { nom: 'Node.js', niveau: 'expert' }], diplomes: [{ intitule: 'Master Informatique', ecole: 'FST Settat', annee: '2008', niveau: 'Bac+5', specialite: 'Génie Logiciel' }], certifications: [] },
      { matricule: 'INT-002', nom: 'Idrissi', prenom: 'Sara', email: 's.idrissi@ofppt.ma', telephone: '0662345678', genre: 'F', affectation: 'Rabat', type: 'interne', competences: [{ nom: 'AutoCAD', niveau: 'expert' }, { nom: 'BIM', niveau: 'intermediaire' }], diplomes: [], certifications: [] },
      { matricule: 'INT-003', nom: 'Moussaoui', prenom: 'Khalid', email: 'k.moussaoui@ofppt.ma', telephone: '0663456789', genre: 'M', affectation: 'Fès', type: 'externe', competences: [{ nom: 'Lean Manufacturing', niveau: 'expert' }, { nom: 'Six Sigma', niveau: 'expert' }], diplomes: [], certifications: [] },
    ]);
    console.log('✅ Intervenants seeded');
  }
};
mongoose.connection.once('open', seed);

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'user-service' }));
app.listen(PORT, () => console.log(`👥 User Service running on port ${PORT}`));
