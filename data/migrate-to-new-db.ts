import { neon } from '@neondatabase/serverless';

const OLD_DB_URL = "postgresql://neondb_owner:npg_JN75VXlDWyTC@ep-gentle-base-a46ijjvh-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require";
const NEW_DB_URL = "postgresql://neondb_owner:npg_s6wmYuJ1kTzq@ep-withered-thunder-ahwirk6u-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require";

// Tables to migrate in order (respects foreign key dependencies)
const TABLES_TO_MIGRATE = [
  'User',
  'Account',
  'Session',
  'VerificationToken',
  'UserFavorite',
  'ServiceRequest',
  'SellSubmission'
];

interface MigrationStats {
  table: string;
  oldCount: number;
  newCount: number;
  success: boolean;
  error?: string;
}

async function migrateDatabase(dryRun: boolean = false) {
  const oldSql = neon(OLD_DB_URL);
  const newSql = neon(NEW_DB_URL);
  
  const stats: MigrationStats[] = [];
  
  console.log('='.repeat(60));
  console.log(dryRun ? '🔍 DRY RUN MODE - No data will be written' : '🚀 LIVE MIGRATION MODE');
  console.log('='.repeat(60));
  console.log('');
  
  try {
    // Verify connection to both databases
    console.log('📡 Verifying database connections...');
    await oldSql`SELECT 1`;
    await newSql`SELECT 1`;
    console.log('✓ Connected to both databases\n');
    
    // Check if new database has the schema
    console.log('🔍 Checking new database schema...');
    const newTables = await newSql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    
    if (newTables.length === 0) {
      console.error('❌ ERROR: New database has no schema!');
      console.error('   Run Prisma migrations first:');
      console.error('   cd website && DATABASE_URL="..." npx prisma migrate deploy');
      process.exit(1);
    }
    
    const newTableNames = newTables.map(t => t.table_name);
    console.log(`✓ Found ${newTables.length} tables in new database\n`);
    
    // Migrate each table
    for (const tableName of TABLES_TO_MIGRATE) {
      console.log(`\n📋 Processing table: ${tableName}`);
      console.log('-'.repeat(60));
      
      try {
        // Check if table exists in new database
        if (!newTableNames.includes(tableName)) {
          console.log(`⚠️  Table ${tableName} not found in new database - skipping`);
          stats.push({
            table: tableName,
            oldCount: 0,
            newCount: 0,
            success: false,
            error: 'Table not found in new database'
          });
          continue;
        }
        
        // Get data from old database
        const oldData = await oldSql(`SELECT * FROM "${tableName}"`);
        const oldCount = oldData.length;
        
        console.log(`   Old DB: ${oldCount} rows`);
        
        if (oldCount === 0) {
          console.log(`   ✓ No data to migrate`);
          stats.push({
            table: tableName,
            oldCount: 0,
            newCount: 0,
            success: true
          });
          continue;
        }
        
        if (dryRun) {
          console.log(`   🔍 Would migrate ${oldCount} rows`);
          console.log(`   Sample data:`, JSON.stringify(oldData[0], null, 2));
          stats.push({
            table: tableName,
            oldCount,
            newCount: 0,
            success: true
          });
          continue;
        }
        
        // Get column names
        const columns = await oldSql`
          SELECT column_name
          FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = ${tableName}
          ORDER BY ordinal_position;
        `;
        const columnNames = columns.map(c => c.column_name);
        
        // Insert data into new database
        console.log(`   📥 Inserting ${oldCount} rows...`);
        
        for (const row of oldData) {
          // Build INSERT query dynamically
          const values = columnNames.map(col => row[col]);
          const placeholders = columnNames.map((_, i) => `$${i + 1}`).join(', ');
          const columnList = columnNames.map(c => `"${c}"`).join(', ');
          
          await newSql(
            `INSERT INTO "${tableName}" (${columnList}) VALUES (${placeholders})`,
            values
          );
        }
        
        // Verify count in new database
        const newData = await newSql(`SELECT COUNT(*) as count FROM "${tableName}"`);
        const newCount = parseInt(newData[0].count);
        
        console.log(`   New DB: ${newCount} rows`);
        
        if (oldCount === newCount) {
          console.log(`   ✅ Migration successful`);
          stats.push({
            table: tableName,
            oldCount,
            newCount,
            success: true
          });
        } else {
          console.log(`   ❌ Row count mismatch!`);
          stats.push({
            table: tableName,
            oldCount,
            newCount,
            success: false,
            error: 'Row count mismatch'
          });
        }
        
      } catch (error: any) {
        console.error(`   ❌ Error migrating ${tableName}:`, error.message);
        stats.push({
          table: tableName,
          oldCount: 0,
          newCount: 0,
          success: false,
          error: error.message
        });
      }
    }
    
    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 MIGRATION SUMMARY');
    console.log('='.repeat(60));
    console.log('');
    
    const successCount = stats.filter(s => s.success).length;
    const failCount = stats.filter(s => !s.success).length;
    const totalRows = stats.reduce((sum, s) => sum + s.oldCount, 0);
    const migratedRows = stats.reduce((sum, s) => sum + s.newCount, 0);
    
    console.log(`Tables processed: ${stats.length}`);
    console.log(`Successful: ${successCount}`);
    console.log(`Failed: ${failCount}`);
    console.log(`Total rows to migrate: ${totalRows}`);
    console.log(`Rows migrated: ${migratedRows}`);
    console.log('');
    
    console.log('Detailed results:');
    stats.forEach(stat => {
      const icon = stat.success ? '✅' : '❌';
      const msg = stat.error ? ` (${stat.error})` : '';
      console.log(`  ${icon} ${stat.table}: ${stat.oldCount} → ${stat.newCount}${msg}`);
    });
    
    if (failCount > 0) {
      console.log('\n⚠️  Some tables failed to migrate. Review errors above.');
      process.exit(1);
    } else if (dryRun) {
      console.log('\n✅ Dry run completed successfully!');
      console.log('   Run without --dry-run to perform actual migration.');
    } else {
      console.log('\n✅ Migration completed successfully!');
    }
    
  } catch (error: any) {
    console.error('\n❌ FATAL ERROR:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');

migrateDatabase(dryRun);
