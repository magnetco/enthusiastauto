import { neon } from '@neondatabase/serverless';

const NEW_DB_URL = "postgresql://neondb_owner:npg_s6wmYuJ1kTzq@ep-withered-thunder-ahwirk6u-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function inspectDatabase() {
  const sql = neon(NEW_DB_URL);
  
  try {
    console.log('✓ Connected to new database\n');
    
    // Get all tables
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    
    console.log('=== TABLES IN NEW DATABASE ===');
    console.log('Total tables:', tables.length);
    console.log('');
    
    if (tables.length === 0) {
      console.log('🟢 Database is empty - ready for migration!');
    } else {
      for (const { table_name } of tables) {
        console.log(`📋 ${table_name}`);
        
        // Get row count
        const countResult = await sql(`SELECT COUNT(*) as count FROM "${table_name}"`);
        console.log(`   📊 Rows: ${countResult[0].count}`);
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

inspectDatabase();
