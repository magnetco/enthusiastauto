// Temporary script to inspect old database schema
const { PrismaClient } = require('@prisma/client');

const oldDbUrl = "postgresql://neondb_owner:npg_JN75VXlDWyTC@ep-gentle-base-a46ijjvh-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function inspectDatabase() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: oldDbUrl
      }
    }
  });
  
  try {
    console.log('✓ Connected to old database\n');
    
    // Get all tables
    const tablesResult = await prisma.$queryRaw`
      SELECT table_name, table_schema
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    
    console.log('=== TABLES IN OLD DATABASE ===');
    console.log('Total tables:', tablesResult.length);
    console.log('');
    
    for (const row of tablesResult) {
      console.log(`📋 ${row.table_name}`);
      
      // Get column info for each table
      const columnsResult = await prisma.$queryRawUnsafe(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = '${row.table_name}'
        ORDER BY ordinal_position;
      `);
      
      columnsResult.forEach(col => {
        console.log(`   - ${col.column_name}: ${col.data_type}${col.is_nullable === 'NO' ? ' NOT NULL' : ''}`);
      });
      
      // Get row count
      const countResult = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as count FROM "${row.table_name}"`);
      console.log(`   📊 Rows: ${countResult[0].count}`);
      console.log('');
    }
    
    // Check for any data that might indicate project ownership
    console.log('\n=== CHECKING FOR PROJECT INDICATORS ===\n');
    
    // Look for tables with specific patterns
    const wsiTables = tablesResult.filter(r => r.table_name.toLowerCase().includes('wsi') || r.table_name.toLowerCase().includes('contact'));
    const ritsTables = tablesResult.filter(r => r.table_name.toLowerCase().includes('rits') || r.table_name.toLowerCase().includes('safety'));
    
    if (wsiTables.length > 0) {
      console.log('Potential WSI tables:', wsiTables.map(t => t.table_name).join(', '));
    }
    if (ritsTables.length > 0) {
      console.log('Potential RITS tables:', ritsTables.map(t => t.table_name).join(', '));
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

inspectDatabase();
