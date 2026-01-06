import { neon } from '@neondatabase/serverless'
import { DATABASE_URL } from './env.js'

export const sql = neon(DATABASE_URL)

