# Email Checker Frontend (Next.js)

Frontend web application pour la validation d'emails avec Next.js, TypeScript et Tailwind CSS.

## Fonctionnalités

- 🎨 Interface utilisateur moderne et responsive
- ✅ Validation en temps réel
- 📊 Statistiques de validation
- 📜 Historique des validations
- 🎯 Support TypeScript complet
- 🎨 Design avec Tailwind CSS

## Installation

1. Installer les dépendances:
```bash
cd frontend
npm install
```

2. Configurer les variables d'environnement:
```bash
cp .env.local.example .env.local
# Éditer .env.local si nécessaire
```

3. Lancer le serveur de développement:
```bash
npm run dev
```

4. Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur

## Scripts disponibles

```bash
npm run dev      # Démarrer le serveur de développement
npm run build    # Construire pour la production
npm run start    # Démarrer le serveur de production
npm run lint     # Lancer le linter
```

## Structure du projet

```
frontend/
├── src/
│   ├── app/              # Pages Next.js (App Router)
│   │   ├── layout.tsx    # Layout principal
│   │   ├── page.tsx      # Page d'accueil
│   │   └── globals.css   # Styles globaux
│   ├── components/       # Composants React
│   │   ├── EmailChecker.tsx  # Formulaire de validation
│   │   ├── Stats.tsx         # Statistiques
│   │   └── History.tsx       # Historique
│   ├── lib/              # Utilitaires
│   │   └── api.ts        # Client API
│   └── types/            # Types TypeScript
│       └── index.ts
├── public/               # Fichiers statiques
├── next.config.js        # Configuration Next.js
├── tailwind.config.js    # Configuration Tailwind
└── package.json
```

## Composants

### EmailChecker
Formulaire principal de validation d'email avec options de vérification SMTP.

### Stats
Affiche les statistiques globales de validation (total, emails valides, disposables, pourcentage).

### History
Tableau d'historique des validations avec filtrage par limite.

## Configuration API

L'URL de l'API backend est configurée dans `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```
