import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, LogIn, UserPlus, AlertCircle } from 'lucide-react';

const LOGO = 'https://cdn.brandfetch.io/id0UtA99bn/w/400/h/400/theme/dark/icon.jpeg?k=id64Mup7ac&t=1726639084841';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 600));
    const result = await login(form.email, form.password);
    if (result.success) {
      navigate(`/${result.user.role}/dashboard`);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const quickLogin = (email, password) => {
    setForm({ email, password });
  };

  return (
    <div className="auth-layout">
      <div className="auth-visual">
        <div className="auth-visual-content">
          <div className="auth-visual-logo">
            <img src={LOGO} alt="OFPPT" />
          </div>
          <h1>Plateforme de<br />Formation Continue</h1>
          <p>Gérez et suivez toutes vos prestations de formation avec notre outil digital de nouvelle génération.</p>
          <div className="auth-stats">
            <div className="auth-stat"><strong>2,400+</strong><span>Entreprises</span></div>
            <div className="auth-stat"><strong>850+</strong><span>Intervenants</span></div>
            <div className="auth-stat"><strong>12K+</strong><span>Formations</span></div>
          </div>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form">
          <div className="auth-form-header">
            <h2>Connexion</h2>
            <p>Accédez à votre espace personnel OFPPT</p>
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: '#FFF0F2', border: '1px solid #FFCDD5', borderRadius: 10, marginBottom: 20, color: '#C8102E', fontSize: 14 }}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ animationDelay: '0.1s' }}>
              <label className="form-label">Adresse Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="votre@email.ma"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group" style={{ animationDelay: '0.2s' }}>
              <label className="form-label">Mot de passe</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPwd ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  style={{ paddingRight: 48 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group" style={{ animationDelay: '0.25s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-check">
                  <input type="checkbox" />
                  <span style={{ fontSize: 13, color: '#6B7280' }}>Se souvenir de moi</span>
                </label>
                <a className="auth-link" style={{ fontSize: 13 }}>Mot de passe oublié ?</a>
              </div>
            </div>

            <div className="form-group" style={{ animationDelay: '0.3s' }}>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={loading}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }}></span>
                    Connexion...
                  </span>
                ) : (
                  <><LogIn size={18} />Se connecter</>
                )}
              </button>
            </div>
          </form>

          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <span style={{ fontSize: 14, color: '#9CA3AF' }}>Pas encore de compte ? </span>
            <span className="auth-link" onClick={() => navigate('/register')} style={{ fontSize: 14 }}>Créer un compte</span>
          </div>

          <div style={{ background: '#F9FAFB', borderRadius: 12, padding: 16, border: '1px solid #E5E7EB' }}>
            <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 10, textAlign: 'center', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Comptes de démonstration</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {[
                { label: '👤 Admin', email: 'admin@ofppt.ma', pwd: 'admin123', color: '#FFF0F2' },
                { label: '🏢 Régional', email: 'regional@ofppt.ma', pwd: 'reg123', color: '#EBF2FF' },
                { label: '🏫 Local', email: 'local@ofppt.ma', pwd: 'loc123', color: '#E6FFF8' },
                { label: '🏭 Entreprise', email: 'company@textile.ma', pwd: 'comp123', color: '#FFF8EB' },
                { label: '👨‍🏫 Intervenant', email: 'intervenant@ofppt.ma', pwd: 'int123', color: '#F3EEFF' },
              ].map(demo => (
                <button
                  key={demo.email}
                  type="button"
                  onClick={() => quickLogin(demo.email, demo.pwd)}
                  style={{ padding: '8px 10px', background: demo.color, border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s', textAlign: 'center' }}
                >
                  {demo.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'company', phone: '', region: '', raisonSociale: '', secteur: '', specialite: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 800));
    const result = await register(form);
    if (result.success) {
      navigate(`/${result.user.role}/dashboard`);
    } else {
      setError(result.error || 'Une erreur est survenue lors de l\'inscription.');
    }
    setLoading(false);
  };

  return (
    <div className="auth-layout">
      <div className="auth-visual">
        <div className="auth-visual-content">
          <div className="auth-visual-logo">
            <img src={LOGO} alt="OFPPT" />
          </div>
          <h1>Rejoignez la<br />Plateforme OFPPT</h1>
          <p>Créez votre compte et accédez à des centaines de formations adaptées à vos besoins.</p>
          <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { icon: '🎯', text: 'Choisissez vos thèmes de formation' },
              { icon: '📅', text: 'Planifiez selon votre calendrier' },
              { icon: '📊', text: 'Suivez vos progrès en temps réel' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, color: 'rgba(255,255,255,0.8)', fontSize: 15 }}>
                <span style={{ fontSize: 22 }}>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form">
          <div className="auth-form-header">
            <h2>Créer un compte</h2>
            <p>Étape {step} sur 2 — {step === 1 ? 'Informations de base' : 'Détails du profil'}</p>
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
            {[1, 2].map(s => (
              <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: s <= step ? 'var(--primary)' : 'var(--gray-200)', transition: 'background 0.3s ease' }} />
            ))}
          </div>

          <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); setStep(2); }}>
            {step === 1 && (
              <>
                <div className="form-group" style={{ animationDelay: '0.1s' }}>
                  <label className="form-label">Vous êtes</label>
                  <select className="form-select" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                    <option value="company">Entreprise</option>
                    <option value="intervenant">Intervenant</option>
                  </select>
                </div>
                <div className="form-group" style={{ animationDelay: '0.15s' }}>
                  <label className="form-label">{form.role === 'company' ? 'Raison sociale' : 'Nom complet'}</label>
                  <input type="text" className="form-input" placeholder={form.role === 'company' ? 'Nom de l\'entreprise' : 'Prénom et Nom'} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="form-group" style={{ animationDelay: '0.2s' }}>
                  <label className="form-label">Email</label>
                  <input type="email" className="form-input" placeholder="contact@exemple.ma" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div className="form-group" style={{ animationDelay: '0.25s' }}>
                  <label className="form-label">Mot de passe</label>
                  <input type="password" className="form-input" placeholder="Min. 8 caractères" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="form-group" style={{ animationDelay: '0.1s' }}>
                  <label className="form-label">Téléphone</label>
                  <input type="tel" className="form-input" placeholder="0600 000 000" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="form-group" style={{ animationDelay: '0.15s' }}>
                  <label className="form-label">Région</label>
                  <select className="form-select" value={form.region} onChange={e => setForm({ ...form, region: e.target.value })}>
                    <option value="">Sélectionner une région</option>
                    <option>Casablanca-Settat</option>
                    <option>Rabat-Salé-Kénitra</option>
                    <option>Fès-Meknès</option>
                    <option>Marrakech-Safi</option>
                    <option>Tanger-Tétouan-Al Hoceïma</option>
                    <option>Souss-Massa</option>
                    <option>Oriental</option>
                  </select>
                </div>
                {form.role === 'company' && (
                  <div className="form-group" style={{ animationDelay: '0.2s' }}>
                    <label className="form-label">Secteur d'activité</label>
                    <select className="form-select" value={form.secteur} onChange={e => setForm({ ...form, secteur: e.target.value })}>
                      <option value="">Sélectionner un secteur</option>
                      <option>Textile & Habillement</option>
                      <option>Automobile</option>
                      <option>Agroalimentaire</option>
                      <option>BTP & Construction</option>
                      <option>Industrie Chimique</option>
                      <option>Technologies & Numérique</option>
                      <option>Commerce & Distribution</option>
                      <option>Tourisme & Hôtellerie</option>
                    </select>
                  </div>
                )}
                {form.role === 'intervenant' && (
                  <div className="form-group" style={{ animationDelay: '0.2s' }}>
                    <label className="form-label">Spécialité principale</label>
                    <select className="form-select" value={form.specialite} onChange={e => setForm({ ...form, specialite: e.target.value })}>
                      <option value="">Sélectionner une spécialité</option>
                      <option>Digital & IT</option>
                      <option>Génie Industriel</option>
                      <option>Génie Civil</option>
                      <option>Management</option>
                      <option>Finance & Comptabilité</option>
                      <option>Langue & Communication</option>
                    </select>
                  </div>
                )}
              </>
            )}

            <div style={{ display: 'flex', gap: 12 }}>
              {step === 2 && (
                <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setStep(1)}>
                  Retour
                </button>
              )}
              <button type="submit" className="btn btn-primary" style={{ flex: 1, height: 50, fontSize: 15 }} disabled={loading}>
                {loading ? 'Création...' : step === 1 ? 'Continuer →' : <><UserPlus size={18} /> Créer mon compte</>}
              </button>
            </div>
          </form>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <span style={{ fontSize: 14, color: '#9CA3AF' }}>Déjà inscrit ? </span>
            <span className="auth-link" onClick={() => navigate('/login')} style={{ fontSize: 14 }}>Se connecter</span>
          </div>
        </div>
      </div>
    </div>
  );
};
