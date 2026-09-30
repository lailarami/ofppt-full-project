import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

// ─── INTERVENANT DASHBOARD ───────────────────────────────────────────────────
export function IntervenantDashboard() {
  const { intervenants, plans, postulations, themes, postulationNotification, refreshIntervenants, refreshPlans, refreshPostulations } = useData();
  const { user } = useAuth();

  const currentIntervenant = intervenants.find(i => i.email?.toLowerCase() === user?.email?.toLowerCase());
  const intervenantId = currentIntervenant?.id || user?.id;

  // Rafraîchir les données quand la page se monte et toutes les 10 secondes pour refléter les modifications de l'admin
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([refreshIntervenants(), refreshPlans(), refreshPostulations()]);
    };
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []); // Dependencies vide - useEffect ne dépend pas des fonctions pour éviter les boucles infinies

  const myPostulations = postulations.filter(p => String(p.intervenantId) === String(intervenantId));
  const myMissions = plans.filter(p => String(p.intervenantId) === String(intervenantId));
  const acceptees = myPostulations.filter(p => p.statut === 'acceptee');
  const enAttente = myPostulations.filter(p => p.statut === 'en_attente');
  const postulationColor = myPostulations.length > 0 ? '#00C896' : '#F5A623';

  return (
    <AppLayout pageTitle="Mon Dashboard" pageSubtitle="Vue d'ensemble de vos formations et missions">
      <div className="profile-banner" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), #ff4d6d)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', color: '#fff', fontWeight: 700, flexShrink: 0
          }}>
            {user?.name?.[0]?.toUpperCase() || 'I'}
          </div>
          <div>
            <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>{user?.name}</h2>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>Intervenant · {user?.email}</p>
          </div>
        </div>
      </div>

      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        {[
          { label: 'Missions actives', count: myMissions.filter(m => m.statut === 'en_cours').length, color: '#0066FF', icon: '🔄' },
          { label: 'Postulations', count: myPostulations.length, color: postulationColor, icon: '📝' },
          { label: 'Acceptées', count: acceptees.length, color: '#00C896', icon: '✅' },
          { label: 'En attente', count: enAttente.length, color: '#C8102E', icon: '⏳' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: s.color }}>{s.icon}</div>
            <div className="stat-info"><div className="stat-number">{s.count}</div><div className="stat-label">{s.label}</div></div>
          </div>
        ))}
      </div>
      {postulationNotification && (
        <div style={{
          padding: '0.8rem 1rem',
          borderRadius: '10px',
          marginBottom: '1.5rem',
          background: '#E6F8EE',
          color: '#0E7B51',
          border: '1px solid #00C896'
        }}>
          ✅ {postulationNotification}
        </div>
      )}

      {myPostulations.length > 0 && (
        <div style={{
          padding: '0.8rem 1rem',
          borderRadius: '10px',
          marginBottom: '1.5rem',
          background: '#E6F8EE',
          color: '#0E7B51',
          border: '1px solid #00C896'
        }}>
          ✅ Postulation envoyée ! Vous avez {myPostulations.length} formation(s) en cours de postulation.
        </div>
      )}

      <div className="grid-2">
        <div className="card">
          <div className="card-header"><h3>Mes missions récentes</h3></div>
          {myMissions.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Aucune mission assignée</p>}
          {myMissions.slice(0, 5).map(m => (
            <div key={m.id} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{m.theme}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{m.entreprise} · {m.dateDebut}</div>
                </div>
                <span className={`badge badge-${m.statut === 'en_cours' ? 'blue' : m.statut === 'planifie' ? 'orange' : 'green'}`}>{m.statut.replace('_', ' ')}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-header"><h3>Mes postulations</h3></div>
          {myPostulations.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Aucune postulation</p>}
          {myPostulations.slice(0, 5).map(p => {
            const theme = themes.find(t => t.id === p.themeId);
            return (
              <div key={p.id} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{theme?.intitule || 'Formation'}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.date}</div>
                  </div>
                  <span className={`badge badge-${p.statut === 'acceptee' ? 'green' : p.statut === 'refusee' ? 'gray' : 'orange'}`}>{p.statut}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}

// ─── MON PROFIL ──────────────────────────────────────────────────────────────
export function IntervenantProfil() {
  const { intervenants, updateIntervenant, addToast, refreshIntervenants } = useData();
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);

  // Rafraîchir les données quand la page se monte et toutes les 10 secondes pour refléter les modifications de l'admin
  useEffect(() => {
    refreshIntervenants();
    const interval = setInterval(refreshIntervenants, 10000);
    return () => clearInterval(interval);
  }, []); // Dépendances vides pour éviter les boucles infinies

  const myProfile = intervenants.find(i => i.email === user?.email) || {
    _id: user?.id, matricule: 'INT-001', nom: user?.name?.split(' ')[1] || '', prenom: user?.name?.split(' ')[0] || '',
    email: user?.email, telephone: '', dateNaissance: '', genre: '', affectation: '', type: 'interne',
    diplomes: [], certifications: [], competences: []
  };

  const [form, setForm] = useState(myProfile);

  const handleSave = () => {
    updateIntervenant(myProfile._id, form);
    addToast('Profil mis à jour avec succès', 'success');
    setEditing(false);
  };

  return (
    <AppLayout pageTitle="Mon Profil" pageSubtitle="Informations personnelles et professionnelles">
      <div className="card" style={{ maxWidth: 700, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), #ff4d6d)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.8rem', color: '#fff', fontWeight: 700
            }}>{myProfile.prenom?.[0]?.toUpperCase() || 'I'}</div>
            <div>
              <h2 style={{ margin: 0 }}>{myProfile.prenom} {myProfile.nom}</h2>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>{myProfile.matricule} · {myProfile.type}</p>
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => editing ? handleSave() : setEditing(true)}>
            {editing ? '💾 Sauvegarder' : '✏️ Modifier'}
          </button>
        </div>

        <div className="grid-2">
          {[
            { label: 'Prénom', key: 'prenom' }, { label: 'Nom', key: 'nom' },
            { label: 'Email', key: 'email' }, { label: 'Téléphone', key: 'telephone' },
            { label: 'Date de naissance', key: 'dateNaissance', type: 'date' }, { label: 'Genre', key: 'genre' },
            { label: 'Lieu d\'affectation', key: 'affectation' }, { label: 'Type', key: 'type' },
          ].map(f => (
            <div key={f.key} className="form-group">
              <label className="form-label">{f.label}</label>
              {editing ? (
                f.key === 'type' ? (
                  <select className="form-control" value={form[f.key] || ''} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}>
                    <option value="interne">Interne</option>
                    <option value="externe">Externe</option>
                  </select>
                ) : f.key === 'genre' ? (
                  <select className="form-control" value={form[f.key] || ''} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}>
                    <option value="">--</option>
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </select>
                ) : (
                  <input className="form-control" type={f.type || 'text'} value={form[f.key] || ''} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
                )
              ) : (
                <div style={{ padding: '0.6rem 0', color: form[f.key] ? 'var(--text-primary)' : 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                  {form[f.key] || '—'}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

// ─── MES COMPÉTENCES ────────────────────────────────────────────────────────
export function IntervenantCompetences() {
  const { intervenants, updateIntervenant, addToast, refreshIntervenants } = useData();
  const { user } = useAuth();
  const [showAddComp, setShowAddComp] = useState(false);
  const [newComp, setNewComp] = useState({ nom: '', niveau: 'intermédiaire', description: '' });
  const [prevProfileData, setPrevProfileData] = useState(null);

  // Rafraîchir les données quand la page se monte et toutes les 10 secondes pour refléter les modifications de l'admin
  useEffect(() => {
    const checkForUpdates = async () => {
      await refreshIntervenants();
      
      // Détecter si le profil a changé et afficher une notification
      const currentProfile = intervenants.find(i => i.email === user?.email);
      if (prevProfileData && currentProfile) {
        const competencesChanged = JSON.stringify(prevProfileData.competences) !== JSON.stringify(currentProfile.competences);
        const diplomesChanged = JSON.stringify(prevProfileData.diplomes) !== JSON.stringify(currentProfile.diplomes);
        const certificationsChanged = JSON.stringify(prevProfileData.certifications) !== JSON.stringify(currentProfile.certifications);
        
        if (competencesChanged || diplomesChanged || certificationsChanged) {
          addToast('📢 Vos compétences/diplômes/certifications ont été mis à jour par un administrateur', 'info');
        }
      }
      if (currentProfile) {
        setPrevProfileData(currentProfile);
      }
    };
    
    checkForUpdates();
    const interval = setInterval(checkForUpdates, 10000);
    return () => clearInterval(interval);
  }, []); // Dépendances vides pour éviter les boucles infinies

  const myProfile = intervenants.find(i => i.email === user?.email);
  const competences = myProfile?.competences || [];
  const diplomes = myProfile?.diplomes || [];
  const certifications = myProfile?.certifications || [];

  const addComp = () => {
    if (!newComp.nom) { addToast('Nom de compétence requis', 'error'); return; }
    const updated = { ...myProfile, competences: [...competences, { id: Date.now(), ...newComp }] };
    updateIntervenant(myProfile._id, updated);
    addToast('Compétence ajoutée', 'success');
    setShowAddComp(false);
    setNewComp({ nom: '', niveau: 'intermédiaire', description: '' });
  };

  const removeComp = (id) => {
    const updated = { ...myProfile, competences: competences.filter(c => c.id !== id) };
    updateIntervenant(myProfile._id, updated);
    addToast('Compétence supprimée', 'success');
  };

  const niveauColor = { débutant: '#F5A623', intermédiaire: '#0066FF', expert: '#00C896' };

  return (
    <AppLayout pageTitle="Mes Compétences" pageSubtitle="Gérez vos compétences, diplômes et certifications">
      {!myProfile && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Profil intervenant non trouvé. Veuillez contacter l'administrateur.</p>
        </div>
      )}
      {myProfile && (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {/* Compétences */}
          <div className="card">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Compétences ({competences.length})</h3>
              <button className="btn btn-primary" onClick={() => setShowAddComp(true)}>+ Ajouter</button>
            </div>
            {showAddComp && (
              <div style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '1.25rem', marginBottom: '1rem' }}>
                <div className="grid-3" style={{ gap: '1rem', marginBottom: '1rem' }}>
                  <input className="form-control" placeholder="Nom de la compétence" value={newComp.nom} onChange={e => setNewComp(p => ({ ...p, nom: e.target.value }))} />
                  <select className="form-control" value={newComp.niveau} onChange={e => setNewComp(p => ({ ...p, niveau: e.target.value }))}>
                    <option value="débutant">Débutant</option>
                    <option value="intermédiaire">Intermédiaire</option>
                    <option value="expert">Expert</option>
                  </select>
                  <input className="form-control" placeholder="Description" value={newComp.description} onChange={e => setNewComp(p => ({ ...p, description: e.target.value }))} />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-primary" onClick={addComp}>Ajouter</button>
                  <button className="btn btn-ghost" onClick={() => setShowAddComp(false)}>Annuler</button>
                </div>
              </div>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {competences.map(c => (
                <div key={c.id} className="skill-tag" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'var(--bg-secondary)', borderRadius: 20, border: '1px solid var(--border)' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: niveauColor[c.niveau] || '#aaa', flexShrink: 0 }}></span>
                  <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{c.nom}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({c.niveau})</span>
                  <button onClick={() => removeComp(c.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', fontSize: '0.85rem', lineHeight: 1 }}>×</button>
                </div>
              ))}
              {competences.length === 0 && <p style={{ color: 'var(--text-muted)' }}>Aucune compétence ajoutée</p>}
            </div>
          </div>

          {/* Diplômes */}
          <div className="card">
            <div className="card-header"><h3>Diplômes ({diplomes.length})</h3></div>
            {diplomes.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>Aucun diplôme enregistré</p> : (
              <div className="grid-2">
                {diplomes.map((d, i) => (
                  <div key={i} style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 8, borderLeft: '4px solid var(--primary)' }}>
                    <div style={{ fontWeight: 700 }}>{d.intitule}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{d.ecole} · {d.annee}</div>
                    <div style={{ fontSize: '0.8rem', marginTop: '0.3rem' }}>{d.niveau} – {d.specialite}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Certifications */}
          <div className="card">
            <div className="card-header"><h3>Certifications ({certifications.length})</h3></div>
            {certifications.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>Aucune certification enregistrée</p> : (
              <div className="grid-2">
                {certifications.map((c, i) => (
                  <div key={i} style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 8, borderLeft: '4px solid var(--accent-green)' }}>
                    <div style={{ fontWeight: 700 }}>{c.intitule}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{c.organisme} · {c.dateObtention}</div>
                    <div style={{ fontSize: '0.8rem', marginTop: '0.3rem' }}>Code : {c.code}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </AppLayout>
  );
}

// ─── OFFRES DE FORMATION ─────────────────────────────────────────────────────
export function IntervenantOffres() {
  const { intervenants, themes, postulations, postuler, addToast, refreshThemes, refreshPostulations } = useData();
  const { user } = useAuth();
  const [domainFilter, setDomainFilter] = useState('Tous');

  const currentIntervenant = intervenants.find(i => i.email?.toLowerCase() === user?.email?.toLowerCase());
  const intervenantId = currentIntervenant?.id || user?.id;

  // Rafraîchir les données quand la page se monte et toutes les 10 secondes
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([refreshThemes(), refreshPostulations()]);
    };
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []); // Dépendances vides pour éviter les boucles infinies

  const myPostulations = postulations.filter(p => String(p.intervenantId) === String(intervenantId));
  const domains = ['Tous', ...new Set(themes.map(t => t.domaine))];
  const filtered = domainFilter === 'Tous' ? themes : themes.filter(t => t.domaine === domainFilter);

  const hasPostulated = (themeId) => myPostulations.some(p => p.themeId === themeId);

  const handlePostuler = (themeId) => {
    if (hasPostulated(themeId)) { addToast('Vous avez déjà postulé à cette formation', 'warning'); return; }
    postuler(intervenantId, themeId);
    addToast('Postulation envoyée avec succès !', 'success');
  };

  return (
    <AppLayout pageTitle="Offres de Formation" pageSubtitle="Consultez et postulez aux formations disponibles">
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {domains.map(d => (
            <button key={d} className={`filter-chip ${domainFilter === d ? 'active' : ''}`} onClick={() => setDomainFilter(d)}>{d}</button>
          ))}
        </div>
      </div>

      <div className="grid-3">
        {filtered.map(t => {
          const postulated = hasPostulated(t.id);
          return (
            <div key={t.id} className="formation-card">
              <div className="formation-card-header" style={{ background: 'linear-gradient(135deg, var(--secondary), #2d2d4e)' }}>
                <span className="formation-domain">{t.domaine}</span>
                <h3 className="formation-title">{t.intitule}</h3>
              </div>
              <div className="formation-card-body">
                <div className="formation-meta">
                  <span>⏱ {t.nbJours} jours</span>
                  <span>👥 {t.maxParticipants} max</span>
                </div>
                {t.description && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.75rem 0' }}>{t.description}</p>}
                <button
                  className={`btn ${postulated ? 'btn-ghost' : 'btn-primary'}`}
                  style={{ width: '100%', marginTop: '0.75rem' }}
                  onClick={() => handlePostuler(t.id)}
                  disabled={postulated}
                >
                  {postulated ? '✅ Postulation envoyée' : '📝 Postuler'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
}

// ─── MES MISSIONS ────────────────────────────────────────────────────────────
export function IntervenantMissions() {
  const { intervenants, plans } = useData();
  const { user } = useAuth();

  const currentIntervenant = intervenants.find(i => i.email?.toLowerCase() === user?.email?.toLowerCase());
  const intervenantId = currentIntervenant?.id || user?.id;

  const myMissions = plans.filter(p => String(p.intervenantId) === String(intervenantId));
  const enCours = myMissions.filter(m => m.statut === 'en_cours');
  const termine = myMissions.filter(m => m.statut === 'termine');
  const planifie = myMissions.filter(m => m.statut === 'planifie');

  return (
    <AppLayout pageTitle="Mes Missions" pageSubtitle="Formations que vous animez ou avez animées">
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        {[
          { label: 'En cours', items: enCours, color: '#0066FF', badge: 'badge-blue' },
          { label: 'Planifiées', items: planifie, color: '#F5A623', badge: 'badge-orange' },
          { label: 'Terminées', items: termine, color: '#00C896', badge: 'badge-green' },
        ].map(section => (
          <div key={section.label}>
            <h3 style={{ marginBottom: '1rem', color: section.color }}>{section.label} ({section.items.length})</h3>
            {section.items.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Aucune mission</div>
            ) : section.items.map(m => (
              <div key={m.id} className="card" style={{ marginBottom: '1rem', borderLeft: `4px solid ${section.color}` }}>
                <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{m.theme}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>🏭 {m.entreprise}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>📅 {m.dateDebut}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>👥 {m.groupes} groupe(s)</div>
                {m.statut === 'en_cours' && (
                  <>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${m.progression || 0}%` }}></div>
                    </div>
                    <small style={{ color: 'var(--text-muted)' }}>{m.progression || 0}% complété</small>
                  </>
                )}
                <span className={`badge ${section.badge}`} style={{ marginTop: '0.5rem', display: 'inline-block' }}>{m.statut.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {myMissions.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎯</div>
          <h3>Aucune mission assignée</h3>
          <p style={{ color: 'var(--text-muted)' }}>Consultez les offres de formation et postulez pour obtenir des missions</p>
        </div>
      )}
    </AppLayout>
  );
}
