# 🚀 Guide de Déploiement - Système Hybride IA

## Déploiement sur Production (serv00)

### Option 1: Déploiement Automatique (Recommandé)

```bash
# 1. Connectez-vous au serveur
ssh gas1911@s26.serv00.com

# 2. Uploadez le script de déploiement
# (Copiez le contenu de deploy_hybrid_system.sh et créez-le sur le serveur)
nano ~/deploy_hybrid_system.sh
# Collez le contenu, Ctrl+X, Y, Enter

# 3. Rendez le script exécutable
chmod +x ~/deploy_hybrid_system.sh

# 4. Exécutez le déploiement
./deploy_hybrid_system.sh
```

### Option 2: Déploiement Manuel

```bash
# 1. Connectez-vous au serveur
ssh gas1911@s26.serv00.com

# 2. Allez dans le répertoire du projet
cd ~/domains/gas1911.serv00.net/Mail-checker

# 3. Pull les derniers changements
git pull origin main

# 4. Vérifiez que .env contient les bonnes clés
cat backend/.env | grep -E "GROQ|HUGGINGFACE|USE_INFERENCE"

# Devrait afficher:
# GROQ_API_KEY=gsk_...
# HUGGINGFACE_API_KEY=hf_...
# HUGGINGFACE_SPACE_URL=https://gas-tn-sugesto.hf.space
# USE_INFERENCE_API=false

# 5. Redémarrez l'application
devil www restart gas1911.serv00.net
```

## ✅ Vérification du Déploiement

### 1. Vérifier les Logs

```bash
# Suivre les logs en temps réel
tail -f ~/domains/gas1911.serv00.net/logs/django.log

# Cherchez ces lignes au démarrage:
# [OK] Groq API initialized (Primary - Ultra-fast)
# [OK] HuggingFace Space initialized (Fallback - Reliable)
# [HYBRID] Mode: Groq (fast) + HF Space (fallback)
```

### 2. Tester l'API

```bash
# Test simple (Product Title)
curl -X POST https://gas1911.serv00.net/api/content-generator/generate/ \
  -H "Content-Type: application/json" \
  -d '{
    "content_type": "product-title",
    "product_name": "wireless headphones noise cancellation",
    "tone": "professional",
    "language": "en"
  }'

# Réponse attendue:
# {
#   "success": true,
#   "content": "...",
#   "model": "llama-3.1-8b-instant",
#   "provider": "groq",  ← Devrait être "groq" (rapide)
#   "metadata": {...}
# }
```

### 3. Vérifier la Performance

```bash
# Tester plusieurs requêtes et mesurer le temps
time curl -X POST https://gas1911.serv00.net/api/content-generator/generate/ \
  -H "Content-Type: application/json" \
  -d '{
    "content_type": "product-title",
    "product_name": "smart water bottle",
    "tone": "professional"
  }'

# Temps attendu:
# - Via Groq: 1-3 secondes (la plupart du temps)
# - Via HF: 23-25 secondes (si limite Groq atteinte)
```

## 📊 Monitoring en Production

### Logs à Surveiller

```bash
# Voir les requêtes en temps réel
tail -f ~/domains/gas1911.serv00.net/logs/django.log | grep -E "\[OK\]|\[WARNING\]|\[ERROR\]"

# Messages importants:
# [OK] Groq API initialized        → Groq disponible
# [WARNING] Groq failed             → Fallback vers HF Space
# [ERROR] ...                       → Problème à investiguer
```

### Métriques Clés

1. **Provider Ratio**
   - But: 80-90% via Groq, 10-20% via HF
   - Si <50% via Groq: possiblement limite atteinte

2. **Temps de Réponse**
   - Normal: 1-2s (Groq) ou 23s (HF)
   - Si >30s: problème potentiel

3. **Taux d'Erreur**
   - Normal: <1%
   - Si >5%: investiguer les logs

## 🔧 Dépannage

### Problème 1: "AI service not configured"

**Cause:** Variables d'environnement manquantes

**Solution:**
```bash
# Vérifier .env
cd ~/domains/gas1911.serv00.net/Mail-checker/backend
cat .env | grep -E "GROQ|HUGGINGFACE"

# Si manquant, ajouter:
nano .env
# Ajouter les lignes manquantes

# Redémarrer
devil www restart gas1911.serv00.net
```

### Problème 2: Toutes les requêtes via HF Space (lent)

**Cause:** Groq API ne répond pas ou clé invalide

**Solution:**
```bash
# Tester la clé Groq directement
curl https://api.groq.com/openai/v1/models \
  -H "Authorization: Bearer gsk_..." \
  | jq

# Si erreur: clé invalide
# Générer une nouvelle clé sur: https://console.groq.com

# Mettre à jour .env
nano ~/domains/gas1911.serv00.net/Mail-checker/backend/.env
# Remplacer GROQ_API_KEY

# Redémarrer
devil www restart gas1911.serv00.net
```

### Problème 3: Erreur 500 sur l'API

**Cause:** Problème dans le code ou dépendances manquantes

**Solution:**
```bash
# Voir les logs d'erreur
tail -50 ~/domains/gas1911.serv00.net/logs/django.log

# Vérifier les dépendances Python
cd ~/domains/gas1911.serv00.net/Mail-checker/backend
python3.11 -m pip list | grep requests

# Réinstaller si nécessaire
python3.11 -m pip install --user --upgrade requests

# Redémarrer
devil www restart gas1911.serv00.net
```

## 📱 Test depuis l'Application Frontend

1. Allez sur https://app.sugesto.xyz/tools/content-generator
2. Essayez de générer du contenu
3. Ouvrez les DevTools (F12) → Network
4. Regardez la requête à `/api/content-generator/generate/`
5. Vérifiez le champ `provider` dans la réponse:
   - `"provider": "groq"` = Ultra-rapide ✅
   - `"provider": "huggingface"` = Fallback (normal si limite atteinte)

## 🎯 Performance Attendue

### En Conditions Normales (< 30 req/min)

| Type de Contenu | Avant | Après (Groq) | Amélioration |
|-----------------|-------|--------------|--------------|
| Product Title | 23s | 1.1s | 21x |
| Description | 27s | 1.2s | 22x |
| Social Media | 23s | 0.9s | 26x |
| Email Subject | - | 0.6s | Nouveau |

### Si Limite Groq Atteinte (> 30 req/min)

- Requêtes suivantes utilisent HF Space (~23s)
- Après 1 minute, Groq redevient disponible
- Aucune interruption de service

## ✅ Checklist de Déploiement

- [ ] Code poussé sur GitHub (commit a9355d4)
- [ ] Connecté au serveur serv00
- [ ] `git pull origin main` exécuté
- [ ] Variables `.env` vérifiées (GROQ_API_KEY, etc.)
- [ ] Application redémarrée (`devil www restart`)
- [ ] Logs vérifiés (Groq + HF initialisés)
- [ ] Test API effectué (provider=groq)
- [ ] Performance mesurée (<3s)
- [ ] Test depuis frontend réussi

## 📞 Support

Si problème persistant:
1. Vérifier les logs: `tail -50 ~/domains/gas1911.serv00.net/logs/django.log`
2. Vérifier le .env: Les clés API sont-elles correctes?
3. Tester Groq directement: `curl https://api.groq.com/...`
4. En dernier recours: Désactiver Groq en retirant `GROQ_API_KEY` du .env (utilise HF uniquement)

---

**Version:** 1.0.0
**Date:** 2026-01-12
**Système:** Groq API (1s) + HuggingFace Space (23s fallback)
**Performance:** 24x amélioration
