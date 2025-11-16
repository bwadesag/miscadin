# 🔧 Solution Alternative : Forcer Python 3.11 sur Render

Si vous ne voyez pas l'option "Python Version" dans Settings, voici des méthodes alternatives :

## ✅ Méthode 1 : Variable d'Environnement PYTHON_VERSION

1. Dans votre **Web Service** sur Render, allez dans l'onglet **"Environment"**
2. Cliquez sur **"Add Environment Variable"**
3. Ajoutez :
   - **Key** : `PYTHON_VERSION`
   - **Value** : `3.11.9`
4. Cliquez sur **"Save Changes"**
5. Allez dans **"Manual Deploy"** → **"Clear build cache & deploy"**

---

## ✅ Méthode 2 : Modifier le Build Command

1. Dans votre **Web Service**, allez dans **"Settings"**
2. Section **"Build & Deploy"**
3. Trouvez **"Build Command"**
4. Remplacez par :
   ```bash
   python3.11 -m pip install --upgrade pip && pip install -r requirements.txt
   ```
5. Cliquez sur **"Save Changes"**
6. Redéployez : **"Manual Deploy"** → **"Deploy latest commit"**

---

## ✅ Méthode 3 : Utiliser runtime.txt (Vérifier qu'il est bien lu)

1. Vérifiez que `runtime.txt` est bien à la **racine** du projet (même niveau que `requirements.txt`)
2. Contenu de `runtime.txt` doit être exactement :
   ```
   python-3.11.9
   ```
   (Pas d'espaces, pas de lignes vides supplémentaires)

3. Dans Render, allez dans **"Manual Deploy"**
4. Cliquez sur **"Clear build cache & deploy"**
5. Cela force Render à relire `runtime.txt`

---

## ✅ Méthode 4 : Supprimer et Recréer le Service (Dernier recours)

Si rien ne fonctionne :

1. **Notez toutes vos variables d'environnement** (copiez-les quelque part)
2. **Supprimez** le Web Service actuel
3. **Recréez** un nouveau Web Service :
   - Lors de la création, dans le formulaire, cherchez **"Environment"** ou **"Python"**
   - Si vous voyez une option, choisissez **Python 3.11**
   - Sinon, créez le service normalement
4. **Ajoutez immédiatement** la variable `PYTHON_VERSION=3.11.9` dans Environment
5. **Ajoutez toutes vos autres variables** (DATABASE_URL, SECRET_KEY, etc.)
6. **Redéployez**

---

## 🔍 Vérifier que ça fonctionne

Après avoir appliqué une méthode :

1. Allez dans l'onglet **"Logs"**
2. Cherchez dans les premières lignes du build
3. Vous devriez voir quelque chose comme :
   ```
   Using Python version 3.11.9
   ```
   ou
   ```
   Python 3.11.9
   ```

Si vous voyez encore `Python 3.13`, essayez une autre méthode.

---

## 📋 Checklist

- [ ] Variable `PYTHON_VERSION=3.11.9` ajoutée dans Environment
- [ ] Build Command modifié (si méthode 2)
- [ ] `runtime.txt` vérifié à la racine avec `python-3.11.9`
- [ ] Cache vidé et redéployé
- [ ] Logs vérifiés pour confirmer Python 3.11

---

## 🆘 Si rien ne fonctionne

Contactez le support Render avec :
- Le message d'erreur complet
- La version Python que vous voulez (3.11.9)
- Le fait que `runtime.txt` ne semble pas être pris en compte

