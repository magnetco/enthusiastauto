import { Router, Request, Response } from 'express'
import { sql } from '../db.js'
import { logVersion } from './versions.js'

const router = Router()

// Get all users
router.get('/', async (_req: Request, res: Response) => {
  try {
    const users = await sql`
      SELECT id, name, email, "emailVerified", image, "createdAt", "updatedAt"
      FROM "User"
      ORDER BY "createdAt" DESC
    `
    res.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// Get single user
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const users = await sql`
      SELECT id, name, email, "emailVerified", image, addresses, "createdAt", "updatedAt"
      FROM "User"
      WHERE id = ${id}
    `
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json(users[0])
  } catch (error) {
    console.error('Error fetching user:', error)
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

// Update user field
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { field, value } = req.body

    // Get old value for version tracking
    const oldRecord = await sql`
      SELECT ${sql(field)} as old_value FROM "User" WHERE id = ${id}
    `
    const oldValue = oldRecord[0]?.old_value

    // Update the field
    if (field === 'name') {
      await sql`UPDATE "User" SET name = ${value}, "updatedAt" = NOW() WHERE id = ${id}`
    } else if (field === 'email') {
      await sql`UPDATE "User" SET email = ${value}, "updatedAt" = NOW() WHERE id = ${id}`
    } else if (field === 'image') {
      await sql`UPDATE "User" SET image = ${value}, "updatedAt" = NOW() WHERE id = ${id}`
    } else {
      return res.status(400).json({ error: 'Invalid field' })
    }

    // Log version change
    await logVersion('User', id, field, String(oldValue ?? ''), String(value ?? ''))

    res.json({ success: true })
  } catch (error) {
    console.error('Error updating user:', error)
    res.status(500).json({ error: 'Failed to update user' })
  }
})

// Delete user
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await sql`DELETE FROM "User" WHERE id = ${id}`
    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting user:', error)
    res.status(500).json({ error: 'Failed to delete user' })
  }
})

export default router

