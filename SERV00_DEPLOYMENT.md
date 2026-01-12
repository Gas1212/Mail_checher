# 🚀 Deployment to serv00 Production Server

## Quick Start

### Step 1: Upload Deployment Script

```bash
# Connect to serv00
ssh gas1911@s26.serv00.com

# Download the deployment script from GitHub
cd ~
curl -O https://raw.githubusercontent.com/Gas1212/Mail_checher/main/deploy_to_serv00.sh
chmod +x deploy_to_serv00.sh

# Run deployment
./deploy_to_serv00.sh
```

### Step 2: Configure API Keys

If the script reports that `GROQ_API_KEY` is missing:

```bash
# Edit the .env file
nano ~/domains/gas1911.serv00.net/public_python/backend/.env

# Add these lines at the end:
# AI Content Generation - Hybrid System (Groq + HuggingFace)
GROQ_API_KEY=gsk_your_actual_groq_api_key_here
USE_INFERENCE_API=false

# NOTE: The actual API key is already in the production .env file
# Only edit if you need to update the key

# Save: Ctrl+X, Y, Enter

# Restart the application
devil www restart gas1911.serv00.net
```

### Step 3: Verify Deployment

```bash
# Download verification script
curl -O https://raw.githubusercontent.com/Gas1212/Mail_checher/main/verify_deployment.sh
chmod +x verify_deployment.sh

# Run verification
./verify_deployment.sh
```

## What Gets Deployed

### New Files
- `backend/content_generator/groq_service.py` - Groq API service (ultra-fast)
- `backend/content_generator/hybrid_service.py` - Hybrid orchestrator

### Updated Files
- `backend/content_generator/views.py` - Uses HybridContentService
- `backend/content_generator/huggingface_service.py` - Enhanced with API modes

### Configuration
- `backend/.env` - Groq API key and settings

## Production Directory Structure

```
~/domains/gas1911.serv00.net/
├── public_python/              # Production application
│   └── backend/
│       ├── .env               # Environment configuration
│       └── content_generator/
│           ├── groq_service.py      (NEW)
│           ├── hybrid_service.py    (NEW)
│           ├── views.py             (UPDATED)
│           └── huggingface_service.py (UPDATED)
└── logs/
    └── django.log             # Application logs
```

## Verification Checklist

After deployment, verify:

- [ ] Files deployed successfully
- [ ] `.env` contains `GROQ_API_KEY`
- [ ] Application restarted without errors
- [ ] Logs show: `[OK] Groq API initialized`
- [ ] Logs show: `[OK] HuggingFace Space initialized`
- [ ] Logs show: `[HYBRID] Mode: Groq (fast) + HF Space (fallback)`
- [ ] API responds in <2 seconds (Groq)
- [ ] Response contains `"provider": "groq"`

## Testing the API

### Quick Test

```bash
curl -X POST https://gas1911.serv00.net/api/content-generator/generate/ \
  -H 'Content-Type: application/json' \
  -d '{
    "content_type": "product-title",
    "product_name": "wireless headphones",
    "tone": "professional"
  }'
```

Expected response time: **1-2 seconds**

### Check Logs

```bash
# View recent logs
tail -50 ~/domains/gas1911.serv00.net/logs/django.log

# Watch logs in real-time
tail -f ~/domains/gas1911.serv00.net/logs/django.log | grep -E '\[OK\]|\[HYBRID\]|\[WARNING\]'
```

## Expected Performance

### Normal Operation (<30 req/min)
- **Provider**: Groq API
- **Response time**: 1-2 seconds
- **Model**: Llama 3.1 8B Instant

### Fallback Mode (>30 req/min or Groq unavailable)
- **Provider**: HuggingFace Space
- **Response time**: ~23 seconds
- **Model**: Phi-3.5-mini Q4_0

## Troubleshooting

### Issue 1: "AI service not configured"

**Cause**: Missing environment variables

