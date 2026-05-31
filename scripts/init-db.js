/**
 * M9 Terminal Database Initialization
 * Run this to set up the PostgreSQL database
 */

const pg = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

async function initializeDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║  M9 TERMINAL — DATABASE INITIALIZATION                   ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    
    // Read schema file
    const schemaPath = path.join(__dirname, '../db/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute schema
    console.log('📊 Executing database schema...');
    await client.query(schema);
    console.log('✓ Schema created successfully\n');
    
    // Verify tables
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log(`✓ Created ${result.rows.length} tables:\n`);
    result.rows.forEach(row => {
      console.log(`   • ${row.table_name}`);
    });
    
    console.log('\n✓ Database initialization complete!\n');
    console.log('Next steps:');
    console.log('  1. Configure .env file');
    console.log('  2. Start development server: npm run dev\n');
    
  } catch (error) {
    console.error('❌ Error initializing database:');
    console.error(error.message);
    process.exit(1);
  } finally {
    await client.end();
    await pool.end();
  }
}

// Run initialization
initializeDatabase();
