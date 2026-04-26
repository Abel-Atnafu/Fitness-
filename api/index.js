import { initDb } from '../server/db.js'
import app from '../server/app.js'

export default async function handler(req, res) {
  try {
    await initDb()
  } catch (err) {
    console.error('[FitEthio] DB init failed:', err.message)
    return res.status(503).json({
      error: 'Database unavailable. Check DATABASE_URL environment variable in Vercel settings.',
    })
  }
  return app(req, res)
}
