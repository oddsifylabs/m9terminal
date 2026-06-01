# M9 Terminal - Deployment & Launch Guide

## 🚀 Quick Start

### Option 1: Use the Startup Script (Recommended)
```bash
cd /home/pil_coder1/projects/m9terminal
./start.sh
```

This will:
- Kill any existing processes
- Clear ports 3002 and 3009
- Start frontend on http://localhost:3002
- Start backend on http://localhost:3009
- Verify both servers are working
- Keep both running in background

### Option 2: Manual Startup

**Terminal 1 - Frontend:**
```bash
cd /home/pil_coder1/projects/m9terminal/frontend
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd /home/pil_coder1/projects/m9terminal/backend
PORT=3009 npm start
```

---

## 📋 Verification Checklist

After starting both servers, verify everything is working:

### ✓ Check Frontend
```bash
curl -s http://localhost:3002 | head -5
# Should return HTML content
```

### ✓ Check Backend Health
```bash
curl -s http://localhost:3009/api/health | jq .
# Should return: {"status": "ok", "timestamp": "...", ...}
```

### ✓ Check Markets API
```bash
curl -s http://localhost:3009/api/markets/health | jq '.status'
# Should return: "HEALTHY"
```

### ✓ Check Live Data
```bash
curl -s http://localhost:3009/api/markets/live | jq '.games[0]'
# Should return live game data
```

---

## 🌐 Access the Application

- **Dashboard:** http://localhost:3002
- **Markets:** http://localhost:3002 (click MARKETS in footer)
- **Bet Log:** http://localhost:3002 (click BET LOG in footer)
- **Settings:** Click ⚙️ gear icon in header

---

## 📊 Monitor API Credits

Real-time credit monitoring dashboard:
```bash
curl -s http://localhost:3009/api/markets/health | jq '.'
```

This shows:
- Current cache status
- API requests made
- Credit estimates
- Optimization recommendations

---

## 🔧 Configuration

### API Keys (Production)
Before deploying to production, set environment variables:

```bash
# SportsData.io
export SPORTSDATA_IO_API_KEY="acdea7c8923843c4a1a00d1a0cde9adf"

# Odds API (main + backups)
export ODDS_API_KEY="6f46bbb3b2fb69b5e14980a57e9909da"
export ODDS_API_KEY_2="7d66822dc7744b39bd27b80cbdbb1a3f"
export ODDS_API_KEY_3="e2b8472e5a4741f97a5b8acb4ecf4f00"
export ODDS_API_KEY_4="e26f1baa1cdc73f6df9bd78f583b5510"

# Claude API
export CLAUDE_API_KEY="sk-ant-..."
```

### Backend Configuration
Backend automatically uses demo data if real APIs fail. To use real APIs:

1. Set the environment variables above
2. Restart the backend:
   ```bash
   PORT=3009 npm start
   ```

---

## 🚨 Troubleshooting

### Port Already in Use
```bash
# Kill all Node processes
pkill -9 node

# Or specifically kill port 3009
lsof -i :3009 | tail -1 | awk '{print $2}' | xargs kill -9
```

### Frontend Not Loading
```bash
cd /home/pil_coder1/projects/m9terminal/frontend
npm install
npm run dev
```

### Backend Not Starting
```bash
cd /home/pil_coder1/projects/m9terminal/backend
npm install
PORT=3009 npm start
```

### Database Connection Error (Expected)
This error is normal and expected in development:
```
Database connection error: Error: connect ECONNREFUSED 127.0.0.1:5432
```

It means PostgreSQL isn't running locally. This is fine for development and won't affect functionality.

---

## 📈 Production Deployment (Railway)

### Step 1: Prepare for Deployment
```bash
cd /home/pil_coder1/projects/m9terminal
git init
git add .
git commit -m "M9 Terminal - Ready for production"
```

### Step 2: Push to Railway
```bash
# Login to Railway
railway login

# Create new project
railway init

# Deploy
git push origin main
```

### Step 3: Configure Environment Variables on Railway
```
SPORTSDATA_IO_API_KEY=acdea7c8923843c4a1a00d1a0cde9adf
ODDS_API_KEY=6f46bbb3b2fb69b5e14980a57e9909da
CLAUDE_API_KEY=sk-ant-...
```

### Step 4: Monitor on Production
```bash
# Check health endpoint
curl https://your-app.railway.app/api/health

# Monitor credits
curl https://your-app.railway.app/api/markets/health
```

---

## 🎯 Testing Guide

### Test 1: Dashboard Load
1. Open http://localhost:3002
2. Should see:
   - Header with M9 TERMINAL title
   - Summary stats (Balance, Wagered, ROI, Active Bets)
   - Current Bets section
   - Footer navigation

