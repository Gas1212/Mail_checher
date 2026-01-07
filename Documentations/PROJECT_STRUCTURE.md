# Structure du projet Email Checker

## Vue d'ensemble

```
Mail-checker/
├── backend/                    # Backend Django REST API
│   ├── config/                # Configuration Django
│   │   ├── __init__.py
│   │   ├── settings.py       # Configuration principale
│   │   ├── urls.py           # Routes principales
│   │   ├── wsgi.py           # WSGI config
│   │   └── asgi.py           # ASGI config
│   │
│   ├── email_checker/         # Application de validation
│   │   ├── __init__.py
│   │   ├── models.py         # Modèles MongoDB (EmailValidation, DisposableEmailDomain)
│   │   ├── views.py          # API ViewSets
│   │   ├── serializers.py    # DRF Serializers
│   │   ├── validators.py     # Logique de validation email
│   │   ├── urls.py           # Routes API
│   │   ├── admin.py          # Configuration admin Django
│   │   └── apps.py           # Configuration app
│   │
│   ├── manage.py              # Script de gestion Django
│   ├── requirements.txt       # Dépendances Python
│   ├── .env                   # Variables d'environnement (non versionné)
│   ├── .env.example          # Exemple de configuration
│   └── README.md             # Documentation backend
│
├── frontend/                  # Frontend Next.js
│   ├── src/
│   │   ├── app/              # Next.js App Router
│   │   │   ├── layout.tsx   # Layout principal
│   │   │   ├── page.tsx     # Page d'accueil
│   │   │   └── globals.css  # Styles globaux
│   │   │
│   │   ├── components/       # Composants React
│   │   │   ├── EmailChecker.tsx  # Formulaire de validation
│   │   │   ├── Stats.tsx         # Composant statistiques
│   │   │   └── History.tsx       # Tableau d'historique
│   │   │
│   │   ├── lib/              # Utilitaires
│   │   │   └── api.ts        # Client API Axios
│   │   │
│   │   └── types/            # Types TypeScript
│   │       └── index.ts      # Interfaces et types
│   │
│   ├── public/               # Fichiers statiques
│   ├── package.json          # Dépendances Node.js
│   ├── tsconfig.json         # Configuration TypeScript
│   ├── next.config.js        # Configuration Next.js
│   ├── tailwind.config.js    # Configuration Tailwind CSS
│   ├── postcss.config.js     # Configuration PostCSS
│   ├── .env.local.example    # Exemple de configuration
│   └── README.md             # Documentation frontend
│
├── .gitignore                # Fichiers à ignorer par Git
├── README.md                 # Documentation principale
├── INSTALLATION.md           # Guide d'installation
├── API_EXAMPLES.md           # Exemples d'utilisation API
├── PROJECT_STRUCTURE.md      # Ce fichier
├── start-dev.sh             # Script de démarrage (Linux/Mac)
└── start-dev.bat            # Script de démarrage (Windows)
```

## Détail des composants

### Backend (Django)

#### models.py
- `EmailValidation` - Stocke les résultats de validation
  - email, is_valid_syntax, is_valid_dns, is_valid_smtp
  - is_disposable, mx_records, validation_message
  - created_at, ip_address

- `DisposableEmailDomain` - Liste des domaines jetables
  - domain, added_at, is_active

#### validators.py
- `EmailValidator` - Classe principale de validation
  - `validate_syntax()` - Validation du format
  - `validate_dns()` - Vérification DNS/MX
  - `validate_smtp()` - Test SMTP
  - `check_disposable()` - Détection email jetable
  - `validate_email_complete()` - Validation complète

#### views.py
- `EmailValidationViewSet`
  - `check_email()` - POST /api/emails/check/
  - `get_history()` - GET /api/emails/history/
  - `get_stats()` - GET /api/emails/stats/

- `DisposableEmailDomainViewSet`
  - CRUD pour les domaines jetables
  - `bulk_add_domains()` - Ajout en masse

### Frontend (Next.js)

#### Components

**EmailChecker.tsx**
- Formulaire de validation
- Affichage des résultats
- Options de configuration (SMTP check)

**Stats.tsx**
- Carte de statistiques
- 4 métriques principales
- Design responsive avec Tailwind

**History.tsx**
- Tableau d'historique
- Filtre par limite
- Affichage formaté des dates

#### API Client (lib/api.ts)
```typescript
emailAPI.checkEmail(data)     // Vérifier un email
emailAPI.getHistory(limit)    // Obtenir l'historique
emailAPI.getStats()           // Obtenir les stats
```

#### Types (types/index.ts)
- `EmailValidationResult`
- `EmailCheckRequest`
- `ValidationStats`
- `DisposableDomain`

## Flux de données

```
User Input (Frontend)
    ↓
EmailChecker Component
    ↓
API Client (Axios)
    ↓
Django REST API
    ↓
EmailValidator Class
    ↓
External Services (DNS, SMTP)
    ↓
MongoDB (via Djongo)
    ↓
Response to Frontend
    ↓
Display Results
```

## Base de données MongoDB

### Collections

**email_validations**
```javascript
{
  _id: ObjectId,
  email: String,
  is_valid_syntax: Boolean,
  is_valid_dns: Boolean,
  is_valid_smtp: Boolean,
  is_disposable: Boolean,
  mx_records: Array,
  validation_message: String,
  created_at: Date,
  ip_address: String
}
```

**disposable_domains**
```javascript
{
  _id: ObjectId,
  domain: String,
  added_at: Date,
  is_active: Boolean
}
```

## Technologies utilisées

### Backend
- **Django 5.0** - Framework web
- **Django REST Framework** - API REST
- **Djongo** - Connecteur MongoDB
- **dnspython** - Résolution DNS
- **email-validator** - Validation syntaxe
- **python-decouple** - Gestion config

### Frontend
- **Next.js 14** - Framework React
- **React 18** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling
- **Axios** - Client HTTP

### Base de données
- **MongoDB Atlas** - Base de données cloud
  - URI: mongodb+srv://cluster0.jojbiqs.mongodb.net/
  - Database: Mail
  - Collection: db

## Points d'entrée

### Development
- Backend: `python manage.py runserver` → http://localhost:8000
- Frontend: `npm run dev` → http://localhost:3000
- Admin: http://localhost:8000/admin/

### Production
- Backend: Gunicorn + Nginx
- Frontend: Next.js build + deployment
- Database: MongoDB Atlas (production ready)

## Sécurité

- Variables d'environnement pour les secrets
- CORS configuré
- Validation des entrées
- MongoDB Atlas avec authentification
- HTTPS recommandé en production

## Performance

- Validation async
- Cache DNS (optionnel)
- Pagination de l'historique
- Index MongoDB sur les champs fréquents
- Connexion pooling MongoDB

## Évolutions futures

- [ ] Authentification utilisateur
- [ ] Rate limiting
- [ ] Cache Redis
- [ ] Validation en batch
- [ ] Webhooks pour notifications
- [ ] Export CSV/Excel
- [ ] API versioning
- [ ] Tests unitaires et d'intégration
- [ ] CI/CD pipeline
- [ ] Docker containerization
