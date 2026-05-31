---
title: M9 Terminal Architecture
subtitle: Professional-Grade Sports Market Intelligence Platform
version: 1.0.0
date: "2026-06-01"
---

# M9 Terminal — Complete Architecture

## 1. System Overview

M9 Terminal is a **professional-grade sports market intelligence platform** built to provide institutional-quality analysis for serious sports bettors.

### Design Goals

- **Modular:** Each module (Signals, Tracker, Markets, AI, Alerts) operates independently
- **Scalable:** Built on PostgreSQL and Node.js for enterprise-level performance
- **Secure:** JWT authentication, encrypted API keys, rate limiting
- **Professional:** Bloomberg Terminal aesthetic, institutional-grade intelligence
- **Data-Driven:** All decisions backed by quantitative analysis

---

## 2. Backend Architecture

### 2.1 Express Server

**File:** `backend/index.js`

```javascript
// Core setup
- Express app initialization
- CORS and security headers (Helmet)
- Rate limiting middleware
- Error handling
- Database connection pool
```

### 2.2 Database Layer (PostgreSQL)

**Schema Overview:**

```sql
-- Users table
users
├── id (PK)
├── email (unique)
├── password_hash
├── subscription_tier
├── api_keys (encrypted JSON)
├── created_at
└── updated_at

-- Signals table
signals
├── id (PK)
├── user_id (FK)
├── sport
├── signal_type (contrarian, steam, RLM, sharp, etc.)
├── probability
├── confidence_score
├── market_details (JSON)
├── created_at
└── expires_at

-- Bets table
bets
├── id (PK)
├── user_id (FK)
├── sport
├── game_id
├── bet_type
├── odds_placed
├── odds_closed
├── stake
├── result (pending, win, loss, void)
├── clv (calculated)
├── created_at
└── settled_at

-- Markets table
markets
├── id (PK)
├── sport
├── game_id
├── line_type
├── current_line
├── movement_history (JSON array)
├── liquidity_score
├── last_updated
└── expires_at

-- API Keys table (encrypted)
user_api_keys
├── id (PK)
├── user_id (FK)
├── service (odds_api, sportsdata, claude, etc.)
├── key_encrypted (AES-256)
├── is_active
├── created_at
└── last_used_at

-- Performance Analytics table
analytics
├── id (PK)
├── user_id (FK)
├── period (daily, weekly, monthly)
├── total_bets
├── wins
├── losses
├── roi
├── clv_average
├── bankroll_balance
├── calculated_at
└── expires_at
```

### 2.3 Authentication & Authorization

**JWT Implementation:**

```javascript
// Token structure
{
  userId: int,
  email: string,
  tier: string (free|pro|enterprise),
  iat: timestamp,
  exp: timestamp
}

// Token lifetime: 1 hour
// Refresh tokens: 30 days

// Middleware: `backend/middleware/auth.js`
- Token verification
- User context injection
- Subscription tier checking
- Rate limit enforcement per tier
```

### 2.4 Services Layer

**Backend Services:**

| Service | Purpose | File |
|---------|---------|------|
| **Claude Service** | AI analysis, signal generation | `services/claude-service.js` |
| **Odds Service** | Fetch odds from external APIs | `services/odds-service.js` |
| **Signal Service** | Detect and analyze signals | `services/signal-service.js` |
| **Analytics Service** | Calculate performance metrics | `services/analytics-service.js` |
| **Alert Service** | Manage alerts and notifications | `services/alert-service.js` |
| **Encryption Service** | Secure API key storage | `lib/encrypt.js` |
| **Market Service** | Track line movement | `services/market-service.js` |

### 2.5 API Routes

**Core Endpoints:**

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/signup` | POST | Create account |
| `/api/auth/login` | POST | Authenticate user |
| `/api/signals` | GET | List signals |
| `/api/signals/:id` | GET | Signal details |
| `/api/signals/filter` | POST | Filter signals |
| `/api/tracker/bets` | GET | User bets |
| `/api/tracker/bets` | POST | Log new bet |
| `/api/tracker/performance` | GET | Analytics |
| `/api/markets/lines` | GET | Current lines |
| `/api/markets/movement/:id` | GET | Line history |
| `/api/ai/analyze` | POST | Claude analysis |
| `/api/ai/research` | POST | Research query |
| `/api/health` | GET | Health check |

### 2.6 Rate Limiting

**Tier-Based Limits:**

```
Free Tier:
- 5 API calls/day
- 1 signal analysis/day
- Read-only markets

Pro Tier ($99/month):
- 500 API calls/day
- 50 signal analyses/day
- Full market access
- Real-time alerts

Enterprise:
- Unlimited
- Dedicated support
- Custom integrations
```

---

## 3. Frontend Architecture

### 3.1 React Component Hierarchy

```
App
├── Router
├── Header / Navigation
├── Sidebar (collapsible)
└── Main Content Area
    ├── Dashboard Page
    │   ├── StatsPanel
    │   ├── RecentSignals
    │   ├── PerformanceChart
    │   └── ActiveBets
    ├── Signals Page
    │   ├── SignalFilter
    │   ├── SignalsList
    │   └── SignalDetail
    ├── Tracker Page
    │   ├── BetForm
    │   ├── BetsList
    │   ├── PerformanceAnalytics
    │   └── CLVChart
    ├── Markets Page
    │   ├── LineMovement
    │   ├── OddsComparison
    │   └── MarketMonitor
    ├── AI Page
    │   ├── ResearchAssistant
    │   └── AnalysisResults
    └── Settings Page
        ├── ProfileSettings
        ├── APIKeyConfig
        └── NotificationPreferences
