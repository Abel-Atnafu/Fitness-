import { initDb } from '../server/db.js'
import app from '../server/app.js'

// Begin DB init immediately on cold start (not per-request)
const initPromise = initDb().catch(err => {
  console.error('[FitEthio] DB init failed:', err.message)
  throw err
})

export default async function handler(req, res) {
  try {
    await initPromise
  } catch (err) {
    return res.status(503).json({
      error: 'Database unavailable. Check DATABASE_URL environment variable in Vercel settings.',
    })
  }
  return app(req, res)
}
