# Website — sugesto.xyz

## Description

Site public marketing et outils gratuits. Accessible sans inscription.
URL : https://sugesto.xyz

## Structure des fichiers

```
website/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Homepage
│   │   ├── layout.tsx                  # Layout global
│   │   ├── tools/
│   │   │   ├── page.tsx                # Liste de tous les outils
│   │   │   ├── email-checker/          # Vérificateur email
│   │   │   ├── bulk-checker/           # Vérification en masse
│   │   │   ├── mx-lookup/              # MX lookup
│   │   │   ├── role-detector/          # Détecteur d'emails de rôle
│   │   │   ├── list-cleaner/           # Nettoyeur de liste
│   │   │   ├── spf-generator/          # Générateur SPF
│   │   │   ├── blacklist-checker/      # Vérificateur blacklist
│   │   │   ├── sitemap-validator/      # Validateur sitemap
│   │   │   ├── sitemap-finder/         # Découvreur sitemap
│   │   │   ├── content-generator/      # Générateur de contenu IA
│   │   │   ├── qr-generator/           # Générateur QR code
│   │   │   ├── url-shortener/          # Raccourcisseur d'URL
│   │   │   └── chrome-extensions/      # Nos extensions Chrome
│   │   ├── blog/                       # Blog (si existant)
│   │   ├── pricing/                    # Page tarifs
│   │   └── api/                        # API routes Next.js
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx              # Navigation principale
│   │   │   └── Footer.tsx              # Pied de page
│   │   ├── sections/
│   │   │   ├── Hero.tsx                # Section hero homepage
│   │   │   └── Features.tsx            # Section fonctionnalités
│   │   ├── tools/
│   │   │   └── RelatedTools.tsx        # Outils suggérés en bas de page
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Badge.tsx
│   │       ├── Input.tsx
│   │       └── UpgradeModal.tsx
│   └── lib/
│       └── utils.ts                    # Helpers (cn, etc.)
├── public/                             # Assets statiques
├── next.config.js
├── tailwind.config.js
└── package.json
```

## Pages et outils

### Homepage (`/`)
- Hero animé avec Framer Motion
- Section Features (4 colonnes responsive)
- CTA vers email-checker et tools

### Outils disponibles

| Outil | URL | Catégorie |
|---|---|---|
| Email Checker | `/tools/email-checker` | Email |
| Bulk Checker | `/tools/bulk-checker` | Email |
| MX Lookup | `/tools/mx-lookup` | Email |
| Role Detector | `/tools/role-detector` | Email |
| List Cleaner | `/tools/list-cleaner` | Email |
| SPF Generator | `/tools/spf-generator` | Sécurité |
| Blacklist Checker | `/tools/blacklist-checker` | Sécurité |
| Sitemap Validator | `/tools/sitemap-validator` | SEO |
| Sitemap Finder | `/tools/sitemap-finder` | SEO |
| AI Content Generator | `/tools/content-generator` | Marketing |
| QR Generator | `/tools/qr-generator` | Utilitaires |
| URL Shortener | `/tools/url-shortener` | Utilitaires |
| Chrome Extensions | `/tools/chrome-extensions` | Extensions |

### Système de trial gratuit

Composant `useFreeTrial` dans `src/lib/hooks/useFreeTrial.ts` :
- 3 essais gratuits stockés en `localStorage`
- Après épuisement : modal `UpgradeModal` avec CTA vers inscription
- Pas d'authentification requise pour les essais

### AI Content Generator — double mode

Le générateur de contenu supporte deux fournisseurs :

**Mode Sugesto AI** (limité par trials) :
- Appelle `api.sugesto.xyz/api/content/generate/`
- Limité à 3 essais gratuits

**Mode Groq API** (illimité) :
- L'utilisateur fournit sa propre clé API Groq
- Appel direct depuis le navigateur vers `api.groq.com/openai/v1/chat/completions`
- Modèle : `llama-3.1-8b-instant`
- Clé jamais envoyée aux serveurs Sugesto

Types de contenu supportés (9 types) :
- Email Marketing, Blog Post, Social Media Post
- Product Description, Ad Copy, Newsletter
- Landing Page Copy, Press Release, Video Script

### Chrome Extensions

Page statique listant les extensions Chrome publiées :

**AI Comment Generator** (`jklndoeadnikdojcbhlknfmgmhiohbje`)
- Génère des réponses pour Quora avec l'IA
- Multi-providers : Gemini, Groq, OpenAI, Anthropic
- Raccourci clavier : `Ctrl+Shift+G`

## Composants UI réutilisables

| Composant | Usage |
|---|---|
| `Card` | Carte avec padding responsive (p-3 sm:p-4 md:p-6) |
| `Badge` | Tag coloré (variant: success, info, warning, default) |
| `Button` | Bouton avec variants et loading state |
| `Input` | Input stylisé avec label |
| `UpgradeModal` | Modal d'upgrade après épuisement des trials |
| `RelatedTools` | Section "autres outils" en bas de chaque page outil |

## Responsive Design

Breakpoints Tailwind utilisés :
- `sm` : 640px — tablette portrait
- `md` : 768px — tablette paysage
- `lg` : 1024px — desktop
- `xl` : 1280px — grand écran

Pattern typique pour les titres :
```
text-2xl sm:text-3xl md:text-4xl lg:text-5xl
```
