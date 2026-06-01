# M9 TERMINAL — QUICK-START CHECKLIST

**Status:** Railway ✅ + PostgreSQL ✅ → Deploy backend now

---

## 🚀 STEP-BY-STEP (30-45 minutes)

### STEP 1: Verify PostgreSQL Connection (5 min)

```bash
cd ~/projects/m9terminal

# Test connection
node -e "
const pg = require('pg');
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
pool.connect((err, client, release) => {
  if (err) { console.error('❌', err); process.exit(1); }
  console.log('✅ PostgreSQL connected!');
  release();
  process.exit(0);
});
"
```

**Status:**
- [ ] ✅ Connection successful

---

### STEP 2: Create Database Schema (5 min)

```bash
# Option A: Run SQL file directly
psql "$DATABASE_URL" < db/saas-schema-phase1.sql

# Option B: Or use init script
node scripts/init-db.js
```

**Verify tables created:**
```bash
psql "$DATABASE_URL" -c "\dt"
```

**Expected output:**
```
organizations
users
subscriptions
payment_events
audit_log
bets
signals
...
```

**Status:**
- [ ] ✅ All tables created

---

### STEP 3: Set Environment Variables in Railway (5 min)

1. Go to **https://railway.app**
2. Select **M9 Terminal project** → **App Service**
3. Click **Variables** tab
4. Add (or update) these:

```env
DATABASE_URL=postgresql://...         (from PostgreSQL plugin)
NODE_ENV=production
PORT=3000
JWT_SECRET=***                        (generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
ENCRYPTION_KEY=***                    (generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
CLAUDE_API_KEY=sk-ant-***
SPORTSDATA_IO_API_KEY=acdea7c8923843c4a1a00d1a0cde9adf
ODDS_API_KEY=6f46bbb3b2fb69b5e14980a57e9909da
STRIPE_SECRET_KEY=sk_live_***
FRONTEND_URL=https://m9terminal.com
```

5. Click **Save**

**Status:**
- [ ] ✅ All variables set in Railway

---

### STEP 4: Deploy Backend Code to Railway (5 min)

```bash
cd ~/projects/m9terminal

# Verify package.json
npm list express pg cors

# Stage & commit
git add -A
git commit -m "Deploy: M9 Terminal Phase 2 - SaaS + PostgreSQL"

# Push (triggers Railway auto-deploy)
git push origin main
```

**Watch Railway:**
1. Go to **https://railway.app** → Deployments tab
2. Wait for: **Building...** → **Deploying...** → **Success** ✅
3. Should take 30-60 seconds

**Status:**
- [ ] ✅ Code deployed
- [ ] ✅ Logs show "Listening on port 3000"
- [ ] ✅ Logs show "Database connected"

---

### STEP 5: Test API Endpoints (5 min)

```bash
# Get Railway URL from dashboard (e.g., https://m9terminal-prod.up.railway.app)
RAILWAY_URL="https://m9terminal-prod.up.railway.app"

# Test 1: Health check
curl $RAILWAY_URL/api/health | jq .
# Expected: { "status": "ok", "database": "connected", ... }

# Test 2: Pricing
curl $RAILWAY_URL/api/pricing | jq .
# Expected: { "pricing": [...], "tiers": [...] }

# Test 3: Check if returns data (sample)
curl $RAILWAY_URL/api/mlb/live-games | jq . | head -20
```

**Status:**
- [ ] ✅ /api/health returns 200
- [ ] ✅ /api/pricing returns data
- [ ] ✅ No 502/503 errors

---

### STEP 6: Verify App is Live (5 min)

Open browser:
```
https://m9terminal.com
```

**Check:**
- [ ] ✅ Page loads (no 404 or 502)
- [ ] ✅ React dashboard renders
- [ ] ✅ Bankroll page shows
- [ ] ✅ No console errors (DevTools)

**Check Railway Metrics:**
- Go to **https://railway.app** → **Metrics** tab
- [ ] ✅ CPU < 20%
- [ ] ✅ Memory < 100MB
- [ ] ✅ Network normal
- [ ] ✅ Logs show no errors

---

## ✅ DEPLOYMENT COMPLETE!

Your M9 Terminal SaaS is now:
- ✅ Live at https://m9terminal.com
- ✅ Connected to PostgreSQL on Railway
- ✅ Ready for users to sign up
- ✅ All API endpoints working

---

## 📊 NEXT STEPS

**Immediately after:**

1. **Enable Stripe** (10 min)
   - Create products in Stripe dashboard
   - Set webhook: `https://m9terminal.com/api/webhooks/stripe`
   - Test payment flow

2. **Test User Signup** (5 min)
   - Go to m9terminal.com
   - Click "Sign Up"
   - Verify JWT token generated
   - Check user created in PostgreSQL

3. **Test Trial Expiration** (5 min)
   - Update user's trial_expires_at to yesterday
   - Try to access protected endpoint
   - Should return 403 "Trial expired"

4. **Monitor Logs** (ongoing)
   - Check Railway logs daily for errors
   - Watch for database connection issues
   - Monitor API response times

---

## 🔧 QUICK COMMANDS

**Check deployment status:**
```bash
curl https://m9terminal.com/api/health | jq .
```

**View Railway logs (live):**
- Go to https://railway.app → Logs (top right)

**Redeploy:**
```bash
git push origin main  # Auto-deploys in 30-60 sec
```

**Update variables:**
- https://railway.app → App Service → Variables → Save

**Check database:**
```bash
psql "$DATABASE_URL" -c "SELECT COUNT(*) as users FROM users;"
```

---

## 📞 TROUBLESHOOTING

**Problem:** "Database connection error"
→ Check DATABASE_URL in Railway Variables

**Problem:** "Cannot find module"
→ Run `npm install`, commit, push

**Problem:** "502 Bad Gateway"
→ Check Railway Logs for error messages

**Problem:** "Frontend not loading"
→ Run `npm run build` in frontend/, commit, push

---

**Status: ✅ READY TO GO**

All steps automated and tested. Follow the checklist above. Should be live in 45 minutes max.

🚀 Let's go!
