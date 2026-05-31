---
title: M9 Terminal — Modern UX/UI Design
subtitle: Visual, data-driven dashboard for sports market intelligence
version: 2.0.0
date: "2026-06-01"
---

# M9 Terminal — Modern UX/UI

## Overview

A **world-class, modern dashboard** for serious bettors. Clean. Visual. Data-forward.

### Design Philosophy

- **Information-First** — Data visible immediately
- **Visual Hierarchy** — Most important info at top
- **Profile-Aware** — Different views per bettor type
- **Real Data** — Live odds, verified sports data
- **Responsible** — Clear disclaimers, no hype

---

## Visual Design System

### Color Palette

**Primary Colors**
- **Market Black** `#0F1115` — Main background
- **Terminal Navy** `#131A24` — Secondary background
- **Signal Green** `#00D27A` — Success, positive signals
- **Data Blue** `#2B7FFF` — Primary accent

**Status Colors**
- **A+ (Maximum)** — Emerald Green `#10B981`
- **A (High)** — Blue `#3B82F6`
- **B (Moderate)** — Amber `#F59E0B`
- **C (Low)** — Red `#EF4444`

**Neutral**
- Slate 900-100 for backgrounds and text

### Typography

- **Sans-Serif:** Inter (400, 500, 600, 700, 800)
- **Monospace:** JetBrains Mono (for numbers)
- **Headings:** Inter Bold (700-800)
- **Body:** Inter Regular (400-500)

### Spacing & Layout

- 8px base unit (Tailwind default)
- Max width: 1280px (7xl)
- Mobile-first responsive design
- Dark mode by default

---

## Component Library

### Icons (SVG Custom)

All icons custom-built, no external library:

**Market Icons**
- Moneyline — Horizontal + vertical lines
- Spread — Three horizontal lines with dots
- Total — Vertical lines with circles

**Signal Icons**
- RLM (Reverse Line Movement) — Reversal arrow
- Sharp Money — Targeting reticle
- Steam — Wave pattern

**Confidence Icons**
- High — Checkmark
- Medium — Circle with dividers
- Low — X symbol

**UI Icons**
- Chevron Right, Arrow Up/Down
- Settings, Info, Alert Triangle
- Trending Up, Users, Target, Zap, Lock

### Team Logos & Data

**All 30 MLB Teams**
- Team emoji (visual), team code, full name
- Official colors (brand colors)
- Ballpark names
- Division assignment

**Teams Included**
- AL East: BAL, BOS, NYY, TB, TOR
- AL Central: CWS, CLE, DET, KC, MIN
- AL West: HOU, LAA, OAK, SEA, TEX
- NL East: ATL, MIA, NYM, PHI, WSH
- NL Central: CHC, CIN, MIL, PIT, STL
- NL West: ARI, COL, LAD, SD, SF

---

## Pages & Screens

### 1. Dashboard (Main)

**Header Section**
- Logo + branding (left)
- Profile selector buttons: Sharp, Active, Research (center)
- Settings icon (right)
- Sticky, glassmorphic design

**Disclaimer Alert**
- Amber warning background
- Clear, readable text
- Dismissible (X button)
- Responsible gambling statement

**Stats Bar** (4-column grid)
- Total games analyzed
- Opportunities matching profile
- Average confidence across plays
- Total edge across all plays

**Games Section**
- One game card per matchup
- Away team + Home team (with logos + colors)
- Game time + date
- Opportunities per market below

**Opportunity Cards** (3 columns: ML, Spread, O/U)
- Market type + icon at top
- Confidence percentage (right)
- Large recommendation display (e.g., "↑ AWAY")
- Confidence rating (A+, A, B, C)
- Edge percentage
- Best odds + sportsbook
- Suggested bet size (if not Research profile)
- "Place Bet" or "View Details" button

**Profile Filtering**
- Sharp: 80+ confidence only, full Kelly sizing
- Active: 55+ confidence, half Kelly sizing, all details
- Research: All plays, full model breakdown, no betting UI

**Footer**
- About section
- Disclaimer (mini)
- Data sources attribution
- Copyright

---

## Design Features

### Glassmorphism

Cards use frosted glass effect:
```css
background: rgba(15, 23, 42, 0.8);
border: 1px solid rgba(100, 116, 139, 0.5);
backdrop-filter: blur(10px);
```

### Gradients

Accent colors use subtle gradients:
```css
background: linear-gradient(to right, #10B981, #3B82F6);
/* Emerald to Blue */
```

### Interactive States

- Buttons: Hover brightens + scales slightly
- Cards: Hover adds subtle shadow, bg lightens
- Inputs: Focus ring in brand color

### Responsive Design

- **Desktop:** Full 3-column layout for opportunities
- **Tablet:** 2 columns or stacked
- **Mobile:** Single column, optimized touch targets

---

## Disclaimer & Legal

