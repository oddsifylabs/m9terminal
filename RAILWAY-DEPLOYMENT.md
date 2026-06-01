# M9 Terminal — Railway Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Variables
Set these in Railway dashboard under **Project > Variables**:

| Variable | Required | Example | Notes |
|----------|----------|---------|-------|
| `DATABASE_URL` | ✅ | `postgresql://user:pass@host:5432/db` | PostgreSQL connection string |
| `NODE_ENV` | ✅ | `production` | Set to production |
| `PORT` | ✅ | `3000` | Railway will auto-assign |
| `FRONTEND_URL` | ❌ | (auto-set) | Railway auto-sets to deployment domain |
| `ODDS_API_KEY` | ✅ | (your key) | From https://the-odds-api.com |
| `CLAUDE_API_KEY` | ✅ | (your key) | From https://console.anthropic.com |
| `SPORTSDATA_IO_API_KEY` | ❌ | (your key) | From https://sportsdata.io |
| `JWT_SECRET` | ✅ | (random string) | Generate: `openssl rand -hex 32` |

### 2. Database Setup
1. Add PostgreSQL service to Railway project
2. Copy `DATABASE_URL` from PostgreSQL service
3. Paste into M9 Terminal Variables
4. Run migrations (if any): SSH into service and run `npm run db:migrate`

### 3. GitHub Push
All changes must be on `main` branch:
```bash
git add -A
git commit -m "Railway deployment setup"
git push origin main
```

## Deployment Steps

### Option A: Railway CLI (Recommended)
```bash
# Login to Railway
railway login

# Link to project
railway link <PROJECT_ID>

# Deploy
railway up
```

### Option B: Railway Dashboard
1. Go to https://railway.app/dashboard
2. Create new project or select existing
3. Add GitHub repository (oddsifylabs/m9terminal)
4. Select `main` branch
5. Railway auto-detects `railway.json` and deploys
6. Set environment variables in dashboard
7. Trigger deployment: push to `main` or redeploy manually

## Build & Start Process

### Build Phase
```bash
npm install
npm run build  # Builds frontend (Vite) → frontend/dist/
```

**Output:** React app compiled to `frontend/dist/index.html` + assets

### Start Phase
```bash
node backend/index.js
```

**What happens:**
1. Backend Express server starts on `PORT` (3000)
2. Loads environment variables from `.env` (Railway injects via Variables)
3. Connects to PostgreSQL
4. Serves `/api/*` routes from `backend/`
5. Serves static files (React frontend) from `frontend/dist/`
6. Falls back to `index.html` for SPA routing

## Health & Verification

### Health Check Endpoint
```bash
GET /health → 200 OK
{
  "status": "ok",
  "timestamp": "2024-06-01T...",
  "uptime": 123.45
}
```

Railway uses `/health` to verify service is running.

### Test Frontend
1. Visit `https://your-deployment.railway.app`
2. Should see React frontend
3. Check browser console for API errors

### Test API
```bash
# Health check
curl https://your-deployment.railway.app/health

# Engine endpoint
curl https://your-deployment.railway.app/api/engine/health
```

## Troubleshooting

### Build Fails: "npm: command not found"
- Railway detected Node.js correctly? Check `railway.json` has `"builder": "NIXPACKS"`
- Force rebuild: Delete `node_modules/`, push to trigger rebuild

### Build Fails: "frontend: command not found"
- Vite build script running from wrong directory
- Check: `frontend/package.json` has `"build": "vite build"`
- Solution: Use `cd frontend && npm run build && cd ..` in root build script ✓ (already set)

### Frontend Shows 404
- `frontend/dist/` not created during build
- Check build logs: `railway logs --service m9terminal`
- Verify: `ls -la frontend/dist/` in Railway shell

### Backend Can't Connect to Database
- `DATABASE_URL` not set or invalid
- Test: `psql $DATABASE_URL` in Railway shell
- Verify PostgreSQL service is running in same project

### CORS Errors
- `FRONTEND_URL` not set correctly
- Set to: `https://your-deployment.railway.app` (no trailing slash)
- Or remove `FRONTEND_URL` and backend auto-allows all in production

### Port Already in Use
- Railway manages `PORT` automatically
- Do NOT hardcode 3000 in `backend/index.js` — use `process.env.PORT`
- Current code uses: `const PORT = process.env.PORT || 3000` ✓

## Logs & Monitoring

### View Logs
```bash
railway logs --service m9terminal --follow
```

### Metrics
Railway dashboard shows:
- CPU, Memory, Disk usage
- Request count & latency
- Error rate
- Deployment history

### Error Alerts
Configure webhooks or email alerts in Railway dashboard

## Post-Deployment

### Verify Services
1. ✓ Backend responding on `/health`
2. ✓ Frontend loads at root `/`
3. ✓ API endpoints accessible at `/api/*`
4. ✓ Database connected & queries working

### Auto-Redeploy
Railway watches GitHub:
- Push to `main` → Railway auto-redeploys in 30-60 seconds
- No manual steps needed
- Rollback available in dashboard

### Environment Updates
1. Change variable in Railway dashboard
2. Service restarts automatically
3. Or manually redeploy: Dashboard > Redeploy

## File Structure

```
m9terminal/
├── backend/
│   ├── index.js              ← Entry point (Express server)
│   ├── package.json
│   ├── routes/
│   │   ├── engine.js
│   │   ├── optimized-markets.js
│   │   ├── claude.js
│   │   └── mlb-live.js
│   └── services/
│       ├── optimized-odds-service.js
│       ├── mlb-live-data.js
│       └── ...
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── dist/                 ← (created during npm run build)
│   ├── src/
│   │   ├── App.jsx
│   │   ├── pages/
│   │   ├── components/
│   │   └── services/
│   └── index.html
├── package.json              ← Root (orchestrates build + start)
├── Procfile                  ← Railway: web process
├── railway.json              ← Railway: build, deploy, env config
├── .env.example              ← Environment template
└── README.md
```

## Next Steps

1. **Set up PostgreSQL** in Railway
2. **Set environment variables** in dashboard
3. **Push to main branch** to trigger deployment
4. **Monitor logs** during first build
5. **Test endpoints** after deployment
6. **Configure auto-alerts** for errors/downtime

---

**Questions?** Check Railway docs: https://docs.railway.app/
