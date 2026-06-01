#!/usr/bin/env node

/**
 * M9 Terminal - Ultra-Minimal Bootstrap Server
 * This version starts immediately with ZERO dependencies
 * Used when main app fails to start
 */

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

console.log('\n🚀 M9 Terminal - Ultra-Minimal Bootstrap\n');
console.log(`✓ Port: ${PORT}`);
console.log(`✓ Environment: ${process.env.NODE_ENV || 'production'}\n`);

// Minimal middleware
app.use(express.json());

// Health endpoints (respond instantly)
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mode: 'bootstrap',
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mode: 'bootstrap',
  });
});

// Catch-all
app.get('*', (req, res) => {
  res.status(200).json({
    message: 'M9 Terminal Bootstrap Server',
    status: 'running',
    mode: 'minimal',
    path: req.path,
  });
});

// Start immediately
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Server listening on 0.0.0.0:${PORT}`);
  console.log(`✓ Health: GET http://localhost:${PORT}/health\n`);
});

// Error handlers
server.on('error', (err) => {
  console.error('❌ Server error:', err.message);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught:', err.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('❌ Rejection:', reason);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n✓ Shutting down...');
  server.close(() => process.exit(0));
});

module.exports = app;
