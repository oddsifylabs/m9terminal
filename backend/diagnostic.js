#!/usr/bin/env node

/**
 * M9 Terminal - Startup Diagnostic
 * Check if all services and routes load correctly
 */

console.log('\n🔍 M9 TERMINAL STARTUP DIAGNOSTIC\n');

// Check environment variables
console.log('📋 Environment Variables:');
const requiredEnvVars = ['NODE_ENV', 'DATABASE_URL', 'PORT'];
const optionalEnvVars = ['CLAUDE_API_KEY', 'ODDS_API_KEY', 'SPORTSDATA_IO_API_KEY'];

requiredEnvVars.forEach(key => {
  const value = process.env[key];
  if (value) {
    const masked = key === 'DATABASE_URL' ? value.substring(0, 20) + '...' : value;
    console.log(`  ✓ ${key}: ${masked}`);
  } else {
    console.log(`  ✗ ${key}: NOT SET`);
  }
});

optionalEnvVars.forEach(key => {
  const value = process.env[key];
  if (value) {
    console.log(`  ✓ ${key}: SET`);
  } else {
    console.log(`  ~ ${key}: not configured (optional)`);
  }
});

// Check route files
console.log('\n📂 Checking Route Files:');
const routes = [
  './routes/mlb-live.js',
  './routes/optimized-markets.js',
  './routes/engine.js',
  './routes/claude.js'
];

routes.forEach(route => {
  try {
    require(route);
    console.log(`  ✓ ${route}`);
  } catch (err) {
    console.log(`  ✗ ${route}: ${err.message}`);
  }
});

// Check service files
console.log('\n📦 Checking Service Files:');
const services = [
  './services/optimized-odds-service.js',
  './services/live-data-integration.js',
  './services/engines/mlb-engine.js',
  './services/engines/engine-router.js'
];

services.forEach(service => {
  try {
    require(service);
    console.log(`  ✓ ${service}`);
  } catch (err) {
    console.log(`  ✗ ${service}: ${err.message}`);
  }
});

console.log('\n✅ Diagnostic complete. Check any ✗ items above.\n');
