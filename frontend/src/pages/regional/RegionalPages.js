import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export function RegionalDashboard() {
  const { plans, themes, intervenants } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const regionPlans = plans.filter(p => p.region === (user?.region || 'Casablanca-Settat'));
  const enCours = regionPlans.filter(p => p.statut === 'en_cours').length;
  const planifie = regionPlans.filter(p => p.statut === 'planifie').length;
  const termine = regionPlans.filter(p => p.statut === 'termine').length;

  const domaineData = themes.reduce((acc, t) => {
    const existing = acc.find(a => a.name === t.domaine);
    if (existing) existing.value++;
    else acc.push({ name: t.domaine, value: 1 });
    return acc;
  }, []);

  const COLORS = ['#C8102E', '#0066FF', '#00C896', '#F5A623', '#8B5CF6'];

  return (
    <AppLayout pageTitle="Dashboard Régional" pageSubtitle={`Région ${user?.region || 'Casablanca-Settat'}`}>
      <div className="hero-banner" style={{ marginBottom: '2rem' }}>
        <div className="hero-content">
          <h1>Bienvenue, {user?.name}</h1>
          <p>Gestion et suivi des formations de votre région</p>
        </div>
        <div className="hero-decoration"></div>
      </div>

      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #C8102E, #ff4d6d)' }}>📋</div>
          <div className="stat-info">
            <div className="stat-number">{regionPlans.length}</div>
            <div className="stat-label">Plans Totaux</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #0066FF, #4d94ff)' }}>🔄</div>
          <div className="stat-info">
            <div className="stat-number">{enCours}</div>
            <div className="stat-label">En Cours</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #F5A623, #ffc107)' }}>📅</div>
          <div className="stat-info">
            <div className="stat-number">{planifie}</div>
            <div className="stat-label">Planifiés</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #00C896, #00e5a8)' }}>✅</div>
          <div className="stat-info">
            <div className="stat-number">{termine}</div>
            <div className="stat-label">Terminés</div>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header"><h3>Plans récents de la région</h3></div>
          {regionPlans.slice(0, 5).map(p => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{p.entreprise}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.theme}</div>
              </div>
              <span className={`badge badge-${p.statut === 'en_cours' ? 'blue' : p.statut === 'planifie' ? 'orange' : p.statut === 'termine' ? 'green' : 'gray'}`}>
                {p.statut.replace('_', ' ')}
              </span>
            </div>
          ))}
          {regionPlans.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Aucun plan pour cette région</p>}
        </div>

        <div className="card">
          <div className="card-header"><h3>Formations par domaine</h3></div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={domaineData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {domaineData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppLayout>
  );
}

