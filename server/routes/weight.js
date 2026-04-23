import { Router } from 'express'
import db from '../db.js'
import { authenticate } from '../middleware/auth.js'

export const weightRoutes = Router()
weightRoutes.use(authenticate)

weightRoutes.get('/', (req, res) => {
  const entries = db.prepare('SELECT id, date, weight_kg FROM weight_entries WHERE user_id=? ORDER BY date ASC').all(req.user.userId)
  res.json(entries)
})

weightRoutes.post('/', (req, res) => {
  const { userId } = req.user
  const { date, weight_kg } = req.body
  if (!date || !weight_kg) return res.status(400).json({ error: 'date and weight_kg are required' })
  db.prepare(`
    INSERT INTO weight_entries (user_id, date, weight_kg) VALUES (?, ?, ?)
    ON CONFLICT(user_id, date) DO UPDATE SET weight_kg=excluded.weight_kg
  `).run(userId, date, weight_kg)
  res.json({ success: true })
})
