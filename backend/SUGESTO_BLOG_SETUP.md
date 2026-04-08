# Configuration du Blog Sugesto (Wagtail)

## Vue d'ensemble
Le blog Sugesto a été dupliqué à partir du blog Wagtail du projet Preisradio. Il utilise:
- **Wagtail 7.3.1** pour la gestion du contenu
- **Django 5.0.1** comme framework web
- **Cloudinary** pour le stockage des images
- **Claude/Groq/Mistral/OpenAI** pour la génération d'articles IA

## Structure des fichiers

```
backend/
├── sugesto_blog/                 # Application Django du blog
│   ├── migrations/               # Migrations de base de données (à générer)
│   ├── models.py                # BlogIndexPage, BlogPage
│   ├── views.py                 # API REST endpoints
│   ├── views_admin.py           # Génération d'articles IA
│   ├── views_pinterest.py       # Intégration Pinterest
│   ├── urls.py                  # Routes API du blog
│   ├── apps.py                  # Configuration de l'app
│   ├── ai_generator.py          # Prompts et logique de génération IA
│   ├── pinterest_integration.py # Intégration Pinterest v5
│   └── wagtail_hooks.py         # Hooks Wagtail pour l'admin
└── SUGESTO_BLOG_SETUP.md       # Ce fichier
```

## Étapes d'installation

### 1. Installer les dépendances
```bash
cd backend
pip install -r requirements.txt
```

Cela installe:
- `wagtail==7.3.1` et ses dépendances (modelcluster, taggit, etc.)
- `cloudinary` et `django-cloudinary-storage` pour les images
- `anthropic`, `openai` pour la génération IA

### 2. Générer les migrations initiales
```bash
python manage.py makemigrations sugesto_blog
python manage.py migrate sugesto_blog
```

Cela crée les tables pour `BlogIndexPage` et `BlogPage` dans la base de données.

### 3. Créer un superutilisateur (pour accéder à Wagtail)
```bash
python manage.py createsuperuser
```

### 4. Créer la page index du blog
```bash
python manage.py shell
```

Puis dans le shell Django:
```python
from wagtail.models import Page
from sugesto_blog.models import BlogIndexPage

# Récupérer la page racine
root = Page.get_root_nodes()[0]

# Créer la page index du blog
blog_index = BlogIndexPage(title="Blog", slug="blog")
root.add_child(instance=blog_index)
blog_index.publish()
```

### 5. Démarrer le serveur de développement
```bash
python manage.py runserver
```

Accédez à:
- **Wagtail Admin**: http://localhost:8000/wagtail-admin/
- **API Blog**: http://localhost:8000/api/blog/articles/

## API Endpoints

### Lister tous les articles
```
GET /api/blog/articles/
```
Retourne une liste JSON de tous les articles publiés.

### Récupérer un article spécifique
```
GET /api/blog/articles/<slug>/
```
Exemple: `GET /api/blog/articles/beste-kopfhorer-2024/`

### Récupérer tous les slugs (pour Next.js generateStaticParams)
```
GET /api/blog/slugs/
```

## Configuration requise

### Variables d'environnement (.env)

```env
# Cloudinary (pour stocker les images)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Pinterest (optionnel - pour publier automatiquement sur Pinterest)
PINTEREST_APP_ID=your_app_id
PINTEREST_APP_SECRET=your_app_secret
PINTEREST_DEFAULT_BOARD=your_board_id

# Génération IA (choisir au moins un provider)
OPENAI_API_KEY=your_openai_key          # Pour GPT-4/3.5
ANTHROPIC_API_KEY=your_anthropic_key    # Pour Claude
GROQ_API_KEY=your_groq_key             # Pour Llama (gratuit)
MISTRAL_API_KEY=your_mistral_key        # Pour Mistral
```

## Modèles de données

### BlogIndexPage
Page parente qui liste tous les articles du blog.
- `intro` (RichTextField): Texte d'introduction optionnel

