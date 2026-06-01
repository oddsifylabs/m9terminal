# M9 TERMINAL — QUICK BROWSER DEPLOYMENT (RIGHT NOW)

**You at work desk. Browser only. 30 minutes.**

---

## 🚀 STEP 1: Open Railway Dashboard

**Go to:** https://railway.app

**Log in** → Your M9 Terminal project

**You should see:**
- App Service (Node.js)
- PostgreSQL database

✅ **Done? Go to Step 2.**

---

## 🚀 STEP 2: Check PostgreSQL Variables

**Click:** PostgreSQL (left sidebar)
**Tab:** Variables

**Copy the value:**
```
DATABASE_URL=postgresql://...
```

**Keep this tab open** (you'll need it in Step 3)

✅ **Done? Go to Step 3.**

---

## 🚀 STEP 3: Add Variables to App Service

**Click:** App Service (back to main app)
**Tab:** Variables

**Paste this line:**
```
DATABASE_URL=postgresql://...
```
(Use the value you copied in Step 2)

**Add these lines too:**
```
NODE_ENV=production
PORT=3000
JWT_SECRET=abcd1234abcd1234abcd1234abcd1234
ENCRYPTION_KEY=efgh5678efgh5678efgh5678efgh5678
CLAUDE_API_KEY=sk-ant-...
SPORTSDATA_IO_API_KEY=your-api-key
ODDS_API_KEY=your-api-key
STRIPE_SECRET_KEY=sk_live_...
FRONTEND_URL=https://m9terminal.com
```

**Note:** If you don't have API keys yet, **leave them blank** for now (add later)

**Click:** Save (bottom right)

**Wait:** See "✅ Variables saved"

✅ **Done? Go to Step 4.**

---

## 🚀 STEP 4: Deploy Code

**Click:** Deployments (tab at top)

**Do you see your code deployed?**

**Yes:** Go to Step 5

**No:** Click **Redeploy** button → Wait 60 seconds → Go to Step 5

✅ **Done? Go to Step 5.**

---

## 🚀 STEP 5: Check Logs

**Click:** Logs (top right)

**Scroll down. Do you see?**

```
✓ npm install
✓ Starting server
✓ Database connected
✓ Listening on port 3000
```

**No red ❌ errors?** → Go to Step 6

**Yes red errors?** → Send me screenshot, I'll fix

✅ **Done? Go to Step 6.**

---

## 🚀 STEP 6: Test the App

**Get your Railway URL:**
- Click: App Service
- Copy the **URL** at top (e.g., https://m9terminal-prod.up.railway.app)

**Test 1: Health Check**
- In browser: `https://m9terminal-prod.up.railway.app/api/health`
- Should see: `{"status":"ok","database":"connected"}`

**Test 2: Main App**
- In browser: `https://m9terminal.com`
- Should see: Dashboard loads, no 502 errors

**Both work?** → 🎉 **YOU'RE DONE!**

---

## ✅ DEPLOYMENT COMPLETE!

Your M9 Terminal SaaS is now **LIVE** at:
```
https://m9terminal.com
```

---

## 📚 Need Details?

Full guide: **M9-TERMINAL-RAILWAY-WEB-DEPLOYMENT.md**
(On GitHub: https://github.com/oddsifylabs/m9terminal)

---

## ❌ Something went wrong?

**Step 3: Variables not saving?**
- Scroll down, click Save again
- Wait 5 seconds
- Refresh page

**Step 5: Red errors in logs?**
- Take screenshot
- Send to me
- I'll help fix

**Step 6: 502 Bad Gateway?**
- Wait 30 seconds
- Refresh page
- If still broken, send logs screenshot

---

**Status: ✅ READY TO START**

Follow steps 1-6. Should take 30 minutes. 🚀
