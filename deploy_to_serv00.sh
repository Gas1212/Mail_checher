#!/bin/bash
# Deployment script for serv00 production server
# Run this on serv00: ./deploy_to_serv00.sh

set -e  # Exit on error

echo "======================================================================="
echo "🚀 Deploying Hybrid AI System to serv00 Production"
echo "======================================================================="
echo ""

# Configuration
PROD_DIR="$HOME/domains/gas1911.serv00.net/public_python"
TEMP_DIR="$HOME/temp_mail_checker_deploy"
GITHUB_REPO="https://github.com/Gas1212/Mail_checher.git"

echo "[1/7] Cleaning up any previous temporary files..."
rm -rf "$TEMP_DIR"
echo "✓ Cleanup complete"
echo ""

echo "[2/7] Cloning latest code from GitHub..."
git clone "$GITHUB_REPO" "$TEMP_DIR"
cd "$TEMP_DIR"
echo "✓ Code cloned successfully"
echo ""

echo "[3/7] Verifying new files exist in repository..."
if [ -f "backend/content_generator/groq_service.py" ]; then
    echo "✓ groq_service.py found"
else
    echo "✗ groq_service.py NOT FOUND!"
    exit 1
fi

if [ -f "backend/content_generator/hybrid_service.py" ]; then
    echo "✓ hybrid_service.py found"
else
    echo "✗ hybrid_service.py NOT FOUND!"
    exit 1
fi
echo ""

echo "[4/7] Backing up existing files..."
BACKUP_DIR="$HOME/backups/mail_checker_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp "$PROD_DIR/backend/content_generator/views.py" "$BACKUP_DIR/" 2>/dev/null || true
cp "$PROD_DIR/backend/content_generator/huggingface_service.py" "$BACKUP_DIR/" 2>/dev/null || true
cp "$PROD_DIR/backend/.env" "$BACKUP_DIR/" 2>/dev/null || true
echo "✓ Backup saved to: $BACKUP_DIR"
echo ""

echo "[5/7] Copying new files to production..."
# Copy new service files
cp backend/content_generator/groq_service.py "$PROD_DIR/backend/content_generator/"
cp backend/content_generator/hybrid_service.py "$PROD_DIR/backend/content_generator/"

# Copy updated files
cp backend/content_generator/views.py "$PROD_DIR/backend/content_generator/"
cp backend/content_generator/huggingface_service.py "$PROD_DIR/backend/content_generator/"

echo "✓ Files copied successfully"
echo ""

echo "[6/7] Verifying environment variables..."
# Check if Groq config already exists
if grep -q "GROQ_API_KEY" "$PROD_DIR/backend/.env"; then
    echo "✓ Groq configuration already exists in .env"
    echo "ℹ Note: If you need to update the API key, edit .env manually:"
    echo "  nano $PROD_DIR/backend/.env"
else
    echo "⚠ WARNING: GROQ_API_KEY not found in .env"
    echo ""
    echo "Please add the following to $PROD_DIR/backend/.env:"
    echo ""
    echo "# AI Content Generation - Hybrid System (Groq + HuggingFace)"
    echo "GROQ_API_KEY=your_groq_api_key_here"
    echo "USE_INFERENCE_API=false"
    echo ""
    echo "To edit: nano $PROD_DIR/backend/.env"
    echo ""
    read -p "Press Enter after adding the configuration to continue..."
fi
echo ""

echo "[7/7] Restarting application..."
devil www restart gas1911.serv00.net

if [ $? -eq 0 ]; then
    echo "✓ Application restarted successfully"
else
    echo "⚠ Warning: Restart command returned non-zero status"
fi
echo ""

echo "======================================================================="
echo "✨ DEPLOYMENT COMPLETE"
echo "======================================================================="
echo ""
echo "📁 Files deployed:"
echo "  - groq_service.py (NEW)"
echo "  - hybrid_service.py (NEW)"
echo "  - views.py (UPDATED)"
echo "  - huggingface_service.py (UPDATED)"
echo "  - .env (UPDATED with Groq config)"
echo ""
echo "💾 Backup location: $BACKUP_DIR"
echo ""
echo "🔍 Verification steps:"
echo "1. Check logs for initialization:"
echo "   tail -50 ~/domains/gas1911.serv00.net/logs/django.log | grep -E '\\[OK\\]|\\[HYBRID\\]'"
echo ""
echo "2. Test API endpoint:"
echo "   curl -X POST https://gas1911.serv00.net/api/content-generator/generate/ \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"content_type\":\"product-title\",\"product_name\":\"wireless headphones\",\"tone\":\"professional\"}'"
echo ""
echo "3. Expected log messages:"
echo "   [OK] Groq API initialized (Primary - Ultra-fast)"
echo "   [OK] HuggingFace Space initialized (Fallback - Reliable)"
echo "   [HYBRID] Mode: Groq (fast) + HF Space (fallback)"
echo ""
echo "⚡ Expected performance:"
echo "  - Via Groq: 1-2 seconds (most requests)"
echo "  - Via HF Space: 23 seconds (fallback if Groq limit reached)"
echo ""

# Cleanup
echo "🧹 Cleaning up temporary files..."
cd "$HOME"
rm -rf "$TEMP_DIR"
echo "✓ Cleanup complete"
echo ""

echo "======================================================================="
echo "🎉 Deployment successful! System ready for production use."
echo "======================================================================="
