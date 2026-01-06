// Import env first to ensure environment variables are loaded before anything else
import './env.js'

import express from 'express'
import cors from 'cors'
import usersRouter from './routes/users.js'
import accountsRouter from './routes/accounts.js'
import sessionsRouter from './routes/sessions.js'
import favoritesRouter from './routes/favorites.js'
import serviceRequestsRouter from './routes/service-requests.js'
import sellSubmissionsRouter from './routes/sell-submissions.js'
import versionsRouter from './routes/versions.js'
import vehicleImportRouter from './routes/vehicle-import.js'

const app = express()
const PORT = 4001

app.use(cors())
app.use(express.json({ limit: '50mb' }))

// API routes
app.use('/api/users', usersRouter)
app.use('/api/accounts', accountsRouter)
app.use('/api/sessions', sessionsRouter)
app.use('/api/favorites', favoritesRouter)
app.use('/api/service-requests', serviceRequestsRouter)
app.use('/api/sell-submissions', sellSubmissionsRouter)
app.use('/api/versions', versionsRouter)
app.use('/api/vehicle-import', vehicleImportRouter)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`🚀 Data server running at http://localhost:${PORT}`)
})

