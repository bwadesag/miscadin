# 🚀 Déploiement Rapide - MISCADIN

## Option 1 : Vercel (Frontend) + Railway (Backend) - 15 minutes

### Frontend sur Vercel

1. **Installer Vercel CLI :**
   ```bash
   npm i -g vercel
   ```

2. **Déployer :**
   ```bash
   vercel
   ```
   - Suivez les instructions
   - Notez l'URL obtenue (ex: https://miscadin.vercel.app)

3. **Configurer la variable d'environnement :**
   - Allez sur https://vercel.com/dashboard
   - Sélectionnez votre projet
   - Settings → Environment Variables
   - Ajoutez : `VITE_API_URL` = URL de votre backend (vous l'aurez après l'étape suivante)

### Backend sur Railway

1. **Créer un compte** : https://railway.app (connexion GitHub)

2. **Nouveau projet** → "Deploy from GitHub repo"

3. **Ajouter une base de données MySQL :**
   - "New" → "Database" → "MySQL"
   - Railway génère automatiquement les variables

4. **Configurer les variables d'environnement :**
   ```
   USE_MYSQL=true
   DB_HOST=${{MySQL.MYSQLHOST}}
   DB_PORT=${{MySQL.MYSQLPORT}}
   DB_USER=${{MySQL.MYSQLUSER}}
   DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
   DB_NAME=${{MySQL.MYSQLDATABASE}}
   SECRET_KEY=<générez avec: python -c "import secrets; print(secrets.token_urlsafe(32))">
   JWT_SECRET_KEY=<générez avec: python -c "import secrets; print(secrets.token_urlsafe(32))">
   CORS_ORIGINS=https://votre-frontend.vercel.app
   ```

5. **Déployer** : Railway détecte automatiquement Python

6. **Initialiser la base de données :**
   - Ouvrez la console Railway
   - Exécutez : `python -m backend.init_db`

7. **Notez l'URL du backend** (ex: https://miscadin-production.up.railway.app)

8. **Mettez à jour VITE_API_URL** dans Vercel avec cette URL + `/api`

---

## Option 2 : Render (Tout-en-un)

### Frontend sur Render

1. **Créer un compte** : https://render.com

2. **Nouveau "Static Site"** :
   - Connectez votre repo GitHub
   - Build Command : `npm run build`
   - Publish Directory : `dist`

3. **Variables d'environnement :**
   - `VITE_API_URL` = URL de votre backend Render

### Backend sur Render

1. **Nouveau "Web Service"** :
   - Connectez votre repo
   - Environment : Python 3
   - Build Command : `pip install -r requirements.txt`
   - Start Command : `python backend/run.py`

2. **Ajouter une base de données PostgreSQL** :
   - "New" → "PostgreSQL"
   - Notez les variables de connexion

3. **Variables d'environnement :**
   ```
   USE_MYSQL=false
   # Utilisez PostgreSQL avec psycopg2
   # Ou configurez MySQL externe
   SECRET_KEY=<générez>
   JWT_SECRET_KEY=<générez>
   CORS_ORIGINS=https://votre-frontend.onrender.com
   ```

---

## Option 3 : Netlify (Frontend) + Heroku (Backend)

### Frontend sur Netlify

1. **Créer un compte** : https://netlify.com

2. **Nouveau site depuis Git** :
   - Connectez votre repo
   - Build command : `npm run build`
   - Publish directory : `dist`

3. **Variables d'environnement :**
   - `VITE_API_URL` = URL de votre backend Heroku

### Backend sur Heroku

1. **Installer Heroku CLI** : https://devcenter.heroku.com/articles/heroku-cli

2. **Créer l'application :**
   ```bash
   heroku create miscadin-api
   ```

3. **Ajouter une base de données :**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

4. **Configurer les variables :**
   ```bash
   heroku config:set SECRET_KEY=<votre-clé>
   heroku config:set JWT_SECRET_KEY=<votre-clé>
   heroku config:set CORS_ORIGINS=https://votre-site.netlify.app
   ```

5. **Déployer :**
   ```bash
   git push heroku main
   ```

6. **Initialiser la base :**
   ```bash
   heroku run python -m backend.init_db
   ```

---

## ✅ Checklist Post-Déploiement

- [ ] Frontend accessible et fonctionnel
- [ ] Backend répond sur `/api/health`
- [ ] CORS configuré correctement
- [ ] Base de données initialisée
- [ ] Connexion admin fonctionne
- [ ] Les catégories s'affichent
- [ ] HTTPS activé (automatique sur Vercel/Netlify/Railway)

---

## 🔐 Sécurité

**IMPORTANT** : Changez les clés secrètes en production !

```bash
# Générer des clés sécurisées
python -c "import secrets; print('SECRET_KEY=' + secrets.token_urlsafe(32))"
python -c "import secrets; print('JWT_SECRET_KEY=' + secrets.token_urlsafe(32))"
```

---

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs de votre plateforme
2. Vérifiez les variables d'environnement
3. Vérifiez que CORS est bien configuré
4. Vérifiez la connexion à la base de données

