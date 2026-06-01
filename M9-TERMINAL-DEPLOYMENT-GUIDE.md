# M9 TERMINAL — COMPLETE STEP-BY-STEP SETUP GUIDE

**Status:** Railway app service ✅ + PostgreSQL database ✅ running  
**Next:** Connect backend to Railway, deploy app code, verify live  
**Estimated Time:** 30-45 minutes

---

## 📋 QUICK CHECKLIST

- [ ] **Step 1:** Verify Railway PostgreSQL connection (5 min)
- [ ] **Step 2:** Create/update database schema (5 min)
- [ ] **Step 3:** Set environment variables in Railway (5 min)
- [ ] **Step 4:** Deploy backend code to Railway (5 min)
- [ ] **Step 5:** Test API endpoints (5 min)
- [ ] **Step 6:** Verify app is live at https://m9terminal.com (5 min)

---

## STEP 1: VERIFY RAILWAY POSTGRESQL CONNECTION

### 1.1 Check Railway Dashboard

Go to **https://railway.app** → Select your project → **PostgreSQL plugin**

**Copy these from Railway dashboard:**
- `DATABASE_URL` (under Variables)
- `POSTGRES_URL`

**Example:**
```
DATABASE_URL=postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway
```

### 1.2 Test Connection Locally

```bash
cd ~/projects/m9terminal

# Verify .env has DATABASE_URL
grep DATABASE_URL .env

# If not present, add it:
echo "DATABASE_URL=postgresql://..." >> .env

# Test PostgreSQL connection
npm install pg
node -e "
const pg = require('pg');
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Connection error:', err);
    process.exit(1);
  }
  console.log('✅ PostgreSQL connected!');
  client.query('SELECT NOW()', (err, result) => {
    if (err) console.error(err);
    else console.log('Current time:', result.rows[0]);
    release();
    process.exit(0);
  });
});
"
```

**Expected output:**
```
✅ PostgreSQL connected!
Current time: { now: 2026-06-01T... }
```

---

## STEP 2: CREATE DATABASE SCHEMA

### 2.1 Check Existing Schema File

```bash
cd ~/projects/m9terminal
ls -lh db/
```

**Expected files:**
- `saas-schema-phase1.sql` — SaaS tables (users, subscriptions, payment_events)
- Other schema files

### 2.2 Initialize Database Schema

**Option A: Run schema file directly**

```bash
# Connect to PostgreSQL and run schema
psql "$DATABASE_URL" < db/saas-schema-phase1.sql

# Verify tables created
psql "$DATABASE_URL" -c "
  SELECT table_name FROM information_schema.tables 
  WHERE table_schema = 'public' 
  ORDER BY table_name;
"
```

**Expected output:**
```
            table_name
------------------------------
 activity_log
 audit_log
 bankroll
 bets
 games
 organizations
 payment_events
 signals
 subscriptions
 users
```

**Option B: Create schema programmatically (Node.js)**

Create `scripts/init-db.js`:

```javascript
const pg = require('pg');
const fs = require('fs');

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function initDB() {
  try {
    const schema = fs.readFileSync('db/saas-schema-phase1.sql', 'utf8');
    const queries = schema.split(';').filter(q => q.trim());
    
    for (const query of queries) {
      await pool.query(query);
      console.log('✓ Executed:', query.substring(0, 50) + '...');
    }
    
    console.log('✅ Database schema initialized!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

initDB();
```

Run it:

```bash
node scripts/init-db.js
```

### 2.3 Verify Tables Created

```bash
psql "$DATABASE_URL" -c "\dt"
```

---

## STEP 3: SET ENVIRONMENT VARIABLES IN RAILWAY

### 3.1 Go to Railway Dashboard

1. https://railway.app → Select your project
2. Click on **App Service** (Node.js service)
3. Click **Variables** tab

### 3.2 Add Required Environment Variables

Add these variables (copy/paste):

```env
DATABASE_URL=postgresql://...         (from PostgreSQL plugin)
NODE_ENV=production
PORT=3000
JWT_SECRET=your-256-bit-jwt-secret    (generate below)
ENCRYPTION_KEY=your-256-bit-key       (generate below)
CLAUDE_API_KEY=sk-ant-...             (from Anthropic console)
SPORTSDATA_IO_API_KEY=...             (from SportsData.io console)
ODDS_API_KEY=...                      (from The Odds API console)
STRIPE_SECRET_KEY=sk_live_...         (from Stripe dashboard)
FRONTEND_URL=https://m9terminal.com
```

### 3.3 Generate JWT_SECRET and ENCRYPTION_KEY

```bash
# Generate 256-bit (64-character hex) keys
node -e "
const crypto = require('crypto');
console.log('JWT_SECRET=' + crypto.randomBytes(32).toString('hex'));
console.log('ENCRYPTION_KEY=' + crypto.randomBytes(32).toString('hex'));
"
```

**Copy the output and paste into Railway Variables**

### 3.4 Save Variables

Click **Save** in Railway dashboard

**Verify in Railway dashboard:**
```
✅ Variables saved successfully
```

---

## STEP 4: DEPLOY BACKEND CODE TO RAILWAY

### 4.1 Ensure package.json is Correct

```bash
cd ~/projects/m9terminal
cat package.json | grep -A 5 '"scripts"'
```

**Expected (at minimum):**
```json
{
  "scripts": {
    "start": "node backend/index.js",
    "dev": "nodemon backend/index.js"
  }
}
```

If missing, add to package.json:

```bash
npm set-script start "node backend/index.js"
npm set-script dev "nodemon backend/index.js"
```

### 4.2 Push Code to GitHub

