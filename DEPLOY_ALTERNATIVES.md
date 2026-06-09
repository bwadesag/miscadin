# 🚀 Alternatives à Railway pour le Backend

Voici plusieurs alternatives gratuites pour déployer votre backend Flask :

## 🥇 Option 1 : Render (Recommandé - Gratuit)

### Avantages
- ✅ Gratuit avec limitations raisonnables
- ✅ Base de données PostgreSQL gratuite
- ✅ Déploiement automatique depuis GitHub
- ✅ SSL/HTTPS automatique

### Étapes de Déploiement

1. **Créer un compte** : https://render.com (connexion GitHub)

2. **Créer une base de données PostgreSQL** :
   - Dashboard → "New" → "PostgreSQL"
   - Plan : **Free**
   - Nom : `miscadin-db`
   - Notez les informations de connexion

3. **Créer un Web Service (Backend)** :
   - Dashboard → "New" → "Web Service"
   - Connectez votre repo GitHub : `bwadesag/miscadin`
   - Configuration :
     - **Name** : `miscadin-backend`
     - **Environment** : `Python 3`
     - **Build Command** : `pip install -r requirements.txt`
     - **Start Command** : `python backend/run.py`
     - **Plan** : Free

4. **Configurer les Variables d'Environnement** :
   ```
   USE_MYSQL=false
   DB_HOST=<votre-host-postgresql.render.com>
   DB_PORT=5432
   DB_USER=<votre-user>
   DB_PASSWORD=<votre-password>
   DB_NAME=<votre-db-name>
   SECRET_KEY=axJ7Em-iYb-ScX-aICyq_pc5rZg3IyKgOG4Ef3JL0v0
   JWT_SECRET_KEY=eij5qGaN8olPWJzRqpsQJWXGkqu21-6EksQp6L0HBCU
   CORS_ORIGINS=https://votre-frontend.vercel.app
   ```

5. **Adapter le code pour PostgreSQL** :
   - Voir section "Adapter pour PostgreSQL" ci-dessous

6. **Initialiser la base de données** :
   - Render → Service → Shell
   - Exécutez : `python -m backend.init_db`

---

## 🥈 Option 2 : Fly.io (Gratuit)

### Avantages
- ✅ 3 VMs gratuites
- ✅ Base de données PostgreSQL gratuite
- ✅ Déploiement via CLI

### Étapes

1. **Installer Fly CLI** :
   ```bash
   powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
   ```

2. **Créer un compte** : https://fly.io

3. **Se connecter** :
   ```bash
   fly auth login
   ```

4. **Créer une app** :
   ```bash
   fly launch
   ```

5. **Créer une base PostgreSQL** :
   ```bash
   fly postgres create --name miscadin-db
   ```

6. **Attacher la base à l'app** :
   ```bash
   fly postgres attach --app miscadin-backend miscadin-db
   ```

---

## 🥉 Option 3 : PythonAnywhere (Gratuit)

### Avantages
- ✅ Gratuit pour applications web
- ✅ Interface web simple
- ✅ MySQL inclus

### Étapes

1. **Créer un compte** : https://www.pythonanywhere.com

2. **Uploader votre code** :
   - Files → Upload
   - Ou utilisez Git : `git clone https://github.com/bwadesag/miscadin.git`

3. **Créer une Web App** :
   - Web → "Add a new web app"
   - Framework : Flask
   - Python : 3.10

4. **Configurer** :
   - WSGI file : `/home/votre-username/miscadin/backend/app.py`
   - Static files : `/home/votre-username/miscadin/dist`

---

## 🆓 Option 4 : Cyclic.sh (Gratuit)

### Avantages
- ✅ Entièrement gratuit
- ✅ Déploiement automatique depuis GitHub
- ✅ Base de données incluse

### Étapes

1. **Créer un compte** : https://cyclic.sh

2. **Connecter GitHub** et sélectionner `bwadesag/miscadin`

3. **Configuration automatique** - Cyclic détecte Python

---

## 🔧 Adapter le Code pour PostgreSQL (Render)

Si vous utilisez Render avec PostgreSQL, vous devez modifier `requirements.txt` et `backend/config.py` :

### 1. Modifier requirements.txt
Ajoutez :
```
psycopg2-binary==2.9.9
```

### 2. Modifier backend/config.py
Ajoutez la gestion PostgreSQL (voir fichier séparé)

---

## 📊 Comparaison des Options

| Plateforme | Gratuit | Base de données | Déploiement | Difficulté |
|------------|---------|-----------------|-------------|------------|
| **Render** | ✅ Oui | PostgreSQL | Auto | ⭐ Facile |
| **Fly.io** | ✅ Oui | PostgreSQL | CLI | ⭐⭐ Moyen |
| **PythonAnywhere** | ✅ Oui | MySQL | Manuel | ⭐⭐ Moyen |
| **Cyclic.sh** | ✅ Oui | Incluse | Auto | ⭐ Facile |
| **Heroku** | ❌ Payant | PostgreSQL | Auto | ⭐ Facile |

---

## 🎯 Recommandation

**Utilisez Render** - C'est la meilleure alternative gratuite à Railway avec :
- Interface simple
- Déploiement automatique
- Base de données gratuite
- SSL automatique

