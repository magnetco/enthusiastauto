import { neon } from '@neondatabase/serverless';

const NEW_DB_URL = "postgresql://neondb_owner:npg_s6wmYuJ1kTzq@ep-withered-thunder-ahwirk6u-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function testDatabase() {
  const sql = neon(NEW_DB_URL);
  
  console.log('='.repeat(60));
  console.log('🧪 TESTING NEW DATABASE');
  console.log('='.repeat(60));
  console.log('');
  
  try {
    // Test 1: Query users
    console.log('Test 1: Query users...');
    const users = await sql`SELECT id, name, email FROM "User"`;
    console.log(`✅ Found ${users.length} users:`);
    users.forEach(u => console.log(`   - ${u.name} (${u.email})`));
    console.log('');
    
    // Test 2: Query accounts with JOIN
    console.log('Test 2: Query accounts with user relations...');
    const accounts = await sql`
      SELECT a.provider, u.name, u.email
      FROM "Account" a
      JOIN "User" u ON a."userId" = u.id
    `;
    console.log(`✅ Found ${accounts.length} accounts:`);
    accounts.forEach(a => console.log(`   - ${a.provider} for ${a.name}`));
    console.log('');
    
    // Test 3: Test write operation
    console.log('Test 3: Test write operations...');
    const testToken = 'test-token-' + Date.now();
    await sql`
      INSERT INTO "VerificationToken" (identifier, token, expires)
      VALUES ('test@example.com', ${testToken}, ${new Date(Date.now() + 86400000)})
    `;
    console.log(`✅ Created test verification token`);
    
    await sql`DELETE FROM "VerificationToken" WHERE token = ${testToken}`;
    console.log(`✅ Deleted test verification token\n`);
    
    // Test 4: Count all records
    console.log('Test 4: Count records in all tables...');
    const tables = ['User', 'Account', 'Session', 'UserFavorite', 'ServiceRequest', 'SellSubmission'];
    for (const table of tables) {
      const result = await sql(`SELECT COUNT(*) as count FROM "${table}"`);
      console.log(`   - ${table}: ${result[0].count}`);
    }
    console.log('');
    
    console.log('='.repeat(60));
    console.log('✅ ALL TESTS PASSED');
    console.log('='.repeat(60));
    console.log('');
    console.log('The new database is working correctly!');
    console.log('You can now start the website with: cd website && pnpm dev');
    
  } catch (error: any) {
    console.error('\n❌ TEST FAILED:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

testDatabase();
