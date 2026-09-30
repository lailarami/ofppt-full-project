
db = db.getSiblingDB('ofppt_auth');

db.users.insertMany([
  {
    _id: ObjectId("65a000000000000000000001"),
    name: "Mohammed Alami",
    email: "admin@ofppt.ma",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdmszNbKomXzm9W", // admin123
    role: "admin",
    status: "actif",
    dateCreation: new Date("2024-01-01"),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId("65a000000000000000000002"),
    name: "Fatima Benali",
    email: "regional@ofppt.ma",
    password: "$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // reg123
    role: "regional",
    region: "Casablanca-Settat",
    status: "actif",
    dateCreation: new Date("2024-01-05"),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId("65a000000000000000000003"),
    name: "Youssef Tazi",
    email: "local@ofppt.ma",
    password: "$2a$12$TwjFlHzH0bANnBBjZ/wMQOp45wHHGFCN3Gl0JfXXuT5j5xBH7eFva", // loc123
    role: "local",
    region: "Casablanca",
    centre: "ISTA Hay Hassani",
    status: "actif",
    dateCreation: new Date("2024-01-10"),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId("65a000000000000000000004"),
    name: "Textile Maroc SA",
    email: "company@textile.ma",
    password: "$2a$12$QuAl.l5sTHqn/RGjKFTlj.MNHp3BO.Yk5n8LLZwTBG60cXOTCeHG", // comp123
    role: "company",
    raisonSociale: "Textile Maroc SA",
    secteur: "Textile",
    status: "actif",
    dateCreation: new Date("2024-01-15"),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId("65a000000000000000000005"),
    name: "Ahmed Rami",
    email: "intervenant@ofppt.ma",
    password: "$2a$12$eMmJP7TlFblb8sSMNuLYjuVBHX1DUQMbk3yrECqmkS7XwrFGa5NWO", // int123
    role: "intervenant",
    specialite: "Digital & IT",
    status: "actif",
    dateCreation: new Date("2024-01-20"),
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print("✅ Auth users seeded");

db = db.getSiblingDB('ofppt_users');

db.intervenants.insertMany([
  {
    _id: ObjectId("65b000000000000000000001"),
    matricule: "INT-001",
    nom: "Rami",
    prenom: "Ahmed",
    email: "a.rami@ofppt.ma",
    telephone: "0661234567",
    genre: "M",
    dateNaissance: new Date("1985-03-15"),
    affectation: "Casablanca",
    type: "interne",
    diplomes: [{ intitule: "Master Informatique", ecole: "FST Settat", annee: "2008", niveau: "Bac+5", specialite: "Génie Logiciel" }],
    certifications: [{ code: "CERT-001", intitule: "AWS Solutions Architect", type: "Cloud", domaine: "Digital" }],
    competences: [
      { nom: "React.js", niveau: "expert", description: "Développement front-end" },
      { nom: "Node.js", niveau: "expert", description: "Back-end JavaScript" },
      { nom: "MongoDB", niveau: "intermediaire", description: "Base de données NoSQL" }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId("65b000000000000000000002"),
    matricule: "INT-002",
    nom: "Idrissi",
    prenom: "Sara",
    email: "s.idrissi@ofppt.ma",
    telephone: "0662345678",
    genre: "F",
    dateNaissance: new Date("1990-07-22"),
    affectation: "Rabat",
    type: "interne",
    diplomes: [{ intitule: "Licence GC", ecole: "EMI Rabat", annee: "2012", niveau: "Bac+3", specialite: "Génie Civil" }],
    certifications: [],
    competences: [
      { nom: "AutoCAD", niveau: "expert", description: "Dessin technique" },
      { nom: "BIM", niveau: "intermediaire", description: "Modélisation BIM" }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId("65b000000000000000000003"),
    matricule: "INT-003",
    nom: "Moussaoui",
    prenom: "Khalid",
    email: "k.moussaoui@ofppt.ma",
    telephone: "0663456789",
    genre: "M",
    dateNaissance: new Date("1982-11-10"),
    affectation: "Fès",
    type: "externe",
    diplomes: [{ intitule: "Ingénieur Industriel", ecole: "ENSAM Meknès", annee: "2006", niveau: "Bac+5", specialite: "Génie Industriel" }],
    certifications: [{ code: "CERT-002", intitule: "Lean Six Sigma", type: "Management", domaine: "Industriel" }],
    competences: [
      { nom: "Lean Manufacturing", niveau: "expert", description: "Optimisation industrielle" },
      { nom: "Six Sigma", niveau: "expert", description: "Qualité" }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print("✅ Intervenants seeded");

db = db.getSiblingDB('ofppt_formations');

db.themes.insertMany([
  { _id: ObjectId("65c000000000000000000001"), domaine: "Digital", intitule: "Développement Web React.js", nbJours: 5, maxParticipants: 15, description: "Formation complète sur React.js et l'écosystème moderne du développement web.", createdAt: new Date() },
  { _id: ObjectId("65c000000000000000000002"), domaine: "Digital", intitule: "Cybersécurité & Protection des données", nbJours: 3, maxParticipants: 20, description: "Sensibilisation et pratiques de cybersécurité pour les entreprises.", createdAt: new Date() },
  { _id: ObjectId("65c000000000000000000003"), domaine: "Industriel", intitule: "Lean Manufacturing & 5S", nbJours: 4, maxParticipants: 25, description: "Méthodes d'optimisation de la production industrielle.", createdAt: new Date() },
  { _id: ObjectId("65c000000000000000000004"), domaine: "Génie Civil", intitule: "BIM & AutoCAD Avancé", nbJours: 5, maxParticipants: 12, description: "Modélisation des bâtiments avec les outils BIM et AutoCAD.", createdAt: new Date() },
  { _id: ObjectId("65c000000000000000000005"), domaine: "Management", intitule: "Leadership & Management d'équipe", nbJours: 2, maxParticipants: 20, description: "Développement des compétences managériales.", createdAt: new Date() },
  { _id: ObjectId("65c000000000000000000006"), domaine: "Digital", intitule: "Cloud Computing & DevOps", nbJours: 5, maxParticipants: 15, description: "Infrastructure Cloud AWS/Azure et pratiques DevOps.", createdAt: new Date() },
  { _id: ObjectId("65c000000000000000000007"), domaine: "Industriel", intitule: "Maintenance Industrielle Préventive", nbJours: 3, maxParticipants: 20, description: "Techniques de maintenance pour équipements industriels.", createdAt: new Date() },
  { _id: ObjectId("65c000000000000000000008"), domaine: "Management", intitule: "Gestion de Projet Agile", nbJours: 3, maxParticipants: 20, description: "Méthodes agiles Scrum et Kanban pour la gestion de projets.", createdAt: new Date() }
]);

print("✅ Themes seeded");

db = db.getSiblingDB('ofppt_plans');

db.plans.insertMany([
  { entrepriseId: "65a000000000000000000004", entreprise: "Textile Maroc SA", themeId: "65c000000000000000000001", theme: "Développement Web React.js", groupes: 2, dateDebut: "2024-02-15", statut: "en_cours", intervenantId: "65b000000000000000000001", intervenant: "Ahmed Rami", region: "Casablanca-Settat", progression: 65, createdAt: new Date() },
  { entrepriseId: "65a000000000000000000004", entreprise: "Textile Maroc SA", themeId: "65c000000000000000000005", theme: "Leadership & Management d'équipe", groupes: 1, dateDebut: "2024-03-01", statut: "planifie", intervenantId: null, intervenant: null, region: "Casablanca-Settat", progression: 0, createdAt: new Date() },
  { entrepriseId: "65a000000000000000000004", entreprise: "Auto Nejma", themeId: "65c000000000000000000003", theme: "Lean Manufacturing & 5S", groupes: 3, dateDebut: "2024-01-20", statut: "termine", intervenantId: "65b000000000000000000003", intervenant: "Khalid Moussaoui", region: "Casablanca-Settat", progression: 100, createdAt: new Date() },
  { entrepriseId: "65a000000000000000000004", entreprise: "BTP Constructions", themeId: "65c000000000000000000004", theme: "BIM & AutoCAD Avancé", groupes: 1, dateDebut: "2024-02-28", statut: "en_cours", intervenantId: "65b000000000000000000002", intervenant: "Sara Idrissi", region: "Casablanca-Settat", progression: 40, createdAt: new Date() }
]);

print("✅ Plans seeded");

db = db.getSiblingDB('ofppt_notifications');

db.notifications.insertMany([
  { type: "formation", titre: "Nouvelle offre de formation", message: "L'offre de formation 2024 est maintenant disponible", date: "2024-01-15", destinataires: ["company", "intervenant"], lu: false, createdAt: new Date() },
  { type: "affectation", titre: "Affectation confirmée", message: "Vous avez été affecté à la formation React.js", date: "2024-01-20", destinataires: ["intervenant"], lu: true, createdAt: new Date() },
  { type: "validation", titre: "Plan validé", message: "Votre plan de formation a été approuvé par l'administration", date: "2024-01-22", destinataires: ["company"], lu: false, createdAt: new Date() },
  { type: "info", titre: "Rappel de session", message: "La formation Lean Manufacturing commence demain", date: "2024-01-19", destinataires: ["all"], lu: false, createdAt: new Date() }
]);

print("✅ Notifications seeded");
print("🎉 OFPPT Database initialization complete!");
