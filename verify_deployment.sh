#!/bin/bash
# Verification script for serv00 deployment
# Run this after deployment to verify everything works

echo "======================================================================="
echo "🔍 Verifying Hybrid AI System Deployment"
echo "======================================================================="
echo ""

PROD_DIR="$HOME/domains/gas1911.serv00.net/public_python"
LOG_FILE="$HOME/domains/gas1911.serv00.net/logs/django.log"

echo "[1/5] Checking deployed files..."
echo ""

if [ -f "$PROD_DIR/backend/content_generator/groq_service.py" ]; then
    echo "✓ groq_service.py exists"
else
    echo "✗ groq_service.py MISSING"
fi

if [ -f "$PROD_DIR/backend/content_generator/hybrid_service.py" ]; then
    echo "✓ hybrid_service.py exists"
else
    echo "✗ hybrid_service.py MISSING"
fi

echo ""
echo "[2/5] Checking environment configuration..."
if grep -q "GROQ_API_KEY" "$PROD_DIR/backend/.env"; then
    echo "✓ GROQ_API_KEY configured"
else
    echo "✗ GROQ_API_KEY missing in .env"
fi

if grep -q "HUGGINGFACE_SPACE_URL" "$PROD_DIR/backend/.env"; then
    echo "✓ HUGGINGFACE_SPACE_URL configured"
else
    echo "✗ HUGGINGFACE_SPACE_URL missing in .env"
fi

echo ""
echo "[3/5] Checking application logs..."
if [ -f "$LOG_FILE" ]; then
    echo "Recent logs:"
    tail -30 "$LOG_FILE" | grep -E '\[OK\]|\[HYBRID\]|\[WARNING\]|\[ERROR\]' || echo "No relevant log entries found"
else
    echo "✗ Log file not found at: $LOG_FILE"
fi

echo ""
echo "[4/5] Testing API endpoint..."
RESPONSE=$(curl -s -X POST https://gas1911.serv00.net/api/content-generator/generate/ \
  -H 'Content-Type: application/json' \
  -d '{"content_type":"product-title","product_name":"wireless headphones","tone":"professional","language":"en"}' \
  -w "\n%{http_code}" | tail -1)

if [ "$RESPONSE" = "200" ]; then
    echo "✓ API endpoint responding (HTTP 200)"
else
    echo "⚠ API returned HTTP $RESPONSE"
fi

echo ""
echo "[5/5] Testing response time..."
START_TIME=$(date +%s.%N)
FULL_RESPONSE=$(curl -s -X POST https://gas1911.serv00.net/api/content-generator/generate/ \
  -H 'Content-Type: application/json' \
  -d '{"content_type":"product-title","product_name":"smart water bottle","tone":"professional"}')
END_TIME=$(date +%s.%N)
DURATION=$(echo "$END_TIME - $START_TIME" | bc)

echo "Response time: ${DURATION}s"

# Check which provider was used
PROVIDER=$(echo "$FULL_RESPONSE" | grep -o '"provider":"[^"]*"' | cut -d'"' -f4)
if [ "$PROVIDER" = "groq" ]; then
    echo "✓ Using Groq API (ultra-fast)"
    if (( $(echo "$DURATION < 5" | bc -l) )); then
        echo "✓ Performance excellent (<5s)"
    else
        echo "⚠ Slower than expected for Groq"
    fi
elif [ "$PROVIDER" = "huggingface" ]; then
    echo "⚠ Using HuggingFace Space (fallback)"
    if (( $(echo "$DURATION < 30" | bc -l) )); then
        echo "✓ Fallback performance acceptable (<30s)"
    else
        echo "⚠ Slower than expected for HF Space"
    fi
else
    echo "⚠ Could not determine provider from response"
fi

echo ""
echo "======================================================================="
echo "📊 Verification Summary"
echo "======================================================================="
echo ""
echo "Expected behavior:"
echo "  • Most requests via Groq: 1-2 seconds"
echo "  • Fallback via HF Space: ~23 seconds"
echo "  • Provider field in response: 'groq' or 'huggingface'"
echo ""
echo "If Groq is not being used:"
echo "  1. Check logs for Groq initialization errors"
echo "  2. Verify GROQ_API_KEY is correct in .env"
echo "  3. Test Groq API directly:"
echo "     curl https://api.groq.com/openai/v1/models -H 'Authorization: Bearer \$GROQ_API_KEY'"
echo ""
