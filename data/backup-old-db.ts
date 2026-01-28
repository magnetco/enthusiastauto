import { neon } from '@neondatabase/serverless';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const OLD_DB_URL = "postgresql://neondb_owner:npg_JN75VXlDWyTC@ep-gentle-base-a46ijjvh-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function backupDatabase() {
  const sql = neon(OLD_DB_URL);
  
  console.log('='.repeat(60));
  console.log('💾 DATABASE BACKUP');
  console.log('='.repeat(60));
  console.log('');
  
  try {
    console.log('📡 Connecting to old database...');
    await sql`SELECT 1`;
    console.log('✓ Connected\n');
    
    // Get all tables
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    
    console.log(`📋 Found ${tables.length} tables to backup\n`);
    
    let sqlDump = '';
    sqlDump += `-- Database Backup\n`;
    sqlDump += `-- Generated: ${new Date().toISOString()}\n`;
    sqlDump += `-- Source: ep-gentle-base-a46ijjvh\n`;
    sqlDump += `-- Tables: ${tables.length}\n\n`;
    
    for (const { table_name } of tables) {
      console.log(`   Backing up: ${table_name}`);
      
      // Get table schema
      const columns = await sql`
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = ${table_name}
        ORDER BY ordinal_position;
      `;
      
      // Get table data
      const data = await sql(`SELECT * FROM "${table_name}"`);
      
      sqlDump += `\n-- Table: ${table_name} (${data.length} rows)\n`;
      sqlDump += `-- Schema:\n`;
      columns.forEach(col => {
        sqlDump += `--   ${col.column_name}: ${col.data_type}${col.is_nullable === 'NO' ? ' NOT NULL' : ''}\n`;
      });
      sqlDump += `\n`;
      
      if (data.length > 0) {
        const columnNames = columns.map(c => c.column_name);
        
        for (const row of data) {
          const values = columnNames.map(col => {
            const val = row[col];
            if (val === null) return 'NULL';
            if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
            if (typeof val === 'boolean') return val ? 'true' : 'false';
            if (val instanceof Date) return `'${val.toISOString()}'`;
            if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
            return val;
          }).join(', ');
          
          sqlDump += `INSERT INTO "${table_name}" (${columnNames.map(c => `"${c}"`).join(', ')}) VALUES (${values});\n`;
        }
      }
      
      sqlDump += `\n`;
    }
    
    // Create backups directory if it doesn't exist
    const backupsDir = join(process.cwd(), 'backups');
    try {
      mkdirSync(backupsDir, { recursive: true });
    } catch (err) {
      // Directory might already exist
    }
    
    // Save backup file
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `old-db-backup-${timestamp}.sql`;
    const filepath = join(backupsDir, filename);
    
    writeFileSync(filepath, sqlDump, 'utf-8');
    
    console.log('');
    console.log('='.repeat(60));
    console.log('✅ BACKUP COMPLETE');
    console.log('='.repeat(60));
    console.log('');
    console.log(`📁 File: ${filepath}`);
    console.log(`📊 Size: ${(sqlDump.length / 1024).toFixed(2)} KB`);
    console.log(`📋 Tables: ${tables.length}`);
    
    // Count total rows
    let totalRows = 0;
    for (const { table_name } of tables) {
      const count = await sql(`SELECT COUNT(*) as count FROM "${table_name}"`);
      totalRows += parseInt(count[0].count);
    }
    console.log(`📈 Total rows: ${totalRows}`);
    
  } catch (error: any) {
    console.error('\n❌ ERROR:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

backupDatabase();
