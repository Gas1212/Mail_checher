# Guide d'installation - Email Checker

## Prérequis

- Python 3.8+ installé
- Node.js 18+ installé
- Connexion Internet (pour MongoDB Atlas)

## Installation rapide

### 1. Backend Django

```bash
# Naviguer vers le dossier backend
cd backend

# Créer un environnement virtuel
python -m venv venv

# Activer l'environnement virtuel
# Sur Windows:
venv\Scripts\activate
# Sur Linux/Mac:
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Le fichier .env est déjà configuré avec MongoDB Atlas
# Vérifier que .env contient:
# MONGODB_URI=mongodb+srv://carthagehannibalbarka_db_user:5A65wyZxYuDANKcZ@cluster0.jojbiqs.mongodb.net/
# MONGODB_NAME=Mail

# Effectuer les migrations (optionnel avec MongoDB)
python manage.py migrate

# Créer un superuser pour l'admin Django (optionnel)
python manage.py createsuperuser

# Démarrer le serveur
python manage.py runserver
```

Le backend sera accessible sur http://localhost:8000

### 2. Frontend Next.js

```bash
# Ouvrir un nouveau terminal
# Naviguer vers le dossier frontend
cd frontend

# Installer les dépendances
npm install

# Créer le fichier de configuration
cp .env.local.example .env.local

# Démarrer le serveur de développement
npm run dev
```

Le frontend sera accessible sur http://localhost:3000

## Démarrage rapide avec scripts

### Windows
```bash
start-dev.bat
```

### Linux/Mac
```bash
chmod +x start-dev.sh
./start-dev.sh
```

## Configuration MongoDB Atlas

La connexion MongoDB Atlas est déjà configurée:
- **URI**: mongodb+srv://cluster0.jojbiqs.mongodb.net/
- **Database**: Mail
- **Collection**: db

Assurez-vous que:
1. Votre adresse IP est autorisée dans MongoDB Atlas
2. Les credentials sont corrects
3. Vous avez une connexion Internet stable

## Tester l'application

1. Ouvrir http://localhost:3000
2. Entrer une adresse email (ex: test@gmail.com)
3. Cliquer sur "Check Email"
4. Observer les résultats de validation

## API Endpoints disponibles

- `POST http://localhost:8000/api/emails/check/` - Valider un email
- `GET http://localhost:8000/api/emails/history/` - Historique
- `GET http://localhost:8000/api/emails/stats/` - Statistiques
- `GET http://localhost:8000/admin/` - Interface admin Django

## Dépannage

### Problème de connexion MongoDB
Si vous avez une erreur de connexion MongoDB:
1. Vérifiez votre connexion Internet
2. Vérifiez que votre IP est dans la whitelist MongoDB Atlas
3. Vérifiez les credentials dans `.env`

### Erreur "Module not found"
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

### Port déjà utilisé
Si les ports 8000 ou 3000 sont déjà utilisés:

Backend:
```bash
python manage.py runserver 8001
```

Frontend:
```bash
npm run dev -- -p 3001
```

## Prochaines étapes

1. Personnaliser les domaines jetables dans l'admin Django
2. Tester différents types d'emails
3. Consulter les statistiques
4. Explorer l'historique des validations

## Support

Pour toute question, consultez:
- README.md pour la documentation complète
- backend/README.md pour le backend
- frontend/README.md pour le frontend
