# Déploiement Backend Django sur serv00

## 🚀 Guide complet Django → serv00

### Informations de connexion
- **SSH**: `ssh Gas1911@repo3.serv00.com`
- **Password**: `mS^t^Gv($V)(JIxjB#4I`

## Étape 1: Se connecter à serv00

```bash
ssh Gas1911@repo3.serv00.com
# Entrer le mot de passe: mS^t^Gv($V)(JIxjB#4I
```

## Étape 2: Préparer l'environnement

### 2.1 Vérifier Python

```bash
python3 --version
# Si Python 3.8+, continuer
# Sinon, utiliser: python3.9 ou python3.10
```

### 2.2 Créer un répertoire pour le projet

```bash
cd ~
mkdir mail-checker
cd mail-checker
```

### 2.3 Cloner le repository

```bash
git clone https://github.com/Gas1212/Mail_checher.git .
cd backend
```

## Étape 3: Configurer l'environnement virtuel

```bash
# Créer l'environnement virtuel
python3 -m venv venv

# Activer
source venv/bin/activate

# Mettre à jour pip
pip install --upgrade pip
```

## Étape 4: Installer les dépendances

```bash
pip install -r requirements.txt

# Si erreur avec djongo, installer:
pip install pymongo==4.6.1
pip install djongo==1.3.6
```

## Étape 5: Configurer les variables d'environnement

### 5.1 Créer le fichier .env

```bash
nano .env
```

### 5.2 Ajouter la configuration

```env
DEBUG=False
SECRET_KEY=votre-secret-key-production-securisee
MONGODB_URI=mongodb+srv://carthagehannibalbarka_db_user:5A65wyZxYuDANKcZ@cluster0.jojbiqs.mongodb.net/
MONGODB_NAME=Mail
MONGODB_COLLECTION=db
ALLOWED_HOSTS=votre-domaine.serv00.net,localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=https://mail-checher.vercel.app,http://localhost:3000
```

**Générer une SECRET_KEY**:
```bash
python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Copier la clé générée et la mettre dans `.env`

### 5.3 Sauvegarder et quitter
- Ctrl+O (écrire)
- Enter (confirmer)
- Ctrl+X (quitter)

## Étape 6: Configuration Django pour production

### 6.1 Modifier settings.py pour serv00

```bash
nano config/settings.py
```

Ajouter à la fin:

```python
# Configuration serv00
import os
from decouple import config

# Security
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost').split(',')

# Static files
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Production settings
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
```

## Étape 7: Collecter les fichiers statiques

```bash
python manage.py collectstatic --noinput
```

## Étape 8: Tester les migrations

```bash
python manage.py migrate
```

## Étape 9: Créer un superuser

```bash
python manage.py createsuperuser
# Entrer: username, email, password
```

## Étape 10: Configurer le serveur web

### Option A: Utiliser Passenger (recommandé pour serv00)

#### 10.1 Créer passenger_wsgi.py

```bash
nano ~/mail-checker/backend/passenger_wsgi.py
```

Contenu:

```python
import os
import sys

# Ajouter le chemin du projet
sys.path.insert(0, os.path.dirname(__file__))

# Activer l'environnement virtuel
VIRTUALENV = os.path.join(os.path.dirname(__file__), 'venv')
if sys.platform == 'win32':
    activate_this = os.path.join(VIRTUALENV, 'Scripts', 'activate_this.py')
else:
    activate_this = os.path.join(VIRTUALENV, 'bin', 'activate_this.py')

with open(activate_this) as f:
    exec(f.read(), {'__file__': activate_this})

# Charger l'application Django
os.environ['DJANGO_SETTINGS_MODULE'] = 'config.settings'

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

#### 10.2 Configurer dans le panel serv00

1. Aller sur https://panel.serv00.com
2. Login avec vos identifiants
3. Aller dans "WWW" > "WWW websites"
4. Ajouter un nouveau site web
5. Configuration:
   - **Domain**: Choisir un sous-domaine serv00
   - **Directory**: `/home/Gas1911/mail-checker/backend`
   - **Python**: Cocher "Enable Python"
   - **Python version**: 3.9 ou 3.10
   - **WSGI file**: `passenger_wsgi.py`

### Option B: Utiliser Gunicorn + systemd

Si Passenger ne fonctionne pas:

