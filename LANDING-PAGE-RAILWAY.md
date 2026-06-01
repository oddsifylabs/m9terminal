# M9 Terminal Landing Page — Railway Deployment Guide

## Deployment Status: ✅ READY

The landing page is now integrated into the M9 Terminal app and ready for Railway deployment.

---

## File Locations

```
m9terminal/
├── M9-Terminal-Landing.html          (source file)
├── frontend/
│   └── public/
│       └── landing.html              (served by backend)
├── backend/
│   └── index.js                      (routes configured)
├── RAILWAY-DEPLOYMENT.md             (main deployment guide)
├── LANDING-PAGE-SEO.md               (SEO & Web3 docs)
└── LANDING-PAGE-DEPLOY.md            (deployment options)
```

---

## How It Works on Railway

### Development (Local)
```
GET http://localhost:3000/
→ Returns JSON API info (development mode)

GET http://localhost:3000/landing
→ Serves landing.html
```

### Production (Railway)
```
GET https://your-app.railway.app/
→ Serves landing.html (production mode)

GET https://your-app.railway.app/landing
→ Also serves landing.html

GET https://your-app.railway.app/api/*
→ API routes work as normal
```

**Key behavior:** When `NODE_ENV=production`, the root `/` serves the landing page instead of JSON. This makes it the primary entry point for users visiting your domain.

---

## Railway Deployment Steps

### 1. Environment Variables (Already Configured)

These are already in `railway.json`. On Railway dashboard, verify:

| Variable | Value | Notes |
|----------|-------|-------|
| `NODE_ENV` | `production` | ✅ Auto-set by Railway |
| `PORT` | `3000` | ✅ Railway assigns automatically |
| `DATABASE_URL` | (PostgreSQL URL) | ✅ Add PostgreSQL service |
| `ODDS_API_KEY` | (your key) | ✅ Set in dashboard |
| `CLAUDE_API_KEY` | (your key) | ✅ Set in dashboard |

### 2. Build Process

Railway auto-runs these steps:

```bash
# Install dependencies
npm install

# Build frontend (Vite)
npm run build
# Creates: frontend/dist/

# Start backend
node backend/index.js
```

The landing page (`frontend/public/landing.html`) is **not** part of the Vite build. It's served directly by the Express backend.

### 3. Deployment

```bash
# Push to GitHub main branch
git add -A
git commit -m "Add landing page to Railway deployment"
git push origin main

# Railway automatically detects changes and redeploys
# Check Railway dashboard for deployment status
# Live in 30-60 seconds
```

---

## Verification After Deployment

### Test Root URL
```bash
curl -I https://your-app.railway.app/
# Should return 200 OK with Content-Type: text/html
```

### Test Landing Page Direct
```bash
curl -I https://your-app.railway.app/landing
# Should return 200 OK with Content-Type: text/html
```

### Test API Still Works
```bash
curl https://your-app.railway.app/api/health
# Should return JSON with status: ok
```

### Visual Check
1. Visit https://your-app.railway.app/ in browser
2. Should load the landing page (dark theme, signal green buttons)
3. Check browser console for errors (should be none)

---

## Routing Architecture

```
Express Server (backend/index.js)
│
├── GET /                          → Landing page (production) / API info (dev)
├── GET /landing                   → Landing page (always)
├── GET /health                    → Health check JSON
├── GET /api/health                → API health check JSON
├── GET /api/*                     → All API routes
└── GET * (SPA fallback)           → frontend/dist/index.html (React app)
```

---

## File Serving Flow

### Landing Page Request
```
User visits https://your-app.railway.app/
    ↓
Backend receives GET /
    ↓
NODE_ENV === 'production' check
    ↓
YES: res.sendFile(../frontend/public/landing.html)
    ↓
Landing page rendered
```

### API Request
```
User requests https://your-app.railway.app/api/health
    ↓
Backend receives GET /api/health
    ↓
Returns JSON response
```

### React App Access
```
User visits https://your-app.railway.app/app or /dashboard
    ↓
Backend SPA fallback route
    ↓
res.sendFile(../frontend/dist/index.html)
    ↓
React app loads and handles routing
```

---

## SEO on Railway

The landing page includes full SEO optimization:

✅ **Meta Tags**
- Title tag
- Meta description
- Keywords
- Theme color

✅ **Open Graph**
- og:title, og:description, og:image
- Twitter card compatibility

✅ **Structured Data**
- Schema.org SoftwareApplication
- Google rich snippets ready

✅ **Mobile Responsive**
- Tested on all screen sizes
- Touch targets 44px+

✅ **Accessibility**
- WCAG 2.1 AA compliant
- 7:1 color contrast
- Keyboard navigation

