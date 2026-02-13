# Déploiement

## Infrastructure

L'ensemble du projet est hébergé sur **serv00.net** (hébergement shared).

| Application | URL | Technologie |
|---|---|---|
| Website | https://sugesto.xyz | Next.js (Node.js) |
| App SaaS | https://app.sugesto.xyz | Next.js (Node.js) |
| Backend API | https://api.sugesto.xyz | Django (Python/Passenger) |

## Remotes Git

```bash
# Voir les remotes configurés
git remote -v

# origin  → GitHub (backup + partage)
origin    https://github.com/Gas1212/Mail_checher.git

# serv00  → Production (déploiement automatique)
serv00    ssh://repo3.serv00.com/~/repo/git/pub/mail-checker/
```

## Workflow de déploiement

```bash
# 1. Faire les modifications
# 2. Build (vérification)
cd website && npm run build
cd ../app && npm run build

# 3. Commit
git add <fichiers>
git commit -m "Description des changements"

# 4. Push vers les deux remotes
git push origin main   # GitHub
git push serv00 main   # Production (déclenche redémarrage)
```

Le hook `post-receive` sur serv00 exécute automatiquement :
```bash
# Pull du nouveau code
# npm install si besoin
# Redémarrage de l'application Passenger
```

## Build

### Website

```bash
cd website
npm install
npm run build    # Génère .next/
npm start        # Production sur port 3000
```

### App

```bash
cd app
npm install
npm run build    # Génère .next/
npm start        # Production sur port 3001
```

### Backend

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic
# Serv00 utilise Passenger via passenger_wsgi.py
```

## Fichier passenger_wsgi.py

Point d'entrée WSGI pour le backend Django sur serv00 :

```python
# backend/passenger_wsgi.py
import sys
import os
sys.path.insert(0, '/home/user/Mail-checker/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

## Variables d'environnement

### Backend (`backend/.env`)

```env
SECRET_KEY=<django-secret-key>
DEBUG=False
ALLOWED_HOSTS=api.sugesto.xyz
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/sugesto
GROQ_API_KEY=gsk_<key>
GOOGLE_CLIENT_ID=<id>.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=<secret>
```

### Website (`website/.env.local`)

```env
NEXT_PUBLIC_API_URL=https://api.sugesto.xyz
```

### App (`app/.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ<...>
NEXT_PUBLIC_API_URL=https://api.sugesto.xyz
```

## Sécurité Git

Le fichier `.env.txt` (contenant les secrets Google OAuth) est dans `.gitignore`.
Ne jamais committer de fichiers `.env*` contenant des secrets.

```gitignore
# .gitignore
.env
.env.*
.env.local
*.env.txt
```

## Rollback

En cas de problème après déploiement :

```bash
# Revenir au commit précédent
git revert HEAD
git push serv00 main

# Ou reset hard (destructif — confirmer d'abord)
git reset --hard HEAD~1
git push serv00 main --force
```
