# Guide de Déploiement - MISCADIN

Ce guide vous explique comment déployer l'application MISCADIN en production.

## 📋 Prérequis

- Node.js 18+ installé
- Python 3.11+ installé
- Compte sur une plateforme de déploiement (Vercel, Netlify, Railway, Render, etc.)

## 🎯 Options de Déploiement

### Option 1 : Déploiement Séparé (Recommandé)

**Frontend** : Vercel ou Netlify  
**Backend** : Railway, Render, ou VPS

### Option 2 : Déploiement avec Docker

Déployer les deux services avec Docker Compose sur un VPS.

### Option 3 : Déploiement Monolithique

Déployer le backend qui sert aussi le frontend statique.

---

## 🚀 Option 1 : Déploiement Séparé (Recommandé)

### A. Déploiement du Frontend (Vercel)

1. **Préparer le build :**
   ```bash
   npm run build
   ```

2. **Créer un compte Vercel** et installer la CLI :
   ```bash
   npm i -g vercel
   ```

3. **Déployer :**
   ```bash
   vercel
   ```

4. **Configurer les variables d'environnement dans Vercel :**
   - `VITE_API_URL` : URL de votre backend (ex: https://api.miscadin.com)

### B. Déploiement du Backend (Railway)

1. **Créer un compte Railway** : https://railway.app

2. **Créer un nouveau projet** et connecter votre repository GitHub

3. **Ajouter une base de données** :
   - Cliquez sur "New" → "Database" → "MySQL"
   - Railway créera automatiquement les variables d'environnement

4. **Déployer le backend :**
   - Railway détectera automatiquement Python
   - Configurez les variables d'environnement :
     ```
     USE_MYSQL=true
     DB_HOST=<fourni par Railway>
     DB_USER=<fourni par Railway>
     DB_PASSWORD=<fourni par Railway>
     DB_NAME=<fourni par Railway>
     SECRET_KEY=<générez une clé aléatoire>
     JWT_SECRET_KEY=<générez une clé aléatoire>
     CORS_ORIGINS=https://votre-frontend.vercel.app
     ```

5. **Initialiser la base de données :**
   - Utilisez la console Railway pour exécuter :
     ```bash
     python -m backend.init_db
     ```

---

## 🐳 Option 2 : Déploiement avec Docker

### Sur un VPS (Ubuntu/Debian)

1. **Installer Docker et Docker Compose :**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   sudo apt-get install docker-compose-plugin
   ```

2. **Cloner le repository :**
   ```bash
   git clone <votre-repo>
   cd miscadin
   ```

3. **Créer le fichier `.env` :**
   ```bash
   cp env.example .env
   # Éditez .env avec vos valeurs de production
   ```

4. **Démarrer les services :**
   ```bash
   docker compose up -d
   ```

5. **Initialiser la base de données :**
   ```bash
   docker compose exec backend python -m backend.init_db
   ```

6. **Configurer un reverse proxy (Nginx) :**
   - Voir `nginx.conf.example` pour la configuration

---

## 📝 Configuration de Production

### Variables d'Environnement Requises

**Backend (.env) :**
```env
# Base de données
USE_MYSQL=true
DB_HOST=votre-host
DB_PORT=3306
DB_USER=votre-user
DB_PASSWORD=votre-password-securise
DB_NAME=miscadin

# Sécurité (GÉNÉREZ DES CLÉS UNIQUES !)
SECRET_KEY=votre-secret-key-tres-longue-et-aleatoire
JWT_SECRET_KEY=votre-jwt-secret-key-tres-longue-et-aleatoire

# CORS
CORS_ORIGINS=https://votre-frontend.com,https://www.votre-frontend.com
```

**Frontend (.env.production) :**
```env
VITE_API_URL=https://votre-backend.com/api
```

### Générer des Clés Secrètes

```bash
# Python
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 🔒 Sécurité en Production

1. **Changez TOUTES les clés secrètes** (SECRET_KEY, JWT_SECRET_KEY)
2. **Utilisez HTTPS** partout
3. **Configurez CORS** correctement avec les domaines de production
4. **Utilisez une base de données MySQL** en production (pas SQLite)
5. **Activez les logs** pour le monitoring
6. **Configurez un firewall** sur votre VPS

---

## 📦 Build de Production

### Frontend
```bash
npm run build
# Les fichiers seront dans le dossier dist/
```

### Backend
Le backend Python n'a pas besoin de build, mais assurez-vous que :
- Toutes les dépendances sont dans `requirements.txt`
- Le fichier `.env` est configuré
- La base de données est initialisée

---

## 🧪 Tests Post-Déploiement

1. Vérifiez que le frontend charge : `https://votre-frontend.com`
2. Vérifiez que l'API répond : `https://votre-backend.com/api/health`
3. Testez la connexion : `admin@miscadin.com` / `admin123`
4. Vérifiez que les catégories s'affichent
5. Testez l'ajout au panier

---

## 🔄 Mises à Jour

### Frontend
```bash
git pull
npm run build
vercel --prod  # ou votre commande de déploiement
```

### Backend
```bash
git pull
docker compose restart backend  # si Docker
# ou redéployez sur Railway/Render
```

---

## 📞 Support

En cas de problème, vérifiez :
- Les logs de votre plateforme de déploiement
- La configuration CORS
- Les variables d'environnement
- La connexion à la base de données

