import { Router } from 'express'
import { query } from '../db.js'
import { authenticate } from '../middleware/auth.js'

export const exerciseRoutes = Router()
exerciseRoutes.use(authenticate)

exerciseRoutes.get('/', async (req, res) => {
  const { userId } = req.user
  const { date } = req.query
  if (!date) return res.status(400).json({ error: 'date query param required' })
  try {
    const { rows } = await query(
      `SELECT id, exercise_name, duration_min, calories_burned, category, emoji,
              to_char(logged_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as logged_at
       FROM exercise_entries WHERE user_id=$1 AND date=$2 ORDER BY logged_at ASC`,
      [userId, date]
    )
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

exerciseRoutes.post('/', async (req, res) => {
  const { userId } = req.user
  const { date, exercise_name, duration_min, calories_burned, category, emoji } = req.body
  if (!exercise_name || !date || calories_burned == null) {
    return res.status(400).json({ error: 'exercise_name, date, and calories_burned are required' })
  }
  try {
    const inserted = await query(
      `INSERT INTO exercise_entries (user_id, date, exercise_name, duration_min, calories_burned, category, emoji)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [userId, date, exercise_name, duration_min ?? 30, calories_burned, category ?? 'Cardio', emoji ?? '🏃']
    )
    const { rows } = await query(
      `SELECT id, exercise_name, duration_min, calories_burned, category, emoji,
              to_char(logged_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as logged_at
       FROM exercise_entries WHERE id=$1`,
      [inserted.rows[0].id]
    )
    res.status(201).json(rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

exerciseRoutes.delete('/:id', async (req, res) => {
  const { userId } = req.user
  try {
    const { rows } = await query(
      'DELETE FROM exercise_entries WHERE id=$1 AND user_id=$2 RETURNING id',
      [req.params.id, userId]
    )
    if (!rows.length) return res.status(404).json({ error: 'Entry not found' })
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})
