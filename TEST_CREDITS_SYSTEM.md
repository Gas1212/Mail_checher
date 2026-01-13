# Test du Système de Crédits Global

## Problèmes Rapportés

1. **Crédits qui reset quand on supprime les cookies**
2. **Crédits non globaux** (chaque outil a son propre compteur)
3. **Section Marketing qui disparaît**

## Analyse des Problèmes

### Problème 1: Crédits Reset avec Suppression des Cookies

**Cause identifiée**:
- Les cookies contiennent les tokens JWT (`access_token`, `refresh_token`)
- Quand vous supprimez les cookies, vous perdez les tokens
- Sans tokens, l'utilisateur est déconnecté et redirigé vers `/auth/signin`
- Les crédits sont dans `localStorage`, PAS dans les cookies

**Comportement actuel**:
```javascript
// content-generator/page.tsx ligne 81-86
const token = localStorage.getItem('access_token');
const userData = localStorage.getItem('user');

if (!token || !userData) {
  router.push('/auth/signin'); // ← Redirigé vers connexion
  return;
}
```

**CLARIFICATION IMPORTANTE**:
Si vous supprimez **les cookies**, cela ne devrait PAS affecter les crédits car:
- Les crédits sont dans `localStorage.getItem('sugesto_global_credits_user@example.com')`
- Les tokens sont dans `localStorage.getItem('access_token')`
- Ce sont deux emplacements différents!

**SI vous supprimez localStorage** (DevTools → Application → Clear Storage):
- Oui, les crédits seront perdus (normal, c'est là qu'ils sont stockés)
- Les tokens seront aussi perdus
- Vous serez déconnecté

### Problème 2: Crédits Non Globaux

**Statut**: ✅ **RÉSOLU dans le code**

**Avant**:
```typescript
// Ancien système - un compteur par outil
useCredits('content-generator', !!user)
// → localStorage: sugesto_credits_content-generator

useCredits('email-checker', !!user)
// → localStorage: sugesto_credits_email-checker
```

**Maintenant**:
```typescript
// Nouveau système - un compteur global
useGlobalCredits(user?.email || null, !!user)
// → localStorage: sugesto_global_credits_user@example.com
```

