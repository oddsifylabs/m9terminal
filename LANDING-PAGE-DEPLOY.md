# M9 Terminal Landing Page — Quick Deployment Guide

## One-Click Deployment Options

### 1. Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy (from project root)
vercel deploy --prod

# Result: https://m9-terminal.vercel.app
```

### 2. Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir .

# Result: https://m9-terminal.netlify.app
```

### 3. GitHub Pages (Free)
```bash
# Already in GitHub, just enable Pages
# Settings > Pages > Deploy from branch > main
# Result: https://oddsifylabs.github.io/m9terminal/M9-Terminal-Landing.html
```

### 4. Railway (Same as M9 App)
```bash
# Add to public/ folder in frontend
cp M9-Terminal-Landing.html frontend/public/landing.html

# Serve at /landing route
# Or redirect / to this page in backend
git add -A && git commit -m "Add landing page" && git push origin main
# Railway auto-deploys in 30-60 seconds
```

---

## Pre-Deployment Checklist

Before going live, update these placeholders:

### In HTML File
- [ ] Line 72: Replace `og:image` URL with real image
- [ ] All `#` anchor links work correctly
- [ ] All `href="#"` links updated to real URLs
- [ ] Button click handlers call actual functions

### Environment Setup
- [ ] Domain configured (m9terminal.com)
- [ ] SSL certificate installed (auto with Vercel/Netlify)
- [ ] Analytics added (Google Analytics 4)
- [ ] Error tracking configured (Sentry/Rollbar optional)

### SEO/Marketing
- [ ] Google Search Console - sitemap submitted
- [ ] Meta Pixel - conversion tracking installed
- [ ] robots.txt and sitemap.xml created
- [ ] Social media preview tested (Twitter, Facebook, LinkedIn)

---

## File Location
**Project:** `/home/pil_coder1/projects/m9terminal/`  
**Landing Page:** `M9-Terminal-Landing.html` (32 KB, self-contained)  
**Documentation:** `LANDING-PAGE-SEO.md`

---

## Testing Before Launch

```bash
# 1. Check links
grep -o 'href="[^"]*"' M9-Terminal-Landing.html | sort | uniq

# 2. Validate HTML
npm install -g html-validator-cli
html-validator M9-Terminal-Landing.html

# 3. Test mobile view
# Open file in mobile browser or use DevTools

# 4. Lighthouse audit
# Chrome DevTools > Lighthouse > Analyze page load
# Target score: 90+ for all categories
```

---

## After Deployment

1. **Verify production URL works**
   ```bash
   curl -I https://your-domain.com/landing
   # Check for 200 OK response
   ```

2. **Monitor SEO metrics** (3-6 months)
   - Google Search Console (position tracking)
   - Google Analytics 4 (traffic, user behavior)
   - Tools: SEMrush, Ahrefs (keyword rankings)

3. **Optimize CTAs** (A/B test)
   - Button text variations
   - CTA placement
   - Color variations
   - Copy variations

4. **Build content** (ongoing)
   - Blog articles (sports betting, market analysis)
   - Case studies (real user success stories)
   - FAQ section (schema.org FAQPage)
   - Resource guides (betting education)

---

## Support & Questions

**Documentation:** `LANDING-PAGE-SEO.md`  
**GitHub:** `https://github.com/oddsifylabs/m9terminal`  
**Issues:** GitHub Issues or email dev@oddsifylabs.com

---

**Status:** ✅ Production-ready, can deploy immediately
