# Instructions de Déploiement - Hugging Face Space

## Étape 1: Créer un nouveau Space sur Hugging Face

1. Allez sur https://huggingface.co/new-space
2. Remplissez les informations:
   - **Space name**: `llama-content-generator` (ou votre choix)
   - **License**: Llama 3.2 Community License
   - **SDK**: Docker
   - **Hardware**: A10G Large (24GB) ou mieux
   - **Visibility**: Public ou Private (Private recommandé pour production)

## Étape 2: Cloner et pousser les fichiers

```bash
# Cloner votre Space
git clone https://huggingface.co/spaces/YOUR-USERNAME/llama-content-generator
cd llama-content-generator

# Copier les fichiers du dossier huggingface-space
cp ../Mail-checker/huggingface-space/* .

# Ajouter et pousser
git add .
git commit -m "Initial deployment: Llama 3.2 11B Content Generator API"
git push
```

## Étape 3: Configurer les Secrets (si nécessaire)

Si vous souhaitez ajouter une authentification:
1. Allez dans Settings de votre Space
2. Ajoutez les secrets nécessaires (par exemple: API_KEY)

## Étape 4: Attendre le build

Le Space va:
1. Télécharger l'image Docker (5-10 min)
2. Télécharger le modèle Llama 3.2 11B (~22GB) (10-20 min)
3. Démarrer l'application

**Temps total**: 20-30 minutes pour le premier déploiement

## Étape 5: Obtenir l'URL de votre Space

Une fois déployé, votre API sera disponible à:
```
https://YOUR-USERNAME-llama-content-generator.hf.space
```

## Étape 6: Tester l'API

```bash
curl -X POST "https://YOUR-USERNAME-llama-content-generator.hf.space/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "meta-llama/Llama-3.2-11B-Vision-Instruct",
    "messages": [{"role": "user", "content": "Write a professional product title for an email validation tool"}],
    "max_tokens": 100,
    "temperature": 0.7
  }'
```

## Étape 7: Mettre à jour Django Backend

Dans votre fichier `.env` sur serv00:
```bash
# Remplacer l'URL Hugging Face par votre Space
HUGGINGFACE_SPACE_URL=https://YOUR-USERNAME-llama-content-generator.hf.space
```

## Coûts et Limitations

### Hardware Options:

1. **CPU Basic (gratuit)**
   - ❌ Trop lent pour Llama 11B
   - Non recommandé

2. **T4 Small ($0.60/h)**
   - ⚠️ 16GB VRAM - limite pour 11B
   - Peut fonctionner avec quantization

3. **A10G Large ($3.15/h) - RECOMMANDÉ**
   - ✅ 24GB VRAM - parfait pour 11B
   - Rapide et stable

4. **A100 ($31/h)**
   - ✅ 40GB/80GB VRAM - overkill pour 11B
   - Utilisez seulement si vous avez besoin d'ultra-performance

### Alternative moins chère:

Si le coût est un problème, utilisez **Llama 3.2 3B** au lieu de 11B:
- Fonctionne sur CPU Basic (gratuit)
- Qualité légèrement inférieure mais acceptable
- Changez dans app.py: `MODEL_NAME = "meta-llama/Llama-3.2-3B-Instruct"`

## Optimisations

### Pour réduire les coûts:

1. **Utiliser l'autoscaling**:
   - Le Space s'arrête automatiquement après inactivité
   - Redémarre à la première requête (~30s de délai)

2. **Utiliser un tier plus bas avec quantization**:
   ```python
   # Dans app.py, changer:
   model = AutoModelForCausalLM.from_pretrained(
       MODEL_NAME,
       torch_dtype=torch.float16,
       device_map="auto",
       load_in_8bit=True  # Ajouter cette ligne
   )
   ```

3. **Heures creuses**: Programmer le Space pour être actif uniquement aux heures de pointe

## Monitoring

Surveillez votre Space via:
- Dashboard Hugging Face: https://huggingface.co/spaces/YOUR-USERNAME/llama-content-generator
- Logs en temps réel
- Métriques d'utilisation
- Coûts accumulés

## Support

En cas de problème:
1. Vérifier les logs dans le dashboard du Space
2. Vérifier que le hardware est suffisant (24GB+ VRAM recommandé)
3. Tester l'endpoint avec curl
4. Contacter le support Hugging Face si nécessaire
