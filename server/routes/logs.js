import { Router } from 'express'
import { query } from '../db.js'
import { authenticate } from '../middleware/auth.js'

export const logsRoutes = Router()
logsRoutes.use(authenticate)

logsRoutes.get('/', async (req, res) => {
  const { userId } = req.user
  const days = Math.min(parseInt(req.query.days) || 7, 365)
  try {
    const { rows } = await query(
      `WITH food AS (
         SELECT date,
                COALESCE(SUM(calories), 0)::integer AS total_calories,
                COALESCE(SUM(protein), 0)::real     AS total_protein,
                COALESCE(SUM(carbs), 0)::real       AS total_carbs,
                COALESCE(SUM(fat), 0)::real         AS total_fat
         FROM food_entries WHERE user_id=$1
         GROUP BY date
       ),
       water AS (
         SELECT date, glasses FROM water_logs WHERE user_id=$1
       ),
       meals AS (
         SELECT date, COUNT(*)::integer AS meals_completed
         FROM meals_eaten WHERE user_id=$1 AND eaten=1
         GROUP BY date
       ),
       all_dates AS (
         SELECT date FROM food
         UNION SELECT date FROM water
         UNION SELECT date FROM meals
       )
       SELECT a.date,
              COALESCE(food.total_calories, 0)::integer AS "totalCalories",
              COALESCE(food.total_protein, 0)::real     AS "totalProtein",
              COALESCE(food.total_carbs, 0)::real       AS "totalCarbs",
              COALESCE(food.total_fat, 0)::real         AS "totalFat",
              COALESCE(water.glasses, 0)::integer       AS "waterGlasses",
              COALESCE(meals.meals_completed, 0)::integer AS "mealsCompleted"
       FROM all_dates a
       LEFT JOIN food  ON food.date  = a.date
       LEFT JOIN water ON water.date = a.date
       LEFT JOIN meals ON meals.date = a.date
       ORDER BY a.date DESC LIMIT $2`,
      [userId, days]
    )
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

logsRoutes.get('/:date', async (req, res) => {
  const { userId } = req.user
  const { date } = req.params
  try {
    const [foodRes, waterRes, mealRes] = await Promise.all([
      query(
        `SELECT id, food_name as name, calories, protein, carbs, fat, emoji, category,
                to_char(logged_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as time
         FROM food_entries WHERE user_id=$1 AND date=$2 ORDER BY logged_at ASC`,
        [userId, date]
      ),
      query('SELECT glasses FROM water_logs WHERE user_id=$1 AND date=$2', [userId, date]),
      query('SELECT slot, eaten FROM meals_eaten WHERE user_id=$1 AND date=$2', [userId, date]),
    ])
    const mealsEaten = Object.fromEntries(mealRes.rows.map(r => [r.slot, Number(r.eaten) === 1]))
    res.json({
      date,
      foodEntries: foodRes.rows,
      waterGlasses: waterRes.rows[0] ? Number(waterRes.rows[0].glasses) : 0,
      mealsEaten,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

logsRoutes.post('/food', async (req, res) => {
  const { userId } = req.user
  const { date, food_name, calories, protein, carbs, fat, emoji, category } = req.body
  if (!food_name || !calories || !date) {
    return res.status(400).json({ error: 'food_name, calories, and date are required' })
  }
  try {
    const inserted = await query(
      `INSERT INTO food_entries (user_id, date, food_name, calories, protein, carbs, fat, emoji, category)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [userId, date, food_name, calories, protein ?? 0, carbs ?? 0, fat ?? 0, emoji ?? '🍽️', category ?? 'Other']
    )
    const { rows } = await query(
      `SELECT id, food_name as name, calories, protein, carbs, fat, emoji, category,
              to_char(logged_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as time
       FROM food_entries WHERE id=$1`,
      [inserted.rows[0].id]
    )
    res.status(201).json(rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

logsRoutes.delete('/food/:id', async (req, res) => {
  const { userId } = req.user
  try {
    const { rows } = await query(
      'DELETE FROM food_entries WHERE id=$1 AND user_id=$2 RETURNING id',
      [req.params.id, userId]
    )
    if (!rows.length) return res.status(404).json({ error: 'Entry not found' })
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

logsRoutes.put('/meal', async (req, res) => {
  const { userId } = req.user
  const { date, slot, eaten } = req.body
  try {
    await query(
      `INSERT INTO meals_eaten (user_id, date, slot, eaten) VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, date, slot) DO UPDATE SET eaten=EXCLUDED.eaten`,
      [userId, date, slot, eaten ? 1 : 0]
    )
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

logsRoutes.put('/water', async (req, res) => {
  const { userId } = req.user
  const { date, glasses } = req.body
  try {
    await query(
      `INSERT INTO water_logs (user_id, date, glasses) VALUES ($1, $2, $3)
       ON CONFLICT (user_id, date) DO UPDATE SET glasses=EXCLUDED.glasses`,
      [userId, date, glasses]
    )
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})
