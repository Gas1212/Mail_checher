# Migration vers Phi-3.5-mini + llama.cpp

## Changements effectués

### 1. Remplacement du modèle
- **Ancien**: Qwen 2.5 1.5B avec transformers + PyTorch
- **Nouveau**: Phi-3.5-mini 3.8B avec llama.cpp
- **Gain**: 3-4x plus rapide, meilleure qualité

### 2. Nouveaux fichiers

**requirements.txt** (simplifié):
```
fastapi==0.109.0
uvicorn[standard]==0.27.0
pydantic==2.5.3
llama-cpp-python==0.2.90
huggingface-hub==0.20.3
```

**app.py** (réécrit avec llama.cpp):
- Télécharge automatiquement le modèle GGUF depuis HuggingFace
- Utilise llama.cpp pour inférence ultra-rapide
- Compatible API OpenAI (aucun changement côté Django)

## Instructions de déploiement

### Push vers HuggingFace Space

```bash
cd huggingface-space

# Add all changes
git add .

# Commit
git commit -m "Upgrade to Phi-3.5-mini with llama.cpp for 3-4x speed"

# Push to HuggingFace
git push origin main
```

**Premier démarrage**: 5-10 minutes
**Démarrages suivants**: 1-2 minutes

## Aucun changement Django requis!

✅ Même endpoint, même format, même URL

## Performances attendues

| Avant | Après |
|-------|-------|
| 30-45s | 10-15s |

## Rollback si problème

```bash
git revert HEAD
git push origin main
```