```bash
cd ~/projects/m9terminal

# Check git status
git status

# Stage all changes
git add -A

# Commit
git commit -m "Deploy: M9 Terminal Phase 2 - SaaS setup with PostgreSQL"

# Push to GitHub
git push origin main
```

**Watch Railway automatically deploy:**
1. Go to Railway dashboard → **Deployments** tab
2. Wait for status: **Building...** → **Deploying...** → **Success** (30-60 seconds)

### 4.3 Check Railway Logs

Railway dashboard → **Logs** tab:

```
✓ npm install (or yarn install)
✓ Starting Node.js server
✓ Listening on port 3000
✓ Database connected
```

**If you see errors:** Click **View Details** and check error messages

---

## STEP 5: TEST API ENDPOINTS

### 5.1 Get Railway App URL

Railway dashboard → Select **App Service** → Copy the **URL** (e.g., `https://m9terminal-prod.up.railway.app`)

### 5.2 Test Health Endpoint

```bash
RAILWAY_URL="https://m9terminal-prod.up.railway.app"

# Health check
curl $RAILWAY_URL/api/health | jq .

# Expected response:
# {
#   "status": "ok",
#   "database": "connected",
#   "timestamp": "2026-06-01T...",
#   "uptime": 0.xxx
# }
```

### 5.3 Test Database Connection

```bash
# Test database query
curl $RAILWAY_URL/api/test-db | jq .

# Expected response (if endpoint exists):
# { "status": "ok", "timestamp": "2026-06-01T..." }
```

### 5.4 Test Main API Routes

```bash
# Test subscription pricing endpoint
curl $RAILWAY_URL/api/pricing | jq .

# Test engine/signal endpoint
curl "$RAILWAY_URL/api/engine/signals?sport=mlb" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" | jq .
```

---

## STEP 6: VERIFY APP IS LIVE

### 6.1 Test Main Domain

Open your browser:
```
https://m9terminal.com
```

**You should see:**
- ✅ Bankroll page loads
- ✅ React frontend renders
- ✅ No 404 or 502 errors

### 6.2 Check Railway Metrics

Railway dashboard → **Metrics** tab:

```
✅ CPU: < 20%
✅ Memory: < 100 MB
✅ Network: Normal
✅ Logs: No errors
```

### 6.3 Monitor Logs in Real-Time

Railway dashboard → **Logs** tab → Check for errors:

```
✓ GET /api/health 200 (5ms)
✓ GET /api/pricing 200 (12ms)
✓ POST /api/bets 200 (45ms)
```

---

## TROUBLESHOOTING

### Problem: "Database connection error"

**Cause:** `DATABASE_URL` not set or incorrect

**Fix:**
1. Copy `DATABASE_URL` from PostgreSQL plugin
2. Paste into Railway App Variables
3. Click **Save**
4. Wait 30 seconds
5. Check logs again

### Problem: "Cannot find module 'pg'"

**Cause:** Missing dependencies

**Fix:**
```bash
npm install pg express cors helmet express-rate-limit dotenv
npm install
git add package-lock.json
git commit -m "Update dependencies"
git push origin main
```

### Problem: "502 Bad Gateway"

**Cause:** App crashed or not responding

**Fix:**
1. Check Railway **Logs** for error messages
2. Look for "Error:", "TypeError:", "ReferenceError:"
3. Fix the error locally
4. `git push origin main` to redeploy

### Problem: "ENOENT: no such file or directory, open 'frontend/dist/index.html'"

**Cause:** React frontend not built

**Fix:**
```bash
cd ~/projects/m9terminal/frontend
npm install
npm run build
cd ..
git add frontend/dist
git commit -m "Build: React frontend"
git push origin main
```

---

## NEXT STEPS (AFTER VERIFICATION)

### Phase 2A: Stripe Integration
- [ ] Create Stripe products (monthly, yearly, lifetime pricing)
- [ ] Set webhook URL in Stripe: `https://m9terminal.com/api/webhooks/stripe`
- [ ] Test checkout flow
- [ ] Verify payment confirmation in database

### Phase 2B: Authentication
- [ ] Build login/register pages
- [ ] Implement JWT token generation
- [ ] Test trial signup flow
- [ ] Verify user can access protected endpoints

### Phase 2C: Game Analysis
- [ ] Test `/api/engine/signals` endpoint
- [ ] Verify Claude signal detection works
- [ ] Test bet tracking
- [ ] Verify CLV calculation

### Phase 2D: Bankroll Management
- [ ] Test bankroll update endpoint
- [ ] Verify P&L calculation
- [ ] Test bet history filtering
- [ ] Verify analytics dashboard

---

## IMPORTANT LINKS

| Resource | URL |
|----------|-----|
| **M9 Terminal App** | https://m9terminal.com |
| **Railway Dashboard** | https://railway.app |
| **GitHub Repo** | https://github.com/oddsifylabs/m9terminal |
| **Health Check** | https://m9terminal.com/api/health |
| **Stripe Dashboard** | https://dashboard.stripe.com |
| **Claude API Docs** | https://docs.anthropic.com/ |

---

## 📞 QUICK REFERENCE

**Check app status:**
```bash
curl https://m9terminal.com/api/health
```

**View Railway logs:**
- Go to https://railway.app → Select project → Logs tab

**Redeploy app:**
```bash
git push origin main  # Auto-deploys in 30-60 seconds
```

**Update environment variables:**
- Go to https://railway.app → App Service → Variables → Save

**SSH into Railway app (if needed):**
```bash
railway shell  # Requires Railway CLI
```

---

**Status:** ✅ **READY TO DEPLOY**

All systems go! Follow steps 1-6 above, and your M9 Terminal SaaS will be live in ~45 minutes. 🚀
