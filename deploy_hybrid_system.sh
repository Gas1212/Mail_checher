#!/bin/bash
# Script de déploiement du système hybride sur serv00

echo "======================================================================="
echo "Déploiement du Système Hybride IA - Groq + HuggingFace"
echo "======================================================================="
echo ""

# 1. Pull les derniers changements depuis GitHub
echo "[1/4] Pull des changements depuis GitHub..."
cd ~/domains/gas1911.serv00.net/Mail-checker
git pull origin main

if [ $? -ne 0 ]; then
    echo "ERREUR: Échec du git pull"
    exit 1
fi

echo "✓ Code mis à jour"
echo ""

# 2. Vérifier que le .env contient les variables nécessaires
echo "[2/4] Vérification de la configuration..."

if grep -q "GROQ_API_KEY" backend/.env; then
    echo "✓ GROQ_API_KEY configuré"
else
    echo "⚠ GROQ_API_KEY manquant dans .env"
fi

if grep -q "HUGGINGFACE_SPACE_URL" backend/.env; then
    echo "✓ HUGGINGFACE_SPACE_URL configuré"
else
    echo "⚠ HUGGINGFACE_SPACE_URL manquant dans .env"
fi

echo ""

# 3. Installer les dépendances Python si besoin
echo "[3/4] Installation des dépendances Python..."
cd backend
python3.11 -m pip install --user requests > /dev/null 2>&1
echo "✓ Dépendances installées"
echo ""

# 4. Redémarrer l'application Django
echo "[4/4] Redémarrage de l'application..."
devil www restart gas1911.serv00.net

if [ $? -eq 0 ]; then
    echo "✓ Application redémarrée avec succès"
else
    echo "⚠ Problème lors du redémarrage (vérifier manuellement)"
fi

echo ""
echo "======================================================================="
echo "DÉPLOIEMENT TERMINÉ"
echo "======================================================================="
echo ""
echo "Prochaines étapes:"
echo "1. Vérifier les logs: tail -f ~/domains/gas1911.serv00.net/logs/django.log"
echo "2. Tester l'API: curl -X POST https://gas1911.serv00.net/api/content-generator/generate/"
echo "3. Chercher dans les logs:"
echo "   - '[OK] Groq API initialized' = Groq disponible"
echo "   - '[OK] HuggingFace Space initialized' = Fallback disponible"
echo "   - '[HYBRID] Mode: Groq (fast) + HF Space (fallback)' = Système opérationnel"
echo ""
echo "Performance attendue:"
echo "  - Via Groq: 1-2 secondes (la plupart du temps)"
echo "  - Via HF Space: 23 secondes (si limite Groq atteinte)"
echo ""
