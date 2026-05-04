import express from 'express'
import { query } from '../db.js'
import { authenticate } from '../middleware/auth.js'

export const measurementsRoutes = express.Router()
measurementsRoutes.use(authenticate)

// GET /api/measurements — last 90 days
measurementsRoutes.get('/', async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT id, date, weight_kg, chest_cm, waist_cm, hips_cm, arms_cm, thighs_cm, neck_cm,
        to_char(logged_at AT TIME ZONE 'UTC','YYYY-MM-DD"T"HH24:MI:SS"Z"') AS logged_at
       FROM body_measurements WHERE user_id=$1
       ORDER BY date DESC LIMIT 90`,
      [req.user.userId]
    )
    res.json(rows)
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// POST /api/measurements
measurementsRoutes.post('/', async (req, res) => {
  const { date, weight_kg, chest_cm, waist_cm, hips_cm, arms_cm, thighs_cm, neck_cm } = req.body
  if (!date) return res.status(400).json({ error: 'date required' })
  try {
    const { rows } = await query(
      `INSERT INTO body_measurements (user_id,date,weight_kg,chest_cm,waist_cm,hips_cm,arms_cm,thighs_cm,neck_cm)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (user_id,date) DO UPDATE SET
         weight_kg=EXCLUDED.weight_kg, chest_cm=EXCLUDED.chest_cm, waist_cm=EXCLUDED.waist_cm,
         hips_cm=EXCLUDED.hips_cm, arms_cm=EXCLUDED.arms_cm, thighs_cm=EXCLUDED.thighs_cm,
         neck_cm=EXCLUDED.neck_cm, logged_at=NOW()
       RETURNING *`,
      [req.user.userId, date, weight_kg||null, chest_cm||null, waist_cm||null, hips_cm||null, arms_cm||null, thighs_cm||null, neck_cm||null]
    )
    res.json(rows[0])
  } catch (e) { res.status(500).json({ error: e.message }) }
})
