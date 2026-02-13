# Application SaaS — app.sugesto.xyz

## Description

Application authentifiée avec gestion des crédits, historique et outils avancés.
URL : https://app.sugesto.xyz

## Structure des fichiers

```
app/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Landing/redirect vers dashboard
│   │   ├── layout.tsx                  # Layout global
│   │   ├── dashboard/
│   │   │   ├── page.tsx                # Tableau de bord principal
│   │   │   └── settings/               # Page paramètres
│   │   ├── auth/
│   │   │   ├── login/                  # Page connexion
│   │   │   └── register/               # Page inscription
│   │   ├── tools/
│   │   │   ├── email-checker/          # Checker email (auth)
│   │   │   ├── bulk-checker/           # Bulk checker (auth)
│   │   │   ├── mx-lookup/
│   │   │   ├── role-detector/
│   │   │   ├── list-cleaner/
│   │   │   ├── spf-generator/
│   │   │   ├── blacklist-checker/
│   │   │   ├── sitemap-validator/
│   │   │   ├── sitemap-finder/
│   │   │   └── content-generator/
│   │   ├── privacy/                    # Politique de confidentialité
│   │   └── terms/                      # CGU
│   ├── components/
│   │   ├── layout/
│   │   └── ui/
│   │       ├── Card.tsx                # Carte responsive
│   │       ├── CardHeader.tsx
│   │       ├── Button.tsx
│   │       └── Badge.tsx
│   └── lib/
│       ├── supabase.ts                 # Client Supabase
│       └── utils.ts
├── next.config.js
├── tailwind.config.js
└── package.json
```

## Authentification

L'app utilise **Supabase Auth** :

- **Google OAuth** — connexion en un clic via compte Google
- **Email/Password** — inscription classique avec confirmation email
- Tokens JWT gérés par Supabase
- Profil utilisateur stocké dans **MongoDB** (synchronisé via backend Django)

### Flux de connexion

```
1. Utilisateur clique "Se connecter avec Google"
2. Supabase redirige vers Google OAuth
3. Google retourne un token
4. Supabase crée/met à jour la session
5. App lit le profil depuis MongoDB via Django API
6. Redirect vers /dashboard
```

## Dashboard

### Structure du layout

```
┌─────────────────────────────────────────────┐
│ [Mobile Header] Logo | Menu hamburger        │  ← fixed, lg:hidden
├─────────────────────────────────────────────┤
│ [Sidebar]           │ [Main Content]         │
│ - Logo (desktop)    │ - Welcome header       │
│ - User info         │ - Stats grid (1/2/3)   │
│ - Nav links         │ - Quick Actions        │
│ - Logout            │                        │
└─────────────────────┴────────────────────────┘
```

### Mobile Sidebar

Comportement responsive du sidebar :
- **Mobile** (`< lg`) : slide-in depuis la gauche, overlay backdrop
- **Desktop** (`>= lg`) : toujours visible, sticky
- Toggle avec bouton `Menu`/`X` dans le header mobile

État géré par `useState<boolean>` : `isSidebarOpen`

### Stats affichées

| Stat | Source |
|---|---|
| Credits Remaining | `profile.credits_remaining` |
| Total Checks | `profile.total_checks` |
| This Month | `profile.checks_this_month` |

### Navigation (sidebar)

Catégories organisées :
1. **Email Validation** — Single Checker, Bulk Checker, MX Lookup, Role Detector, List Cleaner
2. **Email Security** — SPF Generator, Blacklist Checker
3. **SEO Tools** — Sitemap Validator, Sitemap Finder
4. **Marketing** — AI Content Generator
5. **Settings** — Paramètres compte

## Composants UI

### Card (responsive)

```tsx
// Padding progressif selon la taille d'écran
className="p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl"
```

| Composant | Props |
|---|---|
| `Card` | `hover?: boolean` — active l'effet hover shadow |
| `CardHeader` | Margin-bottom responsive |
| `CardTitle` | `text-xl font-bold` |
| `CardContent` | Container sans style |
| `CardFooter` | Bordure top + margin |

## Plans et crédits

| Plan | Crédits/mois | Fonctionnalités |
|---|---|---|
| Free | Limité | Outils basiques |
| Pro | Plus | Bulk + API |
| Enterprise | Illimité | Tout |

Les crédits sont décrémentés par chaque appel API authentifié.

## Variables d'environnement

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_API_URL=https://api.sugesto.xyz
```
