import { Router, Request, Response } from 'express'
import { sql } from '../db.js'
import { logVersion } from './versions.js'

const router = Router()

// Get all favorites with user info
router.get('/', async (_req: Request, res: Response) => {
  try {
    const favorites = await sql`
      SELECT f.id, f."userId", f."itemId", f."itemType", f."itemHandle", f."createdAt",
             u.email as user_email, u.name as user_name
      FROM "UserFavorite" f
      LEFT JOIN "User" u ON f."userId" = u.id
      ORDER BY f."createdAt" DESC
    `
    res.json(favorites)
  } catch (error) {
    console.error('Error fetching favorites:', error)
    res.status(500).json({ error: 'Failed to fetch favorites' })
  }
})

// Get favorites for a specific user
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    const favorites = await sql`
      SELECT * FROM "UserFavorite"
      WHERE "userId" = ${userId}
      ORDER BY "createdAt" DESC
    `
    res.json(favorites)
  } catch (error) {
    console.error('Error fetching user favorites:', error)
    res.status(500).json({ error: 'Failed to fetch user favorites' })
  }
})

// Update favorite
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { field, value } = req.body

    // Get old value for version tracking
    const oldRecord = await sql`
      SELECT ${sql(field)} as old_value FROM "UserFavorite" WHERE id = ${id}
    `
    const oldValue = oldRecord[0]?.old_value

    // Update the field
    if (field === 'itemId') {
      await sql`UPDATE "UserFavorite" SET "itemId" = ${value} WHERE id = ${id}`
    } else if (field === 'itemType') {
      await sql`UPDATE "UserFavorite" SET "itemType" = ${value} WHERE id = ${id}`
    } else if (field === 'itemHandle') {
      await sql`UPDATE "UserFavorite" SET "itemHandle" = ${value} WHERE id = ${id}`
    } else {
      return res.status(400).json({ error: 'Invalid field' })
    }

    // Log version change
    await logVersion('UserFavorite', id, field, String(oldValue ?? ''), String(value ?? ''))

    res.json({ success: true })
  } catch (error) {
    console.error('Error updating favorite:', error)
    res.status(500).json({ error: 'Failed to update favorite' })
  }
})

// Delete favorite
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await sql`DELETE FROM "UserFavorite" WHERE id = ${id}`
    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting favorite:', error)
    res.status(500).json({ error: 'Failed to delete favorite' })
  }
})

export default router

