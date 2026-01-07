# Guide d'utilisation - Email Checker

## Interface utilisateur

### Page principale

L'interface est divisée en trois sections principales:

1. **Formulaire de validation** (en haut)
2. **Statistiques** (au milieu)
3. **Historique** (en bas)

## 1. Valider un email

### Étape par étape:

1. **Entrer l'email**
   - Cliquer dans le champ "Email Address"
   - Taper l'adresse email à valider
   - Exemple: `test@gmail.com`

2. **Options de vérification**
   - ✅ **SMTP activé** (par défaut): Vérification complète mais plus lente
   - ⬜ **SMTP désactivé**: Vérification rapide (syntaxe + DNS uniquement)

3. **Lancer la validation**
   - Cliquer sur le bouton "Check Email"
   - Attendre quelques secondes
   - Observer les résultats

### Résultats affichés:

#### Informations principales:
- **Email**: L'adresse validée
- **Syntax Valid**: ✓ ou ✗
- **DNS Valid**: ✓ ou ✗
- **SMTP Valid**: ✓ ou ✗ (si activé)
- **Disposable**: Yes ou No

#### MX Records:
Liste des serveurs de messagerie du domaine

#### Message de validation:
Résumé du statut de l'email

#### Détails:
- Détail de la validation syntaxe
- Détail de la vérification DNS
- Détail de la vérification SMTP
- Information sur le statut jetable

## 2. Interpréter les résultats

### Email valide ✅
```
✓ Syntax Valid: Yes
✓ DNS Valid: Yes
✓ SMTP Valid: Yes
✓ Disposable: No
Message: "Email is valid and verified"
```
→ L'email est complètement valide et utilisable

### Email invalide (syntaxe) ❌
```
✗ Syntax Valid: No
Message: "Invalid syntax: ..."
```
→ Format de l'email incorrect

### Email invalide (DNS) ❌
```
✓ Syntax Valid: Yes
✗ DNS Valid: No
Message: "DNS validation failed: Domain does not exist"
```
→ Le domaine n'existe pas

### Email jetable ⚠️
```
✓ Syntax Valid: Yes
✓ DNS Valid: Yes
✓ Disposable: Yes
Message: "Valid email but from disposable domain"
```
→ Email valide mais domaine temporaire

## 3. Consulter les statistiques

La section statistiques affiche:

### Total Validations
Nombre total d'emails vérifiés

### Valid Emails
Nombre d'emails valides (syntaxe + DNS)

### Disposable Emails
Nombre d'emails jetables détectés

### Valid Percentage
Pourcentage d'emails valides

## 4. Explorer l'historique

### Fonctionnalités:

1. **Affichage tableau**
   - Email
   - Syntax (✓/✗)
   - DNS (✓/✗)
   - SMTP (✓/✗)
   - Disposable (Yes/No)
   - Date

2. **Filtre par limite**
   - Sélecteur: 10, 25, 50, 100
   - Affiche les N dernières validations

## 5. Exemples d'utilisation

### Cas d'usage 1: Validation simple
```
Email: user@example.com
SMTP: ⬜ (désactivé)
Résultat: Validation rapide en 1-2 secondes
```

### Cas d'usage 2: Validation complète
```
Email: user@example.com
SMTP: ✅ (activé)
Résultat: Validation complète en 5-10 secondes
```

### Cas d'usage 3: Détecter un email jetable
```
Email: test@tempmail.com
Résultat: Détection automatique du domaine jetable
```

### Cas d'usage 4: Vérifier un domaine inexistant
```
Email: user@domainequisexistepas.xyz
Résultat: DNS validation failed
```

## 6. Codes couleur

### Vert ✓
- Email valide
- Vérification réussie
- Domaine légitime

### Rouge ✗
- Email invalide
- Vérification échouée
- Problème détecté

### Orange/Jaune ⚠️
- Email jetable détecté
- Avertissement

## 7. Messages courants

| Message | Signification |
|---------|---------------|
| "Email is valid and verified" | Email complètement valide |
| "Valid email but from disposable domain" | Email valide mais temporaire |
| "Invalid syntax" | Format email incorrect |
| "Domain does not exist" | Domaine inexistant |
| "No MX records found" | Pas de serveur mail configuré |
| "Email address does not exist" | Boîte email inexistante |
| "Could not verify via SMTP" | SMTP non vérifiable |

## 8. Bonnes pratiques

### ✅ À faire:
- Désactiver SMTP pour validation rapide en masse
- Activer SMTP pour validation critique (inscription, etc.)
- Consulter les détails pour comprendre les problèmes
- Vérifier l'historique pour voir les tendances

### ❌ À éviter:
- Valider trop d'emails avec SMTP (lent)
- Ignorer les emails jetables pour des services critiques
- Se fier uniquement à la syntaxe

## 9. Cas spéciaux

### Emails catch-all
Certains domaines acceptent tous les emails (catch-all).
La vérification SMTP peut dire "valide" même si l'email n'existe pas.

### Emails role-based
Emails génériques: admin@, info@, contact@
Généralement valides mais non personnels.

### Domaines internationaux
Supportés mais peuvent avoir des comportements différents.

## 10. Performance

### Temps de validation moyens:

| Type | Durée | Vérifications |
|------|-------|---------------|
| Syntaxe seule | < 1s | Format uniquement |
| Syntaxe + DNS | 1-2s | Format + Domaine |
| Complet (+ SMTP) | 5-10s | Tout |

### Optimisation:
- Utilisez SMTP uniquement quand nécessaire
- Validez en batch via l'API (future fonctionnalité)
- Consultez l'historique pour les emails déjà vérifiés

## 11. API Usage (pour développeurs)

### Validation simple:
```bash
curl -X POST http://localhost:8000/api/emails/check/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "check_smtp": false
  }'
```

### Obtenir les stats:
```bash
curl http://localhost:8000/api/emails/stats/
```

### Consulter l'historique:
```bash
curl http://localhost:8000/api/emails/history/?limit=10
```

Voir [API_EXAMPLES.md](API_EXAMPLES.md) pour plus d'exemples.

## 12. Dépannage

### L'email apparaît invalide mais il fonctionne:
- Le serveur peut bloquer les vérifications SMTP
- Essayer sans SMTP
- Certains serveurs sont protégés contre la vérification

### Validation très lente:
- SMTP peut être lent
- Certains serveurs ont des timeouts longs
- Désactiver SMTP pour plus de rapidité

### Résultats incohérents:
- Les serveurs peuvent changer de comportement
- Les DNS peuvent être mis en cache
- Réessayer après quelques minutes

## Support

Pour toute question:
- Consulter [README.md](README.md)
- Voir [QUICKSTART.md](QUICKSTART.md)
- Créer une issue sur GitHub