**Fix appliqué**:
- Fichier modifié: [content-generator/page.tsx:13](app/src/app/tools/content-generator/page.tsx#L13)
- Import changé: `useCredits` → `useGlobalCredits`
- Hook changé (ligne 77): Passe `user?.email` au lieu de `'content-generator'`

**Limitation actuelle**:
- ⚠️ Seulement Content Generator utilise le système global
- ❌ Les autres outils (Email Checker, SPF Checker, etc.) utilisent encore l'ancien système ou rien du tout

**TODO**: Ajouter `useGlobalCredits` aux autres outils du dashboard

### Problème 3: Section Marketing Disparaît

**Statut**: ✅ **RÉSOLU dans le code**

**Fix appliqué**:
- Fichier: [Sidebar.tsx:59](app/src/components/layout/Sidebar.tsx#L59)
- Ajout de `pb-4` (padding-bottom) au `<nav>`
- Évite que le contenu soit coupé par l'overflow

```typescript
<nav className="flex-1 p-4 space-y-3 overflow-y-auto pb-4">
  {/* ↑ pb-4 ajouté */}
```

## Vérification Nécessaire

### Test 1: localStorage vs Cookies

Pour clarifier: **Qu'est-ce que vous supprimez exactement?**

1. **Si vous supprimez les COOKIES** (DevTools → Application → Cookies → Supprimer):
   - Impact: Aucun (les crédits sont dans localStorage, pas cookies)

2. **Si vous supprimez localStorage** (DevTools → Application → Local Storage → Clear):
   - Impact: Crédits perdus (normal, c'est là qu'ils sont)
   - Impact: Tokens perdus (vous êtes déconnecté)

3. **Si vous supprimez TOUT** (DevTools → Application → Clear Site Data):
   - Impact: Tout est perdu (crédits + tokens + cookies)

### Test 2: Vérifier la Structure localStorage

Ouvrez DevTools → Application → Local Storage → http://localhost:3000:

**Vous devriez voir**:
```
access_token: "eyJ0eXAiOiJKV1QiLCJhbGc..."
refresh_token: "eyJ0eXAiOiJKV1QiLCJhbGc..."
user: "{"id":"...","email":"user@example.com","first_name":"..."}"
sugesto_global_credits_user@example.com: "{"available":97,"used":3,...}"
```

**Vous NE devriez PAS voir** (ancien système):
```
sugesto_credits_content-generator: "..."  ← À SUPPRIMER
sugesto_credits_email-checker: "..."      ← À SUPPRIMER
```

### Test 3: Email de l'Utilisateur

Le système utilise `user?.email` comme clé. Vérifiez que l'email est bien chargé:

```javascript
// Dans la console du navigateur
const userData = localStorage.getItem('user');
const user = JSON.parse(userData);
console.log('Email:', user.email);
// Devrait afficher: Email: user@example.com
```

## Plan de Test Complet

### 1. Test de Base

```bash
1. Ouvrir http://localhost:3000
2. Se connecter
3. Ouvrir DevTools → Console
4. Exécuter:
   const user = JSON.parse(localStorage.getItem('user'));
   console.log('User email:', user.email);
   console.log('Credits key:', `sugesto_global_credits_${user.email}`);
   console.log('Credits:', localStorage.getItem(`sugesto_global_credits_${user.email}`));
```

### 2. Test de Persistance

```bash
1. Aller sur Content Generator
2. Noter le nombre de crédits (ex: 100)
3. Générer du contenu 3 fois
4. Crédits devrait être 97
5. Fermer le navigateur
6. Rouvrir et se reconnecter
7. Vérifier que les crédits sont toujours 97
```

### 3. Test Cookies vs localStorage

```bash
1. Aller sur Content Generator avec 95 crédits
2. Ouvrir DevTools → Application → Cookies
3. Supprimer TOUS les cookies
4. Recharger la page
5. Vérifier si vous êtes toujours connecté
   - Si OUI: Les tokens sont dans localStorage (pas cookies)
   - Si NON: Les tokens sont dans cookies
6. Si encore connecté, vérifier les crédits (devrait être 95)
```

### 4. Test localStorage Clear

```bash
1. Aller sur Content Generator avec 90 crédits
2. DevTools → Application → Local Storage
3. Supprimer sugesto_global_credits_*
4. Recharger la page
5. Crédits devrait être 100 (réinitialisé)
```

### 5. Test Multi-Outils (Quand implémenté)

```bash
1. Content Generator: 100 crédits
2. Utiliser 5 crédits → 95 crédits
3. Aller sur Email Checker
4. Vérifier que les crédits affichent 95 (pas 100)
```

## Corrections Supplémentaires Nécessaires

### 1. Ajouter useGlobalCredits aux Autres Outils

**Fichiers à modifier**:
- `app/src/app/tools/email-checker/page.tsx`
- `app/src/app/tools/spf-checker/page.tsx`
- `app/src/app/tools/dmarc-checker/page.tsx`
- etc.

**Changements**:
```typescript
// Ajouter l'import
import { useGlobalCredits } from '@/hooks/useGlobalCredits';
import CreditsDisplay from '@/components/ui/CreditsDisplay';

// Ajouter le hook
const { credits, isRateLimited, consumeCredit, rateLimit } =
  useGlobalCredits(user?.email || null, !!user);

// Afficher le composant
{user && (
  <CreditsDisplay
    available={credits.available}
    total={credits.total}
    used={credits.used}
    isRateLimited={isRateLimited}
    rateLimitReset={rateLimitReset}
    rateLimit={rateLimit}
  />
)}

// Avant chaque requête API
const creditResult = consumeCredit();
if (!creditResult.success) {
  setError(creditResult.message);
  return;
}
```

### 2. Nettoyer les Anciennes Clés localStorage

Ajouter un script de migration dans `useGlobalCredits`:

```typescript
// Dans useEffect initial
useEffect(() => {
  if (isAuthenticated && userEmail) {
    // Migration: Supprimer les anciennes clés
    const oldKeys = Object.keys(localStorage).filter(
      key => key.startsWith('sugesto_credits_') &&
             !key.startsWith('sugesto_global_credits_')
    );
    oldKeys.forEach(key => localStorage.removeItem(key));
  }
}, [isAuthenticated, userEmail]);
```

## Questions à Clarifier

1. **Qu'est-ce que vous supprimez exactement?**
   - Cookies du navigateur?
   - localStorage (DevTools → Clear Storage)?
   - Les deux?

2. **Sur quel environnement testez-vous?**
   - Local (http://localhost:3000)?
   - Production (https://gas1911.serv00.net)?

3. **Est-ce que l'email de l'utilisateur est bien affiché?**
   - Dans le Sidebar (nom de l'utilisateur)?
   - Dans la console (voir Test de Base ci-dessus)?

4. **Les autres outils ont-ils besoin du système de crédits?**
   - Seulement Content Generator?
   - Tous les outils?
   - Lesquels exactement?

## Prochaines Étapes

1. **Clarifier les problèmes** - Exécuter les tests ci-dessus
2. **Ajouter useGlobalCredits aux autres outils** - Si nécessaire
3. **Ajouter script de migration** - Pour nettoyer localStorage
4. **Tests en production** - Déployer et vérifier

---

*Créé le 13 Janvier 2026*
*Ce document aide à diagnostiquer les problèmes rapportés*
