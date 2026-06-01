# M9 TERMINAL — CUSTOM DOMAIN CONFIGURATION GUIDE

**Issue:** App is running but https://m9terminal.com shows 502  
**Root Cause:** Custom domain not properly configured on Railway  
**Solution:** Configure domain in Railway + DNS settings  

---

## ✅ APP IS WORKING!

From latest logs (18:00:49 UTC):

```
✓ Environment: production
✓ Port: 3000
✓ Database: Configured
✓ MLB routes loaded
✓ Markets routes loaded
✓ Engine routes loaded
✓ App loaded successfully
✓ Server running on http://localhost:3000
✓ Database connected
```

**The backend is 100% operational!** 🎉

---

## 🔴 THE PROBLEM

**You can access via Railway URL:**
```
https://m9terminal-prod.up.railway.app/
```
(Replace with your actual Railway URL from the Deployments tab)

**But NOT via custom domain:**
```
https://m9terminal.com/  ← Still shows 502
```

This means:
- ✅ Railway app is fine
- ❌ Custom domain routing is misconfigured
- ❌ DNS or Railway domain settings are wrong

---

## 🔧 FIX: CONFIGURE CUSTOM DOMAIN IN RAILWAY

### Step 1: Get Your Railway URL

1. Go to https://railway.app
2. Click M9 Terminal project
3. Click **Deployments** tab
4. Look for the deployment URL at the top
5. It looks like: `m9terminal-prod-xxx.up.railway.app`
6. **Copy this URL**

### Step 2: Add Domain to Railway

1. Go to https://railway.app
2. Click M9 Terminal project
3. Click **Settings** tab (gear icon)
4. Scroll to **Domains** section
5. Click **+ Add Domain**
6. Enter: `m9terminal.com`
7. Click **Add**
8. Railway will show DNS records you need to add

### Step 3: Configure DNS Records

Railway will show something like:

```
Type: CNAME
Name: m9terminal.com (or @ for root)
Value: m9terminal-prod-xxx.railway.app
TTL: 300 (or automatic)
```

**Where to add this:**
- Go to your domain registrar (GoDaddy, Namecheap, etc.)
- Find DNS settings
- Add the CNAME record Railway gave you
- Save changes

**DNS propagation:**
- Usually takes 5-30 minutes
- Can take up to 24 hours
- You'll see ✅ green check in Railway when done

### Step 4: Verify Connection

1. Go back to Railway Settings > Domains
2. Should show `m9terminal.com` with green ✅ status
3. Wait for green (may take a few minutes)
4. Try https://m9terminal.com in browser

---

## 🔗 ALTERNATIVE: IF DOMAIN ALREADY EXISTS

If `m9terminal.com` already exists in Railway Settings:

### Check Status
1. Go to Settings > Domains
2. Look for `m9terminal.com`
3. If it shows:
   - 🟢 Green ✅ = Working (but DNS may not have propagated yet)
   - 🔴 Red ❌ = Not configured properly
   - 🟡 Yellow ⏳ = Still propagating

### If Red ❌:
1. Click the domain
2. Check the DNS configuration
3. Verify DNS records at your registrar match what Railway shows
4. Fix any mismatches
5. Wait 5-30 minutes for propagation

### If Green ✅ but still 502:
1. The domain is configured correctly
2. The app is running
3. Issue might be:
   - DNS cache (wait 24 hours or flush cache)
   - Firewall/security rule
   - Browser cache (clear cache or use incognito)

---

## 🧪 TEST BOTH URLS

### Test 1: Railway URL (Should work immediately)
```
https://m9terminal-prod.up.railway.app/api/health
```

Expected response:
```json
{"status":"ok","timestamp":"...","uptime":...}
```

If this works → App is fine, issue is domain routing

### Test 2: Custom Domain (May take time)
```
https://m9terminal.com/api/health
```

If still 502 after domain is green ✅:
- Wait 30 minutes (DNS propagation)
- Clear browser cache
- Try in incognito/private mode
- Try different device/network

---

## 📋 CHECKLIST

- [ ] Go to https://railway.app
- [ ] Click M9 Terminal project
- [ ] Click Settings tab
- [ ] Find Domains section
- [ ] Check if m9terminal.com is listed
- [ ] If listed:
  - [ ] Check if status is 🟢 Green
  - [ ] If green, wait 30 min for DNS propagation
  - [ ] If red, click to see DNS settings
- [ ] If not listed:
  - [ ] Click "+ Add Domain"
  - [ ] Enter m9terminal.com
  - [ ] Copy DNS records Railway provides
  - [ ] Go to domain registrar (GoDaddy, Namecheap, etc.)
  - [ ] Add CNAME record from Railway
  - [ ] Save and wait 5-30 minutes
- [ ] Test Railway URL first: `m9terminal-prod.up.railway.app`
- [ ] Then test custom domain: `m9terminal.com`

---

## 🆘 TROUBLESHOOTING

### Symptom: App works on Railway URL but not custom domain

**Cause:** DNS not yet propagated or misconfigured

**Fix:**
1. Wait 30 minutes
2. Clear browser cache (Ctrl+Shift+Delete)
3. Try incognito mode
4. Check DNS records match exactly
5. Verify CNAME is added to your registrar

### Symptom: Green ✅ in Railway but still 502

**Cause:** DNS propagation or cache

**Fix:**
1. Wait up to 24 hours
2. Clear all browser caches
3. Restart computer
4. Try from different device
5. Use DNS checker: https://mxtoolbox.com/

### Symptom: Can't find Domains section

**Cause:** You're in wrong place

**Fix:**
1. Go to https://railway.app
2. Click "M9 Terminal" project
3. Click **Settings** (gear icon, top right)
4. Scroll down to **Domains** section
5. Should be there

---

## 📞 QUICK LINKS

| Task | URL |
|------|-----|
| **Railway Dashboard** | https://railway.app |
| **M9 Terminal Project** | Click project in Railway |
| **Settings (Domains)** | Gear icon, then scroll |
| **Test App** | https://m9terminal-prod.up.railway.app/api/health |
| **DNS Checker** | https://mxtoolbox.com/ |

---

## ✅ SUMMARY

**Current Status:**
- ✅ App running on Railway
- ✅ Backend responding
- ✅ Database connected
- ❌ Custom domain not configured

**What you need to do:**
1. Configure custom domain in Railway Settings
2. Add DNS CNAME record at your registrar
3. Wait 5-30 minutes for propagation
4. Verify at https://mxtoolbox.com/

**After domain is configured:**
- https://m9terminal.com will work
- Users can sign up and use the app
- All functionality available

**Timeline:**
- Immediate: Railway URL works
- 5-30 min: Custom domain propagates
- 1-24 hours: Full propagation complete

---

**You're almost there! Just need to configure the domain.** 🎉

Let me know if you need help with any step!
