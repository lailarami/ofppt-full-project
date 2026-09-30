import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI, usersAPI, intervenantsAPI, themesAPI, plansAPI, notificationsAPI, postulationsAPI } from '../services/apiService';

const DataContext = createContext(null);

const initialData = {
  intervenants: [
    { id: '1', matricule: 'INT-001', nom: 'Ahmed', prenom: 'Rami', email: 'a.rami@ofppt.ma', telephone: '0661234567', genre: 'M', dateNaissance: '1985-03-15', affectation: 'Casablanca', type: 'interne', diplomes: [{ intitule: 'Master Informatique', ecole: 'FST Settat', annee: '2008', niveau: 'Bac+5', specialite: 'Génie Logiciel' }], certifications: [{ code: 'CERT-001', intitule: 'AWS Solutions Architect', type: 'Cloud', domaine: 'Digital' }], competences: [{ nom: 'React.js', niveau: 'expert', description: 'Développement front-end' }, { nom: 'Node.js', niveau: 'expert', description: 'Back-end JavaScript' }, { nom: 'MongoDB', niveau: 'intermediaire', description: 'Base de données NoSQL' }] },
    { id: '2', matricule: 'INT-002', nom: 'Sara', prenom: 'Idrissi', email: 's.idrissi@ofppt.ma', telephone: '0662345678', genre: 'F', dateNaissance: '1990-07-22', affectation: 'Rabat', type: 'interne', diplomes: [{ intitule: 'Licence GC', ecole: 'EMI Rabat', annee: '2012', niveau: 'Bac+3', specialite: 'Génie Civil' }], certifications: [], competences: [{ nom: 'AutoCAD', niveau: 'expert', description: 'Dessin technique' }, { nom: 'BIM', niveau: 'intermediaire', description: 'Modélisation BIM' }] },
    { id: '3', matricule: 'INT-003', nom: 'Khalid', prenom: 'Moussaoui', email: 'k.moussaoui@ofppt.ma', telephone: '0663456789', genre: 'M', dateNaissance: '1982-11-10', affectation: 'Fès', type: 'externe', diplomes: [{ intitule: 'Ingénieur Industriel', ecole: 'ENSAM Meknès', annee: '2006', niveau: 'Bac+5', specialite: 'Génie Industriel' }], certifications: [{ code: 'CERT-002', intitule: 'Lean Six Sigma', type: 'Management', domaine: 'Industriel' }], competences: [{ nom: 'Lean Manufacturing', niveau: 'expert', description: 'Optimisation industrielle' }, { nom: 'Six Sigma', niveau: 'expert', description: 'Qualité' }] },
    { id: '4', matricule: 'INT-004', nom: 'Nadia', prenom: 'Berrada', email: 'n.berrada@ofppt.ma', telephone: '0664567890', genre: 'F', dateNaissance: '1988-05-30', affectation: 'Marrakech', type: 'interne', diplomes: [{ intitule: 'DUT Comptabilité', ecole: 'EST Marrakech', annee: '2009', niveau: 'Bac+2', specialite: 'Comptabilité' }], certifications: [], competences: [{ nom: 'Excel Avancé', niveau: 'expert', description: 'Tableaux de bord' }, { nom: 'Power BI', niveau: 'intermediaire', description: 'Data visualisation' }] },
  ],

  themes: [
    { id: '1', domaine: 'Digital', intitule: 'Développement Web React.js', nbJours: 5, maxParticipants: 15, description: 'Formation complète sur React.js et l\'écosystème moderne du développement web.' },
    { id: '2', domaine: 'Digital', intitule: 'Cybersécurité & Protection des données', nbJours: 3, maxParticipants: 20, description: 'Sensibilisation et pratiques de cybersécurité pour les entreprises.' },
    { id: '3', domaine: 'Industriel', intitule: 'Lean Manufacturing & 5S', nbJours: 4, maxParticipants: 25, description: 'Méthodes d\'optimisation de la production industrielle.' },
    { id: '4', domaine: 'Génie Civil', intitule: 'BIM & AutoCAD Avancé', nbJours: 5, maxParticipants: 12, description: 'Modélisation des bâtiments avec les outils BIM et AutoCAD.' },
    { id: '5', domaine: 'Management', intitule: 'Leadership & Management d\'équipe', nbJours: 2, maxParticipants: 20, description: 'Développement des compétences managériales.' },
    { id: '6', domaine: 'Digital', intitule: 'Cloud Computing & DevOps', nbJours: 5, maxParticipants: 15, description: 'Infrastructure Cloud AWS/Azure et pratiques DevOps.' },
    { id: '7', domaine: 'Industriel', intitule: 'Maintenance Industrielle Préventive', nbJours: 3, maxParticipants: 20, description: 'Techniques de maintenance pour équipements industriels.' },
    { id: '8', domaine: 'Management', intitule: 'Gestion de Projet Agile', nbJours: 3, maxParticipants: 20, description: 'Méthodes agiles Scrum et Kanban pour la gestion de projets.' },
  ],

  plans: [
    { id: '1', entrepriseId: '4', entreprise: 'Textile Maroc SA', themeId: '1', theme: 'Développement Web React.js', groupes: 2, dateDebut: '2024-02-15', statut: 'en_cours', intervenantId: '1', intervenant: 'Ahmed Rami', region: 'Casablanca-Settat', progression: 65 },
    { id: '2', entrepriseId: '4', entreprise: 'Textile Maroc SA', themeId: '5', theme: 'Leadership & Management d\'équipe', groupes: 1, dateDebut: '2024-03-01', statut: 'planifie', intervenantId: null, intervenant: null, region: 'Casablanca-Settat', progression: 0 },
    { id: '3', entrepriseId: '5', entreprise: 'Auto Nejma', themeId: '3', theme: 'Lean Manufacturing & 5S', groupes: 3, dateDebut: '2024-01-20', statut: 'termine', intervenantId: '3', intervenant: 'Khalid Moussaoui', region: 'Casablanca-Settat', progression: 100 },
    { id: '4', entrepriseId: '6', entreprise: 'Pharma Maghreb', themeId: '2', theme: 'Cybersécurité & Protection des données', groupes: 2, dateDebut: '2024-04-10', statut: 'planifie', intervenantId: null, intervenant: null, region: 'Rabat-Salé-Kénitra', progression: 0 },
    { id: '5', entrepriseId: '7', entreprise: 'BTP Constructions', themeId: '4', theme: 'BIM & AutoCAD Avancé', groupes: 1, dateDebut: '2024-02-28', statut: 'en_cours', intervenantId: '2', intervenant: 'Sara Idrissi', region: 'Casablanca-Settat', progression: 40 },
  ],

  users: [
    { id: '1', name: 'Mohammed Alami', email: 'admin@ofppt.ma', role: 'admin', status: 'actif', dateCreation: '2024-01-01' },
    { id: '2', name: 'Fatima Benali', email: 'regional@ofppt.ma', role: 'regional', status: 'actif', region: 'Casablanca-Settat', dateCreation: '2024-01-05' },
    { id: '3', name: 'Youssef Tazi', email: 'local@ofppt.ma', role: 'local', status: 'actif', region: 'Casablanca', centre: 'ISTA Hay Hassani', dateCreation: '2024-01-10' },
    { id: '4', name: 'Textile Maroc SA', email: 'company@textile.ma', role: 'company', status: 'actif', dateCreation: '2024-01-15' },
    { id: '5', name: 'Ahmed Rami', email: 'intervenant@ofppt.ma', role: 'intervenant', status: 'actif', dateCreation: '2024-01-20' },
  ],

  notifications: [
    { id: '1', type: 'nouvelle_offre', titre: 'Nouvelle offre de formation', message: 'L\'offre de formation 2024 est maintenant disponible', date: '2024-01-15', destinataires: ['company', 'intervenant'], lu: false },
    { id: '2', type: 'affectation', titre: 'Affectation confirmée', message: 'Vous avez été affecté à la formation React.js', date: '2024-01-20', destinataires: ['intervenant'], lu: true },
    { id: '3', type: 'validation', titre: 'Plan validé', message: 'Votre plan de formation a été approuvé', date: '2024-01-22', destinataires: ['company'], lu: false },
  ],

  postulations: [
    { id: '1', intervenantId: '1', themeId: '1', statut: 'accepte', date: '2024-01-18' },
    { id: '2', intervenantId: '3', themeId: '3', statut: 'accepte', date: '2024-01-15' },
    { id: '3', intervenantId: '2', themeId: '4', statut: 'en_attente', date: '2024-01-25' },
  ],
};

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(initialData);
  const [toast, setToast] = useState(null);
  const [postulationNotification, setPostulationNotification] = useState('');

  // Load users, intervenants, themes, plans, notifications from backend API on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersRes, intervenantsRes, themesRes, plansRes, notificationsRes, postulationsRes] = await Promise.all([
          usersAPI.getAll(),
          intervenantsAPI.getAll(),
          themesAPI.getAll(),
          plansAPI.getAll(),
          notificationsAPI.getAll(),
          postulationsAPI.getAll()
        ]);
        
        if (usersRes.success && usersRes.data) {
          setData(prev => ({ ...prev, users: usersRes.data.map(u => ({ ...u, id: u._id || u.id })) }));
        }
        if (intervenantsRes.success && intervenantsRes.data) {
          setData(prev => ({ ...prev, intervenants: intervenantsRes.data.map(i => ({ ...i, id: i._id || i.id })) }));
        }
        if (themesRes.success && themesRes.data) {
          setData(prev => ({ ...prev, themes: themesRes.data.map(t => ({ ...t, id: t._id || t.id })) }));
        }
        if (plansRes.success && plansRes.data) {
          setData(prev => ({ ...prev, plans: plansRes.data.map(p => ({ ...p, id: p._id || p.id })) }));
        }
        if (notificationsRes.success && notificationsRes.data) {
          setData(prev => ({ ...prev, notifications: notificationsRes.data.map(n => ({ ...n, id: n._id || n.id })) }));
        }
        if (postulationsRes.success && postulationsRes.data) {
          setData(prev => ({ ...prev, postulations: postulationsRes.data.map(p => ({ ...p, id: p._id || p.id })) }));
        }
      } catch (error) {
        console.warn('Failed to load data from API:', error);
        // Keep using local data if API fails
      }
    };
    loadData();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Refresh functions – reload data from API
  const refreshUsers = useCallback(async () => {
    try {
      const res = await usersAPI.getAll();
      if (res.success && res.data) {
        setData(prev => ({ ...prev, users: res.data.map(u => ({ ...u, id: u._id || u.id })) }));
      }
    } catch (error) {
      console.warn('Failed to refresh users:', error);
    }
  }, []);

  const refreshIntervenants = useCallback(async () => {
    try {
      const res = await intervenantsAPI.getAll();
      if (res.success && res.data) {
        setData(prev => ({ ...prev, intervenants: res.data.map(i => ({ ...i, id: i._id || i.id })) }));
      }
    } catch (error) {
      console.warn('Failed to refresh intervenants:', error);
    }
  }, []);

  const refreshThemes = useCallback(async () => {
    try {
      const res = await themesAPI.getAll();
      if (res.success && res.data) {
        setData(prev => ({ ...prev, themes: res.data.map(t => ({ ...t, id: t._id || t.id })) }));
      }
    } catch (error) {
      console.warn('Failed to refresh themes:', error);
    }
  }, []);

  const refreshPlans = useCallback(async () => {
    try {
      const res = await plansAPI.getAll();
      if (res.success && res.data) {
        setData(prev => ({ ...prev, plans: res.data.map(p => ({ ...p, id: p._id || p.id })) }));
      }
    } catch (error) {
      console.warn('Failed to refresh plans:', error);
    }
  }, []);

  const refreshNotifications = async () => {
    try {
      const res = await notificationsAPI.getAll();
      if (res.success && res.data) {
        setData(prev => ({ ...prev, notifications: res.data.map(n => ({ ...n, id: n._id || n.id })) }));
      }
    } catch (error) {
      console.warn('Failed to refresh notifications:', error);
    }
  };

  const refreshPostulations = async () => {
    try {
      const res = await postulationsAPI.getAll();
      if (res.success && res.data) {
        setData(prev => ({ ...prev, postulations: res.data }));
      }
    } catch (error) {
      console.warn('Failed to refresh postulations:', error);
    }
  };

  useEffect(() => {
    const handleUserRegistered = () => {
      refreshUsers();
      refreshIntervenants();
      refreshPlans();
    };
    window.addEventListener('user-registered', handleUserRegistered);
    return () => window.removeEventListener('user-registered', handleUserRegistered);
  }, []);

  // INTERVENANTS CRUD
  const addIntervenant = async (intervenant) => {
    if (!intervenant.password) {
      showToast('Le mot de passe est requis pour créer un intervenant.', 'error');
      return;
    }

    const newItem = {
      ...intervenant,
      id: Date.now().toString(),
      competences: intervenant.competences || [],
      diplomes: intervenant.diplomes || [],
      certifications: intervenant.certifications || []
    };

    const userPayload = {
      name: `${intervenant.prenom} ${intervenant.nom}`,
      email: intervenant.email,
      password: intervenant.password,
      role: 'intervenant',
      status: 'actif'
    };

    const intervenantPayload = {
      nom: intervenant.nom,
      prenom: intervenant.prenom,
      email: intervenant.email,
      telephone: intervenant.telephone || '',
      dateNaissance: intervenant.dateNaissance || null,
      genre: intervenant.genre || 'M',
      affectation: intervenant.affectation || intervenant.region || '',
      type: intervenant.type || 'externe',
      competences: intervenant.competences || [],
      diplomes: intervenant.diplomes || [],
      certifications: intervenant.certifications || []
    };

    try {
      await authAPI.register(userPayload);
    } catch (err) {
      console.error('Failed to create intervenant in auth-service:', err);
      if (err.status === 409 || err.message?.toLowerCase().includes('déjà')) {
        await refreshUsers();
        await refreshIntervenants();
        showToast('Compte intervenant déjà existant, rafraîchissement des listes.', 'warning');
        return;
      }
      showToast(`Erreur auth: ${err.message || 'Impossible de créer le compte'}`, 'error');
      return;
    }

    try {
      await intervenantsAPI.create(intervenantPayload);
    } catch (err) {
      console.error('Failed to create intervenant in user-service:', err);
      if (err.status === 409 || err.message?.toLowerCase().includes('déjà')) {
        await refreshUsers();
        await refreshIntervenants();
        showToast('Intervenant déjà existant, rafraîchissement des listes.', 'warning');
        return;
      }
      showToast(`Erreur intervenants: ${err.message || 'Impossible d’enregistrer l’intervenant'}`, 'error');
      return;
    }

    try {
      await usersAPI.create({
        name: userPayload.name,
        email: userPayload.email,
        role: userPayload.role,
        status: userPayload.status,
        region: intervenant.affectation || intervenant.region || ''
      });
    } catch (err) {
      console.error('Failed to create user record for intervenant in user-service:', err);
      showToast(`Erreur users: ${err.message || 'Impossible d’enregistrer le profil utilisateur'}`, 'error');
      // continue: intervenant créé en tant que profil
    }

    setData(prev => ({ ...prev, intervenants: [...prev.intervenants, newItem] }));
    refreshIntervenants();
    refreshUsers();

    showToast('Intervenant ajouté avec succès');
    return newItem;
  };

  const updateIntervenant = (id, updates) => {
    setData(prev => ({ ...prev, intervenants: prev.intervenants.map(i => i.id === id ? { ...i, ...updates } : i) }));
    
    // Sync with backend and refresh
    try {
      intervenantsAPI.update(id, updates).then(() => {
        refreshIntervenants();
      }).catch(err => {
        console.warn('Failed to update intervenant on backend:', err);
        refreshIntervenants();
      });
    } catch (err) {
      console.warn('Failed to update intervenant on backend:', err);
    }
    
    showToast('Intervenant mis à jour');
  };

  const deleteIntervenant = (id) => {
    setData(prev => ({ ...prev, intervenants: prev.intervenants.filter(i => i.id !== id) }));
    
    // Sync with backend and refresh
    try {
      intervenantsAPI.delete(id).then(() => {
        refreshIntervenants();
      }).catch(err => {
        console.warn('Failed to delete intervenant from backend:', err);
        refreshIntervenants();
      });
    } catch (err) {
      console.warn('Failed to delete intervenant from backend:', err);
    }
    
    showToast('Intervenant supprimé', 'error');
  };

  // THEMES CRUD
  const addTheme = (theme) => {
    const newItem = { ...theme, id: Date.now().toString() };
    setData(prev => ({ ...prev, themes: [...prev.themes, newItem] }));
    
    // Sync with backend and refresh
    try {
      themesAPI.create(newItem).then(() => {
        refreshThemes();
      }).catch(err => {
        console.warn('Failed to save theme to backend:', err);
        refreshThemes();
      });
    } catch (err) {
      console.warn('Failed to save theme to backend:', err);
    }
    
    showToast('Thème de formation ajouté');
    return newItem;
  };

  const updateTheme = (id, updates) => {
    setData(prev => ({ ...prev, themes: prev.themes.map(t => t.id === id ? { ...t, ...updates } : t) }));
    
    // Sync with backend and refresh
    try {
      themesAPI.update(id, updates).then(() => {
        refreshThemes();
      }).catch(err => {
        console.warn('Failed to update theme on backend:', err);
        refreshThemes();
      });
    } catch (err) {
      console.warn('Failed to update theme on backend:', err);
    }
    
    showToast('Thème mis à jour');
  };

  const deleteTheme = (id) => {
    setData(prev => ({ ...prev, themes: prev.themes.filter(t => t.id !== id) }));
    
    // Sync with backend and refresh
    try {
      themesAPI.delete(id).then(() => {
        refreshThemes();
      }).catch(err => {
        console.warn('Failed to delete theme from backend:', err);
        refreshThemes();
      });
    } catch (err) {
      console.warn('Failed to delete theme from backend:', err);
    }
    
    showToast('Thème supprimé', 'error');
  };

  // PLANS CRUD
  const addPlan = async (plan) => {
    const newItem = { ...plan, id: Date.now().toString(), statut: plan.statut || 'planifie', progression: plan.progression || 0 };
    setData(prev => ({ ...prev, plans: [...prev.plans, newItem] }));

    try {
      await plansAPI.create(newItem);
      await refreshPlans();
      showToast('Plan de formation créé avec succès');
      return newItem;
    } catch (err) {
      console.error('Failed to save plan to backend:', err);
      showToast(`Erreur planification: ${err.message || 'Impossible d’enregistrer le plan'}`, 'error');
      await refreshPlans();
      return null;
    }
  };

  const updatePlan = (id, updates) => {
    setData(prev => ({ ...prev, plans: prev.plans.map(p => p.id === id ? { ...p, ...updates } : p) }));
    
    // Sync with backend and refresh
    try {
      plansAPI.update(id, updates).then(() => {
        refreshPlans();
      }).catch(err => {
        console.warn('Failed to update plan on backend:', err);
        refreshPlans();
      });
    } catch (err) {
      console.warn('Failed to update plan on backend:', err);
    }
    
    showToast('Plan mis à jour');
  };

  const deletePlan = (id) => {
    setData(prev => ({ ...prev, plans: prev.plans.filter(p => p.id !== id) }));
    
    // Sync with backend and refresh
    try {
      plansAPI.delete(id).then(() => {
        refreshPlans();
      }).catch(err => {
        console.warn('Failed to delete plan from backend:', err);
        refreshPlans();
      });
    } catch (err) {
      console.warn('Failed to delete plan from backend:', err);
    }
    
    showToast('Plan annulé', 'warning');
  };

  const affecterIntervenant = (planId, intervenantId) => {
    const intervenant = data.intervenants.find(i => i.id === intervenantId);
    if (intervenant) {
      updatePlan(planId, { intervenantId, intervenant: `${intervenant.prenom} ${intervenant.nom}` });
      showToast(`${intervenant.prenom} ${intervenant.nom} affecté avec succès`);
    }
  };

  // USERS CRUD
  const addUser = async (user) => {
    if (!user.password) {
      showToast('Mot de passe requis pour créer un utilisateur.', 'error');
      return;
    }

    const newUser = { ...user, id: Date.now().toString(), status: user.status || 'actif', dateCreation: new Date().toISOString().split('T')[0] };

    const createIntervenantProfile = async (userData) => {
      if (userData.role !== 'intervenant') return;
      const [prenom, ...rest] = (userData.name || '').trim().split(' ');
      const nom = rest.join(' ') || userData.name;
      const intervenantPayload = {
        nom: nom || 'Intervenant',
        prenom: prenom || 'Inconnu',
        email: userData.email,
        telephone: userData.telephone || '',
        dateNaissance: null,
        genre: 'M',
        affectation: '',
        type: 'interne',
        competences: [],
        diplomes: [],
        certifications: []
      };
      try {
        await intervenantsAPI.create(intervenantPayload);
        refreshIntervenants();
      } catch (err) {
        console.warn('Failed to create intervenant profile for new user:', err);
        refreshIntervenants();
      }
    };

    try {
      await authAPI.register(user);
    } catch (err) {
      console.error('Failed to save user to auth-service:', err);
      if (err.status === 409 || err.message?.toLowerCase().includes('déjà')) {
        await refreshUsers();
        if (user.role === 'intervenant') await refreshIntervenants();
        showToast('Compte déjà existant, données rafraîchies.', 'warning');
        return;
      }
      showToast(`Erreur auth: ${err.message || 'Impossible de créer le compte'}`, 'error');
      return;
    }

    let createdUser = { ...newUser };
    try {
      const res = await usersAPI.create(newUser);
      if (res && res.success && res.data) {
        createdUser = { ...res.data, id: res.data._id || res.data.id || newUser.id };
      }
    } catch (err) {
      console.error('Failed to save user to user-service:', err);
      if (err.status === 409 || err.message?.toLowerCase().includes('déjà')) {
        await refreshUsers();
        if (user.role === 'intervenant') await refreshIntervenants();
        showToast('Utilisateur déjà existant, données rafraîchies.', 'warning');
        return;
      }
      showToast(`Erreur user-service: ${err.message || 'Impossible d’enregistrer l’utilisateur'}`, 'error');
      return;
    }

    if (user.role === 'intervenant') {
      await createIntervenantProfile(user);
    }

    setData(prev => ({ ...prev, users: [...prev.users, createdUser] }));
    refreshUsers();
    if (user.role === 'intervenant') refreshIntervenants();

    showToast('Utilisateur créé avec succès');
    window.dispatchEvent(new Event('user-registered'));
  };

  const updateUser = (id, updates) => {
    setData(prev => ({ ...prev, users: prev.users.map(u => u.id === id ? { ...u, ...updates } : u) }));
    
    // Sync with backend and refresh
    try {
      usersAPI.update(id, updates).then(() => {
        refreshUsers();
      }).catch(err => {
        console.warn('Failed to update user on backend:', err);
        refreshUsers();
      });
    } catch (err) {
      console.warn('Failed to update user on backend:', err);
    }
    
    showToast('Utilisateur mis à jour');
  };

  const deleteUser = (id) => {
    setData(prev => ({ ...prev, users: prev.users.filter(u => u.id !== id) }));
    
    // Sync with backend and refresh
    try {
      usersAPI.delete(id).then(() => {
        refreshUsers();
      }).catch(err => {
        console.warn('Failed to delete user from backend:', err);
        refreshUsers();
      });
    } catch (err) {
      console.warn('Failed to delete user from backend:', err);
    }
    
    showToast('Utilisateur supprimé', 'error');
  };

  // POSTULATIONS
  const postuler = (intervenantId, themeId) => {
    const existing = data.postulations.find(p => p.intervenantId === intervenantId && p.themeId === themeId);
    if (existing) { 
      showToast('Vous avez déjà postulé à cette formation', 'warning'); 
      return; 
    }
    
    // Update local state immediately
    const newPost = { id: Date.now().toString(), intervenantId, themeId, statut: 'en_attente', date: new Date().toISOString().split('T')[0] };
    setData(prev => ({ ...prev, postulations: [...prev.postulations, newPost] }));
    setPostulationNotification('Postulation envoyée !');
    setTimeout(() => setPostulationNotification(''), 5000);
    showToast('Postulation envoyée avec succès');
    
    // Sync with backend and refresh
    try {
      postulationsAPI.create({ intervenantId, themeId }).then(() => {
        refreshPostulations();
      }).catch(err => {
        console.warn('Failed to save postulation to backend:', err);
        refreshPostulations();
      });
    } catch (err) {
      console.warn('Failed to save postulation to backend:', err);
    }
  };

  const updatePostulation = (id, statut) => {
    // Update local state immediately
    setData(prev => ({ ...prev, postulations: prev.postulations.map(p => p.id === id ? { ...p, statut } : p) }));
    showToast(statut === 'acceptee' ? 'Postulation acceptée' : 'Postulation refusée', statut === 'acceptee' ? 'success' : 'error');
    
    // Sync with backend and refresh
    try {
      postulationsAPI.updateStatus(id, statut).then(() => {
        refreshPostulations();
      }).catch(err => {
        console.warn('Failed to update postulation on backend:', err);
        refreshPostulations();
      });
    } catch (err) {
      console.warn('Failed to update postulation on backend:', err);
    }
  };

  const updateStatus = (planId, statut) => {
    // Update local state immediately
    setData(prev => ({ ...prev, plans: prev.plans.map(p => p.id === planId ? { ...p, statut, progression: statut === 'termine' ? 100 : p.progression } : p) }));

    // Sync with backend
    try {
      plansAPI.updateStatus(planId, statut).then(() => {
        refreshPlans();
      }).catch(err => {
        console.warn('Failed to update plan status on backend:', err);
        refreshPlans();
      });
    } catch (err) {
      console.warn('Failed to update plan status on backend:', err);
    }
  };

  const updateProgression = (planId, progression) => {
    // Update local state immediately
    setData(prev => ({ ...prev, plans: prev.plans.map(p => p.id === planId ? { ...p, progression } : p) }));

    // Sync with backend
    try {
      plansAPI.update(planId, { progression }).then(() => {
        refreshPlans();
      }).catch(err => {
        console.warn('Failed to update plan progression on backend:', err);
        refreshPlans();
      });
    } catch (err) {
      console.warn('Failed to update plan progression on backend:', err);
    }
  };

  const markAllRead = () => {
    setData(prev => ({ ...prev, notifications: prev.notifications.map(n => ({ ...n, lu: true })) }));
    
    // Sync with backend and refresh
    try {
      notificationsAPI.markAllRead().then(() => {
        refreshNotifications();
      }).catch(err => {
        console.warn('Failed to mark all notifications as read on backend:', err);
        refreshNotifications();
      });
    } catch (err) {
      console.warn('Failed to mark all notifications as read on backend:', err);
    }
    
    showToast('Toutes les notifications marquées comme lues', 'success');
  };

  const markNotifRead = (notifId) => {
    setData(prev => ({ ...prev, notifications: prev.notifications.map(n => n.id === notifId ? { ...n, lu: true } : n) }));
    
    // Sync with backend and refresh
    try {
      notificationsAPI.markRead(notifId).then(() => {
        refreshNotifications();
      }).catch(err => {
        console.warn('Failed to mark notification as read on backend:', err);
        refreshNotifications();
      });
    } catch (err) {
      console.warn('Failed to mark notification as read on backend:', err);
    }
  };

  const addToast = (message, type = 'success') => showToast(message, type);

  const stats = {
    totalIntervenants: data.intervenants.length,
    totalThemes: data.themes.length,
    totalPlans: data.plans.length,
    totalUsers: data.users.length,
    plansEnCours: data.plans.filter(p => p.statut === 'en_cours').length,
    plansPlanifies: data.plans.filter(p => p.statut === 'planifie').length,
    plansTermines: data.plans.filter(p => p.statut === 'termine').length,
  };

  return (
    <DataContext.Provider value={{
      ...data, stats, toast, postulationNotification,
      addIntervenant, updateIntervenant, deleteIntervenant,
      addTheme, updateTheme, deleteTheme,
      addPlan, updatePlan, deletePlan, affecterIntervenant,
      addUser, updateUser, deleteUser,
      postuler, updatePostulation,
      updateStatus, updateProgression, markAllRead, markNotifRead,
      addToast, showToast,
      refreshIntervenants, refreshThemes, refreshPlans, refreshUsers, refreshNotifications, refreshPostulations
    }}>
      {children}
      {toast && (
        <div className={`toast ${toast.type}`}>
          <span>{toast.type === 'success' ? '✓' : toast.type === 'error' ? '✗' : '!'}</span>
          {toast.message}
        </div>
      )}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};
