# M9 TERMINAL — WEB-BASED DEPLOYMENT GUIDE

**Status:** Railway ✅ + PostgreSQL ✅ running  
**Setup:** Browser-only (no local terminal needed)  
**Time:** 30-45 minutes  

---

## 📋 QUICK CHECKLIST (Web-Only Steps)

- [ ] **Step 1:** Check PostgreSQL connection in Railway (5 min)
- [ ] **Step 2:** Add environment variables in Railway (10 min)
- [ ] **Step 3:** Deploy code via GitHub (auto-deploy) (5 min)
- [ ] **Step 4:** Monitor Railway logs (5 min)
- [ ] **Step 5:** Test health endpoint (5 min)
- [ ] **Step 6:** Verify app is live (5 min)

---

## STEP 1: CHECK POSTGRESQL CONNECTION IN RAILWAY

### 1.1 Open Railway Dashboard

Go to: **https://railway.app**

**Log in** with your GitHub account if needed.

### 1.2 Select Your Project

1. Look for your **M9 Terminal** project
2. Click on it to open
3. You should see **2 services:**
   - ✅ **App Service** (Node.js)
   - ✅ **PostgreSQL** (database)

### 1.3 Check PostgreSQL Status

1. Click on **PostgreSQL** service (left sidebar)
2. Look at the **Logs** tab at the top
3. You should see:
   ```
   ✓ PostgreSQL running
   ✓ Database created
   ✓ Ready to accept connections
   ```

### 1.4 Copy Database URL

1. Click **PostgreSQL** → **Variables** tab
2. **Look for:**
   ```
   DATABASE_URL=postgresql://postgres:***@containers-us-west-***railway.app:5432/railway
   ```
