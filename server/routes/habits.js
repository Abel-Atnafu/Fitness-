import express from 'express'
import { query } from '../db.js'
import { authenticate } from '../middleware/auth.js'

export const habitsRoutes = express.Router()
habitsRoutes.use(authenticate)

// GET /api/habits — user's habits + today's completions + 7-day streak data
habitsRoutes.get('/', async (req, res) => {
  const { date } = req.query
  try {
    const { rows: habits } = await query(
      'SELECT * FROM habits WHERE user_id=$1 ORDER BY created_at ASC',
      [req.user.userId]
    )
    // Get last 30 days of completions
    const { rows: completions } = await query(
      `SELECT habit_id, date FROM habit_completions WHERE user_id=$1
       AND date >= (CURRENT_DATE - INTERVAL '30 days')::TEXT
       ORDER BY date DESC`,
      [req.user.userId]
    )
    res.json({ habits, completions })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// POST /api/habits — create habit
habitsRoutes.post('/', async (req, res) => {
  const { name, emoji = '⭐', color = '#fbbf24' } = req.body
  if (!name?.trim()) return res.status(400).json({ error: 'name required' })
  try {
    const { rows } = await query(
      'INSERT INTO habits (user_id,name,emoji,color) VALUES ($1,$2,$3,$4) RETURNING *',
      [req.user.userId, name.trim(), emoji, color]
    )
    res.json(rows[0])
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// DELETE /api/habits/:id
habitsRoutes.delete('/:id', async (req, res) => {
  try {
    await query('DELETE FROM habits WHERE id=$1 AND user_id=$2', [req.params.id, req.user.userId])
    res.json({ ok: true })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// POST /api/habits/:id/complete — toggle completion for a date
habitsRoutes.post('/:id/complete', async (req, res) => {
  const { date } = req.body
  if (!date) return res.status(400).json({ error: 'date required' })
  try {
    // Check if already completed
    const { rows: existing } = await query(
      'SELECT id FROM habit_completions WHERE user_id=$1 AND habit_id=$2 AND date=$3',
      [req.user.userId, req.params.id, date]
    )
    if (existing.length > 0) {
      await query('DELETE FROM habit_completions WHERE user_id=$1 AND habit_id=$2 AND date=$3',
        [req.user.userId, req.params.id, date])
      res.json({ completed: false })
    } else {
      await query('INSERT INTO habit_completions (user_id,habit_id,date) VALUES ($1,$2,$3)',
        [req.user.userId, req.params.id, date])
      res.json({ completed: true })
    }
  } catch (e) { res.status(500).json({ error: e.message }) }
})
