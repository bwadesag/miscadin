# 📝 Valeurs d'Environnement pour Render

## 🔑 Variables à Ajouter dans Render

Ajoutez ces variables dans votre **Web Service** → **Environment** sur Render :

### 1. DATABASE_URL (RECOMMANDÉ)

**Comment l'obtenir :**
1. Allez dans votre service **PostgreSQL** sur Render
2. Onglet **"Info"** ou **"Connections"**
3. Copiez la **"Internal Database URL"**
4. Format : `postgresql://user:password@host:port/dbname`

**Exemple :**
```
postgresql://miscadin_user:abc123xyz@dpg-xxxxx-a.oregon-postgres.render.com:5432/miscadin_xxxx
```

---

### 2. SECRET_KEY

**Valeur à utiliser :**
```
axJ7Em-iYb-ScX-aICyq_pc5rZg3IyKgOG4Ef3JL0v0
```

---

### 3. JWT_SECRET_KEY

**Valeur à utiliser :**
```
eij5qGaN8olPWJzRqpsQJWXGkqu21-6EksQp6L0HBCU
```

---

### 4. CORS_ORIGINS

**Comment l'obtenir :**
1. Déployez d'abord votre frontend sur Vercel
2. Notez l'URL obtenue (ex: `https://miscadin.vercel.app`)
3. Utilisez cette URL complète

**Exemple :**
```
https://miscadin.vercel.app
```

**Si vous avez plusieurs domaines :**
```
https://miscadin.vercel.app,https://www.miscadin.vercel.app
```

---

## 📋 Checklist de Configuration

- [ ] PostgreSQL créé sur Render
- [ ] DATABASE_URL copiée depuis PostgreSQL → Info
- [ ] SECRET_KEY ajoutée
- [ ] JWT_SECRET_KEY ajoutée
- [ ] Frontend déployé sur Vercel
- [ ] CORS_ORIGINS configuré avec l'URL Vercel réelle

---

## ⚠️ Important

- **Ne créez PAS** de fichier `.env` sur Render
- Utilisez l'interface web : **Web Service** → **Environment** → **Add Environment Variable**
- Render peut automatiquement lier la base de données via **Settings** → **Connections**

---

## 🔗 Lien Automatique de la Base de Données

**Méthode la plus simple :**

1. Dans votre **Web Service**, allez dans **"Settings"**
2. Section **"Connections"** ou **"Linked Services"**
3. Trouvez votre base PostgreSQL (`miscadin-db`)
4. Cliquez sur **"Link"** ou **"Connect"**
5. Render ajoutera automatiquement `DATABASE_URL` avec la bonne valeur

Cela évite de copier-coller manuellement l'URL de la base de données !

