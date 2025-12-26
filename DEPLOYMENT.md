# Guide de déploiement - Email Checker

## Options de déploiement

### Option 1: Déploiement local avec MongoDB Atlas (Recommandé pour le développement)

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # ou venv\Scripts\activate sur Windows
pip install -r requirements.txt
python manage.py runserver
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Option 2: Docker Compose

#### Prérequis
- Docker installé
- Docker Compose installé

#### Commandes
```bash
# Construire et démarrer tous les services
docker-compose up --build

# En arrière-plan
docker-compose up -d

# Arrêter les services
docker-compose down

# Voir les logs
docker-compose logs -f
```

**Note**: Avec Docker, MongoDB local sera utilisé au lieu de MongoDB Atlas. Pour utiliser Atlas, modifiez le service backend dans docker-compose.yml pour utiliser les variables d'environnement Atlas.

### Option 3: Déploiement Production

#### Backend Django (sur un serveur Linux)

1. **Installer les dépendances système**
```bash
sudo apt update
sudo apt install python3-pip python3-venv nginx
```

2. **Configurer l'environnement**
```bash
cd /var/www/mail-checker/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn
```

3. **Créer le fichier .env de production**
```bash
DEBUG=False
SECRET_KEY=votre-cle-secrete-super-longue-et-complexe
MONGODB_URI=mongodb+srv://carthagehannibalbarka_db_user:5A65wyZxYuDANKcZ@cluster0.jojbiqs.mongodb.net/
MONGODB_NAME=Mail
ALLOWED_HOSTS=votre-domaine.com,www.votre-domaine.com
CORS_ALLOWED_ORIGINS=https://votre-domaine.com
```

4. **Créer un service systemd**
```bash
sudo nano /etc/systemd/system/mail-checker.service
```

Contenu:
```ini
[Unit]
Description=Mail Checker Django API
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/mail-checker/backend
Environment="PATH=/var/www/mail-checker/backend/venv/bin"
ExecStart=/var/www/mail-checker/backend/venv/bin/gunicorn \
    --workers 3 \
    --bind 127.0.0.1:8000 \
    config.wsgi:application

[Install]
WantedBy=multi-user.target
```

5. **Démarrer le service**
```bash
sudo systemctl start mail-checker
sudo systemctl enable mail-checker
sudo systemctl status mail-checker
```

6. **Configurer Nginx**
```bash
sudo nano /etc/nginx/sites-available/mail-checker
```

Contenu:
```nginx
server {
    listen 80;
    server_name api.votre-domaine.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static/ {
        alias /var/www/mail-checker/backend/staticfiles/;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/mail-checker /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

7. **Configurer HTTPS avec Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.votre-domaine.com
```

#### Frontend Next.js

##### Option A: Vercel (Recommandé)

1. Pusher le code sur GitHub
2. Aller sur [vercel.com](https://vercel.com)
3. Importer le projet
4. Configurer les variables d'environnement:
   - `NEXT_PUBLIC_API_URL=https://api.votre-domaine.com/api`
5. Déployer

##### Option B: Serveur Linux avec PM2

1. **Installer Node.js et PM2**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs
sudo npm install -g pm2
```

2. **Build et démarrer**
```bash
cd /var/www/mail-checker/frontend
npm install
npm run build

# Créer .env.local
echo "NEXT_PUBLIC_API_URL=https://api.votre-domaine.com/api" > .env.local

# Démarrer avec PM2
pm2 start npm --name "mail-checker-frontend" -- start
pm2 save
pm2 startup
```

3. **Configurer Nginx pour le frontend**
```nginx
server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

##### Option C: Build statique

```bash
cd frontend
npm run build
npm run export  # Si configuré pour export statique
```

Déployer le dossier `out/` sur n'importe quel hébergement statique (Netlify, GitHub Pages, etc.)

### Option 4: Plateforme Cloud

#### Heroku

**Backend:**
1. Créer `Procfile`:
```
web: gunicorn config.wsgi
```

2. Déployer:
```bash
heroku create mail-checker-api
git subtree push --prefix backend heroku main
heroku config:set MONGODB_URI=...
```

**Frontend:**
```bash
heroku create mail-checker-web
git subtree push --prefix frontend heroku main
```

#### Railway.app

1. Connecter le repo GitHub
2. Déployer backend et frontend séparément
3. Configurer les variables d'environnement

#### DigitalOcean App Platform

1. Connecter le repo
2. Configurer deux composants (backend + frontend)
3. Définir les variables d'environnement

## Configuration MongoDB Atlas pour la production

1. **Whitelist IP addresses**
   - Aller dans Network Access
   - Ajouter les IPs de vos serveurs
   - Ou autoriser de partout (0.0.0.0/0) - moins sécurisé

2. **Créer un utilisateur dédié**
   - Database Access
   - Créer un nouvel utilisateur pour la production
   - Permissions: readWrite sur la database "Mail"

3. **Backup automatique**
   - Configurer les backups dans MongoDB Atlas
   - Schedule quotidien recommandé

## Checklist de sécurité production

- [ ] DEBUG=False dans settings.py
- [ ] SECRET_KEY unique et complexe
- [ ] HTTPS configuré (Let's Encrypt)
- [ ] CORS limité aux domaines autorisés
- [ ] MongoDB avec authentification
- [ ] IP whitelist sur MongoDB Atlas
- [ ] Rate limiting configuré
- [ ] Logs configurés et surveillés
- [ ] Backups automatiques activés
- [ ] Variables d'environnement sécurisées
- [ ] Firewall configuré (UFW sur Ubuntu)
- [ ] Updates de sécurité automatiques

## Monitoring

### Backend
```bash
# Logs Django
tail -f /var/log/mail-checker/django.log

# Logs Gunicorn
tail -f /var/log/mail-checker/gunicorn.log

# Logs Nginx
tail -f /var/log/nginx/error.log
```

### Frontend
```bash
# Logs PM2
pm2 logs mail-checker-frontend

# Monitoring
pm2 monit
```

## Performance

### Backend optimizations
- Gunicorn avec multiple workers
- Redis pour le cache (optionnel)
- Connection pooling MongoDB
- Compression Nginx

### Frontend optimizations
- Next.js Image optimization
- Static generation quand possible
- CDN pour les assets
- Compression Gzip/Brotli

## Rollback

### Backend
```bash
sudo systemctl stop mail-checker
cd /var/www/mail-checker/backend
git checkout previous-version
source venv/bin/activate
pip install -r requirements.txt
sudo systemctl start mail-checker
```

### Frontend
```bash
pm2 stop mail-checker-frontend
cd /var/www/mail-checker/frontend
git checkout previous-version
npm install
npm run build
pm2 restart mail-checker-frontend
```

## Support

Pour toute question sur le déploiement:
1. Vérifier les logs
2. Tester la connexion MongoDB
3. Vérifier les variables d'environnement
4. Tester les endpoints API manuellement
