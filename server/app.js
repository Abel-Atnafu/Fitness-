import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { authRoutes } from './routes/auth.js'
import { profileRoutes } from './routes/profile.js'
import { logsRoutes } from './routes/logs.js'
import { weightRoutes } from './routes/weight.js'
import { exerciseRoutes } from './routes/exercise.js'
import { adminRoutes } from './routes/admin.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()

// VERCEL env var is automatically set to "1" by Vercel — do NOT rely on NODE_ENV
const isVercel = !!process.env.VERCEL

// Same-origin on Vercel needs no CORS headers. Allow localhost in dev.
app.use(cors({
  origin: isVercel ? false : 'http://localhost:5173',
  credentials: true,
}))

app.use(express.json())

// Serialize BigInt values from libsql as plain numbers
app.set('json replacer', (_, v) => (typeof v === 'bigint' ? Number(v) : v))

app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/logs', logsRoutes)
app.use('/api/weight', weightRoutes)
app.use('/api/exercise', exerciseRoutes)
app.use('/api/admin', adminRoutes)

app.get('/api/health', (_, res) => res.json({ ok: true, ts: new Date().toISOString() }))

// Serve built React app when running standalone (Railway / local prod)
if (!isVercel && process.env.NODE_ENV === 'production') {
  const distPath = join(__dirname, '../dist')
  app.use(express.static(distPath))
  app.get('*', (_, res) => res.sendFile(join(distPath, 'index.html')))
}

export default app
