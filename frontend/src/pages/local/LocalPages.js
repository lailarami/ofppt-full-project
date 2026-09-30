import React, { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

// ─── LOCAL DASHBOARD ─────────────────────────────────────────────────────────
export function LocalDashboard() {
  const { plans } = useData();
  const { user } = useAuth();

  const localPlans = plans.filter(p => p.statut !== 'annule');
  const enCours = localPlans.filter(p => p.statut === 'en_cours');

  return (
    <AppLayout pageTitle="Dashboard Local" pageSubtitle="Suivi terrain des formations">
      <div className="hero-banner" style={{ marginBottom: '2rem' }}>
        <div className="hero-content">
          <h1>Bonjour, {user?.name}</h1>
          <p>Coordination et suivi des sessions de formation locales</p>
        </div>
        <div className="hero-decoration"></div>
      </div>

      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        {[
          { label: 'Formations actives', count: enCours.length, color: '#0066FF', icon: '🔄' },
          { label: 'Total planifiées', count: localPlans.filter(p => p.statut === 'planifie').length, color: '#F5A623', icon: '📅' },
          { label: 'Terminées', count: localPlans.filter(p => p.statut === 'termine').length, color: '#00C896', icon: '✅' },
          { label: 'Intervenants actifs', count: [...new Set(enCours.map(p => p.intervenantId).filter(Boolean))].length, color: '#C8102E', icon: '👨‍🏫' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: s.color }}>{s.icon}</div>
            <div className="stat-info"><div className="stat-number">{s.count}</div><div className="stat-label">{s.label}</div></div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header"><h3>Formations en cours</h3></div>
          {enCours.length === 0 && <p style={{ color: 'var(--text-muted)', padding: '1.5rem', textAlign: 'center' }}>Aucune formation en cours</p>}
          {enCours.map(p => (
            <div key={p.id} style={{ padding: '1rem 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{p.theme}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.entreprise}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Intervenant : {p.intervenant || 'Non affecté'}</div>
                </div>
                <span className="badge badge-blue">En cours</span>
              </div>
              <div className="progress-bar" style={{ marginTop: '0.5rem' }}>
                <div className="progress-fill" style={{ width: `${p.progression || 0}%` }}></div>
              </div>
              <small style={{ color: 'var(--text-muted)' }}>{p.progression || 0}% complété</small>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-header"><h3>Prochaines sessions</h3></div>
          {localPlans.filter(p => p.statut === 'planifie').map(p => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{p.theme}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.entreprise} · {p.dateDebut}</div>
              </div>
              <span className="badge badge-orange">Planifié</span>
            </div>
          ))}
          {localPlans.filter(p => p.statut === 'planifie').length === 0 && (
            <p style={{ color: 'var(--text-muted)', padding: '1.5rem', textAlign: 'center' }}>Aucune session planifiée</p>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

// ─── LOCAL PLANNING ──────────────────────────────────────────────────────────
export function LocalPlanning() {
  const { plans } = useData();
  const [view, setView] = useState('list');
  const [monthFilter, setMonthFilter] = useState('');

  const months = [...new Set(plans.map(p => p.dateDebut?.slice(0, 7)).filter(Boolean))].sort();
  const filtered = monthFilter ? plans.filter(p => p.dateDebut?.startsWith(monthFilter)) : plans;

  return (
    <AppLayout pageTitle="Planning des Formations" pageSubtitle="Vue d'ensemble du calendrier de formation">
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className={`filter-chip ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>📋 Liste</button>
            <button className={`filter-chip ${view === 'calendar' ? 'active' : ''}`} onClick={() => setView('calendar')}>📅 Calendrier</button>
          </div>
          <select className="form-control" value={monthFilter} onChange={e => setMonthFilter(e.target.value)} style={{ maxWidth: 200 }}>
            <option value="">Tous les mois</option>
            {months.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {view === 'list' ? (
        <div className="table-container">
          <div className="table-header"><h3>Planning ({filtered.length} formations)</h3></div>
          <table>
            <thead><tr><th>Thème</th><th>Entreprise</th><th>Date début</th><th>Groupes</th><th>Intervenant</th><th>Statut</th></tr></thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td><strong>{p.theme}</strong></td>
                  <td>{p.entreprise}</td>
                  <td>{p.dateDebut}</td>
                  <td style={{ textAlign: 'center' }}>{p.groupes}</td>
                  <td>{p.intervenant || <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                  <td><span className={`badge badge-${p.statut === 'en_cours' ? 'blue' : p.statut === 'planifie' ? 'orange' : p.statut === 'termine' ? 'green' : 'gray'}`}>{p.statut.replace('_', ' ')}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card">
          <div className="calendar-grid">
            {filtered.map(p => (
              <div key={p.id} style={{
                padding: '1rem',
                borderRadius: 8,
                background: p.statut === 'en_cours' ? '#e8f0ff' : p.statut === 'planifie' ? '#fff8e6' : p.statut === 'termine' ? '#e6fff7' : '#f5f5f5',
                borderLeft: `4px solid ${p.statut === 'en_cours' ? '#0066FF' : p.statut === 'planifie' ? '#F5A623' : p.statut === 'termine' ? '#00C896' : '#aaa'}`,
                marginBottom: '0.75rem'
              }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{p.theme}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.entreprise} · {p.dateDebut}</div>
                <div style={{ fontSize: '0.8rem', marginTop: '0.3rem' }}>{p.groupes} groupe(s) · {p.intervenant || 'Sans intervenant'}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AppLayout>
  );
}

// ─── LOCAL SESSIONS ──────────────────────────────────────────────────────────
export function LocalSessions() {
  const { plans } = useData();
  const [selected, setSelected] = useState(null);

  return (
    <AppLayout pageTitle="Détail des Sessions" pageSubtitle="Gestion et suivi des sessions de formation">
      <div className="grid-2">
        <div className="table-container">
          <div className="table-header"><h3>Sessions ({plans.length})</h3></div>
          <table>
            <thead><tr><th>Formation</th><th>Entreprise</th><th>Statut</th></tr></thead>
            <tbody>
              {plans.map(p => (
                <tr key={p.id} style={{ cursor: 'pointer', background: selected?.id === p.id ? 'var(--primary-light)' : '' }} onClick={() => setSelected(p)}>
                  <td><strong>{p.theme}</strong></td>
                  <td>{p.entreprise}</td>
                  <td><span className={`badge badge-${p.statut === 'en_cours' ? 'blue' : p.statut === 'planifie' ? 'orange' : p.statut === 'termine' ? 'green' : 'gray'}`}>{p.statut.replace('_', ' ')}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-header"><h3>Détails de la session</h3></div>
          {selected ? (
            <div>
              <h2 style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>{selected.theme}</h2>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {[
                  { label: 'Entreprise', value: selected.entreprise },
                  { label: 'Date de début', value: selected.dateDebut },
                  { label: 'Nombre de groupes', value: selected.groupes },
                  { label: 'Région', value: selected.region },
                  { label: 'Intervenant', value: selected.intervenant || 'Non affecté' },
                  { label: 'Progression', value: `${selected.progression || 0}%` },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{item.label}</span>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.value}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Progression globale</span>
                  <span style={{ fontWeight: 700 }}>{selected.progression || 0}%</span>
                </div>
                <div className="progress-bar" style={{ height: 12, borderRadius: 6 }}>
                  <div className="progress-fill" style={{ width: `${selected.progression || 0}%` }}></div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👆</div>
              <p>Cliquez sur une session pour voir les détails</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

// ─── LOCAL SUIVI ─────────────────────────────────────────────────────────────
export function LocalSuivi() {
  const { plans, updateStatus, updateProgression, addToast } = useData();
  const [progressUpdates, setProgressUpdates] = useState({});

  const handleProgressSave = (planId) => {
    const newProgression = progressUpdates[planId];
    updateProgression(planId, newProgression);
    addToast('Progression mise à jour', 'success');
    setProgressUpdates(prev => ({ ...prev, [planId]: undefined }));
  };

  return (
    <AppLayout pageTitle="Suivi d'Exécution" pageSubtitle="Mise à jour de l'état d'avancement des formations">
      <div className="table-container">
        <div className="table-header"><h3>Suivi des formations</h3></div>
        <table>
          <thead><tr><th>Thème</th><th>Entreprise</th><th>Intervenant</th><th>Progression</th><th>Statut</th><th>Mise à jour</th></tr></thead>
          <tbody>
            {plans.filter(p => p.statut !== 'annule').map(p => (
              <tr key={p.id}>
                <td><strong>{p.theme}</strong></td>
                <td>{p.entreprise}</td>
                <td>{p.intervenant || '—'}</td>
                <td style={{ minWidth: 160 }}>
                  <input
                    type="range" min={0} max={100} step={5}
                    value={progressUpdates[p.id] ?? p.progression ?? 0}
                    onChange={e => setProgressUpdates(prev => ({ ...prev, [p.id]: Number(e.target.value) }))}
                    style={{ width: '100%', accentColor: 'var(--primary)' }}
                  />
                  <small style={{ color: 'var(--text-muted)' }}>{progressUpdates[p.id] ?? p.progression ?? 0}%</small>
                </td>
                <td><span className={`badge badge-${p.statut === 'en_cours' ? 'blue' : p.statut === 'planifie' ? 'orange' : p.statut === 'termine' ? 'green' : 'gray'}`}>{p.statut.replace('_', ' ')}</span></td>
                <td style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {progressUpdates[p.id] !== undefined && (
                    <button className="btn btn-sm btn-primary" onClick={() => handleProgressSave(p.id)}>💾</button>
                  )}
                  {p.statut === 'planifie' && (
                    <button className="btn btn-sm btn-primary" onClick={() => { updateStatus(p.id, 'en_cours'); addToast('Formation démarrée', 'success'); }}>Démarrer</button>
                  )}
                  {p.statut === 'en_cours' && (
                    <button className="btn btn-sm" style={{ background: 'var(--accent-green)', color: '#fff', border: 'none', borderRadius: 6, padding: '0.3rem 0.7rem', cursor: 'pointer', fontSize: '0.8rem' }} onClick={() => { updateStatus(p.id, 'termine'); addToast('Formation terminée', 'success'); }}>Terminer</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
