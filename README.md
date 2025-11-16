# Miscadin - Boutique de Prêt-à-porter Homme

Application web moderne et futuriste pour la vente de prêt-à-porter, chaussures et accessoires pour hommes.

## 🚀 Fonctionnalités

### Interface Utilisateur
- ✅ Navigation libre sans connexion
- ✅ Consultation des produits et catégories
- ✅ Détails des produits avec sélection de taille et couleur
- ✅ Panier d'achat
- ✅ Connexion/Inscription obligatoire pour passer commande
- ✅ Design moderne inspiré de jules.com

### Interface Admin
- ✅ Tableau de bord avec statistiques
- ✅ Gestion des produits (création, modification, suppression)
- ✅ Gestion des catégories
- ✅ Gestion du stock
- ✅ Système de messages/chat avec les clients

## 🛠️ Technologies

### Frontend
- **React 18** avec TypeScript
- **Vite** - Build tool moderne
- **React Router** - Navigation
- **Zustand** - Gestion d'état
- **Tailwind CSS** - Styling
- **Lucide React** - Icônes
- **React Hot Toast** - Notifications
- **Framer Motion** - Animations
- **Axios** - Client HTTP

### Backend
- **Python 3.11** avec Flask
- **SQLAlchemy** - ORM
- **MySQL 8.0** (via Docker) - Base de données
- **PyJWT** - Authentification JWT
- **Docker Compose** - Orchestration

## 📦 Installation

### Prérequis
- Node.js 18+
- Python 3.11+
- Docker et Docker Compose

### 1. Configuration

Créez un fichier `.env` à la racine du projet (copiez `env.example`) :

```env
# Database Configuration (Docker MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=miscadin

# Flask Configuration
SECRET_KEY=dev-secret-key-change-in-production
JWT_SECRET_KEY=jwt-secret-key-change-in-production

# CORS Configuration
CORS_ORIGINS=http://localhost:5173
```

### 2. Installation des dépendances

#### Frontend
```bash
npm install
```

#### Backend
```bash
pip install -r requirements.txt
```

### 3. Démarrage avec Docker Compose

#### Option A : Tout démarrer en une fois (recommandé)

```bash
# Démarrer MySQL et initialiser la base de données
docker compose up -d mysql

# Attendre quelques secondes que MySQL soit prêt, puis initialiser
python -m backend.init_db

# Démarrer le backend (vous pouvez aussi utiliser Docker)
python backend/run.py
```

#### Option B : Utiliser Docker pour le backend aussi

```bash
# Démarrer MySQL
docker compose up -d mysql

# Attendre que MySQL soit prêt, puis initialiser
python -m backend.init_db

# Démarrer le backend avec Docker
docker compose up backend
```

### 4. Initialisation de la base de données

Après avoir démarré MySQL, initialisez la base de données :

```bash
python -m backend.init_db
```

Ce script va :
- Créer toutes les tables nécessaires
- Créer les utilisateurs de démonstration (admin et user)
- Créer les catégories et produits de démonstration

### 5. Démarrage du backend

Si vous n'utilisez pas Docker pour le backend :

```bash
python backend/run.py
```

Le backend sera accessible sur [http://localhost:5000](http://localhost:5000)

### 6. Démarrage du frontend

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:5173](http://localhost:5173)

## 🔐 Comptes de démonstration

Après l'initialisation de la base de données, vous pouvez vous connecter avec :

### Admin
- Email: `admin@miscadin.com`
- Mot de passe: `admin123`

### Utilisateur
- Email: `user@example.com`
- Mot de passe: `user123`

## 📁 Structure du projet

```
miscadin/
├── backend/
│   ├── models/          # Modèles SQLAlchemy
│   ├── routes/          # Routes API
│   ├── config.py        # Configuration
│   ├── app.py           # Application Flask
│   └── init_db.py       # Initialisation BD
├── src/
│   ├── components/      # Composants React
│   ├── pages/           # Pages
│   ├── store/           # Stores Zustand
│   ├── types/           # Types TypeScript
│   ├── utils/           # Utilitaires (API client)
│   └── styles/          # Styles CSS
├── backend/
│   └── create_database.sql  # Script SQL pour créer la BD
├── docker-compose.yml   # Configuration Docker (optionnel)
├── Dockerfile.backend   # Image Docker backend (optionnel)
├── requirements.txt     # Dépendances Python
└── package.json         # Dépendances Node.js
```

## 🔌 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Utilisateur actuel

### Produits
- `GET /api/products` - Liste des produits
- `GET /api/products/:id` - Détails d'un produit
- `POST /api/products` - Créer un produit (admin)
- `PUT /api/products/:id` - Modifier un produit (admin)
- `DELETE /api/products/:id` - Supprimer un produit (admin)

### Catégories
- `GET /api/categories` - Liste des catégories
- `GET /api/categories/:id` - Détails d'une catégorie
- `POST /api/categories` - Créer une catégorie (admin)
- `PUT /api/categories/:id` - Modifier une catégorie (admin)
- `DELETE /api/categories/:id` - Supprimer une catégorie (admin)

### Commandes
- `GET /api/orders` - Liste des commandes
- `GET /api/orders/:id` - Détails d'une commande
- `POST /api/orders` - Créer une commande
- `PUT /api/orders/:id/status` - Mettre à jour le statut (admin)

### Messages
- `GET /api/messages` - Liste des messages
- `POST /api/messages` - Créer un message
- `PUT /api/messages/:id/response` - Répondre à un message (admin)

## 🎨 Design

L'interface est inspirée de jules.com avec :
- Navbar moderne avec barre supérieure
- Footer complet avec liens et informations
- Design responsive et moderne
- Animations fluides

## 🚀 Build pour production

### Frontend
```bash
npm run build
```

### Backend
Le backend peut être déployé avec Docker ou directement avec Python.

## 📝 Notes

- Les données sont maintenant stockées dans MySQL
- Les images utilisent des placeholders - remplacer par de vraies images
- Changez les clés secrètes en production
