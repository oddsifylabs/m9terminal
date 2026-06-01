/**
 * M9 Terminal Backend Server
 * Express.js + PostgreSQL
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const pg = require('pg');

// Load environment variables
dotenv.config();

// Initialize app
const app = express();
const PORT = process.env.PORT || 3000;

// Database pool
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Database connection error:', err.stack);
  } else {
    console.log('✓ Database connected');
    release();
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? '*' : 'http://localhost:3000'),
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const mlbLiveRoutes = require('./routes/mlb-live');
const optimizedMarketsRoutes = require('./routes/optimized-markets');
const engineRoutes = require('./routes/engine');
const claudeRoutes = require('./routes/claude');
app.use('/api/mlb', mlbLiveRoutes);
app.use('/api/markets', optimizedMarketsRoutes);
app.use('/api/engine', engineRoutes);
app.use('/api', claudeRoutes);

// Serve React frontend (static files from build folder)
const path = require('path');
const frontendBuildPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendBuildPath));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Landing page routes
app.get('/landing', (req, res) => {
  const landingPath = path.join(__dirname, '../frontend/public/landing.html');
  res.sendFile(landingPath, (err) => {
    if (err) {
      res.status(404).json({ error: 'Landing page not found' });
    }
  });
});

// Serve landing page as root on production
app.get('/', (req, res) => {
  // On production (Railway), serve landing page
  if (process.env.NODE_ENV === 'production') {
    const landingPath = path.join(__dirname, '../frontend/public/landing.html');
    res.sendFile(landingPath, (err) => {
      if (err) {
        // Fallback to API info if landing page not found
        res.json({
          name: 'M9 Terminal',
          version: '1.0.0',
          api: '/api',
          app: '/app',
        });
      }
    });
  } else {
    // On development, show API info
    res.json({
      name: 'M9 Terminal',
      version: '1.0.0',
      description: 'Sports Market Intelligence Platform',
      endpoints: {
        landing: '/landing',
        api: '/api',
        health: '/api/health',
        auth: '/api/auth',
        signals: '/api/signals',
        tracker: '/api/tracker',
        markets: '/api/markets',
        ai: '/api/ai',
      },
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    status: err.status || 500,
  });
});

// SPA fallback: serve index.html for all unmatched routes
app.get('*', (req, res) => {
  const indexPath = path.join(frontendBuildPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(404).json({
        error: 'Not Found',
        path: req.path,
        method: req.method,
      });
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n╔════════════════════════════════════════════════════════════╗`);
  console.log(`║                                                            ║`);
  console.log(`║           🎯 M9 TERMINAL — BACKEND SERVER                 ║`);
  console.log(`║                                                            ║`);
  console.log(`║  Sports Market Intelligence Platform                       ║`);
  console.log(`║  Built by Oddsify Labs                                     ║`);
  console.log(`║                                                            ║`);
  console.log(`╚════════════════════════════════════════════════════════════╝\n`);
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}\n`);
  console.log(`✓ Health check: GET http://localhost:${PORT}/api/health`);
  console.log(`✓ API root: GET http://localhost:${PORT}/api\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n✓ Server shutting down gracefully...');
  pool.end(() => {
    console.log('✓ Database pool closed');
    process.exit(0);
  });
});

module.exports = app;
