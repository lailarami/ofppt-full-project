import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { useData } from '../../context/DataContext';
import { UserPlus, Search, Edit2, Trash2, Eye, X, Award, BookOpen, Plus, Check } from 'lucide-react';

// ============================================================
// USERS PAGE
// ============================================================
export const UsersPage = () => {
  const { users, addUser, updateUser, deleteUser, refreshUsers } = useData();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'company', status: 'actif', region: '' });

  // Rafraîchir les données au montage et toutes les 10 secondes
  useEffect(() => {
    refreshUsers();
    const interval = setInterval(refreshUsers, 10000);
    return () => clearInterval(interval);
  }, [refreshUsers]);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const roleBadge = (role) => {
    const map = {
      admin: <span className="badge role-admin">Admin</span>,
      regional: <span className="badge role-regional">Régional</span>,
      local: <span className="badge role-local">Local</span>,
      company: <span className="badge role-company">Entreprise</span>,
      intervenant: <span className="badge role-intervenant">Intervenant</span>,
    };
    return map[role] || <span className="badge badge-gray">{role}</span>;
  };

  const openAdd = () => {
    setEditUser(null);
    setForm({ name: '', email: '', password: '', role: 'company', status: 'actif', region: '' });
    setShowModal(true);
  };

  const openEdit = (user) => {
    setEditUser(user);
    setForm({ name: user.name, email: user.email, role: user.role, status: user.status, region: user.region || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editUser) {
      updateUser(editUser.id, form);
    } else {
      await addUser(form);
    }
    setShowModal(false);
    // Refresh users list immediately after adding/updating
    setTimeout(() => refreshUsers(), 500);
  };

  return (
    <AppLayout pageTitle="Gestion des Utilisateurs" pageSubtitle="Utilisateurs">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Gestion des Utilisateurs</h1>
          <p>{users.length} utilisateurs enregistrés sur la plateforme</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <UserPlus size={16} /> Nouvel utilisateur
        </button>
      </div>

      <div className="table-container">
        <div className="table-header">
          <div className="table-search">
            <Search size={16} />
            <input placeholder="Rechercher un utilisateur..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Tous', 'admin', 'regional', 'local', 'company', 'intervenant'].map(f => (
              <button key={f} className="btn btn-ghost btn-sm">{f === 'Tous' ? 'Tous' : f}</button>
            ))}
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Région</th>
              <th>Statut</th>
              <th>Créé le</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <tr key={user.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="avatar avatar-sm">{user.name[0]}</div>
                    <span style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{user.name}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--gray-500)', fontSize: 13 }}>{user.email}</td>
                <td>{roleBadge(user.role)}</td>
                <td style={{ fontSize: 13, color: 'var(--gray-500)' }}>{user.region || '—'}</td>
                <td>
                  <span className={`badge ${user.status === 'actif' ? 'badge-green' : 'badge-gray'}`}>
                    {user.status === 'actif' ? '● Actif' : '○ Inactif'}
                  </span>
                </td>
                <td style={{ fontSize: 13, color: 'var(--gray-500)' }}>{user.dateCreation}</td>
                <td>
                  <div className="td-actions">
                    <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(user)}><Edit2 size={14} /></button>
                    <button className="btn btn-danger btn-icon btn-sm" onClick={() => deleteUser(user.id)}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="empty-state">
            <Search size={40} />
            <h3>Aucun utilisateur trouvé</h3>
            <p>Essayez d'autres termes de recherche</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">{editUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}</span>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nom complet</label>
                  <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
                {!editUser && (
                  <div className="form-group">
                    <label className="form-label">Mot de passe</label>
                    <input type="password" className="form-input" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                  </div>
                )}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Rôle</label>
                    <select className="form-select" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                      <option value="admin">Administrateur</option>
                      <option value="regional">Gestionnaire Régional</option>
                      <option value="local">Gestionnaire Local</option>
                      <option value="company">Entreprise</option>
                      <option value="intervenant">Intervenant</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Statut</label>
                    <select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                      <option value="actif">Actif</option>
                      <option value="inactif">Inactif</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Région</label>
                  <select className="form-select" value={form.region} onChange={e => setForm({ ...form, region: e.target.value })}>
                    <option value="">Sélectionner...</option>
                    <option>Casablanca-Settat</option>
                    <option>Rabat-Salé-Kénitra</option>
                    <option>Fès-Meknès</option>
                    <option>Marrakech-Safi</option>
                    <option>Tanger-Tétouan-Al Hoceïma</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit" className="btn btn-primary">{editUser ? 'Mettre à jour' : 'Créer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

