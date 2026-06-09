# 🔧 Correction du Build Command

## ❌ Problème

Le build command `python3.11 -m pip install --upgrade pip && pip install -r requirements.txt` ne fonctionne pas car `python3.11` n'est pas disponible dans le PATH de Render.

## ✅ Solution : Utiliser la Variable d'Environnement

**Ne modifiez PAS le Build Command**, utilisez plutôt la variable d'environnement :

### Étape 1 : Ajouter la Variable PYTHON_VERSION

1. Dans votre **Web Service** Render, allez dans l'onglet **"Environment"**
2. Cliquez sur **"Add Environment Variable"**
3. Ajoutez :
   - **Key** : `PYTHON_VERSION`
   - **Value** : `3.11.9`
4. Cliquez sur **"Save Changes"**

### Étape 2 : Remettre le Build Command Original

1. Dans **Settings** → **Build & Deploy**
2. Trouvez **"Build Command"**
3. Remettez la valeur originale :
   ```bash
   pip install -r requirements.txt
   ```
4. Cliquez sur **"Save Changes"**

### Étape 3 : Vérifier runtime.txt

Assurez-vous que `runtime.txt` est bien à la racine avec :
```
python-3.11.9
```

### Étape 4 : Redéployer

1. Allez dans **"Manual Deploy"**
2. Cliquez sur **"Clear build cache & deploy"**
3. Render utilisera Python 3.11 grâce à `PYTHON_VERSION` et `runtime.txt`

---

## 📋 Build Command Correct

Le Build Command doit être simplement :
```bash
pip install -r requirements.txt
```

**Ne pas utiliser** :
- ❌ `python3.11 -m pip ...`
- ❌ `python3 -m pip ...`
- ❌ `python -m pip ...`

Juste :
- ✅ `pip install -r requirements.txt`

---

## 🔍 Comment Render Détecte Python 3.11

Render détecte la version Python via :
1. **Variable d'environnement** `PYTHON_VERSION=3.11.9` (priorité)
2. **Fichier `runtime.txt`** avec `python-3.11.9`
3. Si aucun des deux, utilise la version par défaut (3.13)

---

## ✅ Checklist

- [ ] Variable `PYTHON_VERSION=3.11.9` ajoutée dans Environment
- [ ] Build Command remis à `pip install -r requirements.txt`
- [ ] `runtime.txt` vérifié avec `python-3.11.9`
- [ ] Cache vidé et redéployé
- [ ] Logs vérifiés pour confirmer Python 3.11

