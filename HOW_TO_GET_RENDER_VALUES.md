# 📋 Comment Récupérer les Valeurs pour .env depuis Render

## 🗄️ Valeurs de la Base de Données PostgreSQL

### Méthode 1 : Internal Database URL (RECOMMANDÉ)

1. Allez sur https://dashboard.render.com
2. Cliquez sur votre service **PostgreSQL** (`miscadin-db`)
3. Dans l'onglet **"Info"** ou **"Connections"**, trouvez :
   - **Internal Database URL** (format: `postgresql://user:pass@host:port/dbname`)
4. **Copiez cette URL complète** - c'est votre `DATABASE_URL`

### Méthode 2 : Variables Individuelles

Si vous préférez utiliser les variables séparées :

1. Dans votre service PostgreSQL Render, allez dans **"Info"**
2. Notez :
   - **Hostname** → `DB_HOST`
   - **Port** → `DB_PORT` (généralement 5432)
   - **Database** → `DB_NAME`
   - **User** → `DB_USER`
   - **Password** → `DB_PASSWORD` (cliquez sur "Show" pour voir)

---

## 🌐 URL du Frontend Vercel

1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet frontend
3. Notez l'URL affichée (ex: `https://miscadin.vercel.app`)
4. Utilisez cette URL pour `CORS_ORIGINS`

---

## 📝 Exemple de .env Complet pour Render

Une fois que vous avez toutes les valeurs, votre `.env` devrait ressembler à :

```env
# Option 1 : Utiliser DATABASE_URL (plus simple)
DATABASE_URL=postgresql://miscadin_user:abc123xyz@dpg-xxxxx-a.oregon-postgres.render.com:5432/miscadin_xxxx

# OU Option 2 : Variables séparées
USE_POSTGRESQL=true
DB_HOST=dpg-xxxxx-a.oregon-postgres.render.com
DB_PORT=5432
DB_USER=miscadin_user
DB_PASSWORD=abc123xyz
DB_NAME=miscadin_xxxx

# Sécurité
SECRET_KEY=axJ7Em-iYb-ScX-aICyq_pc5rZg3IyKgOG4Ef3JL0v0
JWT_SECRET_KEY=eij5qGaN8olPWJzRqpsQJWXGkqu21-6EksQp6L0HBCU

# CORS
CORS_ORIGINS=https://miscadin.vercel.app
```

---

## ⚠️ Important

- **Ne commitez JAMAIS** le fichier `.env` sur GitHub
- Le fichier `.env` est déjà dans `.gitignore`
- Sur Render, ajoutez ces variables dans **Environment Variables** du Web Service
- Ne créez PAS de fichier `.env` sur Render, utilisez l'interface web

---

## 🔧 Sur Render : Où Ajouter les Variables

1. Allez dans votre **Web Service** (`miscadin-backend`)
2. Onglet **"Environment"**
3. Cliquez sur **"Add Environment Variable"**
4. Ajoutez chaque variable une par une

**Astuce** : Render peut automatiquement lier votre PostgreSQL avec la variable `DATABASE_URL` si vous utilisez le bouton "Link Database" dans les paramètres du Web Service.

