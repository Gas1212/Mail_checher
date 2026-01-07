# Quick Start Guide - Email Checker

## Démarrage rapide en 5 minutes

### Étape 1: Installer Python et Node.js
Assurez-vous d'avoir:
- Python 3.8+ installé
- Node.js 18+ installé

### Étape 2: Démarrer le Backend

```bash
# Ouvrir un terminal
cd backend

# Créer l'environnement virtuel
python -m venv venv

# Activer l'environnement
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Démarrer le serveur
python manage.py runserver
```

✅ Backend démarré sur http://localhost:8000

### Étape 3: Démarrer le Frontend

```bash
# Ouvrir un NOUVEAU terminal (laisser le backend tourner)
cd frontend

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

✅ Frontend démarré sur http://localhost:3000

### Étape 4: Tester l'application

1. Ouvrir http://localhost:3000 dans votre navigateur
2. Entrer une adresse email (ex: test@gmail.com)
3. Cliquer sur "Check Email"
4. Observer les résultats!

## Configuration MongoDB

L'application est déjà configurée pour utiliser MongoDB Atlas:
- **Database**: Mail
- **Collection**: db
- Aucune configuration supplémentaire nécessaire!

## Problèmes courants

### Le backend ne démarre pas
```bash
# Vérifier que l'environnement virtuel est activé
# Vous devriez voir (venv) au début de votre ligne de commande

# Réinstaller les dépendances
pip install -r requirements.txt
```

### Le frontend ne démarre pas
```bash
# Supprimer node_modules et réinstaller
rm -rf node_modules
npm install
```

### Erreur de connexion MongoDB
- Vérifier votre connexion Internet
- Le fichier `.env` dans backend/ contient déjà les bonnes informations

### Port déjà utilisé

**Backend (port 8000):**
```bash
python manage.py runserver 8001
```

**Frontend (port 3000):**
```bash
npm run dev -- -p 3001
```

## Prochaines étapes

1. **Explorer l'interface**
   - Tester différents types d'emails
   - Consulter les statistiques
   - Voir l'historique des validations

2. **Accéder à l'admin Django**
   ```bash
   # Dans le terminal backend
   python manage.py createsuperuser
   # Suivre les instructions

   # Puis visiter: http://localhost:8000/admin/
   ```

3. **Tester l'API directement**
   ```bash
   curl -X POST http://localhost:8000/api/emails/check/ \
     -H "Content-Type: application/json" \
     -d '{"email": "test@example.com", "check_smtp": false}'
   ```

4. **Consulter la documentation**
   - [README.md](README.md) - Documentation complète
   - [API_EXAMPLES.md](API_EXAMPLES.md) - Exemples d'API
   - [INSTALLATION.md](INSTALLATION.md) - Guide détaillé

## Scripts utiles

### Arrêter les serveurs
- Appuyer sur `Ctrl+C` dans chaque terminal

### Réinitialiser l'environnement
```bash
# Backend
cd backend
rm -rf venv
python -m venv venv
source venv/bin/activate  # ou venv\Scripts\activate
pip install -r requirements.txt

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Lancer les tests

**Backend:**
```bash
cd backend
python manage.py test
```

**Frontend:**
```bash
cd frontend
npm test
```

## Besoin d'aide?

1. Vérifier les logs dans les terminaux
2. Consulter [INSTALLATION.md](INSTALLATION.md)
3. Voir la section "Dépannage" ci-dessus
4. Vérifier que MongoDB Atlas est accessible

## Félicitations! 🎉

Votre application Email Checker est maintenant opérationnelle!

**URLs importantes:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api
- Admin Django: http://localhost:8000/admin
