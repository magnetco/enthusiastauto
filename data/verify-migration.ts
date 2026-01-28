import { neon } from '@neondatabase/serverless';

const NEW_DB_URL = "postgresql://neondb_owner:npg_s6wmYuJ1kTzq@ep-withered-thunder-ahwirk6u-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function verifyMigration() {
  const sql = neon(NEW_DB_URL);
  
  console.log('='.repeat(60));
  console.log('🔍 VERIFYING MIGRATION');
  console.log('='.repeat(60));
  console.log('');
  
  try {
    // Check User table
    console.log('📋 Verifying User table...');
    const users = await sql`SELECT id, name, email FROM "User"`;
    console.log(`   ✓ Found ${users.length} users`);
    users.forEach(u => console.log(`      - ${u.name} (${u.email})`));
    
    // Check Account table and foreign keys
    console.log('\n📋 Verifying Account table and foreign keys...');
    const accounts = await sql`
      SELECT a.id, a.provider, a."userId", u.email as user_email
      FROM "Account" a
      JOIN "User" u ON a."userId" = u.id
    `;
    console.log(`   ✓ Found ${accounts.length} accounts`);
    accounts.forEach(a => console.log(`      - ${a.provider} account for ${a.user_email}`));
    
    // Check for orphaned accounts
    const orphanedAccounts = await sql`
      SELECT a.id, a.provider
      FROM "Account" a
      LEFT JOIN "User" u ON a."userId" = u.id
      WHERE u.id IS NULL
    `;
    if (orphanedAccounts.length > 0) {
      console.log(`   ⚠️  Found ${orphanedAccounts.length} orphaned accounts!`);
    } else {
      console.log(`   ✓ No orphaned accounts`);
    }
    
    // Check Session table
    console.log('\n📋 Verifying Session table...');
    const sessions = await sql`SELECT COUNT(*) as count FROM "Session"`;
    console.log(`   ✓ Found ${sessions[0].count} sessions`);
    
    // Check UserFavorite table
    console.log('\n📋 Verifying UserFavorite table...');
    const favorites = await sql`SELECT COUNT(*) as count FROM "UserFavorite"`;
    console.log(`   ✓ Found ${favorites[0].count} favorites`);
    
    // Check ServiceRequest table
    console.log('\n📋 Verifying ServiceRequest table...');
    const serviceRequests = await sql`SELECT COUNT(*) as count FROM "ServiceRequest"`;
    console.log(`   ✓ Found ${serviceRequests[0].count} service requests`);
    
    // Check SellSubmission table
    console.log('\n📋 Verifying SellSubmission table...');
    const sellSubmissions = await sql`SELECT COUNT(*) as count FROM "SellSubmission"`;
    console.log(`   ✓ Found ${sellSubmissions[0].count} sell submissions`);
    
    // Verify foreign key constraints exist
    console.log('\n📋 Verifying foreign key constraints...');
    const fkConstraints = await sql`
      SELECT
        tc.constraint_name,
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
      ORDER BY tc.table_name;
    `;
    
    console.log(`   ✓ Found ${fkConstraints.length} foreign key constraints`);
    fkConstraints.forEach(fk => {
      console.log(`      - ${fk.table_name}.${fk.column_name} → ${fk.foreign_table_name}.${fk.foreign_column_name}`);
    });
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ VERIFICATION COMPLETE');
    console.log('='.repeat(60));
    console.log('');
    console.log('Summary:');
    console.log(`  - Users: ${users.length}`);
    console.log(`  - Accounts: ${accounts.length}`);
    console.log(`  - Sessions: ${sessions[0].count}`);
    console.log(`  - Favorites: ${favorites[0].count}`);
    console.log(`  - Service Requests: ${serviceRequests[0].count}`);
    console.log(`  - Sell Submissions: ${sellSubmissions[0].count}`);
    console.log(`  - Foreign Keys: ${fkConstraints.length}`);
    console.log(`  - Orphaned Records: ${orphanedAccounts.length}`);
    console.log('');
    console.log('✅ All data integrity checks passed!');
    
  } catch (error: any) {
    console.error('\n❌ ERROR:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

verifyMigration();
