# Guide de Déploiement Backend sur Railway

## Étapes à suivre :

### 1. Créer un compte Railway
- Allez sur https://railway.app
- Cliquez sur "Start a New Project"
- Connectez-vous avec GitHub

### 2. Créer un nouveau projet
- Cliquez sur "New Project"
- Sélectionnez "Deploy from GitHub repo"
- Choisissez le repository : `bwadesag/miscadin`

### 3. Ajouter une base de données MySQL
- Dans votre projet Railway, cliquez sur "New"
- Sélectionnez "Database" → "MySQL"
- Railway créera automatiquement les variables d'environnement

### 4. Configurer les variables d'environnement
Allez dans votre service backend → Variables et ajoutez :

```
USE_MYSQL=true
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_USER=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
DB_NAME=${{MySQL.MYSQLDATABASE}}
SECRET_KEY=axJ7Em-iYb-ScX-aICyq_pc5rZg3IyKgOG4Ef3JL0v0
JWT_SECRET_KEY=eij5qGaN8olPWJzRqpsQJWXGkqu21-6EksQp6L0HBCU
CORS_ORIGINS=https://votre-frontend.vercel.app
```

**Important** : Remplacez `https://votre-frontend.vercel.app` par l'URL réelle de votre frontend Vercel une fois déployé.

### 5. Railway détectera automatiquement Python
- Railway détectera le fichier `requirements.txt`
- Il installera automatiquement les dépendances
- Le service démarrera avec `python backend/run.py`

### 6. Initialiser la base de données
- Cliquez sur votre service backend
- Ouvrez la console (onglet "Deploy Logs" ou "Shell")
- Exécutez : `python -m backend.init_db`

### 7. Obtenir l'URL de votre backend
- Dans votre service Railway, cliquez sur "Settings"
- Notez l'URL sous "Domains" (ex: `miscadin-production.up.railway.app`)
- L'URL complète sera : `https://miscadin-production.up.railway.app`

### 8. Mettre à jour Vercel avec l'URL du backend
- Allez sur https://vercel.com/dashboard
- Sélectionnez votre projet frontend
- Settings → Environment Variables
- Ajoutez ou modifiez : `VITE_API_URL` = `https://votre-backend.railway.app/api`
- Redéployez le frontend

## ✅ Vérification

1. Vérifiez que le backend répond : `https://votre-backend.railway.app/api/health`
2. Vérifiez que le frontend charge : `https://votre-frontend.vercel.app`
3. Testez la connexion : `admin@miscadin.com` / `admin123`

