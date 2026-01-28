import { neon } from '@neondatabase/serverless';

const OLD_DB_URL = "postgresql://neondb_owner:npg_JN75VXlDWyTC@ep-gentle-base-a46ijjvh-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function inspectDatabase() {
  const sql = neon(OLD_DB_URL);
  
  try {
    console.log('✓ Connected to old database\n');
    
    // Get all tables
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    
    console.log('=== TABLES IN OLD DATABASE ===');
    console.log('Total tables:', tables.length);
    console.log('');
    
    for (const { table_name } of tables) {
      console.log(`📋 ${table_name}`);
      
      // Get column info for each table
      const columns = await sql`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = ${table_name}
        ORDER BY ordinal_position;
      `;
      
      columns.forEach(col => {
        console.log(`   - ${col.column_name}: ${col.data_type}${col.is_nullable === 'NO' ? ' NOT NULL' : ''}`);
      });
      
      // Get row count
      const countResult = await sql(`SELECT COUNT(*) as count FROM "${table_name}"`);
      console.log(`   📊 Rows: ${countResult[0].count}`);
      console.log('');
    }
    
    // Check for any data that might indicate project ownership
    console.log('\n=== CHECKING FOR PROJECT INDICATORS ===\n');
    
    // Look for tables with specific patterns
    const tableNames = tables.map(t => t.table_name);
    const wsiTables = tableNames.filter(name => 
      name.toLowerCase().includes('wsi') || 
      name.toLowerCase().includes('contact')
    );
    const ritsTables = tableNames.filter(name => 
      name.toLowerCase().includes('rits') || 
      name.toLowerCase().includes('safety')
    );
    const enthusiastTables = tableNames.filter(name =>
      name === 'User' || 
      name === 'Account' || 
      name === 'Session' || 
      name === 'VerificationToken' ||
      name === 'UserFavorite' ||
      name === 'ServiceRequest' ||
      name === 'SellSubmission'
    );
    
    if (wsiTables.length > 0) {
      console.log('🔵 Potential WSI tables:', wsiTables.join(', '));
    }
    if (ritsTables.length > 0) {
      console.log('🟢 Potential RITS tables:', ritsTables.join(', '));
    }
    if (enthusiastTables.length > 0) {
      console.log('🟠 Enthusiast Auto tables:', enthusiastTables.join(', '));
    }
    
    const otherTables = tableNames.filter(name => 
      !wsiTables.includes(name) && 
      !ritsTables.includes(name) && 
      !enthusiastTables.includes(name)
    );
    if (otherTables.length > 0) {
      console.log('⚪ Other/Unknown tables:', otherTables.join(', '));
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
  }
}

inspectDatabase();
