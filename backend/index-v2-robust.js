/**
 * M9 Terminal Backend - Simplified & Robust Version
 * Fixed: Static file serving, error handling, proper middleware order
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const path = require('path');
const pg = require('pg');

// Load environment
dotenv.config();
const NODE_ENV = process.env.NODE_ENV || 'production';
const PORT = process.env.PORT || 3000;

// Create app FIRST
const app = express();

console.log(`\n✓ Port: ${PORT}`);
console.log(`✓ Environment: ${NODE_ENV}`);
console.log(`✓ Database URL: ${process.env.DATABASE_URL ? 'SET' : 'NOT SET'}\n`);

// === MIDDLEWARE - CORRECT ORDER ===

// Security (before everything)
app.use(helmet());

// CORS
app.use(cors({
  origin: '*',
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// === DATABASE ===
let pool = null;
if (process.env.DATABASE_URL) {
  try {
    pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
    
    pool.on('error', (err) => {
      console.error('Pool error:', err);
    });
    
    console.log('✓ Database pool created');
  } catch (err) {
    console.error('Failed to create pool:', err.message);
  }
}

// === HEALTH CHECKS (FIRST) ===
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
    database: pool ? 'configured' : 'not_configured',
  });
});

// === API ROUTES (WITH ERROR HANDLING) ===

// Load routes safely
const routesToLoad = [
  { path: './routes/mlb-live', mount: '/api/mlb', name: 'MLB' },
  { path: './routes/optimized-markets', mount: '/api/markets', name: 'Markets' },
  { path: './routes/engine', mount: '/api/engine', name: 'Engine' },
  { path: './routes/claude', mount: '/api', name: 'Claude' },
];

routesToLoad.forEach(({ path: routePath, mount, name }) => {
  try {
    const route = require(routePath);
    app.use(mount, route);
    console.log(`✓ ${name} routes loaded`);
  } catch (err) {
    console.warn(`⚠️  ${name} routes failed:`, err.message);
  }
});

// === STATIC FILES (BEFORE CATCH-ALL) ===
const frontendDistPath = path.join(__dirname, '../frontend/dist');
console.log(`\nServing frontend from: ${frontendDistPath}`);

app.use(express.static(frontendDistPath, {
  maxAge: '1h',
  etag: false,
}));

// === BASIC ROUTES ===
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'), (err) => {
    if (err) {
      console.error('Error sending index.html:', err.message);
      res.status(500).json({ error: 'Could not load index.html' });
    }
  });
});

app.get('/landing', (req, res) => {
  res.json({
    status: 'ok',
    app: 'M9 Terminal',
    version: '1.0.0',
  });
});

// === ERROR HANDLER (BEFORE CATCH-ALL) ===
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error:`, err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    status: err.status || 500,
  });
});

// === SPA FALLBACK (CATCH-ALL) ===
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'), (err) => {
    if (err) {
      console.error('Error sending SPA fallback:', err.message);
      res.status(404).json({
        error: 'Not Found',
        path: req.path,
      });
    }
  });
});

// === START SERVER ===
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
  console.log(`Environment: ${NODE_ENV}`);
  console.log(`Frontend path: ${frontendDistPath}`);
  console.log(`\n✓ Health: GET http://localhost:${PORT}/health`);
  console.log(`✓ API Health: GET http://localhost:${PORT}/api/health`);
  console.log(`✓ Listening on all interfaces (0.0.0.0)\n`);
});

// === ERROR HANDLERS ===
server.on('error', (err) => {
  console.error('\n❌ Server error:', err.message);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use!`);
  }
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('\n❌ Uncaught Exception:', err.message);
  console.error(err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('\n❌ Unhandled Rejection:', reason);
  process.exit(1);
});

// === GRACEFUL SHUTDOWN ===
process.on('SIGINT', () => {
  console.log('\n\n✓ Shutting down gracefully...');
  server.close(() => {
    if (pool) {
      pool.end(() => {
        console.log('✓ Database pool closed');
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  });
});

// Export for testing
module.exports = app;
