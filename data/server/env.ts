import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
// Try local .env first, then fall back to website's .env.local
dotenv.config({ path: resolve(__dirname, '..', '.env') })
dotenv.config({ path: resolve(__dirname, '..', '..', 'website', '.env.local') })

export const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL

if (!DATABASE_URL) {
  console.error('⚠️  DATABASE_URL or POSTGRES_PRISMA_URL environment variable is not set')
  console.error('   Make sure your .env.local file exists in the website folder')
  console.error('   Or create a .env file in the data folder with DATABASE_URL')
  process.exit(1)
}