### Test 2: Markets Page
1. Click MARKETS in footer
2. Should see:
   - Live games with real odds
   - Signal indicators (4 types)
   - Sport selector (MLB, NBA, NFL)
   - Profile selector (SHARP, ACTIVE, RESEARCH)
   - "+ PLACE BET" button on each game

### Test 3: Bet Placement
1. Go to Markets page
2. Click "+ PLACE BET" on any game
3. Should see bet placement modal with:
   - Bet type selector
   - Odds selector
   - Amount input
   - Payout calculation

### Test 4: Bet Log
1. Click BET LOG in footer
2. Should see:
   - Performance statistics (Balance, Wagered, ROI, Win Rate)
   - Bet history table
   - Status filtering (ALL, WON, LOST, PENDING)
   - Expandable bet details

### Test 5: Settings
1. Click ⚙️ gear in header
2. Should see:
   - Two-column layout
   - System Status section
   - Activity Log
   - API Status
   - About section

### Test 6: Responsive Design
1. Open DevTools (F12)
2. Toggle Device Toolbar
3. Test on different screen sizes:
   - Desktop (1024px+) ✓
   - Tablet (768px-1024px) ✓
   - Phone (480px-768px) ✓
   - Small phone (<480px) ✓

---

## 🔄 Common Tasks

### Clear Cache
```bash
# Clear frontend cache
rm -rf /home/pil_coder1/projects/m9terminal/frontend/node_modules/.vite

# Restart frontend
cd /home/pil_coder1/projects/m9terminal/frontend
npm run dev
```

### Update API Keys
```bash
# Set new keys
export ODDS_API_KEY="new_key_here"

# Restart backend
cd /home/pil_coder1/projects/m9terminal/backend
PORT=3009 npm start
```

### Check Server Logs
```bash
# Frontend logs
tail -f /tmp/m9-frontend.log

# Backend logs
tail -f /tmp/m9-backend.log
```

### Stop All Servers
```bash
pkill -f "npm run dev"
pkill -f "PORT=3009"
```

---

## 📊 Performance Monitoring

### API Credit Usage
```bash
curl -s http://localhost:3009/api/markets/health | jq '.creditEstimate'
```

Expected output:
```json
{
  "strategy": "5-minute cache, 3 sports",
  "requestsPerDay": 864,
  "requestsPerMonth": 25920,
  "estimatedTier": "PRO ($50/mo, 100k)"
}
```

### Cache Hit Rate
```bash
curl -s http://localhost:3009/api/markets/health | jq '.cache.stats'
```

Expected:
- High cache hit rate after warmup (minutes 2-5)
- Low requests per minute after caching starts

### Real-Time Monitoring
```bash
# Watch cache stats every 10 seconds
watch -n 10 'curl -s http://localhost:3009/api/markets/health | jq ".cache.stats"'
```

---

## 🎓 Next Steps for Production

1. **Purchase API Tier**
   - Starter ($10/month) for 10k requests
   - Pro ($50/month) for 100k requests (recommended)
   - Purchase at: https://the-odds-api.com/

2. **Configure Real API Keys**
   - Update environment variables
   - Test with real data
   - Monitor usage via health endpoint

3. **Deploy to Production**
   - Push code to Railway
   - Configure environment variables
   - Monitor first week closely

4. **Adjust Optimization**
   - Review actual API usage
   - Adjust cache TTLs if needed
   - Enable/disable features based on usage

5. **Scale**
   - Add more sports
   - Add more signal types
   - Add user accounts and persistence

---

## 📞 Support

For issues or questions:
1. Check logs: `tail -f /tmp/m9-*.log`
2. Test endpoints manually with curl
3. Review API documentation in `/docs/`
4. Check health endpoint: `http://localhost:3009/api/markets/health`

---

## ✅ Deployment Checklist

- [ ] Both servers start without errors
- [ ] Frontend accessible at http://localhost:3002
- [ ] Backend accessible at http://localhost:3009
- [ ] Health endpoint responds (/api/health)
- [ ] Markets API healthy (/api/markets/health)
- [ ] Dashboard loads and displays correctly
- [ ] Markets page shows live games
- [ ] Bet placement works
- [ ] Bet log displays history
- [ ] Settings page accessible
- [ ] Mobile view responsive
- [ ] No console errors in browser
- [ ] API keys configured (for production)
- [ ] Ready to deploy to Railway

---

**M9 Terminal is ready for launch!** 🚀

For more information, see:
- M9-TERMINAL-COMPLETE.md - Full delivery report
- README-FINAL.md - Production guide
- ODDS-API-CREDITS.md - Credit optimization details
- IMPLEMENTATION-COMPLETE.md - Technical implementation

Built by Oddsify Labs © 2026
