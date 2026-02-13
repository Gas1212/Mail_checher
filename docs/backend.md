# Backend — Django REST API

## Localisation

```
backend/
├── config/
│   ├── settings.py       # Configuration Django
│   ├── urls.py           # Routes principales
│   └── wsgi.py           # Point d'entrée WSGI
├── email_checker/
│   ├── views.py          # Endpoints email validation
│   ├── tool_views.py     # Endpoints outils (MX, blacklist, role...)
│   ├── auth_views.py     # Authentification (register, login, Google OAuth)
│   ├── validators.py     # Logique de validation email
│   ├── models.py         # Modèles Django
│   ├── serializers.py    # Sérialiseurs DRF
│   ├── mongo_auth.py     # Helpers MongoDB pour auth
│   ├── db.py             # Connexion MongoDB
│   └── tools/            # Outils internes (DNS, SMTP...)
├── seo_tools/
│   ├── views.py          # Sitemap validator + finder
│   └── urls.py
├── content_generator/
│   ├── views.py          # Endpoint génération contenu
│   ├── groq_service.py   # Intégration API Groq
│   └── urls.py
├── manage.py
├── requirements.txt
└── passenger_wsgi.py     # Serv00 Passenger entry point
```

## Endpoints API

### Email Validation (`/api/email-checker/`)

| Méthode | Endpoint | Description |
|---|---|---|
| POST | `/api/email-checker/validate/` | Valider une adresse email |
| POST | `/api/email-checker/bulk/` | Valider en masse (CSV/liste) |
| POST | `/api/email-checker/mx-lookup/` | Lookup MX records |
| POST | `/api/email-checker/role-detector/` | Détecter emails de rôle |
| POST | `/api/email-checker/list-cleaner/` | Nettoyer une liste d'emails |
| POST | `/api/email-checker/blacklist/` | Vérifier blacklist |

### Authentification (`/api/auth/`)

| Méthode | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register/` | Inscription |
| POST | `/api/auth/login/` | Connexion email/password |
| POST | `/api/auth/google/` | Connexion Google OAuth |
| GET | `/api/auth/profile/` | Profil utilisateur |
| POST | `/api/auth/logout/` | Déconnexion |

### SEO Tools (`/api/seo/`)

| Méthode | Endpoint | Description |
|---|---|---|
| POST | `/api/seo/sitemap-validator/` | Valider un sitemap XML |
| POST | `/api/seo/sitemap-finder/` | Découvrir les sitemaps d'un site |

### Content Generator (`/api/content/`)

| Méthode | Endpoint | Description |
|---|---|---|
| POST | `/api/content/generate/` | Générer du contenu marketing |

## Validation Email

La validation se fait en plusieurs étapes :

1. **Syntaxe** — regex sur format email
2. **DNS/MX** — vérification enregistrements MX via `dnspython`
3. **SMTP** — connexion SMTP sans envoi pour confirmer l'existence
4. **Disposable** — comparaison avec liste de domaines jetables

## Base de données

### MongoDB (principal)
- Collection `users` — profils utilisateurs, crédits, plan
- Collection `email_results` — historique des validations
- Connexion via `pymongo` dans `db.py`

### SQLite (secondaire)
- Utilisé uniquement pour l'admin Django
- Fichier `db.sqlite3` à la racine du backend

## Variables d'environnement

```env
SECRET_KEY=...
DEBUG=False
ALLOWED_HOSTS=api.sugesto.xyz,localhost
MONGODB_URI=mongodb+srv://...
GROQ_API_KEY=gsk_...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

## Content Generator — Groq Integration

Le fichier `groq_service.py` appelle l'API Groq pour la génération de contenu côté serveur.

Modèle utilisé : `llama-3.1-8b-instant`

**Note** : Le frontend `content-generator` peut aussi appeler Groq directement depuis le navigateur (clé API fournie par l'utilisateur) — sans passer par le backend.

## CORS

Configuré dans `settings.py` via `django-cors-headers` :

```python
CORS_ALLOWED_ORIGINS = [
    "https://sugesto.xyz",
    "https://app.sugesto.xyz",
]
```
