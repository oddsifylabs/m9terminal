# M9 TERMINAL — MLB ONLY MODE

**Date:** June 1, 2026  
**Status:** ✅ **DEPLOYED**  
**Model Focus:** MLB Only

---

## 🎯 WHAT CHANGED

### Markets Page

**Before:**
- Show all sports (MLB, NBA, NFL)
- Multi-sport data mixed together
- User can switch between sports
- All sports have live data

**After:**
- **NBA button:** DISABLED 🔒 (Coming soon)
- **NFL button:** DISABLED 🔒 (Coming soon)
- **MLB button:** ACTIVE ⚾ (Only working model)
- Forces MLB selection if other sport selected
- Only MLB games displayed
- Only MLB live data shown
- Clear "MLB Model Active" indicator

---

### Bankroll Page

**Before:**
- Show all sports data (MLB, NBA, NFL, NHL, Soccer)
- Performance breakdown by sport
- Sessions mixed across sports
- Allocation across all sports

**After:**
- **MLB ONLY** data displayed
- Performance section shows MLB only
- Sessions are MLB trades only
- Allocation is MLB bankroll only
- Risk allocation for MLB only
- All metrics prefixed with ⚾ MLB
- Clear "MLB Model Only" banner at top

---

## 🔧 TECHNICAL CHANGES

### Markets.jsx Changes

```javascript
// ONLY MLB IS ACTIVE - OTHER SPORTS DISABLED
const sportOptions = [
  { value: 'baseball_mlb', label: 'MLB', logo: '⚾', active: true },
  { value: 'basketball_nba', label: 'NBA', logo: '🏀', active: false, disabled: true },
  { value: 'americanfootball_nfl', label: 'NFL', logo: '🏈', active: false, disabled: true },
];

// Force MLB selection
if (selectedSport !== 'baseball_mlb') {
  setSelectedSport('baseball_mlb');
  return;
}

// Only fetch MLB
const response = await fetch(`/api/markets/live?sport=baseball_mlb`);
```

