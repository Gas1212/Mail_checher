# Sugesto - Email Tools & AI Content Generator

Production backend deployed on gas1911.serv00.net

## Structure

```
Mail-checker/
├── backend/              # Django REST API
│   ├── config/          # Django settings & WSGI
│   ├── email_checker/   # Email validation & security tools
│   ├── content_generator/ # AI content generation (Groq API)
│   ├── seo_tools/       # SEO utilities (sitemap finder/validator)
│   ├── manage.py
│   └── requirements.txt
├── app/                 # Next.js dashboard (authenticated)
├── hooks/               # Git deployment hooks
└── README.md
```

## Technology Stack

- **Backend**: Python 3.11 + Django 4.2 + Django REST Framework
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **AI**: Groq API (llama-3.1-8b-instant) - Ultra-fast inference (~0.5-1.8s)
- **Server**: serv00.com with Passenger WSGI

## API Endpoints

### Content Generator (Groq AI)
- `POST /api/content-generator/generate/`

### Email & Security Tools
- `POST /api/tools/spf-check/`
- `POST /api/tools/dmarc-check/`
- `POST /api/tools/dns-check/`
- `POST /api/tools/header-analyzer/`
- `POST /api/tools/phishing-check/`

### SEO Tools
- `POST /api/seo/find-sitemap/`
- `POST /api/seo/validate-sitemap/`

## Local Development

### Backend (Django)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend (Next.js)
```bash
cd app
npm install
npm run dev
```

## Environment Variables

Create `.env` file in root directory:

```env
# Django
DEBUG=False
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=your-domain.com,localhost

# MongoDB
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/
MONGODB_NAME=Mail
MONGODB_COLLECTION=db

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-secret

# CORS
CORS_ALLOWED_ORIGINS=https://your-domain.com,http://localhost:3000

# Groq AI
GROQ_API_KEY=your-groq-api-key
```

## Deployment

### Production (serv00.com)

The project automatically deploys to serv00 via Git hooks:

```bash
git add .
git commit -m "Your commit message"
git push serv00 main
```

The `post-receive` hook automatically:
1. Checks out code to `~/domains/gas1911.serv00.net/public_python/`
2. Restarts the application via `devil www restart`

### Configuration

See `CONFIGURATION.md` on the server for complete deployment guide.

## Testing Production

```bash
# Content Generator
curl -X POST "https://gas1911.serv00.net/api/content-generator/generate/" \
  -H "Content-Type: application/json" \
  -d '{"content_type":"product-title","product_name":"laptop","tone":"professional"}'

# SPF Checker
curl -X POST "https://gas1911.serv00.net/api/tools/spf-check/" \
  -H "Content-Type: application/json" \
  -d '{"domain":"google.com"}'
```

## Performance

- **Content Generator**: 0.5-1.8s per generation (Groq API)
- **Email Tools**: < 1s response time
- **SEO Tools**: < 2s response time

## License

Proprietary
