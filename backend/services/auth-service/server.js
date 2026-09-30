const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

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
    console.log('✅ Auth Service connecté à MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connexion échouée:', err.message);
    throw err;
  }
};

connectMongo('ofppt_auth').catch(err => console.error('❌ Auth Service final MongoDB error:', err));

const userSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true },
  email:         { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:      { type: String, required: true, minlength: 6 },
  role:          { type: String, enum: ['admin', 'regional', 'local', 'company', 'intervenant'], required: true },
  status:        { type: String, enum: ['actif', 'inactif'], default: 'actif' },
  region:        { type: String },
  centre:        { type: String },
  raisonSociale: { type: String },
  secteur:       { type: String },
  specialite:    { type: String },
  dateCreation:  { type: Date, default: Date.now }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role, name: user.name, region: user.region },
    process.env.JWT_SECRET || 'ofppt_secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};


app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email et mot de passe requis.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect.' });
    }

    if (user.status === 'inactif') {
      return res.status(403).json({ success: false, message: 'Compte désactivé. Contactez l\'administrateur.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect.' });
    }

    const token = generateToken(user);
    const { password: _, ...userWithoutPwd } = user.toObject();

    res.json({ success: true, token, user: userWithoutPwd });
  } catch (error) {
    console.error('[Auth] Login error:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role, region, phone, raisonSociale, secteur, specialite } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Tous les champs obligatoires sont requis.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Un compte avec cet email existe déjà.' });
    }

    const user = await User.create({ name, email, password, role, region, raisonSociale, secteur });
    
    try {
      const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:5002';
      await fetch(`${userServiceUrl}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          role,
          status: 'actif',
          region,
          centre: null,
          dateCreation: new Date()
        })
      });
      
      if (role === 'intervenant') {
        const nameParts = name.split(' ');
        const prenom = nameParts[0] || '';
        const nom = nameParts.slice(1).join(' ') || name;
        
        await fetch(`${userServiceUrl}/api/intervenants`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nom,
            prenom,
            email,
            telephone: phone || '',
            dateNaissance: null,
            genre: 'M',
            affectation: region || '',
            specialite: specialite || '',
            region: region || ''
          })
        });
      }
    } catch (err) {
      console.warn('[Auth] Failed to sync with user-service:', err.message);
    }
    
    const token = generateToken(user);
    const { password: _, ...userWithoutPwd } = user.toObject();

    res.status(201).json({ success: true, token, user: userWithoutPwd });
  } catch (error) {
    console.error('[Auth] Register error:', error);
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Email déjà utilisé.' });
    }
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

app.delete('/api/auth/users/by-email', async (req, res) => {
  try {
    const email = (req.query.email || '').toLowerCase();
    if (!email) return res.status(400).json({ success: false, message: 'Email requis.' });

    const deleted = await User.findOneAndDelete({ email });
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé dans auth-service.' });
    }

    res.json({ success: true, message: 'Utilisateur supprimé dans auth-service.' });
  } catch (error) {
    console.error('[Auth] delete-by-email error:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
});

app.get('/api/auth/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Token manquant.' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ofppt_secret');
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur introuvable.' });

    res.json({ success: true, user });
  } catch (error) {
    res.status(403).json({ success: false, message: 'Token invalide.' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Déconnexion réussie.' });
});

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@ofppt.ma' });
    if (!adminExists) {
      await User.create({ name: 'Mohammed Alami', email: 'admin@ofppt.ma', password: 'admin123', role: 'admin' });
      await User.create({ name: 'Fatima Benali', email: 'regional@ofppt.ma', password: 'reg123', role: 'regional', region: 'Casablanca-Settat' });
      await User.create({ name: 'Youssef Tazi', email: 'local@ofppt.ma', password: 'loc123', role: 'local', region: 'Casablanca' });
      await User.create({ name: 'Textile Maroc SA', email: 'company@textile.ma', password: 'comp123', role: 'company', raisonSociale: 'Textile Maroc SA', secteur: 'Textile' });
      await User.create({ name: 'Ahmed Rami', email: 'intervenant@ofppt.ma', password: 'int123', role: 'intervenant' });
      console.log('✅ Demo users seeded');
    }
  } catch (err) {
    console.error('Seed error:', err.message);
  }
};

mongoose.connection.once('open', seedAdmin);

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'auth-service' }));

app.listen(PORT, () => console.log(`🔐 Auth Service running on port ${PORT}`));