// ============================================================
// INTERVENANTS PAGE
// ============================================================
export const IntervenantsPage = () => {
  const { intervenants, addIntervenant, updateIntervenant, deleteIntervenant } = useData();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [form, setForm] = useState({
    matricule: '', nom: '', prenom: '', email: '', password: '', telephone: '',
    genre: 'M', dateNaissance: '', affectation: '', type: 'interne',
    competences: [], diplomes: [], certifications: []
  });
  const [newComp, setNewComp] = useState({ nom: '', niveau: 'intermediaire', description: '' });
  const [newDiplome, setNewDiplome] = useState({ intitule: '', ecole: '', annee: '', niveau: 'Bac+3', specialite: '' });
  const [newCert, setNewCert] = useState({ code: '', intitule: '', type: '', domaine: '' });

  const filtered = intervenants.filter(i =>
    `${i.prenom} ${i.nom}`.toLowerCase().includes(search.toLowerCase()) ||
    i.email.toLowerCase().includes(search.toLowerCase()) ||
    i.matricule.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditItem(null);
    setForm({ matricule: `INT-${String(intervenants.length + 1).padStart(3,'0')}`, nom: '', prenom: '', email: '', password: '', telephone: '', genre: 'M', dateNaissance: '', affectation: '', type: 'interne', competences: [], diplomes: [], certifications: [] });
    setActiveTab('info');
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ ...item });
    setActiveTab('info');
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editItem) {
      updateIntervenant(editItem.id, form);
    } else {
      addIntervenant(form);
    }
    setShowModal(false);
  };

  const addCompetence = () => {
    if (newComp.nom) {
      setForm(f => ({ ...f, competences: [...f.competences, { ...newComp }] }));
      setNewComp({ nom: '', niveau: 'intermediaire', description: '' });
    }
  };

  const addDiplome = () => {
    if (newDiplome.intitule) {
      setForm(f => ({ ...f, diplomes: [...f.diplomes, { ...newDiplome }] }));
      setNewDiplome({ intitule: '', ecole: '', annee: '', niveau: 'Bac+3', specialite: '' });
    }
  };

  const addCert = () => {
    if (newCert.intitule) {
      setForm(f => ({ ...f, certifications: [...f.certifications, { ...newCert }] }));
      setNewCert({ code: '', intitule: '', type: '', domaine: '' });
    }
  };

  const niveauBadge = (n) => ({
    expert: <span className="skill-tag expert">Expert</span>,
    intermediaire: <span className="skill-tag intermediate">Intermédiaire</span>,
    debutant: <span className="skill-tag beginner">Débutant</span>,
  })[n] || <span className="skill-tag">{n}</span>;

  return (
    <AppLayout pageTitle="Gestion des Intervenants" pageSubtitle="Intervenants">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Intervenants</h1>
          <p>{intervenants.length} intervenants enregistrés</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={16} /> Ajouter intervenant
        </button>
      </div>

      <div className="table-container">
        <div className="table-header">
          <div className="table-search">
            <Search size={16} />
            <input placeholder="Rechercher par nom, email, matricule..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost btn-sm">Tous</button>
            <button className="btn btn-ghost btn-sm">Internes</button>
            <button className="btn btn-ghost btn-sm">Externes</button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Matricule</th>
              <th>Intervenant</th>
              <th>Contact</th>
              <th>Type</th>
              <th>Affectation</th>
              <th>Compétences</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => (
              <tr key={item.id}>
                <td><span className="badge badge-gray">{item.matricule}</span></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="avatar avatar-sm">{item.prenom[0]}{item.nom[0]}</div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{item.prenom} {item.nom}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{item.diplomes[0]?.specialite || '—'}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: 13 }}>
                    <div style={{ color: 'var(--gray-600)' }}>{item.email}</div>
                    <div style={{ color: 'var(--gray-400)' }}>{item.telephone}</div>
                  </div>
                </td>
                <td>
                  <span className={`badge ${item.type === 'interne' ? 'badge-blue' : 'badge-purple'}`}>
                    {item.type === 'interne' ? 'Interne' : 'Externe'}
                  </span>
                </td>
                <td style={{ fontSize: 13, color: 'var(--gray-600)' }}>{item.affectation}</td>
                <td>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', maxWidth: 200 }}>
                    {item.competences.slice(0, 2).map((c, i) => (
                      <span key={i} className="skill-tag">{c.nom}</span>
                    ))}
                    {item.competences.length > 2 && <span className="skill-tag">+{item.competences.length - 2}</span>}
                  </div>
                </td>
                <td>
                  <div className="td-actions">
                    <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setShowDetail(item)}><Eye size={14} /></button>
                    <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(item)}><Edit2 size={14} /></button>
                    <button className="btn btn-danger btn-icon btn-sm" onClick={() => deleteIntervenant(item.id)}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="empty-state">
            <Search size={40} />
            <h3>Aucun intervenant trouvé</h3>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetail && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowDetail(null)}>
          <div className="modal" style={{ maxWidth: 640 }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div className="avatar avatar-lg">{showDetail.prenom[0]}{showDetail.nom[0]}</div>
                <div>
                  <div className="modal-title">{showDetail.prenom} {showDetail.nom}</div>
                  <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>{showDetail.matricule} · {showDetail.affectation}</div>
                </div>
              </div>
              <button className="modal-close" onClick={() => setShowDetail(null)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <div className="grid-2" style={{ marginBottom: 20 }}>
                {[
                  { label: 'Email', value: showDetail.email },
                  { label: 'Téléphone', value: showDetail.telephone },
                  { label: 'Genre', value: showDetail.genre === 'M' ? 'Masculin' : 'Féminin' },
                  { label: 'Type', value: showDetail.type },
                ].map((f, i) => (
                  <div key={i} style={{ background: 'var(--gray-50)', padding: '12px 16px', borderRadius: 10 }}>
                    <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--gray-400)', fontWeight: 700, marginBottom: 4 }}>{f.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-700)' }}>{f.value}</div>
                  </div>
                ))}
              </div>

              {showDetail.competences.length > 0 && (
                <>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-700)', marginBottom: 10 }}>Compétences</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                    {showDetail.competences.map((c, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'white', border: '1px solid var(--gray-200)', borderRadius: 8, padding: '8px 14px' }}>
                        <span style={{ fontSize: 14, fontWeight: 600 }}>{c.nom}</span>
                        {niveauBadge(c.niveau)}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {showDetail.diplomes.length > 0 && (
                <>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-700)', marginBottom: 10 }}>Diplômes</div>
                  {showDetail.diplomes.map((d, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--gray-100)' }}>
                      <Award size={18} style={{ color: 'var(--accent)', marginTop: 2, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{d.intitule}</div>
                        <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>{d.ecole} · {d.annee} · {d.niveau}</div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {showDetail.certifications.length > 0 && (
                <>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-700)', marginBottom: 10, marginTop: 16 }}>Certifications</div>
                  {showDetail.certifications.map((c, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--gray-100)' }}>
                      <BookOpen size={18} style={{ color: 'var(--primary)', marginTop: 2, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{c.intitule}</div>
                        <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>{c.code} · {c.domaine}</div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowDetail(null)}>Fermer</button>
              <button className="btn btn-primary" onClick={() => { setShowDetail(null); openEdit(showDetail); }}><Edit2 size={15} /> Modifier</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal" style={{ maxWidth: 680 }}>
            <div className="modal-header">
              <span className="modal-title">{editItem ? 'Modifier l\'intervenant' : 'Ajouter un intervenant'}</span>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ borderBottom: '1px solid var(--gray-100)', padding: '0 28px' }}>
                <div className="tabs" style={{ marginBottom: 0, background: 'transparent', padding: 0, borderRadius: 0, borderBottom: '2px solid var(--gray-100)', gap: 0 }}>
                  {['info', 'competences', 'diplomes', 'certifications'].map(tab => (
                    <button key={tab} type="button"
                      style={{ padding: '14px 18px', background: 'none', border: 'none', borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: activeTab === tab ? 'var(--primary)' : 'var(--gray-500)', transition: 'all 0.2s', fontFamily: 'var(--font-body)', marginBottom: -2 }}
                      onClick={() => setActiveTab(tab)}>
                      {tab === 'info' ? 'Informations' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="modal-body">
                {activeTab === 'info' && (
                  <>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Matricule</label>
                        <input className="form-input" value={form.matricule} onChange={e => setForm({ ...form, matricule: e.target.value })} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Type</label>
                        <select className="form-select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                          <option value="interne">Interne</option>
                          <option value="externe">Externe</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Prénom</label>
                        <input className="form-input" value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Nom</label>
                        <input className="form-input" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} required />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                      </div>
                      {!editItem && (
                        <div className="form-group">
                          <label className="form-label">Mot de passe</label>
                          <input type="password" className="form-input" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                        </div>
                      )}
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Genre</label>
                        <select className="form-select" value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })}>
                          <option value="M">Masculin</option>
                          <option value="F">Féminin</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Date de naissance</label>
                        <input type="date" className="form-input" value={form.dateNaissance} onChange={e => setForm({ ...form, dateNaissance: e.target.value })} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Lieu d'affectation</label>
                      <select className="form-select" value={form.affectation} onChange={e => setForm({ ...form, affectation: e.target.value })}>
                        <option value="">Sélectionner...</option>
                        <option>Casablanca</option><option>Rabat</option><option>Fès</option>
                        <option>Marrakech</option><option>Tanger</option><option>Agadir</option>
                      </select>
                    </div>
                  </>
                )}

                {activeTab === 'competences' && (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                      {form.competences.map((c, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--gray-50)', borderRadius: 10, border: '1px solid var(--gray-200)' }}>
                          <div style={{ flex: 1 }}>
                            <span style={{ fontWeight: 600, fontSize: 14 }}>{c.nom}</span>
                            <span style={{ fontSize: 13, color: 'var(--gray-500)', marginLeft: 8 }}>{c.description}</span>
                          </div>
                          {niveauBadge(c.niveau)}
                          <button type="button" className="btn btn-danger btn-icon btn-sm" onClick={() => setForm(f => ({ ...f, competences: f.competences.filter((_, j) => j !== i) }))}>
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div style={{ background: 'var(--primary-ultra-light)', borderRadius: 12, padding: 16, border: '1px dashed var(--primary)' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 12 }}>Ajouter une compétence</div>
                      <div className="form-row">
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <input className="form-input" placeholder="Nom de la compétence" value={newComp.nom} onChange={e => setNewComp({ ...newComp, nom: e.target.value })} />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <select className="form-select" value={newComp.niveau} onChange={e => setNewComp({ ...newComp, niveau: e.target.value })}>
                            <option value="debutant">Débutant</option>
                            <option value="intermediaire">Intermédiaire</option>
                            <option value="expert">Expert</option>
                          </select>
                        </div>
                      </div>
                      <div style={{ marginTop: 10, display: 'flex', gap: 8, alignItems: 'center' }}>
                        <input className="form-input" placeholder="Description..." value={newComp.description} onChange={e => setNewComp({ ...newComp, description: e.target.value })} style={{ flex: 1 }} />
                        <button type="button" className="btn btn-primary" onClick={addCompetence}><Check size={16} /></button>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'diplomes' && (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                      {form.diplomes.map((d, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'var(--gray-50)', borderRadius: 10, border: '1px solid var(--gray-200)' }}>
                          <Award size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>{d.intitule}</div>
                            <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{d.ecole} · {d.annee} · <span className="badge badge-blue" style={{ fontSize: 10 }}>{d.niveau}</span></div>
                          </div>
                          <button type="button" className="btn btn-danger btn-icon btn-sm" onClick={() => setForm(f => ({ ...f, diplomes: f.diplomes.filter((_, j) => j !== i) }))}><X size={12} /></button>
                        </div>
                      ))}
                    </div>
                    <div style={{ background: '#FFF8EB', borderRadius: 12, padding: 16, border: '1px dashed var(--accent)' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)', marginBottom: 12 }}>Ajouter un diplôme</div>
                      <div className="form-row">
                        <div className="form-group" style={{ marginBottom: 10 }}>
                          <input className="form-input" placeholder="Intitulé du diplôme" value={newDiplome.intitule} onChange={e => setNewDiplome({ ...newDiplome, intitule: e.target.value })} />
                        </div>
                        <div className="form-group" style={{ marginBottom: 10 }}>
                          <input className="form-input" placeholder="École / Université" value={newDiplome.ecole} onChange={e => setNewDiplome({ ...newDiplome, ecole: e.target.value })} />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <input className="form-input" placeholder="Année d'obtention" value={newDiplome.annee} onChange={e => setNewDiplome({ ...newDiplome, annee: e.target.value })} />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <select className="form-select" value={newDiplome.niveau} onChange={e => setNewDiplome({ ...newDiplome, niveau: e.target.value })}>
                            <option>Bac+2</option><option>Bac+3</option><option>Bac+4</option><option>Bac+5</option><option>Bac+8</option>
                          </select>
                        </div>
                      </div>
                      <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                        <input className="form-input" placeholder="Spécialité" value={newDiplome.specialite} onChange={e => setNewDiplome({ ...newDiplome, specialite: e.target.value })} style={{ flex: 1 }} />
                        <button type="button" className="btn btn-primary" onClick={addDiplome} style={{ background: 'var(--accent)' }}><Check size={16} /></button>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'certifications' && (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                      {form.certifications.map((c, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'var(--gray-50)', borderRadius: 10, border: '1px solid var(--gray-200)' }}>
                          <BookOpen size={16} style={{ color: 'var(--accent-blue)', flexShrink: 0 }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>{c.intitule}</div>
                            <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{c.code} · {c.type} · {c.domaine}</div>
                          </div>
                          <button type="button" className="btn btn-danger btn-icon btn-sm" onClick={() => setForm(f => ({ ...f, certifications: f.certifications.filter((_, j) => j !== i) }))}><X size={12} /></button>
                        </div>
                      ))}
                    </div>
                    <div style={{ background: '#EBF2FF', borderRadius: 12, padding: 16, border: '1px dashed var(--accent-blue)' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-blue)', marginBottom: 12 }}>Ajouter une certification</div>
                      <div className="form-row">
                        <div className="form-group" style={{ marginBottom: 10 }}>
                          <input className="form-input" placeholder="Code" value={newCert.code} onChange={e => setNewCert({ ...newCert, code: e.target.value })} />
                        </div>
                        <div className="form-group" style={{ marginBottom: 10 }}>
                          <input className="form-input" placeholder="Intitulé" value={newCert.intitule} onChange={e => setNewCert({ ...newCert, intitule: e.target.value })} />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <input className="form-input" placeholder="Type" value={newCert.type} onChange={e => setNewCert({ ...newCert, type: e.target.value })} />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <input className="form-input" placeholder="Domaine" value={newCert.domaine} onChange={e => setNewCert({ ...newCert, domaine: e.target.value })} />
                        </div>
                      </div>
                      <button type="button" className="btn btn-primary" onClick={addCert} style={{ marginTop: 10, background: 'var(--accent-blue)' }}><Plus size={16} /> Ajouter</button>
                    </div>
                  </>
                )}
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
