#!/usr/bin/env node

/**
 * M9 Terminal - Safe Startup Wrapper with Bootstrap Fallback
 * Attempts: Main App → Fallback → Bootstrap (guaranteed to start)
 */

console.log('\n📋 M9 Terminal - Starting with Safe Wrapper\n');

// Set environment
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

console.log(`✓ Environment: ${process.env.NODE_ENV}`);
console.log(`✓ Port: ${process.env.PORT || 3000}`);
console.log(`✓ Database: ${process.env.DATABASE_URL ? 'Configured' : 'NOT SET'}\n`);

// Catch global errors
process.on('uncaughtException', (err) => {
  console.error('\n❌ UNCAUGHT EXCEPTION:');
  console.error(err.message);
  console.error(err.stack);
  console.log('\n📌 Attempting bootstrap server...\n');
  
  try {
    require('./bootstrap.js');
  } catch (bootstrapErr) {
    console.error('❌ Bootstrap also failed:', bootstrapErr.message);
    process.exit(1);
  }
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('\n❌ UNHANDLED REJECTION:');
  console.error(reason);
  console.log('\n📌 Attempting bootstrap server...\n');
  
  try {
    require('./bootstrap.js');
  } catch (bootstrapErr) {
    console.error('❌ Bootstrap also failed:', bootstrapErr.message);
    process.exit(1);
  }
});

// Try to load the main app
console.log('📦 Loading main app...');
try {
  const app = require('./index.js');
  console.log('✓ App loaded successfully\n');
  
  // App is already listening (started in index.js)
  console.log('✓ Server should be running now\n');
} catch (err) {
  console.error('\n❌ FAILED TO LOAD MAIN APP:');
  console.error(err.message);
  console.error(err.stack);
  
  // Try fallback minimal server
  console.log('\n📌 Attempting fallback minimal server...\n');
  try {
    const minimalApp = require('./index-minimal.js');
    console.log('✓ Fallback server started\n');
  } catch (fallbackErr) {
    console.error('❌ Fallback also failed:', fallbackErr.message);
    
    // Final fallback: bootstrap server
    console.log('\n📌 Attempting bootstrap server (guaranteed to start)...\n');
    try {
      require('./bootstrap.js');
    } catch (bootstrapErr) {
      console.error('❌ Bootstrap failed:', bootstrapErr.message);
      process.exit(1);
    }
  }
}
