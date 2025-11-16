# Guide d'installation avec Docker MySQL

Ce guide vous explique comment configurer le projet Miscadin avec Docker MySQL.

## 📋 Prérequis

1. **Docker Desktop** installé et fonctionnel
   - Téléchargez depuis : https://www.docker.com/products/docker-desktop
   - Assurez-vous que Docker est démarré

2. **Python 3.11+** installé (pour le backend)

3. **Node.js 18+** installé (pour le frontend)

## 🚀 Étapes d'installation

### Étape 1 : Configurer le fichier .env

Créez un fichier `.env` à la racine du projet :

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

# SQLAlchemy (optionnel)
SQLALCHEMY_ECHO=False
```

### Étape 2 : Installer les dépendances

#### Frontend
```bash
npm install
```

#### Backend
```bash
pip install -r requirements.txt
```

Si vous utilisez un environnement virtuel (recommandé) :

```bash
# Créer l'environnement virtuel
python -m venv venv

# Activer l'environnement virtuel
# Sur Windows :
venv\Scripts\activate
# Sur Linux/Mac :
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt
```

### Étape 3 : Démarrer MySQL avec Docker

```bash
docker compose up -d mysql
```

Cette commande va :
- Télécharger l'image MySQL 8.0 (si nécessaire)
- Créer un conteneur MySQL
- Démarrer MySQL sur le port 3306
- Créer automatiquement la base de données `miscadin`

**Vérification** : Attendez quelques secondes, puis vérifiez que MySQL est bien démarré :

```bash
docker compose ps
```

Vous devriez voir `miscadin_mysql` avec le statut "Up".

### Étape 4 : Initialiser la base de données

Une fois MySQL démarré, initialisez la base de données :

```bash
python -m backend.init_db
```

Ce script va :
- ✅ Créer toutes les tables (users, products, categories, orders, messages)
- ✅ Créer l'utilisateur admin : `admin@miscadin.com` / `admin123`
- ✅ Créer l'utilisateur de démo : `user@example.com` / `user123`
- ✅ Créer les catégories de base (Vêtements, Chaussures, Accessoires)
- ✅ Créer quelques produits de démonstration

### Étape 5 : Démarrer le backend

Vous avez deux options :

#### Option A : Backend en local (recommandé pour le développement)

```bash
python backend/run.py
```

#### Option B : Backend avec Docker

```bash
docker compose up backend
```

Le backend sera accessible sur : http://localhost:5000

**Test** :
```bash
curl http://localhost:5000/api/health
```

Devrait retourner : `{"status": "ok"}`

### Étape 6 : Démarrer le frontend

Dans un nouveau terminal :

```bash
npm run dev
```

Le frontend sera accessible sur : http://localhost:5173

## 🛠️ Commandes Docker utiles

### Voir les logs MySQL
```bash
docker compose logs mysql
```

### Arrêter MySQL
```bash
docker compose stop mysql
```

### Redémarrer MySQL
```bash
docker compose restart mysql
```

### Arrêter et supprimer MySQL (⚠️ supprime les données)
```bash
docker compose down mysql
```

### Arrêter et supprimer MySQL avec les volumes (⚠️ supprime toutes les données)
```bash
docker compose down -v mysql
```

### Accéder à MySQL en ligne de commande
```bash
docker compose exec mysql mysql -u root -ppassword miscadin
```

### Voir les conteneurs en cours d'exécution
```bash
docker compose ps
```

## 🔧 Dépannage

### Erreur : "Cannot connect to MySQL server"

**Solution** :
1. Vérifiez que MySQL est démarré : `docker compose ps`
2. Attendez quelques secondes après le démarrage (MySQL a besoin de temps pour s'initialiser)
3. Vérifiez les logs : `docker compose logs mysql`

### Erreur : "Port 3306 is already in use"

**Solution** :
1. Vérifiez si un autre MySQL est en cours d'exécution
2. Modifiez le port dans `docker-compose.yml` et `.env` :
   ```yaml
   ports:
     - "3307:3306"  # Utilisez un autre port
   ```

### Erreur : "Access denied for user 'root'@'localhost'"

**Solution** :
1. Vérifiez le mot de passe dans votre fichier `.env`
2. Le mot de passe par défaut est `password`
3. Assurez-vous que `DB_PASSWORD` dans `.env` correspond à `MYSQL_ROOT_PASSWORD` dans `docker-compose.yml`

### Erreur : "ModuleNotFoundError: No module named 'pymysql'"

**Solution** :
```bash
pip install pymysql
# Ou réinstallez toutes les dépendances
pip install -r requirements.txt
```

### Réinitialiser complètement la base de données

```bash
# Arrêter et supprimer le conteneur et les volumes
docker compose down -v mysql

# Redémarrer MySQL
docker compose up -d mysql

# Attendre quelques secondes, puis réinitialiser
python -m backend.init_db
```

## 📝 Vérification

Pour vérifier que tout fonctionne :

1. **MySQL** : `docker compose ps` → `miscadin_mysql` doit être "Up"
2. **Backend** : http://localhost:5000/api/health → doit retourner `{"status": "ok"}`
3. **Base de données** : Connectez-vous avec un client MySQL ou via Docker :
   ```bash
   docker compose exec mysql mysql -u root -ppassword -e "SHOW DATABASES;"
   ```
4. **Frontend** : http://localhost:5173 → doit afficher l'application

## 🔐 Comptes de test

Après l'initialisation, vous pouvez vous connecter avec :

- **Admin** : `admin@miscadin.com` / `admin123`
- **Utilisateur** : `user@example.com` / `user123`

## 💡 Avantages de Docker MySQL

- ✅ **Isolation** : Ne perturbe pas d'autres installations MySQL
- ✅ **Simple** : Démarrage/arrêt en une commande
- ✅ **Portable** : Fonctionne sur toutes les machines
- ✅ **Propre** : Pas de conflit avec d'autres services
- ✅ **Persistant** : Les données sont sauvegardées dans un volume Docker

## 🔄 Workflow quotidien

```bash
# Démarrer MySQL
docker compose up -d mysql

# Démarrer le backend
python backend/run.py

# Dans un autre terminal, démarrer le frontend
npm run dev

# Pour arrêter
docker compose stop mysql
# (Ctrl+C pour arrêter le backend et frontend)
```



