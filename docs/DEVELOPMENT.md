# M9 Terminal — Development Guide

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/oddsifylabs/m9terminal.git
cd m9terminal

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### Environment Variables

Required variables (see `.env.example`):

```
DATABASE_URL=postgresql://user:password@localhost:5432/m9terminal
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_secret_key_here
CLAUDE_API_KEY=sk-...
ODDS_API_KEY=your_key_here
SPORTSDATA_API_KEY=your_key_here
```

### Database Setup

```bash
# Initialize database (creates tables)
npm run db:init

# (Optional) Seed test data
npm run db:seed
```

### Start Development

```bash
# Start both backend and frontend
npm run dev

# OR run separately:
npm run backend:dev    # Terminal 1
npm run frontend:dev   # Terminal 2
```

**Endpoints:**
- Backend: `http://localhost:3000`
- Frontend: `http://localhost:3000` (React dev server handles frontend routing)

---

## Project Structure

```
m9terminal/
├── backend/
│   ├── index.js              # Express server entry
│   ├── config/               # Configuration files
│   ├── models/               # Database models & queries
│   ├── services/             # Business logic
│   ├── routes/               # API endpoints
│   ├── middleware/           # Express middleware
│   └── lib/                  # Utilities & helpers
├── frontend/src/
│   ├── pages/                # Page components
│   ├── components/           # Reusable components
│   ├── hooks/                # Custom React hooks
│   ├── styles/               # CSS & design tokens
│   └── utils/                # Utilities
├── db/
│   ├── schema.sql            # Database schema
│   ├── migrations/           # Migration scripts
│   └── seeds/                # Test data
├── scripts/
│   ├── init-db.js            # Database initialization
│   └── ...
└── docs/
    ├── API.md                # API documentation
    ├── DEPLOYMENT.md         # Deployment guide
    └── ...
```

---

## Development Workflow

### Creating a New Feature

#### 1. Database Changes

If your feature needs a new table:

```bash
# Create migration file
touch db/migrations/001_add_new_table.sql

# Add SQL to the migration file
# Then run it:
psql -U user -d m9terminal -f db/migrations/001_add_new_table.sql
```

#### 2. Backend API

Create a new route in `backend/routes/`:

```javascript
// backend/routes/my-feature.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// GET /api/my-feature
router.get('/', auth, async (req, res) => {
  try {
    // Your logic here
    res.json({ data: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

Register in `backend/index.js`:

```javascript
const myFeatureRoutes = require('./routes/my-feature');
app.use('/api/my-feature', myFeatureRoutes);
```

#### 3. Frontend UI

Create a new page in `frontend/src/pages/`:

```jsx
// frontend/src/pages/MyFeature.jsx
import React, { useEffect, useState } from 'react';
import '../styles/my-feature.css';

export default function MyFeature() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data
  }, []);

  return (
    <div className="my-feature">
      {/* Your UI here */}
    </div>
  );
}
```

Add route in `frontend/src/App.jsx`:

```jsx
import MyFeature from './pages/MyFeature';

// In Router setup:
<Route path="/my-feature" element={<MyFeature />} />
```

---

## Code Standards

### Backend (Node.js)

```javascript
// Always use async/await
async function fetchData() {
  try {
    const result = await pool.query('SELECT * FROM users');
    return result.rows;
  } catch (error) {
    logger.error('Database error:', error);
    throw error;
  }
}

// Include error handling
app.post('/api/endpoint', (req, res) => {
  if (!req.body.required_field) {
    return res.status(400).json({ error: 'Required field missing' });
  }
  // Process request
});

// Use environment variables for configuration
const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DATABASE_URL;
```

### Frontend (React)

```jsx
// Use functional components with hooks
import { useState, useEffect } from 'react';

export default function Component() {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Side effect
  }, [dependencies]);

  return <div>Your JSX</div>;
}

// Use descriptive component names
// Use proper prop types/validation
// Keep components small and focused
```

### General

- **Naming:** camelCase for functions/variables, PascalCase for components/classes
- **Comments:** Use JSDoc for functions
- **Constants:** UPPER_SNAKE_CASE
- **Files:** lowercase-with-hyphens.js
- **Indentation:** 2 spaces

---

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- --testPathPattern=unit

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

### Writing Tests

```javascript
// tests/unit/my-function.test.js
describe('myFunction', () => {
  it('should do something', () => {
    const result = myFunction(input);
    expect(result).toBe(expected);
  });
});
```

---

## Linting & Formatting

```bash
# Lint code
npm run lint

# Fix linting errors
npm run lint -- --fix

# Format code
npm run format
```

---

## Database Management

### Running Migrations

```bash
npm run db:migrate
```

### Seeding Test Data

```bash
npm run db:seed
```

### Accessing Database Directly

```bash
# Connect to database
psql -U user -d m9terminal

# Useful commands:
\dt                     # List tables
\d table_name           # Describe table
SELECT * FROM users;    # Query data
```

---

## Debugging

### Backend Debugging

```javascript
// Use console.log (basic)
console.log('Value:', value);

// Use logger (recommended)
const logger = require('../lib/logger');
logger.info('Info message');
logger.error('Error message', error);

// Node inspect protocol
node --inspect backend/index.js
```

Then visit: `chrome://inspect` in Chrome DevTools

### Frontend Debugging

- Use React DevTools browser extension
- Use browser DevTools (F12)
- Use `console.log()` in components
- Use debugger statement: `debugger;`

---

## Common Tasks

### Add a New User

```javascript
const bcrypt = require('bcryptjs');
const hashed = await bcrypt.hash(password, 10);
await pool.query(
  'INSERT INTO users (email, password_hash) VALUES ($1, $2)',
  [email, hashed]
);
```

### Fetch User Bets

```javascript
const result = await pool.query(
  'SELECT * FROM bets WHERE user_id = $1 ORDER BY created_at DESC',
  [userId]
);
```

### Calculate CLV

```javascript
const clv = (closingOdds - placedOdds) / 100;
const clvPercent = (clv / placedOdds) * 100;
```

---

## Troubleshooting

### Database Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:** PostgreSQL is not running. Start it:
```bash
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Windows
net start PostgreSQL
```

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:** Kill the process or use a different port:
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# OR use different port
PORT=3001 npm run backend:dev
```

### Module Not Found

```
Error: Cannot find module 'express'
```

**Solution:** Install dependencies:
```bash
npm install
```

---

## Performance Tips

- Use indexes on frequently queried columns
- Implement caching for expensive queries
- Use connection pooling (pg library handles this)
- Minimize frontend bundle size
- Use React.memo for expensive components
- Debounce input handlers

---

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to GitHub
git push origin feature/my-feature

# Create pull request on GitHub
```

### Commit Message Format

```
feat: add new feature
fix: fix bug
docs: update documentation
refactor: refactor code
test: add tests
chore: update dependencies
```

---

## Resources

- **Express.js:** https://expressjs.com
- **React:** https://react.dev
- **PostgreSQL:** https://www.postgresql.org/docs/
- **JWT:** https://jwt.io
- **Claude API:** https://docs.anthropic.com

---

## Questions?

- Create an issue on GitHub
- Email: dev@oddsifylabs.com
- Check ARCHITECTURE.md for system design

---

**Happy coding!** 🎯
