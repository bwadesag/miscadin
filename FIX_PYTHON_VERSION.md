# 🔧 Correction : Erreur Python 3.13 avec psycopg2

## ❌ Problème

L'erreur `ImportError: undefined symbol: _PyInterpreterState_Get` se produit car `psycopg2-binary` n'est pas encore compatible avec Python 3.13.

## ✅ Solution : Utiliser Python 3.11

### Option 1 : Via l'Interface Render (RECOMMANDÉ)

1. Allez dans votre **Web Service** sur Render
2. Cliquez sur **"Settings"**
3. Dans la section **"Build & Deploy"**, trouvez **"Python Version"**
4. Sélectionnez **"3.11"** (pas 3.13)
5. Cliquez sur **"Save Changes"**
6. Render redéploiera automatiquement

### Option 2 : Via runtime.txt (Automatique)

Le fichier `runtime.txt` a été créé avec Python 3.11.9. Render devrait le détecter automatiquement.

Si ce n'est pas le cas :
1. Assurez-vous que `runtime.txt` est à la racine du projet
2. Redéployez manuellement : **"Manual Deploy"** → **"Deploy latest commit"**

### Option 3 : Vérifier la Configuration

Dans votre Web Service Render :
- **Settings** → **Build & Deploy**
- Vérifiez que **Python Version** est bien **3.11** (pas 3.13)

---

## 🔄 Après la Correction

1. Render redéploiera automatiquement avec Python 3.11
2. Surveillez les **Logs** pour vérifier que le déploiement réussit
3. Vous devriez voir : `Running on http://0.0.0.0:5000`

---

## ⚠️ Note

- Python 3.11 est stable et compatible avec toutes les dépendances
- Python 3.13 est trop récent et cause des problèmes de compatibilité
- Le fichier `runtime.txt` spécifie déjà Python 3.11.9

---

## 🆘 Si le Problème Persiste

1. **Vérifiez les logs** : Web Service → Logs
2. **Vérifiez Python Version** : Settings → Build & Deploy → Python Version
3. **Redéployez manuellement** : Manual Deploy → Deploy latest commit
4. **Vérifiez runtime.txt** : Doit contenir `python-3.11.9`

