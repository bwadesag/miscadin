# 🔧 Forcer Python 3.11 sur Render

## ❌ Problème

Render utilise encore Python 3.13 malgré `runtime.txt`. Il faut forcer la version dans les settings.

## ✅ Solution : Configurer Python 3.11 dans Render

### Étape 1 : Vérifier les Settings

1. Allez sur https://dashboard.render.com
2. Cliquez sur votre **Web Service** (`miscadin-backend`)
3. Cliquez sur **"Settings"** (en haut à droite)

### Étape 2 : Changer la Version Python

1. Dans **Settings**, trouvez la section **"Build & Deploy"**
2. Cherchez **"Python Version"** ou **"Environment"**
3. Si vous voyez un menu déroulant avec les versions :
   - Sélectionnez **"3.11"** (pas 3.13, pas "latest")
4. Si vous ne voyez pas cette option :
   - Cherchez **"Environment Variables"**
   - Ajoutez une variable :
     - **Key** : `PYTHON_VERSION`
     - **Value** : `3.11.9`
   - Cliquez sur **"Save Changes"**

### Étape 3 : Vérifier runtime.txt

Assurez-vous que `runtime.txt` est bien à la **racine** du projet (même niveau que `requirements.txt`).

Contenu de `runtime.txt` :
```
python-3.11.9
```

### Étape 4 : Forcer un Redéploiement

1. Dans votre Web Service, allez dans **"Manual Deploy"**
2. Cliquez sur **"Clear build cache & deploy"**
3. Cela forcera Render à :
   - Reconstruire complètement l'environnement
   - Utiliser Python 3.11 depuis `runtime.txt`
   - Réinstaller toutes les dépendances

### Étape 5 : Vérifier les Logs

1. Allez dans l'onglet **"Logs"**
2. Cherchez la ligne qui indique la version Python
3. Vous devriez voir : `Python 3.11.9` (pas 3.13)

---

## 🔍 Alternative : Utiliser un Build Script

Si le problème persiste, créez un fichier `build.sh` :

```bash
#!/bin/bash
python3.11 -m pip install --upgrade pip
pip install -r requirements.txt
```

Puis dans Render :
- **Build Command** : `chmod +x build.sh && ./build.sh`

---

## ⚠️ Important

- **Ne pas utiliser** Python 3.13 (trop récent, incompatibilité avec psycopg2-binary)
- **Utiliser** Python 3.11 ou 3.12 maximum
- Le fichier `runtime.txt` doit être à la racine du projet

---

## 🆘 Si ça ne fonctionne toujours pas

1. **Supprimez et recréez** le Web Service avec Python 3.11 dès le début
2. Ou contactez le support Render avec cette erreur