### Prominent Disclaimer

**Location:** Below header, before main content
**Style:** Amber alert background, high visibility
**Content:**

> M9 Terminal provides analytical insights only. Past performance does not guarantee future results. Sports betting involves risk. Please gamble responsibly. Must be 21+. Check local laws before betting. This is not financial advice. Always verify odds with your sportsbook.

**Dismissible:** Users can close (via X button), but see on reload

### Footer Legal

- Data attribution
- Copyright notice
- Brief disclaimer
- Responsible gambling statement

---

## Data Visualization

### Team Cards

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  [🐯] Detroit Tigers    @    [🔴] Boston Red Sox  │
│   DET (0-3 last 5)          BOS (3-2 last 5)     │
│                    7:05 PM ET • Today              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Opportunity Cards

```
┌──────────────────────────┐
│ ⚡ ML                  84 │
│                          │
│ ↑ AWAY                   │
│ A+ (MAXIMUM)             │
│                          │
│ Edge:        +28%        │
│ Best Odds:   -100        │
│ Book:    DraftKings      │
│                          │
│ Bet Size:  $2,800        │
│                          │
│  [Place Bet]             │
└──────────────────────────┘
```

---

## Mobile Experience

### Responsive Behavior

**Header:** Collapses to hamburger menu on mobile
**Profile Selector:** Horizontal scroll or dropdown
**Stats Bar:** Single column instead of 4 columns
**Game Cards:** Stacked vertically
**Opportunity Cards:** Full width instead of 3 columns
**Touch Targets:** Minimum 44px (Apple HIG standard)

### Mobile Optimizations

- Larger tap targets
- Simplified header
- Bottom navigation option
- Swipe gestures (future)

---

## Accessibility

### WCAG 2.1 Compliance

- Color contrast ratios ≥ 4.5:1
- Keyboard navigation (Tab, Enter, Escape)
- ARIA labels on icons
- Semantic HTML structure
- Focus indicators visible

### Keyboard Navigation

- Tab: Move through interactive elements
- Shift+Tab: Reverse direction
- Enter: Activate buttons
- Escape: Dismiss modals/alerts
- Arrow Keys: Profile selector

---

## Performance

### Optimizations

- Images: Lazy loading
- Icons: Inline SVG (no requests)
- CSS: Tailwind purged (production only)
- Code Splitting: Route-based
- Caching: 1-hour HTTP cache

### Loading States

- Skeleton screens for cards
- Spinning indicators
- Fade-in animations (0.3s)

---

## Future Enhancements

### Phase 2

- [ ] Dark/Light theme toggle
- [ ] Custom color themes per user
- [ ] Favorites/watchlist
- [ ] Historical performance tracker
- [ ] Notification settings
- [ ] Bet slip/parlay builder

### Phase 3

- [ ] Mobile app (React Native)
- [ ] Advanced charting (game movement)
- [ ] Model explainer (tooltips)
- [ ] Shareable analysis
- [ ] Integration with sportsbooks

---

## File Structure

```
frontend/
├── src/
│   ├── pages/
│   │   └── Dashboard.jsx          (Main UI)
│   ├── components/
│   │   ├── Icons.jsx               (SVG icons)
│   │   └── (future: Modals, Sidebars, etc)
│   ├── data/
│   │   └── mlb-teams.js            (Team data, logos)
│   ├── styles/
│   │   └── global.css              (Tailwind + custom)
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

---

## Setup & Running

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
# Runs on http://localhost:3000
# Auto-hot reloads
```

### Production Build

```bash
npm run build
# Creates optimized dist/ folder
# Ready for deployment
```

### Deployment

```bash
# Via Railway (recommended)
railway deploy

# Or Docker
docker build -t m9-terminal-frontend .
docker run -p 3000:3000 m9-terminal-frontend
```

---

## Design Tokens (Tailwind)

### Colors

```js
{
  "market-black": "#0F1115",
  "terminal-navy": "#131A24",
  "signal-green": "#00D27A",
  "data-blue": "#2B7FFF"
}
```

### Fonts

```js
{
  "sans": "Inter",
  "mono": "JetBrains Mono"
}
```

### Spacing

```
8px base (Tailwind default)
xs: 0.5rem
sm: 0.875rem
md: 1rem
lg: 1.5rem
xl: 2rem
```

---

## Summary

**M9 Terminal UI is:**

✅ Modern — Clean, glassmorphic design
✅ Visual — Team logos, icons, graphics
✅ Responsive — Mobile-first, works on all devices
✅ Accessible — WCAG 2.1 compliant
✅ Profile-Aware — Different views per user type
✅ Legal — Clear disclaimers, responsible messaging
✅ Data-Forward — Immediate access to opportunities
✅ Production-Ready — React + Tailwind, optimized

**Ready to deploy. Ready for users. Professional-grade.**
