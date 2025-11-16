# 🚀 Guide Pas à Pas - Déploiement sur Render

## 📋 Services à Créer

Vous devez créer **2 services** sur Render :

1. **Postgres** (Base de données) - À créer EN PREMIER
2. **Web Services** (Backend Flask) - À créer EN SECOND

---

## 🗄️ ÉTAPE 1 : Créer la Base de Données PostgreSQL

1. Dans votre Dashboard Render, cliquez sur **"New +"**
2. Sélectionnez **"Postgres"** (pas Static Site, pas Web Services)
3. Remplissez le formulaire :
   - **Name** : `miscadin-db`
   - **Database** : `miscadin` (ou laissez par défaut)
   - **User** : `miscadin_user` (ou laissez par défaut)
   - **Region** : Choisissez le plus proche (ex: **Frankfurt** pour l'Europe)
   - **PostgreSQL Version** : **15** (ou la plus récente disponible)
   - **Plan** : **Free** (sélectionnez le plan gratuit)
4. Cliquez sur **"Create Database"**
5. ⚠️ **IMPORTANT** : Notez les informations affichées :
   - **Internal Database URL** (ex: `postgresql://user:pass@host:5432/dbname`)
   - **Hostname**
   - **Port** (généralement 5432)
   - **Database Name**
   - **Username**
   - **Password**

---

## 🌐 ÉTAPE 2 : Créer le Web Service (Backend)

1. Dans votre Dashboard Render, cliquez sur **"New +"**
2. Sélectionnez **"Web Services"** (pas Static Site)
3. Connectez votre repository GitHub :
   - Si c'est la première fois : Cliquez sur **"Connect account"** et autorisez Render
   - Sélectionnez le repository : **`bwadesag/miscadin`**
   - Cliquez sur **"Connect"**
4. Remplissez le formulaire de configuration :

   **Informations de base :**
   - **Name** : `miscadin-backend`
   - **Region** : **Même région que votre base de données** (ex: Frankfurt)
   - **Branch** : `main`
   - **Root Directory** : `.` (laissez vide ou mettez un point)

   **Build & Deploy :**
   - **Environment** : `Python 3`
   - **Python Version** : **3.11** (⚠️ IMPORTANT : Ne pas utiliser 3.13)
   - **Build Command** : `pip install -r requirements.txt`
   - **Start Command** : `python backend/run.py`

   **Plan :**
   - **Plan** : **Free** (sélectionnez le plan gratuit)

5. Cliquez sur **"Create Web Service"**

---

## ⚙️ ÉTAPE 3 : Configurer les Variables d'Environnement

Une fois le Web Service créé :

### Option A : Lier Automatiquement la Base de Données (RECOMMANDÉ)

1. Dans votre Web Service, allez dans **"Settings"**
2. Dans la section **"Connections"**, trouvez votre base PostgreSQL
3. Cliquez sur **"Link"** ou **"Connect"**
4. Render ajoutera automatiquement `DATABASE_URL` avec la bonne valeur

### Option B : Ajouter Manuellement les Variables

1. Dans votre Web Service, allez dans l'onglet **"Environment"**
2. Cliquez sur **"Add Environment Variable"**
3. Ajoutez les variables suivantes **UNE PAR UNE** :

#### Variable 1 : DATABASE_URL
- **Key** : `DATABASE_URL`
- **Value** : Copiez la **Internal Database URL** de votre base PostgreSQL
  - Format : `postgresql://user:password@host:port/dbname`
  - Trouvez-la dans : PostgreSQL service → "Info" → "Internal Database URL"
- Cliquez sur **"Save Changes"**

#### Variable 2 : SECRET_KEY
- **Key** : `SECRET_KEY`
- **Value** : `axJ7Em-iYb-ScX-aICyq_pc5rZg3IyKgOG4Ef3JL0v0`
- Cliquez sur **"Save Changes"**

#### Variable 3 : JWT_SECRET_KEY
- **Key** : `JWT_SECRET_KEY`
- **Value** : `eij5qGaN8olPWJzRqpsQJWXGkqu21-6EksQp6L0HBCU`
- Cliquez sur **"Save Changes"**

#### Variable 4 : CORS_ORIGINS
- **Key** : `CORS_ORIGINS`
- **Value** : `https://votre-frontend.vercel.app`
- ⚠️ **Remplacez** `votre-frontend.vercel.app` par l'URL réelle de Vercel une fois déployé
- Exemple : `https://miscadin.vercel.app`
- Cliquez sur **"Save Changes"**

### 📋 Template de Variables pour Render

Voir le fichier `.env.render` pour un template complet avec toutes les variables nécessaires.

---

## 🚀 ÉTAPE 4 : Déploiement Automatique

1. Render va automatiquement :
   - Installer les dépendances Python
   - Démarrer votre backend
2. Surveillez les **Logs** dans l'onglet **"Logs"** de votre Web Service
3. Attendez que le déploiement soit terminé (5-10 minutes la première fois)
4. Vous verrez : `Running on http://0.0.0.0:5000` dans les logs

---

## 🗃️ ÉTAPE 5 : Initialiser la Base de Données

1. Dans votre Web Service, allez dans l'onglet **"Shell"**
2. Cliquez sur **"Open Shell"**
3. Dans le terminal qui s'ouvre, exécutez :
   ```bash
   python -m backend.init_db
   ```
4. Vous devriez voir :
   ```
   [OK] Database initialized successfully!
   ```

---

## 🔗 ÉTAPE 6 : Obtenir l'URL du Backend

1. Dans votre Web Service, allez dans **"Settings"**
2. Notez l'URL sous **"Service Details"** → **"URL"**
   - Exemple : `https://miscadin-backend.onrender.com`
3. L'URL de l'API sera : `https://miscadin-backend.onrender.com/api`
4. Testez : Ouvrez `https://miscadin-backend.onrender.com/api/health` dans votre navigateur
   - Vous devriez voir : `{"status":"ok"}`

---

## ✅ Résumé des Services à Créer

| Service | Type | Nom | Plan |
|---------|------|-----|------|
| Base de données | **Postgres** | `miscadin-db` | Free |
| Backend API | **Web Services** | `miscadin-backend` | Free |

---

## ⚠️ Notes Importantes

- **Ne créez PAS** de "Static Site" - c'est pour le frontend qui sera sur Vercel
- **Créez d'abord** la base de données PostgreSQL
- **Ensuite** créez le Web Service
- Le service gratuit peut "s'endormir" après 15 minutes d'inactivité
- Le premier démarrage après inactivité peut prendre 30-60 secondes

---

## 🆘 En cas de problème

1. **Vérifiez les logs** : Web Service → Logs
2. **Vérifiez les variables** : Web Service → Environment
3. **Vérifiez la connexion DB** : Assurez-vous que DATABASE_URL est correcte