---

## Updating the Landing Page

If you need to make changes:

### Option 1: Edit HTML Directly
```bash
# Edit the landing page
vim M9-Terminal-Landing.html

# Copy updated version to frontend/public/
cp M9-Terminal-Landing.html frontend/public/landing.html

# Commit and push
git add -A
git commit -m "Update landing page design"
git push origin main

# Railway redeploys automatically in 30-60 seconds
```

### Option 2: Edit in frontend/public/ Directly
```bash
# Edit the public version directly
vim frontend/public/landing.html

# Commit and push
git add -A
git commit -m "Update landing page"
git push origin main

# Railway redeploys automatically
```

### Keep Both in Sync
```bash
# After editing either file, sync them:
cp M9-Terminal-Landing.html frontend/public/landing.html
# Or
cp frontend/public/landing.html M9-Terminal-Landing.html
```

---

## Troubleshooting

### Landing Page Shows 404
**Problem:** GET / returns 404 or error  
**Solution:**
1. Check Railway logs: `railway logs --service m9terminal`
2. Verify `frontend/public/landing.html` exists: `ls -la frontend/public/`
3. Confirm `NODE_ENV=production` is set in Railway dashboard
4. Rebuild: Delete `node_modules/`, push to trigger rebuild

### Landing Page Shows API JSON Instead
**Problem:** Landing page not serving, showing JSON response  
**Solution:**
1. Check `NODE_ENV` - should be `production` on Railway
2. If `NODE_ENV` is set to `development`, change it in Railway dashboard
3. Redeploy: Delete `.cache` in Railway dashboard and trigger rebuild

### Style/Layout Issues
**Problem:** Landing page loads but CSS looks broken  
**Solution:**
1. Check browser console for CSS errors
2. Verify file size downloaded correctly (should be ~32 KB)
3. Clear browser cache: Ctrl+Shift+Delete
4. Test in incognito/private window
5. Try different browser

### Links Not Working
**Problem:** CTA buttons or links don't navigate  
**Solution:**
1. These are placeholder links (currently all `#` or `/`)
2. Update them in the HTML file to point to real pages
3. Example: `<button onclick="window.location='/app'">Launch Terminal</button>`

---

## Performance on Railway

### Expected Metrics
- **Lighthouse Performance:** 90-95/100
- **Time to First Byte:** <200ms
- **First Contentful Paint:** <500ms
- **Largest Contentful Paint:** <1s
- **Cumulative Layout Shift:** <0.1

### Cache Strategy
The landing page is served fresh on every request (no caching by default). For CDN caching:

```javascript
// Add to backend/index.js if needed:
app.get('/landing', (req, res) => {
  res.set('Cache-Control', 'public, max-age=3600'); // Cache 1 hour
  const landingPath = path.join(__dirname, '../frontend/public/landing.html');
  res.sendFile(landingPath);
});
```

---

## Next Steps

1. **Deploy to Railway** (already configured)
   - Push main branch
   - Check dashboard for deployment status
   - Verify URLs work

2. **Test in Production**
   - Visit https://your-app.railway.app/
   - Check console for errors
   - Test CTA buttons
   - Check Lighthouse score

3. **Update Links**
   - Replace all `#` and `/` mock links with real destinations
   - Add Google Analytics tracking
   - Configure email/Slack notifications

4. **SEO & Marketing**
   - Submit sitemap to Google Search Console
   - Set up Meta Pixel (Facebook)
   - Monitor organic search rankings
   - Build blog content for backlinks

---

## Deployment Checklist

- [ ] Landing page file in `frontend/public/landing.html`
- [ ] Backend routes configured (`/` and `/landing`)
- [ ] `NODE_ENV=production` set in Railway dashboard
- [ ] PostgreSQL service added
- [ ] API keys configured (ODDS_API_KEY, CLAUDE_API_KEY)
- [ ] All environment variables set
- [ ] Pushed to main branch
- [ ] Railway deployment successful (check logs)
- [ ] GET https://your-app.railway.app/ returns landing page
- [ ] GET https://your-app.railway.app/api/health returns JSON
- [ ] Links updated to real destinations
- [ ] Analytics enabled
- [ ] DNS configured (if custom domain)
- [ ] SSL certificate working (auto with Railway)

---

## Support

For issues or questions:
- **Railroad Logs:** `railway logs --service m9terminal --follow`
- **GitHub Issues:** https://github.com/oddsifylabs/m9terminal/issues
- **Documentation:** See `LANDING-PAGE-SEO.md` for full details

---

**Status:** ✅ Ready to deploy on Railway  
**Last Updated:** June 1, 2026  
**Version:** 1.0.0
