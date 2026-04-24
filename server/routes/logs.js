import { Router } from 'express'
import db from '../db.js'
import { authenticate } from '../middleware/auth.js'

export const logsRoutes = Router()
logsRoutes.use(authenticate)

// Get full day log
logsRoutes.get('/:date', (req, res) => {
  const { userId } = req.user
  const { date } = req.params
  const foodEntries = db.prepare(`
    SELECT id, food_name as name, calories, protein, carbs, fat, emoji, category,
           strftime('%Y-%m-%dT%H:%M:%SZ', logged_at) as time
    FROM food_entries WHERE user_id=? AND date=? ORDER BY logged_at ASC
  `).all(userId, date)
  const water = db.prepare('SELECT glasses FROM water_logs WHERE user_id=? AND date=?').get(userId, date)
  const mealRows = db.prepare('SELECT slot, eaten FROM meals_eaten WHERE user_id=? AND date=?').all(userId, date)
  const mealsEaten = Object.fromEntries(mealRows.map(r => [r.slot, r.eaten === 1]))
  res.json({ date, foodEntries, waterGlasses: water?.glasses ?? 0, mealsEaten })
})

// History: last N days calorie totals
logsRoutes.get('/', (req, res) => {
  const { userId } = req.user
  const days = Math.min(parseInt(req.query.days) || 7, 90)
  const rows = db.prepare(`
    SELECT date, CAST(COALESCE(SUM(calories), 0) AS INTEGER) as totalCalories
    FROM food_entries WHERE user_id=?
    GROUP BY date ORDER BY date DESC LIMIT ?
  `).all(userId, days)
  res.json(rows)
})

// Add food entry
logsRoutes.post('/food', (req, res) => {
  const { userId } = req.user
  const { date, food_name, calories, protein, carbs, fat, emoji, category } = req.body
  if (!food_name || !calories || !date) return res.status(400).json({ error: 'food_name, calories, and date are required' })
  const result = db.prepare(`
    INSERT INTO food_entries (user_id, date, food_name, calories, protein, carbs, fat, emoji, category)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(userId, date, food_name, calories, protein ?? 0, carbs ?? 0, fat ?? 0, emoji ?? '🍽️', category ?? 'Other')
  const entry = db.prepare(`
    SELECT id, food_name as name, calories, protein, carbs, fat, emoji, category,
           strftime('%Y-%m-%dT%H:%M:%SZ', logged_at) as time
    FROM food_entries WHERE id=?
  `).get(result.lastInsertRowid)
  res.status(201).json(entry)
})

// Delete food entry
logsRoutes.delete('/food/:id', (req, res) => {
  const { userId } = req.user
  const changes = db.prepare('DELETE FROM food_entries WHERE id=? AND user_id=?').run(req.params.id, userId).changes
  if (!changes) return res.status(404).json({ error: 'Entry not found' })
  res.json({ success: true })
})

// Toggle meal eaten
logsRoutes.put('/meal', (req, res) => {
  const { userId } = req.user
  const { date, slot, eaten } = req.body
  db.prepare(`
    INSERT INTO meals_eaten (user_id, date, slot, eaten) VALUES (?, ?, ?, ?)
    ON CONFLICT(user_id, date, slot) DO UPDATE SET eaten=excluded.eaten
  `).run(userId, date, slot, eaten ? 1 : 0)
  res.json({ success: true })
})

// Update water
logsRoutes.put('/water', (req, res) => {
  const { userId } = req.user
  const { date, glasses } = req.body
  db.prepare(`
    INSERT INTO water_logs (user_id, date, glasses) VALUES (?, ?, ?)
    ON CONFLICT(user_id, date) DO UPDATE SET glasses=excluded.glasses
  `).run(userId, date, glasses)
  res.json({ success: true })
})
