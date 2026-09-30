import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, Clock, Users, Plus, X, CheckCircle, Trash2, TrendingUp, Search, ArrowRight } from 'lucide-react';

const domainColors = {
  Digital: { bg: 'var(--primary-ultra-light)', color: 'var(--primary)', gradient: 'linear-gradient(135deg, #C8102E, #E8334A)' },
  Industriel: { bg: '#FFF8EB', color: 'var(--accent)', gradient: 'linear-gradient(135deg, #F5A623, #FFCA6E)' },
  'Génie Civil': { bg: '#EBF2FF', color: 'var(--accent-blue)', gradient: 'linear-gradient(135deg, #0066FF, #4D9EFF)' },
  Management: { bg: '#E6FFF8', color: 'var(--accent-green)', gradient: 'linear-gradient(135deg, #00C896, #4DEBB1)' },
};

export const CompanyDashboard = () => {
  const { user } = useAuth();
  const { users, plans, themes, refreshPlans } = useData();
  const navigate = useNavigate();

  const currentCompany = users.find(u => u.email?.toLowerCase() === user?.email?.toLowerCase() && u.role === 'company');
  const entrepriseId = currentCompany?.id || currentCompany?._id || user?.id || user?._id || user?.email;
  const userIdentifier = String(entrepriseId || '').toLowerCase();

  useEffect(() => {
    refreshPlans();
    const interval = setInterval(refreshPlans, 10000);
    return () => clearInterval(interval);
  }, [refreshPlans]);

  const myPlans = plans.filter(p => {
    const planCompanyId = String(p.entrepriseId || '').toLowerCase();
    const planCompanyEmail = String(p.entrepriseEmail || '').toLowerCase();
    const planCompanyName = String(p.entreprise || '').toLowerCase();
    return planCompanyId === userIdentifier || planCompanyEmail === userIdentifier || planCompanyName === userIdentifier;
  });

  return (
    <AppLayout pageTitle="Tableau de Bord" pageSubtitle="Entreprise">
      <div className="hero-banner">
        <div className="hero-banner-content">
          <h2>Bienvenue, {user?.name} 👋</h2>
          <p>Planifiez et gérez vos formations avec l'OFPPT</p>
          <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
            <button className="btn" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.25)' }} onClick={() => navigate('/company/catalogue')}>
              <BookOpen size={16} /> Voir le catalogue
            </button>
            <button className="btn" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.25)' }} onClick={() => navigate('/company/planification')}>
              <Calendar size={16} /> Planifier une formation
            </button>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        {[
          { icon: Calendar, label: 'Formations planifiées', value: myPlans.filter(p=>p.statut==='planifie').length, color: 'orange' },
          { icon: TrendingUp, label: 'En cours', value: myPlans.filter(p=>p.statut==='en_cours').length, color: 'blue' },
          { icon: CheckCircle, label: 'Terminées', value: myPlans.filter(p=>p.statut==='termine').length, color: 'green' },
          { icon: BookOpen, label: 'Thèmes disponibles', value: themes.length, color: 'red' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div className={`stat-card ${s.color}`} key={i} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={`stat-icon ${s.color}`}><Icon size={22} /></div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Mes formations récentes</div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/company/mes-formations')}>Voir tout <ArrowRight size={13} /></button>
          </div>
          {myPlans.slice(0, 3).map(plan => (
            <div key={plan.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid var(--gray-50)' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: domainColors[plan.theme.includes('React') || plan.theme.includes('Cloud') || plan.theme.includes('Cyber') ? 'Digital' : 'Management']?.bg || 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <BookOpen size={18} style={{ color: 'var(--primary)' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--gray-800)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{plan.theme}</div>
                <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{new Date(plan.dateDebut).toLocaleDateString('fr-FR')} · {plan.groupes} groupe{plan.groupes>1?'s':''}</div>
              </div>
              <div>
                {plan.statut === 'en_cours' ? <span className="badge badge-blue">En cours</span>
                 : plan.statut === 'termine' ? <span className="badge badge-green">Terminé</span>
                 : <span className="badge badge-orange">Planifié</span>}
              </div>
            </div>
          ))}
          {myPlans.length === 0 && (
            <div className="empty-state" style={{ padding: 30 }}>
              <p>Aucune formation planifiée</p>
              <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => navigate('/company/planification')}>Planifier maintenant</button>
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Formations populaires</div>
          </div>
          {themes.slice(0, 4).map((theme, i) => {
            const dc = domainColors[theme.domaine] || { bg: 'var(--gray-100)', color: 'var(--gray-500)' };
            return (
              <div key={theme.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--gray-50)', cursor: 'pointer' }}
                onClick={() => navigate('/company/planification')}>
                <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--gray-200)', fontFamily: 'var(--font-display)', minWidth: 24 }}>{i+1}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{theme.intitule}</div>
                  <span style={{ fontSize: 11, background: dc.bg, color: dc.color, padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>{theme.domaine}</span>
                </div>
                <div className="formation-meta-item" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--gray-500)' }}>
                  <Clock size={12} />{theme.nbJours}j
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
};

export const CataloguePage = () => {
  const { themes } = useData();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterDomain, setFilterDomain] = useState('Tous');

  const domains = ['Tous', ...new Set(themes.map(t => t.domaine))];
  const filtered = themes.filter(t => {
    const matchSearch = t.intitule.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    const matchDomain = filterDomain === 'Tous' || t.domaine === filterDomain;
    return matchSearch && matchDomain;
  });

  return (
    <AppLayout pageTitle="Catalogue de Formations" pageSubtitle="Catalogue">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Catalogue de Formations</h1>
          <p>{themes.length} formations disponibles dans votre région</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/company/planification')}>
          <Plus size={16} /> Planifier une formation
        </button>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="table-search" style={{ maxWidth: 360 }}>
          <Search size={16} />
          <input placeholder="Rechercher une formation..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="filter-bar" style={{ marginBottom: 0 }}>
          {domains.map(d => (
            <button key={d} className={`filter-chip ${filterDomain === d ? 'active' : ''}`} onClick={() => setFilterDomain(d)}>{d}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        {filtered.map((theme, i) => {
          const dc = domainColors[theme.domaine] || { bg: 'var(--gray-100)', color: 'var(--gray-500)', gradient: 'linear-gradient(135deg, #374151, #6B7280)' };
          return (
            <div key={theme.id} className="formation-card" onClick={() => navigate('/company/planification')} style={{ animationDelay: `${i * 0.05}s` }}>
              <div style={{ height: 6, background: dc.gradient }}></div>
              <div className="formation-card-top">
                <span className="formation-domain" style={{ background: dc.bg, color: dc.color }}>{theme.domaine}</span>
                <h3>{theme.intitule}</h3>
                <p style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.5 }}>{theme.description}</p>
              </div>
              <div className="formation-card-bottom">
                <div className="formation-meta">
                  <div className="formation-meta-item"><Clock size={12} /> {theme.nbJours} jours</div>
                  <div className="formation-meta-item"><Users size={12} /> Max {theme.maxParticipants}</div>
                </div>
                <button className="btn btn-primary btn-sm">Planifier →</button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <Search size={40} />
          <h3>Aucune formation trouvée</h3>
          <p>Essayez d'autres termes de recherche</p>
        </div>
      )}
    </AppLayout>
  );
};


export const CompanyPlanificationPage = () => {
  const { users, themes, addPlan, refreshPlans } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [form, setForm] = useState({ groupes: 1, dateDebut: '', region: user?.region || '' });
  const [search, setSearch] = useState('');

  const currentCompany = users.find(u => u.email?.toLowerCase() === user?.email?.toLowerCase() && u.role === 'company');
  const entrepriseId = currentCompany?.id || currentCompany?._id || user?.id || user?._id || user?.email;

  const filtered = themes.filter(t => t.intitule.toLowerCase().includes(search.toLowerCase()) || t.domaine.toLowerCase().includes(search.toLowerCase()));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTheme) return;

    const result = await addPlan({
      entrepriseId: String(entrepriseId || user?.id || user?.email || ''),
      entreprise: currentCompany?.name || user?.name || 'Entreprise',
      themeId: selectedTheme.id,
      theme: selectedTheme.intitule,
      groupes: form.groupes,
      dateDebut: form.dateDebut,
      region: form.region,
      statut: 'planifie',
      progression: 0,
      entrepriseEmail: user?.email
    });

    if (result) {
      await refreshPlans();
      navigate('/company/mes-formations');
    } else {
    }
  };

  return (
    <AppLayout pageTitle="Planifier une Formation" pageSubtitle="Planification">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Planifier une Formation</h1>
          <p>Étape {step} / 2 : {step === 1 ? 'Sélection du thème' : 'Détails de la planification'}</p>
        </div>
      </div>

      {/* Steps */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 32 }}>
        {[
          { n: 1, label: 'Choisir un thème' },
          { n: 2, label: 'Définir les détails' },
        ].map((s, i) => (
          <React.Fragment key={s.n}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', background: step >= s.n ? 'var(--primary-ultra-light)' : 'var(--gray-50)', borderRadius: i === 0 ? '12px 0 0 12px' : '0 12px 12px 0', border: `1px solid ${step >= s.n ? '#FFCDD5' : 'var(--gray-200)'}`, flex: 1 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: step >= s.n ? 'var(--primary)' : 'var(--gray-200)', color: step >= s.n ? 'white' : 'var(--gray-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{step > s.n ? '✓' : s.n}</div>
              <span style={{ fontSize: 14, fontWeight: 600, color: step >= s.n ? 'var(--primary)' : 'var(--gray-500)' }}>{s.label}</span>
            </div>
          </React.Fragment>
        ))}
      </div>

      {step === 1 && (
        <>
          <div className="table-search" style={{ maxWidth: 400, marginBottom: 20 }}>
            <Search size={16} />
            <input placeholder="Rechercher un thème..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {filtered.map(theme => {
              const dc = domainColors[theme.domaine] || { bg: 'var(--gray-100)', color: 'var(--gray-500)' };
              const isSelected = selectedTheme?.id === theme.id;
              return (
                <div
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme)}
                  style={{
                    background: 'white',
                    borderRadius: 14,
                    border: isSelected ? '2px solid var(--primary)' : '1px solid var(--gray-100)',
                    padding: 20,
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                    boxShadow: isSelected ? 'var(--shadow-primary)' : 'var(--shadow-sm)',
                    transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                  }}
                >
                  {isSelected && <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--primary)', fontSize: 12, fontWeight: 700, marginBottom: 8 }}><CheckCircle size={14} /> Sélectionné</div>}
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', background: dc.bg, color: dc.color, padding: '3px 9px', borderRadius: 20, display: 'inline-block', marginBottom: 10 }}>{theme.domaine}</span>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 8, fontFamily: 'var(--font-display)' }}>{theme.intitule}</h3>
                  <p style={{ fontSize: 12, color: 'var(--gray-500)', lineHeight: 1.5, marginBottom: 12 }}>{theme.description}</p>
                  <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--gray-400)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> {theme.nbJours} jours</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={12} /> Max {theme.maxParticipants}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 28, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button className="btn btn-ghost" onClick={() => navigate('/company/catalogue')}>Retour</button>
            <button className="btn btn-primary" disabled={!selectedTheme} onClick={() => setStep(2)}>
              Continuer → {selectedTheme && `(${selectedTheme.intitule})`}
            </button>
          </div>
        </>
      )}

      {step === 2 && selectedTheme && (
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <div className="card" style={{ marginBottom: 20 }}>
                <div className="card-title" style={{ marginBottom: 16 }}>Formation sélectionnée</div>
                <div style={{ background: 'var(--gray-50)', borderRadius: 12, padding: '16px' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{selectedTheme.domaine}</div>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{selectedTheme.intitule}</div>
                  <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--gray-500)' }}>
                    <span><Clock size={13} style={{ display: 'inline', marginRight: 4 }} />{selectedTheme.nbJours} jours</span>
                    <span><Users size={13} style={{ display: 'inline', marginRight: 4 }} />Max {selectedTheme.maxParticipants}/groupe</span>
                  </div>
                </div>
                <button type="button" className="btn btn-ghost btn-sm" style={{ marginTop: 12 }} onClick={() => setStep(1)}>
                  Changer de thème
                </button>
              </div>
            </div>

            <div className="card">
              <div className="card-title" style={{ marginBottom: 20 }}>Détails de la planification</div>
              <div className="form-group">
                <label className="form-label">Nombre de groupes</label>
                <input type="number" className="form-input" value={form.groupes} onChange={e => setForm({ ...form, groupes: parseInt(e.target.value) })} min={1} max={20} required />
                <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 6 }}>Max {selectedTheme.maxParticipants} participants par groupe</div>
              </div>
              <div className="form-group">
                <label className="form-label">Date de démarrage prévisionnelle</label>
                <input type="date" className="form-input" value={form.dateDebut} onChange={e => setForm({ ...form, dateDebut: e.target.value })} required min={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="form-group">
                <label className="form-label">Région</label>
                <select className="form-select" value={form.region} onChange={e => setForm({ ...form, region: e.target.value })} required>
                  <option value="">Sélectionner...</option>
                  <option>Casablanca-Settat</option>
                  <option>Rabat-Salé-Kénitra</option>
                  <option>Fès-Meknès</option>
                  <option>Marrakech-Safi</option>
                  <option>Tanger-Tétouan-Al Hoceïma</option>
                  <option>Souss-Massa</option>
                </select>
              </div>
              <div style={{ background: 'var(--gray-50)', borderRadius: 12, padding: '14px 16px', marginBottom: 20, border: '1px solid var(--gray-200)' }}>
                <div style={{ fontSize: 13, color: 'var(--gray-600)', marginBottom: 4 }}>Résumé</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  {form.groupes} groupe{form.groupes > 1 ? 's' : ''} × {selectedTheme.maxParticipants} participants = {form.groupes * selectedTheme.maxParticipants} participants max
                </div>
                <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 4 }}>
                  Durée: {selectedTheme.nbJours} jours par groupe
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setStep(1)}>Retour</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                  <CheckCircle size={16} /> Confirmer le plan
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </AppLayout>
  );
};


export const MesFormationsPage = () => {
  const { users, plans, deletePlan, refreshPlans } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState('Tous');

  const currentCompany = users.find(u => u.email?.toLowerCase() === user?.email?.toLowerCase() && u.role === 'company');
  const entrepriseId = currentCompany?.id || currentCompany?._id || user?.id;
  const companyName = (currentCompany?.name || user?.name || '').toLowerCase();
  const userEmail = (user?.email || '').toLowerCase();

  useEffect(() => {
    refreshPlans();
    const interval = setInterval(refreshPlans, 10000);
    return () => clearInterval(interval);
  }, [refreshPlans]);

  const myPlans = plans.filter(p => {
    const planCompanyId = String(p.entrepriseId || '');
    const planCompanyName = String(p.entreprise || '').toLowerCase();
    const planCompanyEmail = String(p.entrepriseEmail || '').toLowerCase();
    return (
      planCompanyId === String(entrepriseId) ||
      planCompanyId === String(user?.id) ||
      planCompanyName === companyName ||
      planCompanyName === userEmail ||
      planCompanyEmail === userEmail
    );
  });
  const filtered = filterStatus === 'Tous' ? myPlans : myPlans.filter(p => p.statut === filterStatus);

  const getStatusBadge = (status) => ({
    en_cours: <span className="badge badge-blue">● En cours</span>,
    planifie: <span className="badge badge-orange">◌ Planifié</span>,
    termine: <span className="badge badge-green">✓ Terminé</span>,
    annule: <span className="badge badge-gray">✗ Annulé</span>,
  })[status] || null;

  return (
    <AppLayout pageTitle="Mes Formations" pageSubtitle="Mes formations">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Mes Formations</h1>
          <p>{myPlans.length} formations enregistrées</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/company/planification')}>
          <Plus size={16} /> Nouvelle formation
        </button>
      </div>

      <div className="filter-bar">
        {['Tous', 'planifie', 'en_cours', 'termine'].map(s => (
          <button key={s} className={`filter-chip ${filterStatus === s ? 'active' : ''}`} onClick={() => setFilterStatus(s)}>
            {s === 'Tous' ? 'Toutes' : s === 'planifie' ? 'Planifiées' : s === 'en_cours' ? 'En cours' : 'Terminées'}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <Calendar size={48} />
          <h3>Aucune formation</h3>
          <p>Planifiez votre première formation depuis le catalogue</p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/company/catalogue')}>
            Voir le catalogue
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filtered.map(plan => {
            const dc = domainColors.Digital;
            return (
              <div key={plan.id} style={{ background: 'white', borderRadius: 16, border: '1px solid var(--gray-100)', padding: '20px 24px', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: 20, transition: 'var(--transition)' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--primary-ultra-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <BookOpen size={22} style={{ color: 'var(--primary)' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--gray-900)', marginBottom: 4 }}>{plan.theme}</div>
                  <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--gray-500)', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={13} />{new Date(plan.dateDebut).toLocaleDateString('fr-FR')}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={13} />{plan.groupes} groupe{plan.groupes>1?'s':''}</span>
                    {plan.intervenant && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>👨‍🏫 {plan.intervenant}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {plan.statut === 'en_cours' && (
                    <div style={{ minWidth: 120 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 12, color: 'var(--gray-500)' }}>Progression</span>
                        <span style={{ fontSize: 12, fontWeight: 700 }}>{plan.progression}%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill blue" style={{ width: `${plan.progression}%` }}></div>
                      </div>
                    </div>
                  )}
                  {getStatusBadge(plan.statut)}
                  {plan.statut === 'planifie' && (
                    <button className="btn btn-danger btn-icon btn-sm" onClick={() => deletePlan(plan.id)} title="Annuler">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
};


export const HistoriquePage = () => {
  const { plans } = useData();
  const terminated = plans.filter(p => p.statut === 'termine');

  return (
    <AppLayout pageTitle="Historique des Formations" pageSubtitle="Historique">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Historique</h1>
          <p>{terminated.length} formations terminées</p>
        </div>
      </div>
      {terminated.length === 0 ? (
        <div className="empty-state">
          <CheckCircle size={48} />
          <h3>Aucune formation terminée</h3>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead><tr><th>Thème</th><th>Date</th><th>Groupes</th><th>Intervenant</th><th>Statut</th></tr></thead>
            <tbody>
              {terminated.map(plan => (
                <tr key={plan.id}>
                  <td style={{ fontWeight: 600 }}>{plan.theme}</td>
                  <td style={{ fontSize: 13, color: 'var(--gray-500)' }}>{new Date(plan.dateDebut).toLocaleDateString('fr-FR')}</td>
                  <td><span className="badge badge-blue">{plan.groupes}G</span></td>
                  <td style={{ fontSize: 13 }}>{plan.intervenant || '—'}</td>
                  <td><span className="badge badge-green">✓ Terminé</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppLayout>
  );
};
