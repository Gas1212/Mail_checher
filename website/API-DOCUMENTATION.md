# Content Generator API Documentation

## Overview

The Content Generator API uses Hugging Face AI models to generate marketing content including product descriptions, social media posts, and email content.

## Endpoint

```
POST /api/generate-content
```

## Authentication

No authentication required for the API endpoint. Rate limiting is enforced per IP address (10 requests per hour).

## Request Format

### Headers
```
Content-Type: application/json
```

### Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `contentType` | string | Yes | Type of content to generate (see Content Types below) |
| `productName` | string | Yes* | Name of the product/service |
| `productFeatures` | string | No | Key features or selling points |
| `targetAudience` | string | No | Target audience description |
| `tone` | string | No | Tone of content: `professional`, `casual`, `enthusiastic`, `formal` (default: `professional`) |
| `language` | string | No | Language code: `en` or `fr` (default: `en`) |
| `additionalContext` | string | No | Any additional context or instructions |

*Required for all content types except `email-body`

### Content Types

- `product-title` - SEO-optimized product title (max 60 chars)
- `meta-description` - Meta description for SEO (150-160 chars)
- `product-description` - Detailed product description (150-200 words)
- `linkedin-post` - Professional LinkedIn post with hashtags
- `facebook-post` - Engaging Facebook post
- `instagram-post` - Instagram caption with emojis and hashtags
- `tiktok-post` - TikTok video caption with trending hashtags
- `email-subject` - Email subject line (max 50 chars)
- `email-body` - Email body content (150-200 words)

## Response Format

### Success Response (200)

```json
{
  "success": true,
  "content": "Generated content here...",
  "model": "meta-llama/Meta-Llama-3.1-8B-Instruct",
  "metadata": {
    "contentType": "product-title",
    "tone": "professional",
    "language": "en",
    "characterCount": 45
  }
}
```

### Error Response (400/429/500)

```json
{
  "success": false,
  "error": "Error message here"
}
```

## Example Requests

### 1. Generate Product Title

```bash
curl -X POST http://localhost:3000/api/generate-content \
  -H "Content-Type: application/json" \
  -d '{
    "contentType": "product-title",
    "productName": "Email Validation Tool",
    "tone": "professional",
    "language": "en"
  }'
```

### 2. Generate Instagram Post

```bash
curl -X POST http://localhost:3000/api/generate-content \
  -H "Content-Type: application/json" \
  -d '{
    "contentType": "instagram-post",
    "productName": "Email Validation Tool",
    "productFeatures": "Real-time validation, bulk checking, API access",
    "targetAudience": "Digital marketers and developers",
    "tone": "enthusiastic",
    "language": "en"
  }'
```

### 3. Generate Meta Description (French)

```bash
curl -X POST http://localhost:3000/api/generate-content \
  -H "Content-Type: application/json" \
  -d '{
    "contentType": "meta-description",
    "productName": "Outil de Validation Email",
    "productFeatures": "Validation en temps réel, vérification en masse",
    "tone": "professional",
    "language": "fr"
  }'
```

## Rate Limiting

- **Limit:** 10 requests per hour per IP address
- **Response Header:** `X-RateLimit-Remaining` indicates remaining requests
- **Status Code:** 429 when limit exceeded

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid parameters |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - API or model error |

## Models Used

1. **Primary:** `meta-llama/Meta-Llama-3.1-8B-Instruct`
2. **Fallback:** `mistralai/Mistral-7B-Instruct-v0.2`

The API automatically falls back to the secondary model if the primary model fails or is overloaded.

## Testing

Run the test script to verify API functionality:

```bash
# Start development server
npm run dev

# In another terminal, run tests
node test-api.js
```

## Setup

1. Get a Hugging Face API key: https://huggingface.co/settings/tokens
2. Copy `.env.example` to `.env.local`
3. Add your API key to `.env.local`:
   ```
   HUGGINGFACE_API_KEY=hf_your_actual_key_here
   ```
4. Restart the development server

## Notes

- The Hugging Face Inference API is free with rate limits (~1000 requests/day)
- Response time: 2-5 seconds per generation
- Content is generated using AI and should be reviewed before use
- The API implements fallback mechanisms for high availability
