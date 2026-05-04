import express from 'express'
import { query } from '../db.js'
import { authenticate } from '../middleware/auth.js'

export const sleepRoutes = express.Router()
sleepRoutes.use(authenticate)

// GET /api/sleep — last 30 entries
sleepRoutes.get('/', async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT id, date, hours, quality, notes,
        to_char(logged_at AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS"Z"') AS logged_at
       FROM sleep_entries WHERE user_id=$1
       ORDER BY date DESC LIMIT 30`,
      [req.user.userId]
    )
    res.json(rows)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// POST /api/sleep
sleepRoutes.post('/', async (req, res) => {
  const { date, hours, quality = 3, notes = '' } = req.body
  if (!date || !hours) return res.status(400).json({ error: 'date and hours required' })
  try {
    const { rows } = await query(
      `INSERT INTO sleep_entries (user_id,date,hours,quality,notes)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (user_id,date) DO UPDATE SET hours=EXCLUDED.hours, quality=EXCLUDED.quality, notes=EXCLUDED.notes, logged_at=NOW()
       RETURNING *`,
      [req.user.userId, date, parseFloat(hours), parseInt(quality), notes]
    )
    res.json(rows[0])
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// DELETE /api/sleep/:id
sleepRoutes.delete('/:id', async (req, res) => {
  try {
    await query('DELETE FROM sleep_entries WHERE id=$1 AND user_id=$2', [req.params.id, req.user.userId])
    res.json({ ok: true })
  } catch (e) { res.status(500).json({ error: e.message }) }
})