**Features:**
- ✅ NBA/NFL buttons disabled (grayed out, unclickable)
- ✅ Shows 🔒 lock icon on disabled buttons
- ✅ Tooltip: "Coming soon - MLB only for now"
- ✅ Forces MLB selection (can't switch to other sports)
- ✅ Fetches only MLB data from API
- ✅ Shows "MLB Model Active" banner
- ✅ All game displays show ⚾ prefix

---

### Bankroll.jsx Changes

```javascript
// PERFORMANCE - MLB ONLY
const performanceBySport = [
  { sport: 'MLB', bets: 45, wins: 27, losses: 18, roi: 18.5, ... },
  // NBA, NFL, NHL, Soccer REMOVED
];

// ACTIVE SESSIONS - MLB ONLY
const activeSessions = [
  {
    id: 'S_001',
    date: '2026-06-01',
    sport: 'MLB', // Only MLB
    // ...
  },
  // Other sports REMOVED
];

// ALLOCATION - MLB ONLY
const riskAllocation = {
  bySession: [
    { ... sport: 'MLB' },
    { ... sport: 'MLB' },
    // Only MLB sessions
  ],
};
```

**Changes:**
- ✅ Removed NBA performance data
- ✅ Removed NFL performance data
- ✅ Removed NHL data
- ✅ Removed Soccer data
- ✅ All sessions are MLB only
- ✅ All allocation is MLB only
- ✅ All metrics labeled "MLB"
- ✅ "MLB Model Only" banner at top

---

## 📊 UI INDICATORS

### Markets Page

**Top Banner:**
```
⚾ MLB Model Active • NBA & NFL Coming Soon
```

**Disabled Buttons (Other Sports):**
```
[⚾ MLB] [🏀 NBA 🔒] [🏈 NFL 🔒]
   ↑                    ↑
  Active            Disabled
  Green            Gray + Opacity
```

**Bottom Notice:**
```
📊 MLB Model Active: Currently showing live MLB 
games only. NBA and NFL models coming soon.
```

### Bankroll Page

**Top Banner:**
```
⚾ MLB Model Only: All data shown is for MLB 
trades only. Other sports coming soon.
```

**Section Headers:**
```
MLB Risk Allocation
MLB Performance
Active MLB Sessions
MLB Bankroll
```

**Data Labels:**
```
⚾ MLB
(All items prefixed with baseball emoji)
```

---

## 🔐 RESTRICTION DETAILS

### What's Blocked

```
❌ NBA Data
   - Games not shown
   - Odds not fetched
   - Sessions not displayed
   - Performance not tracked
   - Button disabled

❌ NFL Data
   - Games not shown
   - Odds not fetched
   - Sessions not displayed
   - Performance not tracked
   - Button disabled

❌ Hockey Data
   - Not displayed
   - Not in bankroll
   - Not in sessions

❌ Soccer Data
   - Not displayed
   - Not in bankroll
   - Not in sessions
```

### What's Available

```
✅ MLB Data
   - Games shown (live from API)
   - Odds fetched (real bookmaker odds)
   - Odds types: Moneyline, Spread, Total
   - Sessions displayed (active & history)
   - Performance tracked (ROI, win rate, units)
   - Bankroll managed (allocation, risk, limits)
   - Market data shown (volume, movement, sharp)
   - Signals displayed (SHARP_MONEY, STEAM, etc.)
```

---

## 🚀 USER EXPERIENCE

### Markets Page Flow

1. User opens Markets page
2. MLB is pre-selected (default)
3. User sees only MLB games
4. User searches MLB games
5. User sees MLB odds
6. User can filter by search
7. User cannot switch to other sports
8. Other sport buttons show "🔒 Coming soon"

### Bankroll Page Flow

1. User opens Bankroll page
2. Sees MLB-only metrics
3. Can browse 4 tabs (all MLB data)
4. Sees only MLB sessions
5. Sees only MLB performance
6. Sees only MLB allocation
7. All data clearly labeled MLB

---

## 📋 API INTEGRATION

### Backend Still Works For All Sports

The backend `/api/markets/live` endpoint **still accepts all sports**, but the **frontend only calls it for MLB**.

```javascript
// Frontend calls:
GET /api/markets/live?sport=baseball_mlb

// Backend could return:
GET /api/markets/live?sport=basketball_nba  (Not called by frontend)
GET /api/markets/live?sport=americanfootball_nfl  (Not called by frontend)
```

**Implication:**
- Backend models exist for all sports
- But frontend only uses MLB
- NBA/NFL models not visible to users yet
- When models are ready, just enable frontend buttons

---

## 🔄 FUTURE: ENABLING OTHER SPORTS

When NBA/NFL models are ready:

1. Remove `disabled: true` from sport options
2. Remove lock icons (🔒)
3. Remove forced MLB selection check
4. Allow fetching other sports
5. Uncomment NBA/NFL in Bankroll data
6. Update banners

**Simple change:**
```javascript
// Change from:
{ value: 'basketball_nba', label: 'NBA', logo: '🏀', active: false, disabled: true }

// To:
{ value: 'basketball_nba', label: 'NBA', logo: '🏀', active: false, disabled: false }
```

---

## ✅ TESTING CHECKLIST

### Markets Page

- [ ] MLB button is active (green)
- [ ] NBA button is disabled (gray + 🔒)
- [ ] NFL button is disabled (gray + 🔒)
- [ ] Cannot click NBA/NFL buttons
- [ ] Only MLB games display
- [ ] Live data fetched for MLB
- [ ] Banner shows "MLB Model Active"
- [ ] Search filters MLB games only
- [ ] Mobile responsive
- [ ] Loading states work

### Bankroll Page

- [ ] "MLB Model Only" banner visible
- [ ] Overview shows only MLB metrics
- [ ] Allocation shows only MLB sessions
- [ ] Performance shows only MLB stats
- [ ] Sessions shows only MLB trades
- [ ] All headers labeled with ⚾
- [ ] No NBA/NFL data visible
- [ ] Tab navigation works
- [ ] Numbers are accurate for MLB
- [ ] Mobile responsive

---

## 📈 DEPLOYMENT

**Files Changed:**
- ✅ frontend/src/pages/Markets.jsx
- ✅ frontend/src/pages/Bankroll.jsx

**Deployment Method:** Git push → Railway webhook

**Timeline:** 30-60 seconds

**Testing:** Immediate after deploy

---

## 💡 DESIGN RATIONALE

### Why Lock Other Sports?

- **Clear Focus:** Users know only MLB works
- **No Confusion:** Can't accidentally switch
- **Future-Proof:** Easy to unlock when ready
- **Professional:** Shows careful development
- **Transparency:** Users understand limitations

### Why Keep Backend Flexible?

- **Scalability:** Easy to add sports later
- **Reusability:** Code structure supports growth
- **Maintenance:** Separate models per sport
- **Testing:** Can test backend separately

---

## 🎯 SUMMARY

**Current State:**
- MLB model active & working
- NBA/NFL disabled (coming soon)
- All data is MLB only
- Live odds fetched for MLB
- Bankroll tracks MLB trades
- User interface clearly labeled

**User Sees:**
- Only MLB games
- Only MLB odds
- Only MLB sessions
- Only MLB metrics
- Only MLB data

**What's Hidden:**
- Other sports (disabled)
- Non-MLB data (removed)
- Multi-sport options (locked)
- Future features (coming soon label)

---

**Date Created:** June 1, 2026  
**Version:** 1.0  
**Model Status:** MLB Only (Active)
