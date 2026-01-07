# Déploiement Frontend sur Vercel

## 🚀 Guide complet Next.js → Vercel

### Prérequis
- ✅ Code poussé sur GitHub: https://github.com/Gas1212/Mail_checher.git
- ✅ Compte Vercel (gratuit)
- ✅ Backend déployé sur serv00 (URL nécessaire)

## Étape 1: Préparer le frontend

### 1.1 Vérifier package.json

Le fichier `frontend/package.json` doit contenir:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### 1.2 Créer vercel.json (optionnel)

Créer `frontend/vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
```

## Étape 2: Déployer sur Vercel

### Option A: Via Vercel Dashboard (Recommandé)

1. **Aller sur Vercel**
   - Ouvrir https://vercel.com
   - Cliquer "Sign Up" ou "Login"
   - Se connecter avec GitHub

2. **Importer le projet**
   - Cliquer "New Project"
   - Sélectionner "Import Git Repository"
   - Chercher "Mail_checher"
   - Cliquer "Import"

3. **Configurer le projet**
   - **Framework Preset**: Next.js (détecté automatiquement)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

4. **Variables d'environnement**

   Cliquer "Environment Variables" et ajouter:

   ```
   NEXT_PUBLIC_API_URL=https://votre-backend.serv00.net/api
   ```

   ⚠️ **Important**: Remplacer par votre vraie URL backend serv00

5. **Déployer**
   - Cliquer "Deploy"
   - Attendre 2-3 minutes
   - Récupérer l'URL: `https://mail-checher.vercel.app`

### Option B: Via Vercel CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
cd frontend
vercel

# Suivre les instructions:
# - Set up and deploy? Yes
# - Which scope? Votre compte
# - Link to existing project? No
# - Project name? mail-checker
# - Directory? ./
# - Override settings? No

# Configurer les variables
vercel env add NEXT_PUBLIC_API_URL
# Entrer: https://votre-backend.serv00.net/api

# Redéployer avec les variables
vercel --prod
```

## Étape 3: Configuration post-déploiement

### 3.1 Configurer le domaine personnalisé (optionnel)

1. Vercel Dashboard > Project > Settings > Domains
2. Ajouter votre domaine
3. Configurer les DNS selon les instructions

### 3.2 Tester le déploiement

Ouvrir votre URL Vercel:
```
https://mail-checher.vercel.app
```

Vérifier:
- ✅ Page se charge
- ✅ Formulaire email fonctionne
- ✅ API backend répond
- ✅ Pas d'erreurs CORS

## Étape 4: Configurer CORS sur le backend

⚠️ **Important**: Mettre à jour `backend/.env` sur serv00:

```env
CORS_ALLOWED_ORIGINS=https://mail-checher.vercel.app,http://localhost:3000
```

Si vous avez un domaine personnalisé:
```env
CORS_ALLOWED_ORIGINS=https://votre-domaine.com,https://mail-checher.vercel.app,http://localhost:3000
```

## Étape 5: Déploiement automatique

Vercel redéploie automatiquement à chaque push sur `main`:

```bash
# Modifier le code
git add .
git commit -m "Update frontend"
git push origin main

# Vercel déploie automatiquement! 🚀
```

Pour désactiver:
- Vercel Dashboard > Settings > Git > Disable automatic deployments

## 🔧 Dépannage

### Erreur "API Network Error"

**Cause**: Backend non accessible ou CORS

**Solution**:
1. Vérifier `NEXT_PUBLIC_API_URL` dans Vercel
2. Tester l'URL backend: `curl https://votre-backend.serv00.net/api/emails/stats/`
3. Vérifier CORS sur backend

### Erreur "Build Failed"

**Cause**: Erreur de compilation TypeScript ou dépendances

**Solution**:
```bash
# Tester localement
cd frontend
npm install
npm run build

# Si erreurs, les corriger puis push
```

### Variables d'environnement non prises en compte

**Solution**:
1. Vercel Dashboard > Settings > Environment Variables
2. Vérifier que `NEXT_PUBLIC_API_URL` existe
3. Redéployer: Deployments > ... > Redeploy

### Page blanche ou erreur 404

**Cause**: Root directory incorrect

**Solution**:
1. Vercel Dashboard > Settings > General
2. Root Directory: `frontend`
3. Redéployer

## 📊 Monitoring

### Voir les logs

Vercel Dashboard > Deployments > Cliquer sur un deployment > Logs

### Analytics

Vercel Dashboard > Analytics
- Page views
- Performance
- Top pages

## 💰 Coûts Vercel

### Plan Hobby (Gratuit):
- ✅ Déploiements illimités
- ✅ Bande passante: 100 GB/mois
- ✅ Serverless Functions: 100 GB-Hrs
- ✅ HTTPS automatique
- ✅ Domaines personnalisés
- ✅ Déploiement automatique Git

**Parfait pour ce projet!** 🎉

## 🚀 Commandes utiles

```bash
# Voir les déploiements
vercel ls

# Voir les logs
vercel logs

# Promouvoir en production
vercel --prod

# Supprimer un projet
vercel remove mail-checker
```

## ✅ Checklist finale

Avant de mettre en production:

- [ ] Code frontend poussé sur GitHub
- [ ] Projet importé sur Vercel
- [ ] Root directory = `frontend`
- [ ] `NEXT_PUBLIC_API_URL` configuré
- [ ] Backend serv00 accessible
- [ ] CORS configuré sur backend
- [ ] Déploiement réussi
- [ ] URL fonctionnelle
- [ ] Formulaire teste OK
- [ ] API répond correctement

## 🎉 URLs finales

Après déploiement:

- **Frontend**: `https://mail-checher.vercel.app`
- **Backend**: `https://votre-backend.serv00.net/api/`
- **GitHub**: https://github.com/Gas1212/Mail_checher.git

## 📚 Ressources

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel CLI](https://vercel.com/docs/cli)

---

**Prochaine étape**: Déployer le backend sur serv00 (voir [DEPLOYMENT_SERV00.md](DEPLOYMENT_SERV00.md))