3. **Copy this value** (you'll need it for Step 2)

---

## STEP 2: ADD ENVIRONMENT VARIABLES IN RAILWAY

### 2.1 Click on App Service

1. Go back to Railway dashboard
2. Click **App Service** (Node.js app)

### 2.2 Click Variables Tab

Top of the page: **Variables** tab

### 2.3 Add Required Variables

**Copy each line below and paste into Railway Variables:**

```
DATABASE_URL=postgresql://postgres:***@containers-us-west-***railway.app:5432/railway
```
(Copy the value from Step 1.4 above)

```
NODE_ENV=production
```

```
PORT=3000
```

```
JWT_SECRET=your-256-bit-secret-key-here
```

```
ENCRYPTION_KEY=your-256-bit-encryption-key-here
```

### 2.4 Generate JWT_SECRET and ENCRYPTION_KEY

**Option A: Use online generator**
1. Go to: https://www.random.org/bytes/
2. Generate 32 bytes
3. Hex format
4. Copy the value
5. Paste into `JWT_SECRET`
6. Repeat for `ENCRYPTION_KEY`

**Option B: Ask me to generate**
- I'll create two random 64-character strings for you

### 2.5 Add API Keys

**If you have these API keys, add them:**

```
CLAUDE_API_KEY=sk-ant-...
```

```
SPORTSDATA_IO_API_KEY=your-key-here
```

```
ODDS_API_KEY=your-key-here
```

```
STRIPE_SECRET_KEY=sk_live_...
```

**If you don't have these yet:**
- Leave them blank for now
- You'll add them later

### 2.6 Save Variables

**At the bottom right:** Click **Save**

**Wait for confirmation:**
```
✅ Variables saved successfully
```

---

## STEP 3: DEPLOY CODE VIA GITHUB (AUTO-DEPLOY)

### 3.1 Check if Code is Already Deployed

1. In Railway dashboard → **Deployments** tab
2. Look at the list of deployments
3. If the most recent one says **"Success"** ✅
   - Your code is **already deployed!**
   - Skip to Step 4

### 3.2 If Code is NOT Deployed

**Option A: Redeploy existing code**
1. Click the most recent deployment
2. Click **Redeploy** button
3. Wait 30-60 seconds
4. Should show: **"Deployment successful"** ✅

**Option B: Push new code from GitHub (if changes needed)**
1. Go to: https://github.com/oddsifylabs/m9terminal
2. Click **Code** button
3. Review the latest commit
4. If code is up to date, no need to push
5. If you need to update code:
   - Go to the file you want to edit
   - Click the pencil icon (Edit)
   - Make changes
   - Click **"Commit changes"**
   - Railway will **auto-deploy** in 30-60 seconds

### 3.3 Watch Deployment Progress

1. Go to Railway dashboard → **Deployments** tab
2. Watch the status:
   - **Building...** (30-45 sec)
   - **Deploying...** (15-30 sec)
   - **Success ✅** (you're done!)

---

## STEP 4: MONITOR RAILWAY LOGS

### 4.1 Open Logs

1. Railway dashboard → **Logs** tab (top right)
2. Scroll down to see **latest messages**

### 4.2 Look for These Success Messages

```
✓ npm install (dependencies installed)
✓ Starting server on port 3000
✓ Database connected
✓ Listening on port 3000
```

### 4.3 Check for Errors

**Look for error messages like:**
```
❌ Error: ENOENT: no such file or directory
❌ Cannot find module 'pg'
❌ Database connection error
❌ Error: listen EADDRINUSE: address already in use :::3000
```

**If you see errors:**
- Click **Details** to expand the error
- Take a screenshot
- Send to me, I'll help fix

---

## STEP 5: TEST HEALTH ENDPOINT

### 5.1 Get Your Railway App URL

1. Railway dashboard → **App Service**
2. Look for **URL** at the top
3. It looks like: `https://m9terminal-prod.up.railway.app`
4. **Copy this URL**

### 5.2 Test Health Endpoint

**Option A: Use your browser**
1. Paste your Railway URL in address bar:
   ```
   https://m9terminal-prod.up.railway.app/api/health
   ```
2. Press Enter
3. You should see a response like:
   ```json
   {
     "status": "ok",
     "database": "connected",
     "timestamp": "2026-06-01T10:30:00Z",
     "uptime": 0.123
   }
   ```

**Option B: Use curl (if you have access to terminal on work machine)**
```bash
curl https://m9terminal-prod.up.railway.app/api/health | jq .
```

### 5.3 What Each Response Means

| Response | Meaning | Action |
|----------|---------|--------|
| `{"status":"ok","database":"connected"}` | ✅ Everything working | Go to Step 6 |
| `Cannot GET /api/health` | ❌ Endpoint not found | Check logs for errors |
| `{"database":"disconnected"}` | ❌ Database not connected | Check DATABASE_URL in variables |
| `Connection timeout` | ❌ App not responding | Wait 30 sec, try again |

---

## STEP 6: VERIFY APP IS LIVE

### 6.1 Open Main App URL

In your browser, go to:
```
https://m9terminal.com
```

### 6.2 Check What You See

**Expected (app is working):**
- ✅ Page loads
- ✅ You see the M9 Terminal dashboard
- ✅ Bankroll page visible
- ✅ No error messages

**Not expected (app has issues):**
- ❌ 404 Not Found
- ❌ 502 Bad Gateway
- ❌ Connection timeout
- ❌ Blank page

### 6.3 Check Browser Console (DevTools)

**On your browser:**
1. Press **F12** (or **Cmd+Option+J** on Mac)
2. Click **Console** tab
3. Look for red error messages
4. **No red errors** = ✅ Good!

### 6.4 Check Railway Metrics

1. Go back to Railway dashboard
2. Click **Metrics** tab (next to Logs)
3. Look for:
   - **CPU:** < 20%
   - **Memory:** < 100 MB
   - **Network:** Normal traffic

**All green?** ✅ Your app is live and healthy!

---

## 🎉 DEPLOYMENT COMPLETE!

If you've completed all 6 steps and:
- ✅ Environment variables set in Railway
- ✅ Code deployed (Deployments tab shows Success)
- ✅ Logs show no errors
- ✅ `/api/health` returns `{"status":"ok"}`
- ✅ `https://m9terminal.com` loads

**Then your M9 Terminal SaaS is LIVE!** 🚀

---

## TROUBLESHOOTING

### Problem: "Cannot connect to database"

**In Railway Logs, you see:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Fix:**
1. Go to **PostgreSQL service** → **Variables**
2. Copy the `DATABASE_URL`
3. Go to **App Service** → **Variables**
4. Paste the `DATABASE_URL` value
5. Click **Save**
6. Wait 30 seconds
7. Check logs again

---

### Problem: "502 Bad Gateway"

**In your browser:**
```
502 Bad Gateway
```

**Fix:**
1. Go to Railway dashboard → **Logs**
2. Look for error messages
3. Most common: missing environment variables
4. Add missing variables (see Step 2)
5. Click **Redeploy** in Deployments tab
6. Wait 60 seconds
7. Try accessing app again

---

### Problem: "Cannot find module 'pg'"

**In Railway Logs:**
```
Error: Cannot find module 'pg'
```

**Fix:**
1. Go to GitHub: https://github.com/oddsifylabs/m9terminal
2. Check **package.json** includes `"pg"`
3. If missing, edit file:
   - Click **package.json**
   - Click pencil icon
   - Add `"pg": "^8.11.0"` under `dependencies`
   - Click **Commit**
4. Railway will auto-redeploy
5. Wait 60 seconds
6. Check logs for success

---

### Problem: "Deployment stuck at 'Building...'"

**In Deployments tab:**
```
Building... (more than 5 minutes)
```

**Fix:**
1. Click the stuck deployment
2. Click **View Details**
3. Check the logs
4. If it's really stuck:
   - Go to **Settings** → **Redeploy from GitHub**
   - Click **Redeploy**
   - New deployment will start

---

## 📞 QUICK COMMANDS

**If you can use terminal at work computer:**

```bash
# Test health endpoint
curl https://m9terminal-prod.up.railway.app/api/health | jq .

# Generate secure random key
openssl rand -hex 32
```

---

## 📊 NEXT STEPS

**After app is live (all 6 steps complete):**

1. **Enable Stripe** (15 min)
   - Go to https://dashboard.stripe.com
   - Create products for your pricing tiers
   - Set webhook: `https://m9terminal.com/api/webhooks/stripe`
   - Test payment flow

2. **Test User Signup** (5 min)
   - Go to https://m9terminal.com
   - Click "Sign Up"
   - Create test account
   - Verify JWT token in browser

3. **Test Trial** (5 min)
   - Go to PostgreSQL in Railway
   - Find the user you created
   - Update trial expiration to yesterday
   - Try to access app
   - Should show "Trial expired" message

4. **Monitor Continuously** (daily)
   - Check Railway logs for errors
   - Watch CPU/memory usage
   - Monitor API response times

---

## 📚 FILES REFERENCE

All guides are on GitHub:
```
https://github.com/oddsifylabs/m9terminal
```

- **M9-TERMINAL-DEPLOYMENT-GUIDE.md** — Full technical guide
- **QUICK-START-CHECKLIST.md** — Quick checklist format
- **M9-TERMINAL-RAILWAY-WEB-DEPLOYMENT.md** — This file (browser-only)

---

## ✅ YOU'RE GOOD TO GO!

You now have everything needed to deploy from your work desk using just a browser.

**Questions?** I'm here to help! 🚀

---

**Status: READY FOR WEB-BASED DEPLOYMENT**

All 6 steps designed for browser access. No local terminal needed.

Estimated time: 30-45 minutes
