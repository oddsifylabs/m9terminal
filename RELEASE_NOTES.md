# M9 Terminal v2.0 — Release Notes

## 📦 Version 2.0.0 (June 2026)

### What's New

#### Backend
- **MLB Engine v2.0** — Core markets focus (ML, Spread, O/U)
- **Live Data Integration** — Real odds + game data from official sources
- **4 Production API Endpoints** — Ready for frontend integration
- **Profile Filtering** — Sharp, Active, Research profile support

#### Frontend
- **Modern React Dashboard** — Glassmorphic design with Tailwind CSS
- **Visual Design System** — Custom colors, typography, icons
- **Team Logos** — All 30 MLB teams with emojis and official colors
- **Custom Icons** — 20+ SVG icons (no external dependencies)
- **Responsive Layout** — Mobile-first, works on all devices
- **Legal Disclaimers** — Prominent warnings, responsible messaging

### Breaking Changes
None — This is v1.0 to v2.0 transition.

### Files Added
- `frontend/src/pages/Dashboard.jsx` (14.2 KB)
- `frontend/src/components/Icons.jsx` (5.7 KB)
- `frontend/src/data/mlb-teams.js` (7.4 KB)
- `backend/services/live-data-integration.js` (15.9 KB)
- `backend/routes/mlb-live.js` (13.2 KB)
- `docs/UI_DESIGN.md` (9.7 KB)
- Configuration files (Tailwind, Vite, PostCSS)

### Known Issues
None at this time.

### Roadmap
- **Phase 2:** Player/game props markets
- **Phase 3:** NBA, NFL, NHL engines
- **Phase 4:** Mobile app (React Native)
- **Phase 5:** Advanced charting & explainability

### Contributors
- Oddsify Labs Development Team

### License
MIT

---

**Status:** Production-Ready
**Repository:** https://github.com/oddsifylabs/m9terminal
**Latest Commit:** 3b994e6 (Modern UX/UI Dashboard with Visual Design)
