# Architecture du Projet Sugesto

## Vue d'ensemble

Sugesto est une plateforme **multi-applications** composée de trois parties indépendantes hébergées sur le même serveur.

```
Mail-checker/
├── website/          # Site public (sugesto.xyz)
├── app/              # Application SaaS (app.sugesto.xyz)
├── backend/          # API Django REST (api.sugesto.xyz)
├── docs/             # Documentation technique
├── hooks/            # Git hooks
├── passenger_wsgi.py # WSGI entry point (Passenger/serv00)
└── README.md
```

## Schéma d'architecture

```
┌─────────────────────┐    ┌─────────────────────┐
│   sugesto.xyz        │    │  app.sugesto.xyz     │
│   (Website)          │    │  (App SaaS)          │
│   Next.js 14 SSG     │    │  Next.js 14 SSR      │
└──────────┬──────────┘    └──────────┬───────────┘
           │                          │
           │ fetch (public tools)      │ fetch (auth tools)
           │                          │
           └──────────┬───────────────┘
                      │
           ┌──────────▼───────────┐
           │  backend/             │
           │  Django REST API      │
           │  api.sugesto.xyz      │
           └──────────┬───────────┘
                      │
           ┌──────────▼───────────┐
           │  MongoDB              │
           │  (users, results)     │
           └──────────────────────┘
```

## Applications Django (Backend)

| App | Rôle |
|---|---|
| `email_checker` | Validation email, auth utilisateurs, MX lookup, blacklist |
| `seo_tools` | Sitemap validator, sitemap finder |
| `content_generator` | Génération de contenu via Groq API |

## Flux de données

### Outils publics (website)
1. Utilisateur visite `sugesto.xyz/tools/email-checker`
2. Frontend appelle `api.sugesto.xyz/api/email-checker/`
3. Django valide l'email via SMTP/DNS
4. Résultat retourné en JSON

### Outils authentifiés (app)
1. Utilisateur connecté via **Supabase Auth** (Google OAuth ou email)
2. Frontend `app.sugesto.xyz` lit le profil depuis **MongoDB** via Django
3. Chaque appel API décrémente les crédits utilisateur
4. Résultat stocké en base

## Technologies par couche

### Frontend (website + app)
- **Next.js 14** — App Router, SSG/SSR
- **TypeScript** — typage statique
- **Tailwind CSS** — styling utility-first, responsive (sm/md/lg/xl)
- **Framer Motion** — animations (website)
- **Lucide React** — icônes
- **Supabase JS** — authentification (app uniquement)

### Backend
- **Django 4** + **Django REST Framework**
- **Python** avec `dnspython`, `pysmtp` pour validation email
- **pymongo** — connexion MongoDB directe
- **python-decouple** — variables d'environnement
- **corsheaders** — CORS pour les frontends

### Infrastructure
- **Serv00.net** — hébergement shared (Node.js + Python/Passenger)
- **GitHub** — source et CI/CD via git hooks
- **MongoDB** — base principale (cloud)
- **SQLite** — base secondaire (admin Django)

## Remotes Git

```bash
origin  → https://github.com/Gas1212/Mail_checher.git
serv00  → ssh://repo3.serv00.com/~/repo/git/pub/mail-checker/
```

Un push sur `serv00` déclenche automatiquement le redémarrage de l'application via un hook post-receive.