```

### 3.2 State Management

**React Context:**

```javascript
// AuthContext — User, token, permissions
// SignalsContext — Signal list, filters, selected signal
// TrackerContext — Bets, performance, CLV data
// MarketsContext — Current lines, movement data
// UIContext — Dark mode, sidebar state, notifications
```

**Data Flow:**
- Local component state for UI
- Context for shared application state
- Custom hooks (useSignals, useTracker, etc.)
- API calls via central `api.js` utility

### 3.3 Styling System

**CSS Architecture:**

- `global.css` — Reset, variables, typography
- `tokens.js` — Design system tokens
- Component-scoped CSS (CSS modules or Styled Components)
- Dark mode by default (Market Black background)

**Color System:**
```css
--color-market-black: #0F1115;
--color-terminal-navy: #131A24;
--color-signal-green: #00D27A;
--color-data-blue: #2B7FFF;
--color-slate: #6B7280;
--color-cloud: #E5E7EB;
--color-white: #FFFFFF;
```

### 3.4 Pages & Features

| Page | Features | Components |
|------|----------|-----------|
| **Dashboard** | Overview, quick stats, recent activity | StatsPanel, SignalFeed, BetSummary |
| **Signals** | Signal detection, filtering, analysis | SignalCard, FilterPanel, DetailModal |
| **Tracker** | Bet logging, performance, CLV | BetForm, BetTable, PerformanceCharts |
| **Markets** | Line movement, odds comparison | LineChart, OddsComparison, Movement |
| **AI** | Claude-powered research | ChatInterface, AnalysisPanel |
| **Settings** | Account, API keys, preferences | ProfileForm, APIKeyManager, Alerts |

---

## 4. Data Flow

### 4.1 Authentication Flow

```
User Input (email, password)
    ↓
POST /api/auth/login
    ↓
Backend validates credentials
    ↓
JWT token generated
    ↓
Token stored in localStorage
    ↓
User redirected to Dashboard
    ↓
All subsequent requests include JWT
```

### 4.2 Signal Detection Flow

```
User configures filters
    ↓
POST /api/signals/filter
    ↓
Backend queries market data (Odds API, SportsData)
    ↓
Claude AI analyzes for signals
    ↓
Signals stored in database
    ↓
Frontend receives signal list
    ↓
UI displays signals with confidence scores
```

### 4.3 Bet Tracking Flow

```
User logs bet (sport, odds, stake)
    ↓
POST /api/tracker/bets
    ↓
Bet stored in database
    ↓
Closing line fetched from Odds API
    ↓
CLV calculated and stored
    ↓
Performance metrics updated
    ↓
Frontend displays in Tracker with CLV
```

---

## 5. External Integrations

### 5.1 APIs Used

| API | Purpose | File |
|-----|---------|------|
| **Odds API** | Current odds, line movement | `services/odds-service.js` |
| **SportsData.io** | Game data, schedules, stats | `services/sportsdata-service.js` |
| **Claude API** | AI analysis, signal generation | `services/claude-service.js` |

### 5.2 User-Supplied APIs

Users provide their own API keys for:
- Odds API (odds-api.com)
- SportsData.io (sportsdata.io)
- Claude API (anthropic.com)

**Encryption:** All keys encrypted with AES-256 before storage.

---

## 6. Security

### 6.1 Authentication
- JWT with 1-hour expiration
- Refresh tokens for extended sessions
- Password hashing (bcrypt)
- Email verification on signup

### 6.2 Data Protection
- All API keys encrypted (AES-256)
- HTTPS only (enforced on production)
- CORS configured for frontend
- Rate limiting on all endpoints
- Input validation on all routes

### 6.3 Environment Variables
- No secrets in code
- `.env` file (not committed to Git)
- Sensitive values loaded from environment

---

## 7. Deployment

### 7.1 Railway Configuration

```yaml
# Service: M9 Terminal
- GitHub repository: oddsifylabs/m9terminal
- Build: npm install && npm run build
- Start: npm start
- Plugins:
  - PostgreSQL 14+
  - Environment variables (see .env.example)
```

### 7.2 Auto-Deploy
- Push to `main` branch triggers auto-build
- Tests run before deployment
- Rollback on failure

---

## 8. Monitoring & Logging

### 8.1 Application Logging
- Winston logger in backend
- Console and file output
- Log levels: error, warn, info, debug

### 8.2 Metrics
- API response times
- Error rates
- User engagement
- Signal accuracy

---

## 9. Future Expansions

### Module: M9 Markets (2027)
- Advanced market intelligence
- Historical data analysis
- Predictive line movement

### Module: M9 AI (2028)
- Expanded Claude integration
- Automated research reports
- Copilot features

### Module: M9 API (2029)
- Programmatic access to signals
- Webhook subscriptions
- Bulk data export

---

## 10. Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18+, CSS3, Recharts |
| **Backend** | Node.js 18+, Express.js |
| **Database** | PostgreSQL 14+ |
| **Auth** | JWT |
| **AI** | Claude API |
| **Deployment** | Railway |
| **Testing** | Jest, React Testing Library |

---

**M9 Terminal — Built for Serious Traders**

*Information is edge. Analysis matters. Process wins.*
