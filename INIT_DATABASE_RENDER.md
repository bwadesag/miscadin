# 🗃️ Initialiser la Base de Données sur Render

## ❌ Erreur

```
relation "categories" does not exist
```

Cela signifie que les tables n'ont pas encore été créées dans PostgreSQL.

## ✅ Solution : Initialiser la Base de Données

### Étape 1 : Ouvrir le Shell Render

1. Allez sur https://dashboard.render.com
2. Cliquez sur votre **Web Service** (`miscadin-backend`)
3. Allez dans l'onglet **"Shell"** (dans le menu de gauche)
4. Cliquez sur **"Open Shell"** ou **"Connect"**

### Étape 2 : Exécuter la Commande d'Initialisation

Dans le terminal qui s'ouvre, exécutez :

```bash
python -m backend.init_db
```

### Étape 3 : Vérifier les Résultats

Vous devriez voir des messages comme :
```
[OK] Database initialized successfully!
[OK] Admin user created (admin@miscadin.com / admin123)
[OK] Category created: Chemises
[OK] Category created: T-shirts & Polos
...
```

### Étape 4 : Tester l'API

Une fois l'initialisation terminée, testez :
- `https://miscadin.onrender.com/api/categories`
- `https://miscadin.onrender.com/api/products`

Vous devriez maintenant voir les données au lieu d'une erreur.

---

## 🔍 Si le Shell ne Fonctionne Pas

### Alternative : Via les Logs

1. Dans votre Web Service, allez dans **"Manual Deploy"**
2. Modifiez temporairement le **Start Command** :
   ```bash
   python -m backend.init_db && python backend/run.py
   ```
3. Déployez
4. Une fois fait, remettez le Start Command original : `python backend/run.py`

---

## ⚠️ Note

- L'initialisation ne doit être faite **qu'une seule fois**
- Si vous la refaites, elle vérifiera si les données existent déjà
- Les comptes de démonstration seront créés :
  - Admin : `admin@miscadin.com` / `admin123`
  - User : `user@example.com` / `user123`

---

## ✅ Après l'Initialisation

Une fois la base de données initialisée :
- ✅ Les tables seront créées
- ✅ Les catégories seront ajoutées
- ✅ Les produits de démonstration seront créés
- ✅ Les comptes utilisateurs seront créés