### BlogPage
Article individuel du blog avec les champs:
- `excerpt` (CharField, 500 chars): Description courte pour la liste
- `content` (TextField): Contenu HTML complet
- `category` (CharField): Catégorie (Kaufberatung, Spartipps, Technik, Nachrichten, Testberichte)
- `image` (ForeignKey to wagtailimages.Image): Image de couverture
- `amazon_keywords` (CharField): Mots-clés Amazon séparés par des virgules
- `amazon_product_url` (URLField): URL d'un produit Amazon (optionnel)
- `product_names` (CharField): Noms de produits pour les cartes produit
- `author` (CharField): Auteur de l'article (défaut: "Sugesto Redaktion")
- `read_time` (IntegerField): Temps de lecture estimé en minutes
- `published_date` (DateField): Date de publication

## Génération d'articles avec l'IA

### Via l'interface Wagtail Admin
1. Allez à `/wagtail-admin/`
2. Créez un nouvel article ou modifiez-en un existant
3. Remplissez le formulaire "Artikel generieren":
   - **Thema**: Sujet (ex. "Beste Kopfhörer unter 100€")
   - **Kategorie**: Type d'article
   - **Provider**: Choix du fournisseur d'IA
   - **Rohtext**: Texte optionnel à reformuler (optionnel)

### Providers disponibles
- **Groq · Llama 3.3**: Gratuit, rapide, bon pour l'allemand
- **Mistral Small**: Payant (5-10€ par 1M tokens), qualité supérieure
- **Claude Sonnet 4.6**: Payant, meilleure qualité
- **Claude Haiku 4.5**: Payant, très rapide

## Structure des articles générés

Les articles générés contiennent automatiquement:
1. Introduction (150+ mots)
2. Contenu principal avec sous-sections
3. Tableaux comparatifs
4. Listes de contrôle
5. FAQ (6 questions)
6. Conclusion

Longueur: 2000+ mots par défaut

## Intégration Pinterest (optionnel)

### Connexion
1. Allez à `/wagtail-admin/pinterest/connect/`
2. Autorisez l'application Pinterest
3. Vous êtes redirigé après succès

### Publication
1. Lors de l'édition/création d'un article
2. Cliquez "Publier sur Pinterest"
3. L'article est automatiquement épinglé avec:
   - Titre et description (excerpt)
   - Image de couverture
   - Lien vers l'article du blog

## Résolution des problèmes

### "BlogIndexPage not found"
La page index du blog n'a pas été créée. Suivez l'étape 4 ci-dessus.

### Images ne s'affichent pas
Vérifiez les credentials Cloudinary dans `.env`.

### Erreur de génération IA
- Vérifiez que les clés API sont définies dans `.env`
- Vérifiez les limites de l'API (rate limits, quota)
- Testez avec Groq (gratuit) en premier

### Erreur Wagtail
- Assurez-vous que `sugesto_blog` est dans `INSTALLED_APPS` du `settings.py`
- Relancez le serveur après chaque changement de `settings.py`

## Routes administrateur Wagtail

- `/wagtail-admin/ai-generate/` - Génération d'articles IA
- `/wagtail-admin/pinterest/connect/` - Connexion Pinterest
- `/wagtail-admin/pinterest/callback/` - Callback OAuth Pinterest
- `/wagtail-admin/pinterest/status/` - État de la connexion
- `/wagtail-admin/pinterest/publish/` - Publier sur Pinterest

## Base de données

Wagtail utilise **SQLite** par défaut. Les articles et pages sont stockés dans:
- `wagtailcore_page` - Données génériques des pages
- `sugesto_blog_blogpage` - Champs spécifiques du BlogPage
- `wagtailimages_image` - Images (métadonnées; fichiers sur Cloudinary)

## Prochaines étapes

1. **Créer le frontend**: Intégrez `/api/blog/articles/` dans votre app Next.js
2. **Configurer Cloudinary**: Assurez-vous que les images sont accessibles publiquement
3. **Tester la génération IA**: Créez un article de test
4. **Configurer les hooks**: Personnalisez `wagtail_hooks.py` selon vos besoins

## Ressources

- Documentation Wagtail: https://docs.wagtail.org/
- Documentation Cloudinary: https://cloudinary.com/documentation
- Modèles de Wagtail: https://docs.wagtail.org/en/stable/topics/pages/
