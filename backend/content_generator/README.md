# Content Generator API - Django Backend

API de génération de contenu marketing avec IA (Hugging Face) pour Sugesto.

## Endpoints

### Base URL
```
/api/content-generator/
```

### 1. Generate Content

Génère du contenu marketing avec IA.

**Endpoint:** `POST /api/content-generator/generate/`

**Request Body:**
```json
{
  "content_type": "product-title",
  "product_name": "Email Validator",
  "product_features": "Real-time validation, bulk checking",
  "target_audience": "Digital marketers",
  "tone": "professional",
  "language": "en",
  "additional_context": "Focus on email deliverability"
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `content_type` | string | Yes | Type de contenu (voir liste ci-dessous) |
| `product_name` | string | Yes* | Nom du produit/service |
| `product_features` | string | No | Fonctionnalités clés |
| `target_audience` | string | No | Audience cible |
| `tone` | string | No | Ton (professional, casual, enthusiastic, formal) |
| `language` | string | No | Langue (en, fr) |
| `additional_context` | string | No | Contexte additionnel |

*Requis pour tous les types sauf `email-body`

**Content Types:**
- `product-title` - Titre produit SEO (60 chars max)
- `meta-description` - Meta description (150-160 chars)
- `product-description` - Description produit (150-200 mots)
- `linkedin-post` - Post LinkedIn avec hashtags
- `facebook-post` - Post Facebook engageant
- `instagram-post` - Post Instagram avec emojis et hashtags
- `tiktok-post` - Caption TikTok avec hashtags tendance
- `email-subject` - Objet d'email (50 chars max)
- `email-body` - Corps d'email (150-200 mots)

**Response:**
```json
{
  "success": true,
  "content": "Professional Email Validation Tool - Verify & Clean Your Lists",
  "model": "meta-llama/Meta-Llama-3.1-8B-Instruct",
  "metadata": {
    "content_type": "product-title",
    "tone": "professional",
    "language": "en",
    "character_count": 61
  }
}
```

**Rate Limiting:**
- 10 requêtes par heure par IP
- Header `X-RateLimit-Remaining` indique les requêtes restantes
- Status 429 quand limite atteinte

### 2. Get Content Types

Liste tous les types de contenu disponibles.

**Endpoint:** `GET /api/content-generator/types/`

**Response:**
```json
{
  "content_types": [
    {
      "id": "product-title",
      "name": "Product Title",
      "description": "SEO-optimized product title (max 60 characters)",
      "category": "product"
    },
    ...
  ],
  "tones": ["professional", "casual", "enthusiastic", "formal"],
  "languages": ["en", "fr"]
}
```

## Configuration

### Environment Variables

Vous avez 2 options pour configurer l'IA:

#### Option 1: Hugging Face Space Personnel (Recommandé - Sans Quota)

Déployez votre propre Llama 3.2 11B sur HF Space (voir `/huggingface-space/DEPLOYMENT.md`):

```bash
HUGGINGFACE_SPACE_URL=https://YOUR-USERNAME-llama-content-generator.hf.space
```

**Avantages:**
- ✅ Aucune limite de quota
- ✅ Llama 3.2 11B (meilleure qualité)
- ✅ Contrôle total
- ⚠️ Coût: ~$3/heure (A10G) ou gratuit avec Llama 3B

#### Option 2: Hugging Face Router API (Avec Limites)

Utilisez l'API publique avec quota limité:

```bash
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Obtenir une clé API: https://huggingface.co/settings/tokens

**Limites:**
- ⚠️ Quota quotidien limité
- ⚠️ Peut être lent aux heures de pointe

### Installation

1. Installer les dépendances:
```bash
pip install -r requirements.txt
```

2. Ajouter la clé API dans `.env`

3. L'app est déjà enregistrée dans `config/settings.py`:
```python
INSTALLED_APPS = [
    ...
    'content_generator',
]
```

4. Les URLs sont configurées dans `config/urls.py`:
```python
urlpatterns = [
    ...
    path('api/', include('content_generator.urls')),
]
```

## Exemples d'utilisation

### Titre de produit (EN)
```bash
curl -X POST http://localhost:8000/api/content-generator/generate/ \
  -H "Content-Type: application/json" \
  -d '{
    "content_type": "product-title",
    "product_name": "Email Validation Tool",
    "tone": "professional",
    "language": "en"
  }'
```

### Post Instagram (FR)
```bash
curl -X POST http://localhost:8000/api/content-generator/generate/ \
  -H "Content-Type: application/json" \
  -d '{
    "content_type": "instagram-post",
    "product_name": "Outil de Validation Email",
    "product_features": "Validation en temps réel, vérification en masse",
    "tone": "enthusiastic",
    "language": "fr"
  }'
```

## Modèles IA utilisés

1. **Primary:** `meta-llama/Meta-Llama-3.1-8B-Instruct`
2. **Fallback:** `mistralai/Mistral-7B-Instruct-v0.2`

Basculement automatique sur le modèle secondaire si le primaire échoue.

## Architecture

```
backend/content_generator/
├── __init__.py
├── apps.py                     # Configuration Django app
├── views.py                    # ViewSet DRF avec endpoints
├── urls.py                     # Routing
├── huggingface_service.py      # Service IA Hugging Face
└── README.md                   # Cette documentation
```

## Rate Limiting

- Implémenté via Django cache
- 10 requêtes par heure par IP
- Fenêtre glissante de 3600 secondes
- Cache key: `content_gen_rate_limit_{ip}`

## Error Handling

- 400: Paramètres invalides
- 429: Rate limit dépassé
- 500: Erreur serveur/API IA

## Tests

Les endpoints peuvent être testés avec:
```bash
python manage.py shell
from content_generator.views import ContentGeneratorViewSet
# Tests manuels
```

Ou via curl/Postman/Thunder Client.

## Notes

- API Hugging Face gratuite: ~1000 requêtes/jour
- Temps de réponse: 2-5 secondes
- Le contenu généré doit être revu avant utilisation
- Fallback automatique entre modèles pour haute disponibilité
