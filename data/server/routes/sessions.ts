import { Router, Request, Response } from 'express'
import { sql } from '../db.js'

const router = Router()

// Get all sessions with user info
router.get('/', async (_req: Request, res: Response) => {
  try {
    const sessions = await sql`
      SELECT s.id, s."sessionToken", s."userId", s.expires,
             u.email as user_email, u.name as user_name
      FROM "Session" s
      LEFT JOIN "User" u ON s."userId" = u.id
      ORDER BY s.expires DESC
    `
    res.json(sessions)
  } catch (error) {
    console.error('Error fetching sessions:', error)
    res.status(500).json({ error: 'Failed to fetch sessions' })
  }
})

// Get single session
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const sessions = await sql`
      SELECT * FROM "Session" WHERE id = ${id}
    `
    if (sessions.length === 0) {
      return res.status(404).json({ error: 'Session not found' })
    }
    res.json(sessions[0])
  } catch (error) {
    console.error('Error fetching session:', error)
    res.status(500).json({ error: 'Failed to fetch session' })
  }
})

// Delete session (revoke)
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await sql`DELETE FROM "Session" WHERE id = ${id}`
    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting session:', error)
    res.status(500).json({ error: 'Failed to delete session' })
  }
})

// Delete expired sessions
router.delete('/', async (_req: Request, res: Response) => {
  try {
    const result = await sql`DELETE FROM "Session" WHERE expires < NOW()`
    res.json({ success: true, deleted: result.length })
  } catch (error) {
    console.error('Error deleting expired sessions:', error)
    res.status(500).json({ error: 'Failed to delete expired sessions' })
  }
})

export default router

