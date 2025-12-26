# Email Checker - Full Stack Web Application

Application web complète pour la validation d'emails avec backend Django et frontend Next.js.

## 🚀 Fonctionnalités

- ✅ **Validation de syntaxe email** - Vérification du format de l'adresse email
- 🌐 **Vérification DNS/MX records** - Validation du domaine et des enregistrements MX
- 📧 **Vérification SMTP** - Test de l'existence réelle de la boîte email
- 🚫 **Détection emails jetables** - Identification des services d'emails temporaires
- 📊 **Statistiques** - Tableau de bord avec métriques de validation
- 📜 **Historique** - Suivi de toutes les validations effectuées
- 💾 **MongoDB** - Stockage des validations dans MongoDB

## 🏗️ Architecture

```
Mail-checker/
├── backend/           # Django REST API
│   ├── config/       # Configuration Django
│   ├── email_checker/ # Application de validation
│   ├── requirements.txt
│   └── manage.py
├── frontend/         # Next.js Application
│   ├── src/
│   │   ├── app/     # Pages Next.js
│   │   ├── components/ # Composants React
│   │   ├── lib/     # Utilitaires
│   │   └── types/   # Types TypeScript
│   └── package.json
└── README.md
```

## 📋 Prérequis

- Python 3.8+
- Node.js 18+
- MongoDB 4.0+

## 🛠️ Installation

### Backend (Django)

1. Créer un environnement virtuel:
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
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

4. S'assurer que MongoDB est en cours d'exécution

5. Effectuer les migrations:
```bash
python manage.py migrate
```

6. (Optionnel) Créer un superuser:
```bash
python manage.py createsuperuser
```

7. Lancer le serveur:
```bash
python manage.py runserver
```

Le backend sera accessible sur `http://localhost:8000`

### Frontend (Next.js)

1. Installer les dépendances:
```bash
cd frontend
npm install
```

2. Configurer les variables d'environnement:
```bash
cp .env.local.example .env.local
```

3. Lancer le serveur de développement:
```bash
npm run dev
```

Le frontend sera accessible sur `http://localhost:3000`

## 📡 API Endpoints

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
```

## 🎨 Technologies utilisées

### Backend
- Django 5.0
- Django REST Framework
- Djongo (MongoDB connector)
- dnspython (DNS validation)
- email-validator
- python-decouple

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Axios

## 📝 Variables d'environnement

### Backend (.env)
```env
DEBUG=True
SECRET_KEY=your-secret-key-here
MONGODB_URI=mongodb://localhost:27017/
MONGODB_NAME=email_checker
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 🧪 Utilisation

1. Démarrer MongoDB
2. Lancer le backend Django
3. Lancer le frontend Next.js
4. Ouvrir `http://localhost:3000` dans votre navigateur
5. Entrer une adresse email et cliquer sur "Check Email"

## 📊 Exemple de réponse API

```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "test@example.com",
  "is_valid_syntax": true,
  "is_valid_dns": true,
  "is_valid_smtp": true,
  "is_disposable": false,
  "mx_records": ["mail.example.com"],
  "validation_message": "Email is valid and verified",
  "created_at": "2025-12-26T10:30:00Z",
  "details": {
    "syntax": "Valid email syntax: test@example.com",
    "dns": "Found 1 MX record(s)",
    "smtp": "Email address exists",
    "disposable": "Not a known disposable email"
  }
}
```

## 🔒 Sécurité

- CORS configuré pour accepter uniquement le frontend
- Validation des entrées côté serveur
- Rate limiting recommandé pour la production
- Variables d'environnement pour les configurations sensibles

## 🚀 Déploiement

### Backend
- Configurer `DEBUG=False` en production
- Utiliser un serveur WSGI (Gunicorn)
- Configurer un reverse proxy (Nginx)
- Utiliser une base de données MongoDB sécurisée

### Frontend
- Build de production: `npm run build`
- Déploiement sur Vercel, Netlify ou autre plateforme

## 📄 License

MIT

## 👥 Contribution

Les contributions sont les bienvenues! N'hésitez pas à ouvrir une issue ou une pull request.
