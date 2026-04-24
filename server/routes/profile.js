import { Router } from 'express'
import db from '../db.js'
import { authenticate } from '../middleware/auth.js'

export const profileRoutes = Router()
profileRoutes.use(authenticate)

function calcTarget(age, heightCm, weightKg) {
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5
  return Math.round(bmr * 1.2 - 500)
}

function toObj(row) {
  if (!row) return null
  const out = {}
  for (const key of Object.keys(row)) {
    const v = row[key]
    out[key] = typeof v === 'bigint' ? Number(v) : v
  }
  return out
}

profileRoutes.get('/', async (req, res) => {
  try {
    const [{ rows: pr }, { rows: ur }] = await Promise.all([
      db.execute({ sql: 'SELECT * FROM profiles WHERE user_id = ?', args: [req.user.userId] }),
      db.execute({ sql: 'SELECT id, name, email FROM users WHERE id = ?', args: [req.user.userId] }),
    ])
    if (!pr[0] || !ur[0]) return res.status(404).json({ error: 'Profile not found' })
    const profile = toObj(pr[0])
    const user = toObj(ur[0])
    res.json({ ...profile, name: user.name, email: user.email })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

profileRoutes.put('/', async (req, res) => {
  try {
    const { name, age, height_cm, current_weight_kg, goal_weight_kg } = req.body
    const target = calcTarget(age, height_cm, current_weight_kg)
    await db.execute({
      sql: `UPDATE profiles SET age=?, height_cm=?, current_weight_kg=?, goal_weight_kg=?, daily_calorie_target=?
            WHERE user_id=?`,
      args: [age, height_cm, current_weight_kg, goal_weight_kg, target, req.user.userId],
    })
    if (name) {
      await db.execute({ sql: 'UPDATE users SET name=? WHERE id=?', args: [name.trim(), req.user.userId] })
    }
    res.json({ success: true, daily_calorie_target: target })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

profileRoutes.delete('/data', async (req, res) => {
  try {
    const { userId } = req.user
    await Promise.all([
      db.execute({ sql: 'DELETE FROM food_entries WHERE user_id=?', args: [userId] }),
      db.execute({ sql: 'DELETE FROM meals_eaten WHERE user_id=?', args: [userId] }),
      db.execute({ sql: 'DELETE FROM water_logs WHERE user_id=?', args: [userId] }),
      db.execute({ sql: 'DELETE FROM weight_entries WHERE user_id=?', args: [userId] }),
    ])
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})
