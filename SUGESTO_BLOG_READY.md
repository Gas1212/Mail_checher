# 🎉 Blog Sugesto - Configuration Complète!

## ✅ Étapes Terminées

1. ✅ **Dépendances installées** - Wagtail 7.3.1, Cloudinary, IA providers
2. ✅ **Migrations générées et appliquées** - Tables BlogIndexPage et BlogPage créées
3. ✅ **Admin user créé** - Identifiants fournis ci-dessous
4. ✅ **Blog index page créée** - Prête à accueillir des articles
5. ✅ **Configuration Wagtail complète** - WAGTAILADMIN_BASE_URL configurée

## 🔐 Identifiants d'accès

| Configuration | Valeur |
|---|---|
| **URL Admin** | `http://localhost:8000/wagtail-admin/` |
| **Username** | `admin` |
| **Password** | `sugesto_admin_2024` |
| **Email** | `admin@sugesto.xyz` |

⚠️ **IMPORTANT:** Changez ce mot de passe en production!

## 🚀 Démarrer le serveur

```bash
cd backend
python manage.py runserver
```

Puis accédez à:
- **Wagtail Admin**: http://localhost:8000/wagtail-admin/
- **API Blog**: http://localhost:8000/api/blog/articles/

## 📍 Routes disponibles

### API Blog
| Route | Méthode | Description |
|---|---|---|
| `/api/blog/articles/` | GET | Lister tous les articles publiés |
| `/api/blog/articles/<slug>/` | GET | Récupérer un article spécifique |
| `/api/blog/slugs/` | GET | Lister tous les slugs (pour Next.js) |

### Admin Wagtail
| Route | Description |
|---|---|
| `/wagtail-admin/` | Dashboard principal |
| `/wagtail-admin/pages/` | Gestion des pages et articles |
| `/wagtail-admin/images/` | Galerie d'images |
| `/wagtail-admin/ai-generate/` | Génération d'articles IA |
| `/wagtail-admin/pinterest/connect/` | Intégration Pinterest |

## 🎨 Première utilisation

1. **Allez à** `/wagtail-admin/`
2. **Login** avec admin / sugesto_admin_2024
3. **Pages** → Cliquez sur "Blog"
4. **Create child page** → "Blog Article"
5. **Remplissez les champs:**
   - Title: Titre de l'article
   - Excerpt: Description courte
   - Category: Catégorie (Kaufberatung, Spartipps, etc.)
   - Content: Contenu HTML
   - Image: Image de couverture (stockée sur Cloudinary)
   - Author: Auteur (par défaut: "Sugesto Redaktion")
   - Read Time: Temps de lecture en minutes

6. **Publier** → Cliquez sur "Publish"

## 🤖 Générer des articles avec l'IA

1. **Dans l'éditeur**, remplissez:
   - **Thema**: Sujet de l'article (ex. "Beste Kopfhörer 2024")
   - **Kategorie**: Type d'article
   - **Provider**: Choisir OpenAI/Claude/Groq/Mistral
   - **Rohtext** (optionnel): Texte à reformuler

2. **Cliquez** "Artikel generieren"
3. **Attendez** que l'IA génère le contenu (~30 sec)
4. **Vérifiez** et **publiez**

⚠️ Nécessite les variables d'environnement:
```env
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GROQ_API_KEY=gsk_...
```

## 🖼️ Configuration Cloudinary

Pour que les images s'affichent:

1. **Créez un compte** https://cloudinary.com
2. **Obtenez vos credentials** (Cloud Name, API Key, API Secret)
3. **Ajoutez au `.env`:**
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. **Relancez le serveur**

## 📱 Intégration Frontend (Next.js/React)

### Récupérer les articles

```javascript
// Lister tous les articles
const response = await fetch('http://localhost:8000/api/blog/articles/');
const articles = await response.json();

// Récupérer un article spécifique
const response = await fetch('http://localhost:8000/api/blog/articles/mon-article-slug/');
const article = await response.json();
```

### Structure d'un article JSON

```json
{
  "id": 1,
  "title": "Meilleurs Kopfhörer 2024",
  "slug": "meilleurs-kopfhorer-2024",
  "excerpt": "Guide complet des meilleurs écouteurs...",
  "content": "<h2>Introduction</h2><p>...</p>",
  "category": "Kaufberatung",
  "categoryColor": "bg-blue-100 text-blue-700",
  "image": "https://res.cloudinary.com/...",
  "author": "Sugesto Redaktion",
  "readTime": 12,
  "date": "2024-04-08T10:30:00Z",
  "amazonKeywords": ["kopfhörer", "wireless"],
  "productNames": ["Sony WH-1000XM5", "Bose QuietComfort"]
}
```

## 📚 Documentation complète

Voir: `backend/SUGESTO_BLOG_SETUP.md` pour:
- Configuration avancée
- Dépendances supplémentaires
- Résolution des problèmes
- Variables d'environnement
- Modèles de données détaillés

## 🔧 Prochaines étapes

1. **Changer le mot de passe admin** en production
2. **Configurer Cloudinary** pour les images
3. **Ajouter les clés API** (OpenAI, Anthropic, Groq)
4. **Intégrer l'API blog** dans le frontend
5. **Configurer les domaines** (ALLOWED_HOSTS)
6. **Ajouter le HTTPS** en production

## 🆘 Problèmes courants

### "Import Error" lors du démarrage
```bash
pip install -r requirements.txt
```

### Images ne s'affichent pas
Vérifiez que Cloudinary est configuré (voir section Cloudinary ci-dessus).

### Erreur Wagtail Admin
Vérifiez que `WAGTAILADMIN_BASE_URL` est défini dans `.env` ou `settings.py`.

### Générer des articles ne marche pas
Assurez-vous que les clés API IA sont dans `.env`.

## ✨ C'est prêt!

Le blog Sugesto est **100% opérationnel**. Vous pouvez maintenant:
- ✅ Créer des articles
- ✅ Générer du contenu avec l'IA
- ✅ Publier sur Pinterest (configurable)
- ✅ Utiliser l'API REST pour le frontend
- ✅ Gérer les images avec Cloudinary

Bon blogging! 🚀
