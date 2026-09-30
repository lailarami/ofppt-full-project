# 🎓 OFPPT – Plateforme de Gestion de la Formation Continue

Application complète de gestion de la formation continue pour l'OFPPT, construite avec une architecture **microservices cloud** sur Node.js/Express, **MongoDB** comme base de données, et **React.js + CSS** pour le frontend.

---

## 🏗️ Architecture

```
ofppt-formation-continue/
├── frontend/                   → React.js (interface utilisateur)
│   ├── src/
│   │   ├── context/            → AuthContext + DataContext
│   │   ├── components/layout/  → AppLayout (sidebar + topbar)
│   │   ├── pages/              → Pages par rôle
│   │   └── styles/             → global.css (design system)
│   └── public/
│
└── backend/                    → Microservices Cloud (Node.js + Express)
    ├── api-gateway/            → Point d'entrée unique (port 5000)
    ├── services/
    │   ├── auth-service/       → Authentification JWT (port 5001)
    │   ├── user-service/       → Gestion utilisateurs & intervenants (port 5002)
    │   ├── formation-service/  → Thèmes & formations (port 5003)
    │   ├── plan-service/       → Plans de formation & affectations (port 5004)
    │   └── notification-service/ → Notifications système (port 5005)
    ├── shared/                 → Middleware commun
    └── docker-compose.yml      → Orchestration des services
```

---

## 🚀 Démarrage rapide

### Prérequis
- Node.js >= 18.x
- Docker & Docker Compose
- MongoDB (via Docker ou Atlas)

### 1. Cloner et installer
```bash
git clone <repo>
cd ofppt-formation-continue
npm run install:all
```

### 2. Configurer l'environnement
Copier `.env.example` dans chaque service et renseigner les variables :
```bash
# backend/services/auth-service/.env
MONGODB_URI=mongodb://localhost:27017/ofppt_auth
JWT_SECRET=ofppt_super_secret_key_2024
PORT=5001

# backend/services/user-service/.env
MONGODB_URI=mongodb://localhost:27017/ofppt_users
JWT_SECRET=ofppt_super_secret_key_2024
PORT=5002

# ... (idem pour les autres services)
```

### 3. Lancer avec Docker Compose
```bash
cd backend
docker-compose up -d
```

### 4. Lancer le frontend
```bash
cd frontend
npm start
```

L'application sera disponible sur **http://localhost:3000**

---

## 👥 Comptes de démonstration

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| Administrateur | admin@ofppt.ma | admin123 |
| Gestionnaire Régional | regional@ofppt.ma | reg123 |
| Gestionnaire Local | local@ofppt.ma | loc123 |
| Entreprise | company@textile.ma | comp123 |
| Intervenant | intervenant@ofppt.ma | int123 |

---

## 🎭 Rôles et fonctionnalités

### 🧑‍💼 Administrateur
- Dashboard global avec statistiques
- Gestion CRUD des utilisateurs
- Gestion CRUD des intervenants (compétences, diplômes, certifications)
- Gestion CRUD des formations/thèmes
- Planification globale et affectation des intervenants
- Consultation des statistiques et rapports

### 🗺️ Gestionnaire Régional
- Dashboard régional
- Consultation des formations disponibles
- Suivi des plans d'entreprises de sa région
- Affectation des intervenants aux formations
- Suivi de l'exécution des formations

### 🏫 Gestionnaire Local
- Dashboard local
- Planning des formations
- Détail des sessions
- Suivi d'exécution et mise à jour de la progression

### 🏭 Entreprise
- Dashboard avec ses formations
- Catalogue des formations disponibles
- Création de plans de formation (wizard 2 étapes)
- Suivi de ses formations en cours
- Historique des formations terminées

### 👨‍🏫 Intervenant
- Dashboard personnel
- Gestion du profil et compétences
- Consultation des offres de formation
- Postulation aux formations
- Suivi de ses missions

---

## 🛠️ Technologies

| Couche | Technologie |
|--------|------------|
| Frontend | React 18, React Router v6, Recharts, CSS Custom |
| Backend | Node.js 18, Express.js, JWT |
| Base de données | MongoDB 7.x avec Mongoose |
| Auth | JSON Web Tokens (JWT) |
| Architecture | Microservices via API Gateway |
| Containerisation | Docker & Docker Compose |
| Communication | REST API (JSON) |

---

## 📡 API Endpoints

### Auth Service (port 5001)
- `POST /api/auth/login` – Connexion
- `POST /api/auth/register` – Inscription
- `GET /api/auth/me` – Profil courant
- `POST /api/auth/logout` – Déconnexion

### User Service (port 5002)
- `GET /api/users` – Liste des utilisateurs
- `POST /api/users` – Créer un utilisateur
- `PUT /api/users/:id` – Modifier un utilisateur
- `DELETE /api/users/:id` – Supprimer un utilisateur
- `GET /api/intervenants` – Liste des intervenants
- `POST /api/intervenants` – Créer un intervenant
- `PUT /api/intervenants/:id` – Modifier un intervenant
- `DELETE /api/intervenants/:id` – Supprimer un intervenant

### Formation Service (port 5003)
- `GET /api/themes` – Liste des thèmes
- `POST /api/themes` – Créer un thème
- `PUT /api/themes/:id` – Modifier un thème
- `DELETE /api/themes/:id` – Supprimer un thème

### Plan Service (port 5004)
- `GET /api/plans` – Liste des plans
- `POST /api/plans` – Créer un plan
- `PUT /api/plans/:id` – Modifier un plan
- `DELETE /api/plans/:id` – Supprimer un plan
- `PATCH /api/plans/:id/affecter` – Affecter un intervenant
- `PATCH /api/plans/:id/status` – Changer le statut

### Notification Service (port 5005)
- `GET /api/notifications` – Liste des notifications
- `PATCH /api/notifications/read-all` – Tout marquer comme lu

---

## 📄 Licence
OFPPT © 2024. Tous droits réservés.
