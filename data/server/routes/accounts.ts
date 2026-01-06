import { Router, Request, Response } from 'express'
import { sql } from '../db.js'

const router = Router()

// Get all accounts with user info
router.get('/', async (_req: Request, res: Response) => {
  try {
    const accounts = await sql`
      SELECT a.id, a."userId", a.type, a.provider, a."providerAccountId",
             u.email as user_email, u.name as user_name
      FROM "Account" a
      LEFT JOIN "User" u ON a."userId" = u.id
      ORDER BY a.id DESC
    `
    res.json(accounts)
  } catch (error) {
    console.error('Error fetching accounts:', error)
    res.status(500).json({ error: 'Failed to fetch accounts' })
  }
})

// Get single account
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const accounts = await sql`
      SELECT * FROM "Account" WHERE id = ${id}
    `
    if (accounts.length === 0) {
      return res.status(404).json({ error: 'Account not found' })
    }
    res.json(accounts[0])
  } catch (error) {
    console.error('Error fetching account:', error)
    res.status(500).json({ error: 'Failed to fetch account' })
  }
})

// Delete account
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await sql`DELETE FROM "Account" WHERE id = ${id}`
    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting account:', error)
    res.status(500).json({ error: 'Failed to delete account' })
  }
})

export default router

