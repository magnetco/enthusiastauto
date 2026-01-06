import { Router, Request, Response } from 'express'
import { sql } from '../db.js'

const router = Router()

// Create versions table if it doesn't exist
async function ensureVersionsTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS "_DataVersions" (
        id SERIAL PRIMARY KEY,
        table_name TEXT NOT NULL,
        record_id TEXT NOT NULL,
        field_name TEXT NOT NULL,
        old_value TEXT,
        new_value TEXT,
        changed_at TIMESTAMP DEFAULT NOW(),
        changed_by TEXT DEFAULT 'admin'
      )
    `
    console.log('✓ Versions table ready')
  } catch (error) {
    console.error('⚠️ Could not create versions table:', (error as Error).message)
    console.error('  Version tracking will be unavailable until DB connection is fixed')
  }
}

// Initialize table on first import (non-blocking)
ensureVersionsTable()

// Log a version change
export async function logVersion(
  tableName: string,
  recordId: string,
  fieldName: string,
  oldValue: string | null,
  newValue: string | null
) {
  await sql`
    INSERT INTO "_DataVersions" (table_name, record_id, field_name, old_value, new_value)
    VALUES (${tableName}, ${recordId}, ${fieldName}, ${oldValue}, ${newValue})
  `
}

// Get all version history
router.get('/', async (_req: Request, res: Response) => {
  try {
    const versions = await sql`
      SELECT * FROM "_DataVersions"
      ORDER BY changed_at DESC
      LIMIT 100
    `
    res.json(versions)
  } catch (error) {
    console.error('Error fetching versions:', error)
    res.status(500).json({ error: 'Failed to fetch versions' })
  }
})

// Get version history for a specific table
router.get('/:tableName', async (req: Request, res: Response) => {
  try {
    const { tableName } = req.params
    const versions = await sql`
      SELECT * FROM "_DataVersions"
      WHERE table_name = ${tableName}
      ORDER BY changed_at DESC
      LIMIT 50
    `
    res.json(versions)
  } catch (error) {
    console.error('Error fetching table versions:', error)
    res.status(500).json({ error: 'Failed to fetch table versions' })
  }
})

// Get version history for a specific record
router.get('/:tableName/:recordId', async (req: Request, res: Response) => {
  try {
    const { tableName, recordId } = req.params
    const versions = await sql`
      SELECT * FROM "_DataVersions"
      WHERE table_name = ${tableName} AND record_id = ${recordId}
      ORDER BY changed_at DESC
    `
    res.json(versions)
  } catch (error) {
    console.error('Error fetching record versions:', error)
    res.status(500).json({ error: 'Failed to fetch record versions' })
  }
})

export default router

