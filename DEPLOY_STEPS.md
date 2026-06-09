# 🚀 Étapes de Déploiement - MISCADIN

## ✅ Étape 1 : Build du Frontend (TERMINÉ)
- ✅ Build réussi
- ✅ Fichiers dans `dist/` prêts

## ✅ Étape 2 : Clés Secrètes Générées (TERMINÉ)
```
SECRET_KEY=axJ7Em-iYb-ScX-aICyq_pc5rZg3IyKgOG4Ef3JL0v0
JWT_SECRET_KEY=eij5qGaN8olPWJzRqpsQJWXGkqu21-6EksQp6L0HBCU
```

---

## 📱 ÉTAPE 3 : Déployer le Frontend sur Vercel

### Option A : Via la CLI (Recommandé)

1. **Se connecter à Vercel :**
   ```bash
   vercel login
   ```
   - Suivez les instructions dans le navigateur

2. **Déployer :**
   ```bash
   vercel
   ```
   - Répondez aux questions :
     - Set up and deploy? **Y**
     - Which scope? **Votre compte**
     - Link to existing project? **N** (première fois)
     - Project name? **miscadin** (ou laissez par défaut)
     - Directory? **.** (point)
     - Override settings? **N**

3. **Notez l'URL obtenue** (ex: `https://miscadin.vercel.app`)

### Option B : Via l'Interface Web

1. Allez sur https://vercel.com
2. Cliquez sur "Add New Project"
3. Importez votre repository GitHub : `bwadesag/miscadin`
4. Configuration :
   - Framework Preset : **Vite**
   - Build Command : `npm run build`
   - Output Directory : `dist`
   - Install Command : `npm install`
5. Cliquez sur "Deploy"

---

## 🔧 ÉTAPE 4 : Configurer le Backend sur Railway

### 4.1 Créer le Projet

1. Allez sur https://railway.app
2. Cliquez sur "Start a New Project"
3. Connectez-vous avec GitHub
4. Sélectionnez "Deploy from GitHub repo"
5. Choisissez : `bwadesag/miscadin`

### 4.2 Ajouter la Base de Données MySQL

1. Dans votre projet Railway, cliquez sur **"New"**
2. Sélectionnez **"Database"** → **"MySQL"**
3. Railway créera automatiquement les variables d'environnement

### 4.3 Configurer les Variables d'Environnement

Allez dans votre service backend → **Variables** et ajoutez :

```env
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

**⚠️ IMPORTANT** : Remplacez `https://votre-frontend.vercel.app` par l'URL réelle de Vercel une fois déployé.

### 4.4 Railway Déploiera Automatiquement

- Railway détectera `requirements.txt`
- Il installera les dépendances Python
- Le service démarrera avec `python backend/run.py`

### 4.5 Initialiser la Base de Données

1. Cliquez sur votre service backend dans Railway
2. Ouvrez l'onglet **"Deploy Logs"** ou **"Shell"**
3. Exécutez :
   ```bash
   python -m backend.init_db
   ```

### 4.6 Obtenir l'URL du Backend

1. Dans votre service Railway, cliquez sur **"Settings"**
2. Notez l'URL sous **"Domains"** (ex: `miscadin-production.up.railway.app`)
3. L'URL complète de l'API sera : `https://miscadin-production.up.railway.app/api`

---

## 🔗 ÉTAPE 5 : Connecter Frontend et Backend

### 5.1 Configurer Vercel avec l'URL du Backend

1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet **miscadin**
3. Allez dans **Settings** → **Environment Variables**
4. Ajoutez :
   - **Name** : `VITE_API_URL`
   - **Value** : `https://votre-backend.railway.app/api`
   - **Environment** : Production, Preview, Development (cochez les 3)
5. Cliquez sur **Save**
6. Allez dans **Deployments** → Cliquez sur les 3 points → **Redeploy**

---

## ✅ ÉTAPE 6 : Vérification

1. **Frontend** : Ouvrez `https://votre-frontend.vercel.app`
2. **Backend Health** : Ouvrez `https://votre-backend.railway.app/api/health`
3. **Test de connexion** :
   - Email : `admin@miscadin.com`
   - Mot de passe : `admin123`
4. **Vérifiez** que les catégories s'affichent
5. **Testez** l'ajout au panier

---

## 📝 Résumé des URLs

Une fois déployé, notez ici vos URLs :

- **Frontend Vercel** : `https://________________.vercel.app`
- **Backend Railway** : `https://________________.railway.app`
- **API Health Check** : `https://________________.railway.app/api/health`

---

## 🆘 En cas de problème

1. **Vérifiez les logs** :
   - Vercel : Dashboard → Deployments → Logs
   - Railway : Service → Deploy Logs

2. **Vérifiez les variables d'environnement** :
   - Vercel : Settings → Environment Variables
   - Railway : Service → Variables

3. **Vérifiez CORS** :
   - L'URL du frontend doit être dans `CORS_ORIGINS` du backend

4. **Vérifiez la base de données** :
   - Railway : Service MySQL → Variables
   - Vérifiez que les variables `${{MySQL.*}}` sont bien référencées

