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

// Database pool - NON-BLOCKING
let pool = null;
if (process.env.DATABASE_URL) {
  try {
    pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000, // 5 second timeout
    });

    // Don't block on connection - just set up error handlers
    pool.on('error', (err) => {
      console.error('❌ Pool error:', err.message);
    });

    // Test connection asynchronously (non-blocking)
    pool.connect().then((client) => {
      console.log('✓ Database connected');
      client.release();
    }).catch((err) => {
      console.warn('⚠️ Database connection warning:', err.message);
      // Don't block startup if DB connection fails
    });
  } catch (err) {
    console.warn('⚠️ Pool creation failed:', err.message);
  }
} else {
  console.warn('⚠️ DATABASE_URL not set - running without database');
}

// Middleware
app.use(helmet());
app.use(cors({
  origin: '*', // Allow all origins
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes - Load with error handling
try {
  const mlbLiveRoutes = require('./routes/mlb-live');
  app.use('/api/mlb', mlbLiveRoutes);
  console.log('✓ MLB routes loaded');
} catch (err) {
  console.warn('⚠️ MLB routes failed:', err.message);
}

try {
  const optimizedMarketsRoutes = require('./routes/optimized-markets');
  app.use('/api/markets', optimizedMarketsRoutes);
  console.log('✓ Markets routes loaded');
} catch (err) {
  console.warn('⚠️ Markets routes failed:', err.message);
}

try {
  const engineRoutes = require('./routes/engine');
  app.use('/api/engine', engineRoutes);
  console.log('✓ Engine routes loaded');
} catch (err) {
  console.warn('⚠️ Engine routes failed:', err.message);
}

try {
  const claudeRoutes = require('./routes/claude');
  app.use('/api', claudeRoutes);
  console.log('✓ Claude routes loaded');
} catch (err) {
  console.warn('⚠️ Claude routes failed:', err.message);
}

// Serve React frontend (static files from build folder)
const path = require('path');
const frontendBuildPath = path.join(__dirname, '../frontend/dist');

// Log what we're serving
console.log(`\nServing frontend from: ${frontendBuildPath}`);

// Static file serving with proper cache headers
app.use(express.static(frontendBuildPath, {
  maxAge: '1h',
  etag: false,
}));

// Favicon fallback (prevent 404s)
app.get('/favicon.ico', (req, res) => {
  res.status(204).send(); // No content
});

// Rate limiting (AFTER static files so static files aren't rate limited)
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
  skip: (req) => req.path.startsWith('/static/'), // Don't rate limit static files
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
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n╔════════════════════════════════════════════════════════════╗`);
  console.log(`║                                                            ║`);
  console.log(`║           🎯 M9 TERMINAL — BACKEND SERVER                 ║`);
  console.log(`║                                                            ║`);
  console.log(`║  Sports Market Intelligence Platform                       ║`);
  console.log(`║  Built by Oddsify Labs                                     ║`);
  console.log(`║                                                            ║`);
  console.log(`╚════════════════════════════════════════════════════════════╝\n`);
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}\\n`);
  console.log(`✓ Health check: GET http://localhost:${PORT}/health`);
  console.log(`✓ API root: GET http://localhost:${PORT}/api\\n`);
});

// Handle server errors
server.on('error', (err) => {
  console.error('Server error:', err.message);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  }
  process.exit(1);
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
