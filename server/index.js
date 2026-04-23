import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { authRoutes } from './routes/auth.js'
import { profileRoutes } from './routes/profile.js'
import { logsRoutes } from './routes/logs.js'
import { weightRoutes } from './routes/weight.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001
const isProd = process.env.NODE_ENV === 'production'

app.use(cors({ origin: isProd ? false : 'http://localhost:5173', credentials: true }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/logs', logsRoutes)
app.use('/api/weight', weightRoutes)

// Health check
app.get('/api/health', (_, res) => res.json({ ok: true, ts: new Date().toISOString() }))

// In production, serve the built React app
if (isProd) {
  const distPath = join(__dirname, '../dist')
  app.use(express.static(distPath))
  app.get('*', (_, res) => res.sendFile(join(distPath, 'index.html')))
}

app.listen(PORT, () => {
  console.log(`\n  🔥 FitEthio API running at http://localhost:${PORT}\n`)
})
