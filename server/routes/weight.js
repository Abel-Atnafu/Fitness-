import { Router } from 'express'
import db from '../db.js'
import { authenticate } from '../middleware/auth.js'

export const weightRoutes = Router()
weightRoutes.use(authenticate)

function toObj(row) {
  if (!row) return null
  const out = {}
  for (const key of Object.keys(row)) {
    const v = row[key]
    out[key] = typeof v === 'bigint' ? Number(v) : v
  }
  return out
}

weightRoutes.get('/', async (req, res) => {
  try {
    const { rows } = await db.execute({
      sql: 'SELECT id, date, weight_kg FROM weight_entries WHERE user_id=? ORDER BY date ASC',
      args: [req.user.userId],
    })
    res.json(rows.map(toObj))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

weightRoutes.post('/', async (req, res) => {
  const { userId } = req.user
  const { date, weight_kg } = req.body
  if (!date || !weight_kg) return res.status(400).json({ error: 'date and weight_kg are required' })
  try {
    await db.execute({
      sql: `INSERT INTO weight_entries (user_id, date, weight_kg) VALUES (?, ?, ?)
            ON CONFLICT(user_id, date) DO UPDATE SET weight_kg=excluded.weight_kg`,
      args: [userId, date, weight_kg],
    })
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})
