import { Router } from 'express'
import db from '../db.js'
import { authenticate } from '../middleware/auth.js'

export const logsRoutes = Router()
logsRoutes.use(authenticate)

// Get full day log
logsRoutes.get('/:date', async (req, res) => {
  const { userId } = req.user
  const { date } = req.params
  try {
    const [foodRes, waterRes, mealRes] = await Promise.all([
      db.execute({
        sql: `SELECT id, food_name as name, calories, protein, carbs, fat, emoji, category,
                     strftime('%Y-%m-%dT%H:%M:%SZ', logged_at) as time
              FROM food_entries WHERE user_id=? AND date=? ORDER BY logged_at ASC`,
        args: [userId, date],
      }),
      db.execute({ sql: 'SELECT glasses FROM water_logs WHERE user_id=? AND date=?', args: [userId, date] }),
      db.execute({ sql: 'SELECT slot, eaten FROM meals_eaten WHERE user_id=? AND date=?', args: [userId, date] }),
    ])
    const mealsEaten = Object.fromEntries(mealRes.rows.map(r => [r.slot, r.eaten === 1]))
    res.json({
      date,
      foodEntries: foodRes.rows,
      waterGlasses: waterRes.rows[0]?.glasses ?? 0,
      mealsEaten,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// History: last N days calorie totals
logsRoutes.get('/', async (req, res) => {
  const { userId } = req.user
  const days = Math.min(parseInt(req.query.days) || 7, 90)
  try {
    const { rows } = await db.execute({
      sql: `SELECT date, CAST(COALESCE(SUM(calories), 0) AS INTEGER) as totalCalories
            FROM food_entries WHERE user_id=?
            GROUP BY date ORDER BY date DESC LIMIT ?`,
      args: [userId, days],
    })
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Add food entry
logsRoutes.post('/food', async (req, res) => {
  const { userId } = req.user
  const { date, food_name, calories, protein, carbs, fat, emoji, category } = req.body
  if (!food_name || !calories || !date) {
    return res.status(400).json({ error: 'food_name, calories, and date are required' })
  }
  try {
    const result = await db.execute({
      sql: `INSERT INTO food_entries (user_id, date, food_name, calories, protein, carbs, fat, emoji, category)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [userId, date, food_name, calories, protein ?? 0, carbs ?? 0, fat ?? 0, emoji ?? '🍽️', category ?? 'Other'],
    })
    const { rows } = await db.execute({
      sql: `SELECT id, food_name as name, calories, protein, carbs, fat, emoji, category,
                   strftime('%Y-%m-%dT%H:%M:%SZ', logged_at) as time
            FROM food_entries WHERE id=?`,
      args: [Number(result.lastInsertRowid)],
    })
    res.status(201).json(rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Delete food entry
logsRoutes.delete('/food/:id', async (req, res) => {
  const { userId } = req.user
  try {
    const result = await db.execute({
      sql: 'DELETE FROM food_entries WHERE id=? AND user_id=?',
      args: [req.params.id, userId],
    })
    if (!result.rowsAffected) return res.status(404).json({ error: 'Entry not found' })
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Toggle meal eaten
logsRoutes.put('/meal', async (req, res) => {
  const { userId } = req.user
  const { date, slot, eaten } = req.body
  try {
    await db.execute({
      sql: `INSERT INTO meals_eaten (user_id, date, slot, eaten) VALUES (?, ?, ?, ?)
            ON CONFLICT(user_id, date, slot) DO UPDATE SET eaten=excluded.eaten`,
      args: [userId, date, slot, eaten ? 1 : 0],
    })
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Update water
logsRoutes.put('/water', async (req, res) => {
  const { userId } = req.user
  const { date, glasses } = req.body
  try {
    await db.execute({
      sql: `INSERT INTO water_logs (user_id, date, glasses) VALUES (?, ?, ?)
            ON CONFLICT(user_id, date) DO UPDATE SET glasses=excluded.glasses`,
      args: [userId, date, glasses],
    })
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})
