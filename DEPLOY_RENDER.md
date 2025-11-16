# 🚀 Déploiement sur Render (Alternative à Railway)

## Étape 1 : Préparer le Code pour PostgreSQL

Render utilise PostgreSQL au lieu de MySQL. Nous devons adapter le code.

### Modifier requirements.txt

Ajoutez `psycopg2-binary` pour PostgreSQL :

```txt
Flask==3.0.0
Flask-SQLAlchemy==3.1.1
Flask-CORS==4.0.0
PyMySQL==1.1.0
psycopg2-binary==2.9.9
cryptography==41.0.7
python-dotenv==1.0.0
PyJWT==2.8.0
Werkzeug==3.0.1
```

### Modifier backend/config.py

Ajoutez la gestion PostgreSQL (voir modifications ci-dessous)

---

## Étape 2 : Créer un Compte Render

1. Allez sur https://render.com
2. Cliquez sur "Get Started for Free"
3. Connectez-vous avec GitHub
4. Autorisez l'accès à votre repository

---

## Étape 3 : Créer la Base de Données PostgreSQL

1. Dans le Dashboard Render, cliquez sur **"New +"**
2. Sélectionnez **"PostgreSQL"**
3. Configuration :
   - **Name** : `miscadin-db`
   - **Database** : `miscadin` (ou laissez par défaut)
   - **User** : `miscadin_user` (ou laissez par défaut)
   - **Region** : Choisissez le plus proche (ex: Frankfurt)
   - **PostgreSQL Version** : 15 (ou la plus récente)
   - **Plan** : **Free**
4. Cliquez sur **"Create Database"**
5. **Notez les informations** affichées :
   - Internal Database URL
   - External Database URL (si disponible)

---

## Étape 4 : Créer le Web Service (Backend)

1. Dans le Dashboard, cliquez sur **"New +"**
2. Sélectionnez **"Web Service"**
3. Connectez votre repository GitHub :
   - **Public Git repository** : `https://github.com/bwadesag/miscadin`
   - Ou sélectionnez depuis la liste si déjà connecté
4. Configuration :
   - **Name** : `miscadin-backend`
   - **Region** : Même que la base de données
   - **Branch** : `main`
   - **Root Directory** : `.` (laissez vide)
   - **Environment** : `Python 3`
   - **Build Command** : `pip install -r requirements.txt`
   - **Start Command** : `python backend/run.py`
   - **Plan** : **Free**
5. Cliquez sur **"Create Web Service"**

---

## Étape 5 : Configurer les Variables d'Environnement

Dans votre Web Service, allez dans **"Environment"** et ajoutez :

### Variables de Base de Données
```
USE_MYSQL=false
USE_POSTGRESQL=true
```

### Variables PostgreSQL (depuis votre base de données Render)
```
DB_HOST=<votre-host-postgresql.render.com>
DB_PORT=5432
DB_USER=<votre-user>
DB_PASSWORD=<votre-password>
DB_NAME=<votre-db-name>
```

**OU** utilisez la variable d'environnement automatique de Render :
```
DATABASE_URL=${{postgres.DATABASE_URL}}
```

### Variables de Sécurité
```
SECRET_KEY=axJ7Em-iYb-ScX-aICyq_pc5rZg3IyKgOG4Ef3JL0v0
JWT_SECRET_KEY=eij5qGaN8olPWJzRqpsQJWXGkqu21-6EksQp6L0HBCU
```

### Variable CORS
```
CORS_ORIGINS=https://votre-frontend.vercel.app
```
⚠️ Remplacez par l'URL réelle de votre frontend Vercel une fois déployé.

---

## Étape 6 : Adapter backend/config.py pour PostgreSQL

Le fichier doit être modifié pour supporter PostgreSQL. Voir les modifications ci-dessous.

---

## Étape 7 : Déployer

1. Render déploiera automatiquement après la configuration
2. Surveillez les logs dans l'onglet **"Logs"**
3. Attendez que le déploiement soit terminé (peut prendre 5-10 minutes la première fois)

---

## Étape 8 : Initialiser la Base de Données

1. Dans votre Web Service, allez dans l'onglet **"Shell"**
2. Exécutez :
   ```bash
   python -m backend.init_db
   ```
3. Vous devriez voir :
   ```
   [OK] Database initialized successfully!
   ```

---

## Étape 9 : Obtenir l'URL du Backend

1. Dans votre Web Service, notez l'URL sous **"Settings"** → **"Service Details"**
2. Exemple : `https://miscadin-backend.onrender.com`
3. L'URL de l'API sera : `https://miscadin-backend.onrender.com/api`

---

## Étape 10 : Connecter le Frontend

1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet frontend
3. **Settings** → **Environment Variables**
4. Ajoutez/modifiez :
   - **Name** : `VITE_API_URL`
   - **Value** : `https://miscadin-backend.onrender.com/api`
5. **Redeploy** le frontend

---

## ✅ Vérification

1. Backend Health : `https://votre-backend.onrender.com/api/health`
2. Frontend : `https://votre-frontend.vercel.app`
3. Test connexion : `admin@miscadin.com` / `admin123`

---

## ⚠️ Notes Importantes

- **Render Free** : Le service peut "s'endormir" après 15 minutes d'inactivité
- **Premier démarrage** : Peut prendre 30-60 secondes après l'inactivité
- **Limites Free** : 750 heures/mois (suffisant pour la plupart des cas)

