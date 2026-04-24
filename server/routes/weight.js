import { Router } from 'express'
import { query } from '../db.js'
import { authenticate } from '../middleware/auth.js'

export const weightRoutes = Router()
weightRoutes.use(authenticate)

weightRoutes.get('/', async (req, res) => {
  try {
    const { rows } = await query(
      'SELECT id, date, weight_kg FROM weight_entries WHERE user_id=$1 ORDER BY date ASC',
      [req.user.userId]
    )
    res.json(rows)
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
    await query(
      `INSERT INTO weight_entries (user_id, date, weight_kg) VALUES ($1, $2, $3)
       ON CONFLICT (user_id, date) DO UPDATE SET weight_kg=EXCLUDED.weight_kg`,
      [userId, date, weight_kg]
    )
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})
