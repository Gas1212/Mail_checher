# ⚡ Quick Deploy to serv00 Production

## Single Command Deployment

Connect to serv00 and run:

```bash
ssh gas1911@s26.serv00.com 'bash -s' << 'ENDSSH'
cd ~
curl -sO https://raw.githubusercontent.com/Gas1212/Mail_checher/main/deploy_to_serv00.sh
chmod +x deploy_to_serv00.sh
./deploy_to_serv00.sh
ENDSSH
```

## What This Does

1. Downloads the deployment script from GitHub
2. Makes it executable
3. Runs the deployment automatically

The script will:
- Clone latest code from GitHub
- Backup existing files
- Copy new files to production
- Verify .env configuration (API key already exists)
- Restart the application
- Show verification steps

## After Deployment

### Check Logs

```bash
ssh gas1911@s26.serv00.com "tail -50 ~/domains/gas1911.serv00.net/logs/django.log | grep -E '\[OK\]|\[HYBRID\]'"
```

You should see:
```
[OK] Groq API initialized (Primary - Ultra-fast)
[OK] HuggingFace Space initialized (Fallback - Reliable)
[HYBRID] Mode: Groq (fast) + HF Space (fallback)
```

### Test API

```bash
time curl -X POST https://gas1911.serv00.net/api/content-generator/generate/ \
  -H 'Content-Type: application/json' \
  -d '{"content_type":"product-title","product_name":"wireless headphones","tone":"professional"}'
```

Expected: **1-2 seconds** (via Groq)

## If Something Goes Wrong

See detailed troubleshooting in [SERV00_DEPLOYMENT.md](SERV00_DEPLOYMENT.md)

Quick rollback:
```bash
ssh gas1911@s26.serv00.com
ls -lt ~/backups/
# Restore from most recent backup
```

---

**Ready?** Just copy-paste the command above!
