import React, { useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { useData } from '../../context/DataContext';
import { Plus, Search, Edit2, Trash2, X, UserCheck, Calendar, Clock, Users } from 'lucide-react';

// ============================================================
// FORMATIONS PAGE
// ============================================================
export const FormationsPage = () => {
  const { themes, addTheme, updateTheme, deleteTheme } = useData();
  const [search, setSearch] = useState('');
  const [filterDomain, setFilterDomain] = useState('Tous');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ domaine: 'Digital', intitule: '', nbJours: 3, maxParticipants: 15, description: '' });

  const domains = ['Tous', ...new Set(themes.map(t => t.domaine))];
  const filtered = themes.filter(t => {
    const matchSearch = t.intitule.toLowerCase().includes(search.toLowerCase());
    const matchDomain = filterDomain === 'Tous' || t.domaine === filterDomain;
    return matchSearch && matchDomain;
  });

  const openAdd = () => {
    setEditItem(null);
    setForm({ domaine: 'Digital', intitule: '', nbJours: 3, maxParticipants: 15, description: '' });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ ...item });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editItem) {
      updateTheme(editItem.id, form);
    } else {
      addTheme(form);
    }
    setShowModal(false);
  };

  const domainColors = {
    Digital: { bg: 'var(--primary-ultra-light)', color: 'var(--primary)' },
    Industriel: { bg: '#FFF8EB', color: 'var(--accent)' },
    'Génie Civil': { bg: '#EBF2FF', color: 'var(--accent-blue)' },
    Management: { bg: '#E6FFF8', color: 'var(--accent-green)' },
  };

  return (
    <AppLayout pageTitle="Offre de Formation" pageSubtitle="Formations">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Offre de Formation</h1>
          <p>{themes.length} thèmes dans le catalogue</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={16} /> Ajouter thème
        </button>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="table-search" style={{ maxWidth: 320 }}>
          <Search size={16} />
          <input placeholder="Rechercher un thème..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="filter-bar" style={{ marginBottom: 0 }}>
          {domains.map(d => (
            <button key={d} className={`filter-chip ${filterDomain === d ? 'active' : ''}`} onClick={() => setFilterDomain(d)}>{d}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
        {filtered.map((theme, i) => {
          const dc = domainColors[theme.domaine] || { bg: 'var(--gray-100)', color: 'var(--gray-600)' };
          return (
            <div key={theme.id} className="formation-card" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="formation-card-top">
                <span className="formation-domain" style={{ background: dc.bg, color: dc.color }}>{theme.domaine}</span>
                <h3>{theme.intitule}</h3>
                <p style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.5 }}>{theme.description}</p>
              </div>
              <div className="formation-card-bottom">
                <div className="formation-meta">
                  <div className="formation-meta-item">
                    <Clock size={13} /> {theme.nbJours} jour{theme.nbJours > 1 ? 's' : ''}
                  </div>
                  <div className="formation-meta-item">
                    <Users size={13} /> Max {theme.maxParticipants}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(theme)}><Edit2 size={14} /></button>
                  <button className="btn btn-danger btn-icon btn-sm" onClick={() => deleteTheme(theme.id)}><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <Search size={40} />
          <h3>Aucun thème trouvé</h3>
          <p>Modifiez vos critères de recherche ou ajoutez un nouveau thème</p>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">{editItem ? 'Modifier le thème' : 'Ajouter un thème'}</span>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Domaine</label>
                  <select className="form-select" value={form.domaine} onChange={e => setForm({ ...form, domaine: e.target.value })}>
                    <option>Digital</option>
                    <option>Industriel</option>
                    <option>Génie Civil</option>
                    <option>Management</option>
                    <option>Finance</option>
                    <option>Langue & Communication</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Intitulé du thème</label>
                  <input className="form-input" placeholder="Nom de la formation..." value={form.intitule} onChange={e => setForm({ ...form, intitule: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-input" placeholder="Description de la formation..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} style={{ resize: 'vertical' }} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Nombre de jours</label>
                    <input type="number" className="form-input" value={form.nbJours} onChange={e => setForm({ ...form, nbJours: parseInt(e.target.value) })} min={1} max={30} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Participants max / groupe</label>
                    <input type="number" className="form-input" value={form.maxParticipants} onChange={e => setForm({ ...form, maxParticipants: parseInt(e.target.value) })} min={1} max={100} required />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit" className="btn btn-primary">{editItem ? 'Mettre à jour' : 'Ajouter'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

// ============================================================
// PLANIFICATION PAGE (Admin & Regional)
// ============================================================
export const PlanificationPage = ({ role = 'admin' }) => {
  const { plans, intervenants, themes, updatePlan, deletePlan, affecterIntervenant } = useData();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('Tous');
  const [showAffect, setShowAffect] = useState(null);
  const [selectedIntervenant, setSelectedIntervenant] = useState('');

  const statuses = ['Tous', 'planifie', 'en_cours', 'termine'];
  const filtered = plans.filter(p => {
    const matchSearch = p.entreprise.toLowerCase().includes(search.toLowerCase()) || p.theme.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'Tous' || p.statut === filterStatus;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status) => ({
    en_cours: <span className="badge badge-blue">● En cours</span>,
    planifie: <span className="badge badge-orange">◌ Planifié</span>,
    termine: <span className="badge badge-green">✓ Terminé</span>,
    annule: <span className="badge badge-gray">✗ Annulé</span>,
  })[status] || <span className="badge badge-gray">{status}</span>;

  const handleAffectation = () => {
    if (selectedIntervenant && showAffect) {
      affecterIntervenant(showAffect.id, selectedIntervenant);
      setShowAffect(null);
      setSelectedIntervenant('');
    }
  };

  const handleUpdateStatus = (planId, newStatus) => {
    updatePlan(planId, { statut: newStatus, progression: newStatus === 'termine' ? 100 : newStatus === 'en_cours' ? 50 : 0 });
  };

  return (
    <AppLayout pageTitle={role === 'admin' ? 'Planification Globale' : 'Plans des Entreprises'} pageSubtitle="Planification">
      <div className="page-header">
        <div className="page-header-left">
          <h1>{role === 'admin' ? 'Planification Globale' : 'Plans des Entreprises'}</h1>
          <p>{plans.length} plans de formation enregistrés</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 24 }}>
        {[
          { label: 'Total Plans', val: plans.length, color: 'var(--gray-800)', bg: 'var(--gray-50)', border: 'var(--gray-200)' },
          { label: 'En cours', val: plans.filter(p=>p.statut==='en_cours').length, color: 'var(--accent-blue)', bg: '#EBF2FF', border: '#C3D9FF' },
          { label: 'Planifiés', val: plans.filter(p=>p.statut==='planifie').length, color: 'var(--accent)', bg: '#FFF8EB', border: '#FFE8A0' },
          { label: 'Terminés', val: plans.filter(p=>p.statut==='termine').length, color: 'var(--accent-green)', bg: '#E6FFF8', border: '#A0F0DC' },
        ].map((s, i) => (
          <div key={i} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 14, padding: '18px 20px' }}>
            <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-display)', color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 13, color: 'var(--gray-500)', fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="table-container">
        <div className="table-header">
          <div className="table-search">
            <Search size={16} />
            <input placeholder="Rechercher par entreprise, thème..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="filter-bar" style={{ marginBottom: 0 }}>
            {statuses.map(s => (
              <button key={s} className={`filter-chip ${filterStatus === s ? 'active' : ''}`} onClick={() => setFilterStatus(s)}>
                {s === 'Tous' ? 'Tous' : s === 'planifie' ? 'Planifié' : s === 'en_cours' ? 'En cours' : 'Terminé'}
              </button>
            ))}
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Entreprise</th>
              <th>Thème de formation</th>
              <th>Groupes</th>
              <th>Date début</th>
              <th>Intervenant</th>
              <th>Statut</th>
              <th>Progression</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(plan => (
              <tr key={plan.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="avatar avatar-sm">{plan.entreprise[0]}</div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{plan.entreprise}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{plan.region}</div>
                    </div>
                  </div>
                </td>
                <td style={{ fontSize: 13 }}>{plan.theme}</td>
                <td><span className="badge badge-blue">{plan.groupes}G</span></td>
                <td style={{ fontSize: 13, color: 'var(--gray-500)' }}>{new Date(plan.dateDebut).toLocaleDateString('fr-FR')}</td>
                <td>
                  {plan.intervenant ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <div className="avatar avatar-sm">{plan.intervenant[0]}</div>
                      <span style={{ fontSize: 13 }}>{plan.intervenant}</span>
                    </div>
                  ) : (
                    <button className="btn btn-primary btn-sm" onClick={() => { setShowAffect(plan); setSelectedIntervenant(''); }}>
                      <UserCheck size={13} /> Affecter
                    </button>
                  )}
                </td>
                <td>{getStatusBadge(plan.statut)}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 100 }}>
                    <div className="progress-bar" style={{ flex: 1 }}>
                      <div className={`progress-fill ${plan.progression >= 100 ? 'green' : 'blue'}`} style={{ width: `${plan.progression}%` }}></div>
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--gray-500)' }}>{plan.progression}%</span>
                  </div>
                </td>
                <td>
                  <div className="td-actions">
                    {plan.statut === 'planifie' && (
                      <button className="btn btn-success btn-sm" onClick={() => handleUpdateStatus(plan.id, 'en_cours')}>Démarrer</button>
                    )}
                    {plan.statut === 'en_cours' && (
                      <button className="btn btn-success btn-sm" onClick={() => handleUpdateStatus(plan.id, 'termine')}>Terminer</button>
                    )}
                    {plan.statut !== 'termine' && (
                      <button className="btn btn-danger btn-icon btn-sm" onClick={() => deletePlan(plan.id)}><Trash2 size={14} /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="empty-state">
            <Calendar size={40} />
            <h3>Aucun plan trouvé</h3>
          </div>
        )}
      </div>

      {/* Affectation Modal */}
      {showAffect && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowAffect(null)}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">Affecter un intervenant</span>
              <button className="modal-close" onClick={() => setShowAffect(null)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <div style={{ background: 'var(--gray-50)', borderRadius: 12, padding: '14px 16px', marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 4 }}>Formation</div>
                <div style={{ fontWeight: 700, color: 'var(--gray-800)' }}>{showAffect.theme}</div>
                <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 4 }}>Entreprise: {showAffect.entreprise}</div>
              </div>
              <div className="form-group">
                <label className="form-label">Sélectionner un intervenant</label>
                <select className="form-select" value={selectedIntervenant} onChange={e => setSelectedIntervenant(e.target.value)}>
                  <option value="">Choisir un intervenant...</option>
                  {intervenants.map(i => (
                    <option key={i.id} value={i.id}>{i.prenom} {i.nom} — {i.competences.map(c=>c.nom).join(', ')}</option>
                  ))}
                </select>
              </div>
              {selectedIntervenant && (
                <div style={{ background: 'var(--primary-ultra-light)', borderRadius: 10, padding: '12px 16px', border: '1px solid #FFD0D7' }}>
                  {(() => {
                    const int = intervenants.find(i => i.id === selectedIntervenant);
                    return int ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className="avatar">{int.prenom[0]}{int.nom[0]}</div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{int.prenom} {int.nom}</div>
                          <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{int.affectation} · {int.type}</div>
                          <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
                            {int.competences.slice(0,3).map((c,i) => <span key={i} className="skill-tag" style={{fontSize:11}}>{c.nom}</span>)}
                          </div>
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowAffect(null)}>Annuler</button>
              <button className="btn btn-primary" onClick={handleAffectation} disabled={!selectedIntervenant}>
                <UserCheck size={16} /> Confirmer l'affectation
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};
