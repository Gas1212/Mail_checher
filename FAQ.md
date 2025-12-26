# FAQ - Questions fréquentes

## Questions générales

### Qu'est-ce que Email Checker?
Email Checker est une application web complète pour valider des adresses email. Elle vérifie la syntaxe, le DNS, le SMTP et détecte les emails jetables.

### Est-ce gratuit?
Oui, le code source est open-source sous licence MIT. Vous pouvez l'utiliser, le modifier et le déployer gratuitement.

### Quelles sont les limites?
Aucune limite dans le code actuel. Vous pouvez ajouter du rate limiting selon vos besoins.

## Installation

### Quels sont les prérequis?
- Python 3.8 ou supérieur
- Node.js 18 ou supérieur
- Connexion Internet (pour MongoDB Atlas)

### Puis-je utiliser MongoDB local au lieu de Atlas?
Oui! Modifiez `MONGODB_URI` dans `.env` pour pointer vers votre instance locale:
```
MONGODB_URI=mongodb://localhost:27017/
```

### L'installation échoue sur Windows
Assurez-vous d'utiliser:
- PowerShell ou CMD (pas Git Bash pour Python)
- `venv\Scripts\activate` (pas `source venv/bin/activate`)

### Erreur "Python not found"
Installez Python depuis [python.org](https://python.org) et cochez "Add to PATH" lors de l'installation.

## Utilisation

### Comment valider un email?
1. Démarrer l'application (backend + frontend)
2. Ouvrir http://localhost:3000
3. Entrer l'email dans le formulaire
4. Cliquer sur "Check Email"

### Quelle est la différence entre validation avec/sans SMTP?
- **Sans SMTP**: Rapide (1-2s), vérifie format + DNS
- **Avec SMTP**: Lent (5-10s), vérifie aussi l'existence de la boîte

### Pourquoi un email valide apparaît invalide?
Plusieurs raisons possibles:
- Le serveur bloque les vérifications SMTP
- Protections anti-spam
- Domaine temporairement inaccessible
- Timeout réseau

### Les emails jetables sont-ils tous détectés?
Non, nous avons une liste de domaines connus. Vous pouvez en ajouter via l'admin Django ou l'API.

### Comment ajouter des domaines jetables?
```bash
# Via l'API
curl -X POST http://localhost:8000/api/disposable-domains/bulk-add/ \
  -H "Content-Type: application/json" \
  -d '{"domains": ["temp.com", "fake.com"]}'

# Ou via l'admin Django
http://localhost:8000/admin/
```

## Performance

### La validation est lente
C'est normal avec SMTP activé (5-10s). Pour plus de rapidité:
- Désactivez SMTP
- Utilisez le cache (future fonctionnalité)

### Combien d'emails puis-je valider par seconde?
Dépend de:
- SMTP activé: ~1-2 par seconde
- SMTP désactivé: ~10-20 par seconde
- Validation en batch (future): beaucoup plus

### Comment optimiser les performances?
- Désactiver SMTP pour validations non critiques
- Implémenter Redis pour le cache
- Utiliser un CDN pour le frontend
- Scaler horizontalement le backend

## Sécurité

### Les données sont-elles sécurisées?
Oui:
- HTTPS en production (recommandé)
- MongoDB avec authentification
- CORS configuré
- Validation des entrées

### Dois-je protéger l'API?
En production, oui:
- Ajouter une authentification
- Implémenter rate limiting
- Utiliser API keys

### Comment sécuriser MongoDB?
- Utiliser MongoDB Atlas (sécurisé par défaut)
- Whitelist les IPs autorisées
- Utiliser des credentials forts
- Activer les backups

## Développement

### Comment contribuer?
Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour le guide complet.

### Comment ajouter une fonctionnalité?
1. Fork le projet
2. Créer une branche feature
3. Implémenter avec tests
4. Soumettre une Pull Request

### Où sont les tests?
- Backend: `backend/email_checker/tests.py`
- Frontend: À ajouter dans `__tests__/`

### Comment lancer les tests?
```bash
# Backend
cd backend
python manage.py test

# Frontend
cd frontend
npm test
```

## API

### Comment utiliser l'API?
Voir [API_EXAMPLES.md](API_EXAMPLES.md) pour tous les exemples.

### Existe-t-il une documentation Swagger?
Pas encore, mais c'est prévu dans la roadmap.

### Puis-je utiliser l'API sans le frontend?
Absolument! L'API est complètement indépendante.

### Format des réponses API?
JSON uniquement. Exemple:
```json
{
  "email": "test@example.com",
  "is_valid_syntax": true,
  "is_valid_dns": true,
  ...
}
```

## Déploiement

### Comment déployer en production?
Voir [DEPLOYMENT.md](DEPLOYMENT.md) pour le guide complet.

### Puis-je déployer sur Heroku?
Oui! Créez un `Procfile` et suivez les instructions Heroku.

### Quelle est la meilleure option de déploiement?
Recommandé:
- Backend: Railway.app, DigitalOcean, ou VPS
- Frontend: Vercel, Netlify
- Database: MongoDB Atlas (déjà configuré)

### Docker est-il supporté?
Oui! Utilisez `docker-compose up` pour démarrer.

## Problèmes courants

### "Port already in use"
```bash
# Changer le port backend
python manage.py runserver 8001

# Changer le port frontend
npm run dev -- -p 3001
```

### "Module not found"
```bash
# Backend
pip install -r requirements.txt

# Frontend
npm install
```

### "Cannot connect to MongoDB"
Vérifiez:
1. Connexion Internet
2. Credentials dans `.env`
3. IP whitelistée dans MongoDB Atlas
4. URI correcte

### "CORS error"
Vérifiez `CORS_ALLOWED_ORIGINS` dans `backend/.env`:
```
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend ne charge pas les données
Vérifiez:
1. Backend est démarré
2. `NEXT_PUBLIC_API_URL` dans `frontend/.env.local`
3. Pas d'erreurs dans la console navigateur

### "django.core.exceptions.ImproperlyConfigured"
Problème avec `settings.py`. Vérifiez:
- Variables d'environnement dans `.env`
- `SECRET_KEY` est défini
- Base de données configurée

## Base de données

### Puis-je voir les données dans MongoDB?
Oui, utilisez:
- MongoDB Compass (GUI)
- Studio 3T
- MongoDB Atlas web interface

### Comment sauvegarder les données?
MongoDB Atlas a des backups automatiques. Pour local:
```bash
mongodump --db Mail --out backup/
```

### Comment restaurer un backup?
```bash
mongorestore --db Mail backup/Mail/
```

### Puis-je changer de base de données?
Oui, Django supporte PostgreSQL, MySQL, etc. Mais vous devrez:
1. Modifier `DATABASES` dans settings
2. Adapter les modèles (supprimer ObjectIdField)
3. Recréer les migrations

## Fonctionnalités

### Puis-je valider plusieurs emails à la fois?
Pas encore dans l'interface, mais vous pouvez:
- Utiliser l'API en boucle
- Attendre la fonctionnalité batch (roadmap)

### Y a-t-il un historique par utilisateur?
Pas encore. Actuellement, l'historique est global. L'authentification est dans la roadmap.

### Puis-je exporter les données?
Pas d'export intégré actuellement, mais vous pouvez:
- Utiliser l'API pour récupérer les données
- Les exporter avec MongoDB Compass
- Attendre la fonctionnalité d'export (roadmap)

### Comment ajouter l'authentification?
C'est planifié dans la roadmap. Pour l'implémenter maintenant:
1. Installer `djangorestframework-simplejwt`
2. Configurer JWT dans settings
3. Ajouter endpoints login/register
4. Protéger les routes

## Licence

### Puis-je utiliser ce code commercialement?
Oui, la licence MIT l'autorise.

### Dois-je créditer les auteurs?
Apprécié mais pas obligatoire selon la licence MIT.

### Puis-je vendre ce logiciel?
Oui, mais vous devez inclure la licence MIT.

## Support

### Où obtenir de l'aide?
1. Consulter la documentation
2. Vérifier les issues GitHub
3. Créer une nouvelle issue
4. Consulter le code source

### Comment rapporter un bug?
Créer une issue GitHub avec:
- Description du problème
- Étapes pour reproduire
- Environnement (OS, versions)
- Logs d'erreur

### Existe-t-il un Discord/Slack?
Pas encore. Utilisez GitHub Issues pour le moment.

## Roadmap

### Quelles sont les prochaines fonctionnalités?
Voir [ROADMAP.md](ROADMAP.md) pour la liste complète:
- Authentification utilisateur
- Validation en batch
- Export de données
- API keys
- Et plus!

### Puis-je proposer une fonctionnalité?
Absolument! Créez une issue avec le tag `enhancement`.

### Quand sera disponible [fonctionnalité X]?
Consultez [ROADMAP.md](ROADMAP.md) pour le planning estimé.

## Divers

### Quelle est la précision de la validation?
- Syntaxe: ~100%
- DNS: ~99%
- SMTP: ~80-90% (dépend des serveurs)
- Disposable: ~70-80% (liste limitée)

### Combien de domaines jetables sont détectés?
~18 domaines par défaut. Vous pouvez en ajouter via l'admin.

### Puis-je intégrer avec mon CRM?
Oui, via l'API REST. Des connecteurs spécifiques sont dans la roadmap.

### Est-ce que ça fonctionne avec tous les fournisseurs email?
La plupart, oui. Certains (Gmail, Outlook) bloquent parfois la vérification SMTP.

---

**Question non listée?**
Créez une issue GitHub avec le tag `question`!
