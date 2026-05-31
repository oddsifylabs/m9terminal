# M9 Terminal

**Sports Market Intelligence Platform**

Track markets. Discover value. Execute with confidence.

Built by [Oddsify Labs](https://oddsifylabs.com)

---

## What is M9 Terminal?

M9 Terminal is a professional-grade sports market intelligence platform designed for serious bettors, traders, and betting syndicates.

We don't sell picks. We provide **tools, intelligence, and data** for users to make their own informed decisions.

Think: **Bloomberg Terminal for sports betting**

---

## Core Philosophy

> We don't predict games.
>
> We analyze markets.
>
> Information is edge.

### Key Principles

- **Information Over Opinion** — Data-driven, not opinionated
- **Process Over Emotion** — Disciplined decision-making
- **Transparency Over Hype** — No guarantees, no locks
- **Markets Matter** — Price movement reveals information
- **CLV Matters** — Long-term edge through better prices

---

## Product Modules

### M9 Signals
Model-driven opportunities and insights. AI-powered signal detection across 12+ sports.

### M9 Tracker
Bet tracking, bankroll management, performance analytics, and CLV calculation.

### M9 Markets
Line movement monitoring, odds comparison across sportsbooks, market intelligence.

### M9 AI
Research assistant and betting copilot powered by Claude AI.

### M9 Alerts
Real-time market notifications and signal alerts.

### M9 API
Programmatic access to platform data and intelligence.

---

## Architecture

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Auth:** JWT
- **AI:** Claude API
- **Deployment:** Railway

### Frontend
- **Framework:** React
- **Styling:** CSS-in-JS + Design tokens
- **State:** React Context (scalable to Redux if needed)
- **Charts:** Recharts for data visualization

### Design System
- **Brand Colors:** Market Black (#0F1115), Terminal Navy (#131A24), Signal Green (#00D27A), Data Blue (#2B7FFF)
- **Typography:** Inter, Geist, SF Pro
- **Philosophy:** Trading terminal aesthetic, not sportsbook

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/oddsifylabs/m9terminal.git
cd m9terminal

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Initialize database
npm run db:init

# Start development server
npm run dev
```

### Environment Variables

See `.env.example` for required variables:
- Database connection string
- JWT secret
- Claude API key
- Port configuration
- CORS settings

---

## Project Structure

```
m9terminal/
├── README.md                      # This file
├── ARCHITECTURE.md                # System design
├── BRAND.md                       # Brand guidelines
├── package.json                   # Dependencies
├── .env.example                   # Environment template
├── .gitignore                     # Git ignore rules
│
├── backend/
│   ├── index.js                   # Express server
│   ├── config/                    # Configuration files
│   ├── models/                    # Database models
│   │   ├── signals.js
│   │   ├── bets.js
│   │   ├── users.js
│   │   └── ...
│   ├── services/                  # Business logic
│   │   ├── claude-service.js
│   │   ├── odds-service.js
│   │   ├── analytics.js
│   │   └── ...
│   ├── routes/                    # API endpoints
│   │   ├── auth.js
│   │   ├── signals.js
│   │   ├── tracker.js
│   │   ├── markets.js
│   │   └── ...
│   ├── middleware/                # Express middleware
│   │   ├── auth.js
│   │   ├── error-handler.js
│   │   ├── rate-limiter.js
│   │   └── ...
│   └── lib/                       # Utilities
│       ├── encrypt.js
│       ├── validators.js
│       └── ...
│
├── frontend/src/
│   ├── index.js                   # React entry point
│   ├── App.jsx                    # Root component
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Signals.jsx
│   │   ├── Tracker.jsx
│   │   ├── Markets.jsx
│   │   ├── Settings.jsx
│   │   └── ...
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   ├── SignalCard.jsx
│   │   ├── BetForm.jsx
│   │   └── ...
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useSignals.js
│   │   ├── useTracker.js
│   │   └── ...
│   ├── styles/
│   │   ├── global.css
│   │   ├── tokens.js
│   │   └── theme.js
│   └── utils/
│       ├── api.js
│       ├── formatters.js
│       └── ...
│
├── db/
│   ├── schema.sql                 # Database schema
│   ├── migrations/                # Migration scripts
│   └── seeds/                     # Seed data
│
├── scripts/
│   ├── init-db.js
│   ├── seed-db.js
│   └── ...
│
├── tests/
│   ├── unit/                      # Unit tests
│   ├── integration/               # Integration tests
│   └── fixtures/                  # Test data
│
├── docs/
│   ├── API.md                     # API documentation
│   ├── DEPLOYMENT.md              # Deployment guide
│   ├── DEVELOPMENT.md             # Developer guide
│   └── ...
│
└── .github/workflows/             # CI/CD pipelines
    ├── test.yml
    └── deploy.yml
```

---

## API Endpoints

### Authentication
- `POST /api/auth/signup` — Create account
- `POST /api/auth/login` — Login
- `POST /api/auth/logout` — Logout
- `POST /api/auth/refresh` — Refresh token

### Signals
- `GET /api/signals` — List signals
- `GET /api/signals/:id` — Get signal details
- `POST /api/signals/filter` — Filter signals by criteria

### Tracker
- `GET /api/tracker/bets` — List user bets
- `POST /api/tracker/bets` — Log new bet
- `GET /api/tracker/performance` — Performance analytics
- `GET /api/tracker/clv` — CLV calculations

### Markets
- `GET /api/markets/lines` — Current lines
- `GET /api/markets/movement/:id` — Line movement history
- `GET /api/markets/odds-comparison` — Compare odds across books

### AI
- `POST /api/ai/analyze` — Analyze game/market
- `POST /api/ai/research` — Research query

---

## Technology Stack

| Component | Technology |
|-----------|-----------|
| **Runtime** | Node.js 18+ |
| **Framework** | Express.js |
| **Frontend** | React 18+ |
| **Database** | PostgreSQL 14+ |
| **Authentication** | JWT |
| **AI** | Claude API |
| **Styling** | CSS + Design tokens |
| **Charts** | Recharts |
| **Testing** | Jest + React Testing Library |
| **Deployment** | Railway |

---

## Development

### Scripts

```bash
# Development
npm run dev              # Start dev server (backend + frontend)
npm run backend:dev     # Backend only
npm run frontend:dev    # Frontend only

# Production
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:init        # Initialize database
npm run db:migrate     # Run migrations
npm run db:seed        # Seed test data

# Testing
npm test               # Run all tests
npm run test:unit      # Unit tests only
npm run test:int       # Integration tests only

# Linting
npm run lint           # Lint code
npm run format         # Format code
```

---

## Brand & Design

M9 Terminal follows the Oddsify Labs brand guidelines:

- **Design Philosophy:** Trading terminal aesthetic, not sportsbook
- **Color Palette:** Market Black, Terminal Navy, Signal Green, Data Blue
- **Voice:** Bloomberg-like, professional, institutional
- **No Hype:** No "locks," "guaranteed winners," or gambling language

See `BRAND.md` for complete brand guidelines.

---

## Deployment

M9 Terminal is designed for deployment on Railway:

1. Connect GitHub repository
2. Add PostgreSQL plugin
3. Configure environment variables
4. Deploy (auto-builds on push to main)

See `docs/DEPLOYMENT.md` for detailed instructions.

---

## Roadmap

### 2026
- [x] Foundation (this repository)
- [ ] M9 Signals (signal detection)
- [ ] M9 Tracker (bet tracking)
- [ ] M9 Analytics (basic analytics)

### 2027
- [ ] Market Intelligence Platform (full market data)
- [ ] Advanced analytics
- [ ] Multi-account management

### 2028
- [ ] AI Copilot (Claude-powered research)
- [ ] Automated insights
- [ ] Content generation

### 2029
- [ ] Institutional API
- [ ] Syndicate features
- [ ] Automation workflows

### 2030+
- [ ] Industry standard terminal
- [ ] Professional infrastructure
- [ ] Institutional tier

---

## Support

For issues, questions, or feature requests:

- **GitHub Issues:** [Create an issue](https://github.com/oddsifylabs/m9terminal/issues)
- **Email:** dev@oddsifylabs.com
- **Website:** [oddsifylabs.com](https://oddsifylabs.com)

---

## License

MIT License — See LICENSE file for details

---

## Credits

Built by **Oddsify Labs**

- **CTO/Operations:** Jesse J. Collins
- **CEO/CFO:** Parris Collins

---

**M9 Terminal — Sports Market Intelligence**

*We don't predict games. We analyze markets. Information is edge.*
