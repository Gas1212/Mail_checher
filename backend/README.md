# Email Checker Backend (Django)

Backend API pour la validation d'emails avec Django REST Framework et MongoDB.

## Fonctionnalités

- ✅ Validation de syntaxe email
- ✅ Vérification DNS/MX records
- ✅ Vérification SMTP
- ✅ Détection emails jetables/temporaires
- ✅ Historique des validations
- ✅ Statistiques

## Installation

1. Créer un environnement virtuel:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows
```

2. Installer les dépendances:
```bash
pip install -r requirements.txt
```

3. Configurer les variables d'environnement:
```bash
cp .env.example .env
# Éditer .env avec vos configurations
```

4. Assurez-vous que MongoDB est en cours d'exécution

5. Effectuer les migrations:
```bash
python manage.py migrate
```

6. Créer un superuser (optionnel):
```bash
python manage.py createsuperuser
```

7. Lancer le serveur:
```bash
python manage.py runserver
```

## API Endpoints

### Validation d'email
```
POST /api/emails/check/
Body: {
  "email": "test@example.com",
  "check_smtp": true
}
```

### Historique
```
GET /api/emails/history/?limit=10
```

### Statistiques
```
GET /api/emails/stats/
```

### Gestion des domaines jetables
```
GET /api/disposable-domains/
POST /api/disposable-domains/
POST /api/disposable-domains/bulk-add/
Body: {
  "domains": ["tempmail.com", "fakeinbox.com"]
}
```

## Structure du projet

```
backend/
├── config/              # Configuration Django
├── email_checker/       # Application principale
│   ├── models.py       # Modèles MongoDB
│   ├── validators.py   # Logique de validation
│   ├── views.py        # API endpoints
│   ├── serializers.py  # DRF serializers
│   └── urls.py         # Routes API
├── manage.py
└── requirements.txt
```
