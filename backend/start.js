#!/usr/bin/env node

/**
 * M9 Terminal - Safe Startup Wrapper
 * This wraps the main app with comprehensive error logging
 */

console.log('\n📋 M9 Terminal - Starting with Safe Wrapper\n');

// Set default environment variables
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

console.log(`✓ Environment: ${process.env.NODE_ENV}`);
console.log(`✓ Port: ${process.env.PORT || 3000}`);
console.log(`✓ Database: ${process.env.DATABASE_URL ? 'Configured' : 'NOT SET'}\n`);

// Catch any uncaught errors early
process.on('uncaughtException', (err) => {
  console.error('\n❌ UNCAUGHT EXCEPTION:');
  console.error(err.message);
  console.error(err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('\n❌ UNHANDLED REJECTION:');
  console.error(reason);
  process.exit(1);
});

// Try to load the main app
console.log('📦 Loading main app...');
try {
  const app = require('./index.js');
  console.log('✓ App loaded successfully');
  
  // App is already listening (started in index.js)
  console.log('✓ Server should be running now\n');
} catch (err) {
  console.error('\n❌ FAILED TO LOAD APP:');
  console.error(err.message);
  console.error(err.stack);
  
  // Try minimal server as fallback
  console.log('\n📌 Attempting fallback minimal server...\n');
  try {
    const minimalApp = require('./index-minimal.js');
    console.log('✓ Fallback server started');
  } catch (fallbackErr) {
    console.error('❌ Fallback also failed:');
    console.error(fallbackErr.message);
    process.exit(1);
  }
}
