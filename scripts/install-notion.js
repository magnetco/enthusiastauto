#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('Installing Notion SDK for task extraction script...');

try {
  execSync('npm install @notionhq/client', { stdio: 'inherit' });
  console.log('\n✅ Notion SDK installed successfully!');
  console.log('\nNext steps:');
  console.log('1. Create a .env.local file in your project root');
  console.log('2. Add your Notion API credentials:');
  console.log('   NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  console.log('   NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
  console.log('3. Set up your Notion database with required properties');
  console.log('4. Run: npm run extract:tasks');
} catch (error) {
  console.error('❌ Failed to install Notion SDK:', error.message);
  process.exit(1);
}