export function RegionalFormations() {
  const { themes } = useData();
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState('Tous');

  const domains = ['Tous', ...new Set(themes.map(t => t.domaine))];
  const filtered = themes.filter(t => {
    const matchDomain = domainFilter === 'Tous' || t.domaine === domainFilter;
    const matchSearch = t.intitule.toLowerCase().includes(search.toLowerCase());
    return matchDomain && matchSearch;
  });

  return (
    <AppLayout pageTitle="Formations Disponibles" pageSubtitle="Catalogue des thèmes de formation">
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input className="form-control" placeholder="Rechercher un thème..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, minWidth: 200 }} />
          <select className="form-control" value={domainFilter} onChange={e => setDomainFilter(e.target.value)} style={{ minWidth: 160 }}>
            {domains.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <div className="grid-3">
        {filtered.map(t => (
          <div key={t.id} className="formation-card">
            <div className="formation-card-header" style={{ background: `linear-gradient(135deg, var(--primary), #ff4d6d)` }}>
              <span className="formation-domain">{t.domaine}</span>
              <h3 className="formation-title">{t.intitule}</h3>
            </div>
            <div className="formation-card-body">
              <div className="formation-meta">
                <span>⏱ {t.nbJours} jours</span>
                <span>👥 Max {t.maxParticipants} participants</span>
              </div>
              {t.description && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>{t.description}</p>}
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Aucune formation trouvée</div>}
    </AppLayout>
  );
}


export function RegionalPlans() {
  const { plans } = useData();
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState('Tous');

  const regionPlans = plans.filter(p => p.region === (user?.region || 'Casablanca-Settat'));
  const filtered = statusFilter === 'Tous' ? regionPlans : regionPlans.filter(p => p.statut === statusFilter);

  return (
    <AppLayout pageTitle="Plans des Entreprises" pageSubtitle="Demandes de formation de votre région">
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['Tous', 'planifie', 'en_cours', 'termine', 'annule'].map(s => (
            <button key={s} className={`filter-chip ${statusFilter === s ? 'active' : ''}`} onClick={() => setStatusFilter(s)}>
              {s === 'Tous' ? 'Tous' : s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3>Plans de formation ({filtered.length})</h3>
        </div>
        <table>
          <thead><tr><th>Entreprise</th><th>Thème</th><th>Groupes</th><th>Date début</th><th>Intervenant</th><th>Statut</th><th>Progression</th></tr></thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td><strong>{p.entreprise}</strong></td>
                <td>{p.theme}</td>
                <td style={{ textAlign: 'center' }}>{p.groupes}</td>
                <td>{p.dateDebut}</td>
                <td>{p.intervenant || <span style={{ color: 'var(--text-muted)' }}>Non affecté</span>}</td>
                <td><span className={`badge badge-${p.statut === 'en_cours' ? 'blue' : p.statut === 'planifie' ? 'orange' : p.statut === 'termine' ? 'green' : 'gray'}`}>{p.statut.replace('_', ' ')}</span></td>
                <td>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${p.progression || 0}%`, background: p.progression >= 100 ? 'var(--accent-green)' : 'var(--primary)' }}></div>
                  </div>
                  <small style={{ color: 'var(--text-muted)' }}>{p.progression || 0}%</small>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Aucun plan trouvé</div>}
      </div>
    </AppLayout>
  );
}


export function RegionalAffectation() {
  const { plans, intervenants, affecterIntervenant, addToast } = useData();
  const { user } = useAuth();
  const [selected, setSelected] = useState(null);
  const [intervenantId, setIntervenantId] = useState('');

  const regionPlans = plans.filter(p => p.region === (user?.region || 'Casablanca-Settat') && p.statut === 'planifie');

  const handleAffecter = () => {
    if (!intervenantId) { addToast('Veuillez sélectionner un intervenant', 'error'); return; }
    affecterIntervenant(selected.id, intervenantId);
    addToast('Intervenant affecté avec succès', 'success');
    setSelected(null);
    setIntervenantId('');
  };

  return (
    <AppLayout pageTitle="Affectation Intervenants" pageSubtitle="Affecter des intervenants aux formations planifiées">
      <div className="grid-2">
        <div>
          <div className="table-container">
            <div className="table-header"><h3>Formations à affecter ({regionPlans.length})</h3></div>
            <table>
              <thead><tr><th>Entreprise</th><th>Thème</th><th>Date</th><th>Action</th></tr></thead>
              <tbody>
                {regionPlans.map(p => (
                  <tr key={p.id} style={{ background: selected?.id === p.id ? 'var(--primary-light)' : '' }}>
                    <td><strong>{p.entreprise}</strong></td>
                    <td>{p.theme}</td>
                    <td>{p.dateDebut}</td>
                    <td>
                      <button className="btn btn-sm btn-primary" onClick={() => { setSelected(p); setIntervenantId(p.intervenantId || ''); }}>
                        Affecter
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {regionPlans.length === 0 && <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Aucune formation à affecter</div>}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3>Affecter un intervenant</h3></div>
          {selected ? (
            <div>
              <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '1rem', marginBottom: '1.5rem' }}>
                <p><strong>Formation :</strong> {selected.theme}</p>
                <p><strong>Entreprise :</strong> {selected.entreprise}</p>
                <p><strong>Date :</strong> {selected.dateDebut}</p>
              </div>
              <div className="form-group">
                <label className="form-label">Choisir l'intervenant</label>
                <select className="form-control" value={intervenantId} onChange={e => setIntervenantId(e.target.value)}>
                  <option value="">-- Sélectionner --</option>
                  {intervenants.map(i => (
                    <option key={i.id} value={i.id}>{i.prenom} {i.nom} – {i.competences?.map(c => c.nom).join(', ') || 'N/A'}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button className="btn btn-primary" onClick={handleAffecter}>Confirmer l'affectation</button>
                <button className="btn btn-ghost" onClick={() => setSelected(null)}>Annuler</button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👆</div>
              <p>Sélectionnez une formation pour affecter un intervenant</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}


export function RegionalSuivi() {
  const { plans, updateStatus, addToast } = useData();
  const { user } = useAuth();

  const regionPlans = plans.filter(p => p.region === (user?.region || 'Casablanca-Settat'));
  const enCours = regionPlans.filter(p => p.statut === 'en_cours');

  return (
    <AppLayout pageTitle="Suivi des Formations" pageSubtitle="Suivre l'exécution des formations en cours">
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        {[
          { label: 'Total', count: regionPlans.length, color: '#C8102E', icon: '📊' },
          { label: 'En cours', count: regionPlans.filter(p => p.statut === 'en_cours').length, color: '#0066FF', icon: '🔄' },
          { label: 'Planifiés', count: regionPlans.filter(p => p.statut === 'planifie').length, color: '#F5A623', icon: '📅' },
          { label: 'Terminés', count: regionPlans.filter(p => p.statut === 'termine').length, color: '#00C896', icon: '✅' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: s.color }}>{s.icon}</div>
            <div className="stat-info"><div className="stat-number">{s.count}</div><div className="stat-label">{s.label}</div></div>
          </div>
        ))}
      </div>

      <div className="table-container">
        <div className="table-header"><h3>Toutes les formations de la région</h3></div>
        <table>
          <thead><tr><th>Entreprise</th><th>Thème</th><th>Intervenant</th><th>Progression</th><th>Statut</th><th>Actions</th></tr></thead>
          <tbody>
            {regionPlans.map(p => (
              <tr key={p.id}>
                <td><strong>{p.entreprise}</strong></td>
                <td>{p.theme}</td>
                <td>{p.intervenant || '—'}</td>
                <td style={{ minWidth: 140 }}>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${p.progression || 0}%`, background: (p.progression || 0) >= 100 ? 'var(--accent-green)' : 'var(--primary)' }}></div>
                  </div>
                  <small>{p.progression || 0}%</small>
                </td>
                <td><span className={`badge badge-${p.statut === 'en_cours' ? 'blue' : p.statut === 'planifie' ? 'orange' : p.statut === 'termine' ? 'green' : 'gray'}`}>{p.statut.replace('_',' ')}</span></td>
                <td>
                  {p.statut === 'planifie' && <button className="btn btn-sm btn-primary" onClick={() => { updateStatus(p.id, 'en_cours'); addToast('Formation démarrée', 'success'); }} style={{ marginRight: 4 }}>Démarrer</button>}
                  {p.statut === 'en_cours' && <button className="btn btn-sm" style={{ background: 'var(--accent-green)', color: '#fff', border: 'none', borderRadius: 6, padding: '0.3rem 0.7rem', cursor: 'pointer' }} onClick={() => { updateStatus(p.id, 'termine'); addToast('Formation terminée', 'success'); }}>Terminer</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
