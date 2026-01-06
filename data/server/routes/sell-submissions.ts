import { Router, Request, Response } from 'express'
import { sql } from '../db.js'
import { logVersion } from './versions.js'

const router = Router()

// Ensure SellSubmission table exists
async function ensureSellSubmissionTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS "SellSubmission" (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "firstName" TEXT NOT NULL,
        "lastName" TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        make TEXT NOT NULL,
        model TEXT NOT NULL,
        year TEXT NOT NULL,
        mileage TEXT NOT NULL,
        vin TEXT NOT NULL,
        notes TEXT,
        "sellOption" TEXT NOT NULL DEFAULT 'sell',
        "existingCustomer" BOOLEAN NOT NULL DEFAULT false,
        newsletter BOOLEAN NOT NULL DEFAULT false,
        status TEXT NOT NULL DEFAULT 'pending',
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `
    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS "SellSubmission_email_idx" ON "SellSubmission" (email)`
    await sql`CREATE INDEX IF NOT EXISTS "SellSubmission_status_idx" ON "SellSubmission" (status)`
    await sql`CREATE INDEX IF NOT EXISTS "SellSubmission_createdAt_idx" ON "SellSubmission" ("createdAt")`
    await sql`CREATE INDEX IF NOT EXISTS "SellSubmission_sellOption_idx" ON "SellSubmission" ("sellOption")`
    console.log('✓ SellSubmission table ready')
  } catch (error) {
    console.error('⚠️ Could not create SellSubmission table:', (error as Error).message)
  }
}

// Initialize table on first import (non-blocking)
ensureSellSubmissionTable()

// Get all sell submissions
router.get('/', async (_req: Request, res: Response) => {
  try {
    const submissions = await sql`
      SELECT id, "firstName", "lastName", phone, email,
             make, model, year, mileage, vin, notes,
             "sellOption", "existingCustomer", newsletter,
             status, "createdAt", "updatedAt"
      FROM "SellSubmission"
      ORDER BY "createdAt" DESC
    `
    res.json(submissions)
  } catch (error) {
    console.error('Error fetching sell submissions:', error)
    res.status(500).json({ error: 'Failed to fetch sell submissions' })
  }
})

// Get single sell submission
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const submissions = await sql`
      SELECT * FROM "SellSubmission" WHERE id = ${id}
    `
    if (submissions.length === 0) {
      return res.status(404).json({ error: 'Sell submission not found' })
    }
    res.json(submissions[0])
  } catch (error) {
    console.error('Error fetching sell submission:', error)
    res.status(500).json({ error: 'Failed to fetch sell submission' })
  }
})

// Update sell submission field
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { field, value } = req.body

    // Get old value for version tracking
    const oldRecord = await sql`
      SELECT ${sql(field)} as old_value FROM "SellSubmission" WHERE id = ${id}
    `
    const oldValue = oldRecord[0]?.old_value

    // Valid editable fields
    const validFields = [
      'firstName', 'lastName', 'phone', 'email',
      'make', 'model', 'year', 'mileage', 'vin', 'notes',
      'sellOption', 'status'
    ]

    if (!validFields.includes(field)) {
      return res.status(400).json({ error: 'Invalid field' })
    }

    // Dynamic field update
    if (field === 'firstName') {
      await sql`UPDATE "SellSubmission" SET "firstName" = ${value}, "updatedAt" = NOW() WHERE id = ${id}`
    } else if (field === 'lastName') {
      await sql`UPDATE "SellSubmission" SET "lastName" = ${value}, "updatedAt" = NOW() WHERE id = ${id}`
    } else if (field === 'phone') {
      await sql`UPDATE "SellSubmission" SET phone = ${value}, "updatedAt" = NOW() WHERE id = ${id}`
    } else if (field === 'email') {
      await sql`UPDATE "SellSubmission" SET email = ${value}, "updatedAt" = NOW() WHERE id = ${id}`
    } else if (field === 'make') {
      await sql`UPDATE "SellSubmission" SET make = ${value}, "updatedAt" = NOW() WHERE id = ${id}`
    } else if (field === 'model') {
      await sql`UPDATE "SellSubmission" SET model = ${value}, "updatedAt" = NOW() WHERE id = ${id}`
    } else if (field === 'year') {
      await sql`UPDATE "SellSubmission" SET year = ${value}, "updatedAt" = NOW() WHERE id = ${id}`
    } else if (field === 'mileage') {
      await sql`UPDATE "SellSubmission" SET mileage = ${value}, "updatedAt" = NOW() WHERE id = ${id}`
    } else if (field === 'vin') {
      await sql`UPDATE "SellSubmission" SET vin = ${value}, "updatedAt" = NOW() WHERE id = ${id}`
    } else if (field === 'notes') {
      await sql`UPDATE "SellSubmission" SET notes = ${value}, "updatedAt" = NOW() WHERE id = ${id}`
    } else if (field === 'sellOption') {
      await sql`UPDATE "SellSubmission" SET "sellOption" = ${value}, "updatedAt" = NOW() WHERE id = ${id}`
    } else if (field === 'status') {
      await sql`UPDATE "SellSubmission" SET status = ${value}, "updatedAt" = NOW() WHERE id = ${id}`
    }

    // Log version change for changelog
    await logVersion('SellSubmission', id, field, String(oldValue ?? ''), String(value ?? ''))

    res.json({ success: true })
  } catch (error) {
    console.error('Error updating sell submission:', error)
    res.status(500).json({ error: 'Failed to update sell submission' })
  }
})

// Delete sell submission
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await sql`DELETE FROM "SellSubmission" WHERE id = ${id}`
    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting sell submission:', error)
    res.status(500).json({ error: 'Failed to delete sell submission' })
  }
})

export default router