**Solution**:
```bash
# Verify .env has Groq configuration
grep GROQ_API_KEY ~/domains/gas1911.serv00.net/public_python/backend/.env

# If missing, add it:
nano ~/domains/gas1911.serv00.net/public_python/backend/.env
# Add: GROQ_API_KEY=gsk_...

# Restart
devil www restart gas1911.serv00.net
```

### Issue 2: All requests via HuggingFace (slow)

**Cause**: Groq API not responding or invalid key

**Solution**:
```bash
# Test Groq API directly (replace with your actual key)
curl https://api.groq.com/openai/v1/models \
  -H "Authorization: Bearer $GROQ_API_KEY"

# If it fails, get a new key from https://console.groq.com
# Update .env with new key
nano ~/domains/gas1911.serv00.net/public_python/backend/.env

# Restart
devil www restart gas1911.serv00.net
```

### Issue 3: Application won't restart

**Cause**: Syntax error or missing dependencies

**Solution**:
```bash
# Check logs for errors
tail -100 ~/domains/gas1911.serv00.net/logs/django.log

# Verify Python can import new modules
cd ~/domains/gas1911.serv00.net/public_python/backend
python3.11 -c "from content_generator.groq_service import GroqService; print('OK')"

# If import fails, check file permissions
ls -la content_generator/*.py
```

## Rollback Procedure

If deployment fails and you need to rollback:

```bash
# Find your backup
ls -lt ~/backups/

# Example: Restore from backup
BACKUP_DIR="~/backups/mail_checker_20260112_143022"
cp "$BACKUP_DIR/views.py" ~/domains/gas1911.serv00.net/public_python/backend/content_generator/
cp "$BACKUP_DIR/huggingface_service.py" ~/domains/gas1911.serv00.net/public_python/backend/content_generator/
cp "$BACKUP_DIR/.env" ~/domains/gas1911.serv00.net/public_python/backend/

# Restart
devil www restart gas1911.serv00.net
```

## Manual Deployment (Alternative)

If the script doesn't work, deploy manually:

```bash
# 1. Clone repository
cd ~
git clone https://github.com/Gas1212/Mail_checher.git temp_deploy
cd temp_deploy

# 2. Copy files
cp backend/content_generator/groq_service.py \
   ~/domains/gas1911.serv00.net/public_python/backend/content_generator/

cp backend/content_generator/hybrid_service.py \
   ~/domains/gas1911.serv00.net/public_python/backend/content_generator/

cp backend/content_generator/views.py \
   ~/domains/gas1911.serv00.net/public_python/backend/content_generator/

cp backend/content_generator/huggingface_service.py \
   ~/domains/gas1911.serv00.net/public_python/backend/content_generator/

# 3. Update .env
nano ~/domains/gas1911.serv00.net/public_python/backend/.env
# Add Groq configuration

# 4. Restart
devil www restart gas1911.serv00.net

# 5. Cleanup
cd ~
rm -rf temp_deploy
```

## Monitoring in Production

### Daily Checks

```bash
# Check provider distribution
tail -1000 ~/domains/gas1911.serv00.net/logs/django.log | \
  grep "provider" | \
  awk '{print $NF}' | \
  sort | uniq -c

# Expected: 80-90% groq, 10-20% huggingface
```

### Performance Monitoring

```bash
# Average response times
tail -1000 ~/domains/gas1911.serv00.net/logs/django.log | \
  grep "generation_time" | \
  awk '{sum+=$NF; count++} END {print sum/count "s average"}'

# Expected: <3s average
```

## Support

If issues persist:

1. Check logs: `tail -100 ~/domains/gas1911.serv00.net/logs/django.log`
2. Verify .env configuration
3. Test Groq API directly
4. Consider disabling Groq (remove `GROQ_API_KEY` to use HF only)

---

**Last Updated**: 2026-01-12
**System**: Groq API (1s) + HuggingFace Space (23s fallback)
**Performance**: 24x improvement over original system