```bash
# Installer gunicorn
pip install gunicorn

# Tester gunicorn
gunicorn config.wsgi:application --bind 0.0.0.0:8000
```

Créer un service systemd (si autorisé):

```bash
nano ~/mail-checker/start.sh
```

```bash
#!/bin/bash
cd ~/mail-checker/backend
source venv/bin/activate
gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 2
```

```bash
chmod +x ~/mail-checker/start.sh
```

## Étape 11: Tester l'application

### 11.1 Vérifier que le serveur fonctionne

```bash
# Tester localement
curl http://localhost:8000/api/emails/stats/
```

### 11.2 Tester depuis l'extérieur

```bash
# Depuis votre machine locale
curl https://votre-domaine.serv00.net/api/emails/stats/
```

## Étape 12: Configuration des processus (optionnel)

### Garder l'application active

Si serv00 utilise cron jobs:

```bash
crontab -e
```

Ajouter:
```
*/5 * * * * cd ~/mail-checker/backend && source venv/bin/activate && python manage.py migrate > /dev/null 2>&1
```

## 🔧 Dépannage

### Erreur "Permission denied"

```bash
chmod +x ~/mail-checker/backend/manage.py
chmod +x ~/mail-checker/start.sh
```

### Erreur "Module not found"

```bash
source venv/bin/activate
pip install -r requirements.txt
```

### Erreur MongoDB connection

Vérifier:
1. MONGODB_URI correct dans `.env`
2. IP whitelistée dans MongoDB Atlas (0.0.0.0/0)
3. Internet accessible depuis serv00

### Erreur "Static files not found"

```bash
python manage.py collectstatic --noinput
```

## 📊 Monitoring

### Voir les logs

```bash
# Logs Django
tail -f ~/mail-checker/backend/debug.log

# Logs serveur (si accessible)
tail -f ~/logs/error_log
```

### Redémarrer l'application

```bash
# Si Passenger
touch ~/mail-checker/backend/tmp/restart.txt

# Si Gunicorn
pkill gunicorn
~/mail-checker/start.sh
```

## 🔒 Sécurité

### Checklist production:

- [ ] DEBUG=False
- [ ] SECRET_KEY unique et sécurisée
- [ ] ALLOWED_HOSTS configuré
- [ ] CORS configuré pour Vercel
- [ ] MongoDB avec authentification
- [ ] Fichiers .env non commités
- [ ] Permissions fichiers correctes (chmod 600 .env)

```bash
# Sécuriser .env
chmod 600 .env
```

## 📈 Optimisation

### Cache statique

Ajouter dans `config/settings.py`:

```python
# Cache
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
    }
}
```

### Compression

```bash
pip install django-compression-middleware

# Dans settings.py MIDDLEWARE, ajouter:
# 'compression_middleware.middleware.CompressionMiddleware',
```

## ✅ Checklist finale

Avant de considérer le déploiement terminé:

- [ ] SSH accessible
- [ ] Repository cloné
- [ ] Environnement virtuel créé
- [ ] Dépendances installées
- [ ] .env configuré
- [ ] SECRET_KEY générée
- [ ] Static files collectés
- [ ] Migrations exécutées
- [ ] Superuser créé
- [ ] WSGI configuré (Passenger ou Gunicorn)
- [ ] Domaine configuré
- [ ] CORS configuré
- [ ] API testée (curl)
- [ ] MongoDB connecté
- [ ] Frontend Vercel peut se connecter

## 🎉 URLs finales

Après déploiement:

- **Backend API**: `https://votre-domaine.serv00.net/api/`
- **Admin Django**: `https://votre-domaine.serv00.net/admin/`
- **Frontend Vercel**: `https://mail-checher.vercel.app`

## 📚 Ressources

- [serv00 Documentation](https://www.serv00.com/documentation)
- [Django Deployment Checklist](https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/)
- [Passenger WSGI](https://www.phusionpassenger.com/library/walkthroughs/deploy/python/)

## 🆘 Support serv00

Si problèmes:
- Panel: https://panel.serv00.com
- Support: Via le panel serv00
- Documentation: https://www.serv00.com

---

**Prochaine étape**: Connecter le frontend Vercel au backend serv00 (voir [DEPLOYMENT_VERCEL.md](DEPLOYMENT_VERCEL.md))
