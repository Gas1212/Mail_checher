# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-12-26

### Ajouté (Added)

#### Backend
- ✨ API REST complète avec Django REST Framework
- ✨ Validation de syntaxe email (email-validator)
- ✨ Vérification DNS/MX records (dnspython)
- ✨ Vérification SMTP
- ✨ Détection des emails jetables
- ✨ Modèle EmailValidation pour MongoDB
- ✨ Modèle DisposableEmailDomain pour MongoDB
- ✨ Endpoint POST /api/emails/check/
- ✨ Endpoint GET /api/emails/history/
- ✨ Endpoint GET /api/emails/stats/
- ✨ Endpoint pour gestion des domaines jetables
- ✨ Endpoint bulk-add pour domaines jetables
- ✨ Interface admin Django
- ✨ Support MongoDB Atlas
- ✨ Configuration CORS
- ✨ Tests unitaires de base
- ✨ Gestion des variables d'environnement (.env)

#### Frontend
- ✨ Application Next.js 14 avec App Router
- ✨ Support TypeScript complet
- ✨ Interface utilisateur moderne avec Tailwind CSS
- ✨ Composant EmailChecker pour validation
- ✨ Composant Stats pour statistiques
- ✨ Composant History pour historique
- ✨ Client API avec Axios
- ✨ Types TypeScript pour toutes les données
- ✨ Design responsive
- ✨ Affichage détaillé des résultats
- ✨ Options de configuration (SMTP check)
- ✨ Gestion des états de chargement
- ✨ Gestion des erreurs
- ✨ Configuration Tailwind CSS personnalisée

#### Documentation
- 📚 README.md principal complet
- 📚 QUICKSTART.md pour démarrage rapide
- 📚 INSTALLATION.md détaillé
- 📚 API_EXAMPLES.md avec exemples curl et code
- 📚 PROJECT_STRUCTURE.md pour architecture
- 📚 DEPLOYMENT.md pour production
- 📚 ROADMAP.md pour fonctionnalités futures
- 📚 CONTRIBUTING.md pour contributeurs
- 📚 USAGE_GUIDE.md pour utilisateurs
- 📚 FAQ.md pour questions fréquentes
- 📚 SUMMARY.md récapitulatif
- 📚 LICENSE (MIT)
- 📚 README.md backend
- 📚 README.md frontend

#### Configuration
- ⚙️ Docker et docker-compose.yml
- ⚙️ Scripts de démarrage (start-dev.sh, start-dev.bat)
- ⚙️ Configuration MongoDB Atlas
- ⚙️ Fichiers .env.example
- ⚙️ .gitignore complet
- ⚙️ .gitattributes pour fins de lignes
- ⚙️ pytest.ini pour tests backend
- ⚙️ jest.config.js pour tests frontend
- ⚙️ ESLint configuration
- ⚙️ TypeScript configuration
- ⚙️ Tailwind configuration
- ⚙️ PostCSS configuration

#### Outils
- 🛠️ Liste de 18+ domaines jetables par défaut
- 🛠️ Helper pour obtenir l'IP du client
- 🛠️ Formatage des dates
- 🛠️ Codes couleur pour statuts

### Fonctionnalités techniques

- **Backend Framework**: Django 5.0
- **API Framework**: Django REST Framework 3.14
- **Base de données**: MongoDB via Djongo
- **Validation DNS**: dnspython 2.4.2
- **Validation Email**: email-validator 2.1.0
- **Configuration**: python-decouple 3.8
- **CORS**: django-cors-headers 4.3.1

- **Frontend Framework**: Next.js 14
- **UI Library**: React 18
- **Language**: TypeScript 5.3
- **Styling**: Tailwind CSS 3.4
- **HTTP Client**: Axios 1.6
- **Build Tool**: Next.js bundler

### Sécurité

- ✅ Variables d'environnement pour secrets
- ✅ CORS configuré et restreint
- ✅ Validation des entrées côté serveur
- ✅ MongoDB avec authentification (Atlas)
- ✅ Support HTTPS (production)
- ✅ Pas de credentials dans le code

### Performance

- ⚡ Validation syntaxe: < 1s
- ⚡ Validation DNS: 1-2s
- ⚡ Validation complète (SMTP): 5-10s
- ⚡ API response time: ~500ms (sans SMTP)

## [Unreleased]

### Planifié pour v1.1.0
- [ ] Authentification utilisateur (JWT)
- [ ] Rate limiting par IP/utilisateur
- [ ] Export CSV/Excel
- [ ] Mode sombre
- [ ] Graphiques interactifs
- [ ] Tests E2E

### Planifié pour v1.2.0
- [ ] Validation en batch (CSV upload)
- [ ] Cache Redis
- [ ] Queue système (Celery)
- [ ] Webhooks
- [ ] API versioning

### Planifié pour v2.0.0
- [ ] Machine Learning pour prédiction
- [ ] Multi-tenant
- [ ] Plans d'abonnement
- [ ] Application mobile
- [ ] Browser extensions

## Types de changements

- `Added` pour les nouvelles fonctionnalités
- `Changed` pour les modifications de fonctionnalités existantes
- `Deprecated` pour les fonctionnalités bientôt supprimées
- `Removed` pour les fonctionnalités supprimées
- `Fixed` pour les corrections de bugs
- `Security` pour les failles de sécurité

---

[1.0.0]: https://github.com/votre-repo/Mail-checker/releases/tag/v1.0.0
[Unreleased]: https://github.com/votre-repo/Mail-checker/compare/v1.0.0...HEAD
