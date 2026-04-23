import { Router } from 'express'
import db from '../db.js'
import { authenticate } from '../middleware/auth.js'

export const profileRoutes = Router()
profileRoutes.use(authenticate)

function calcTarget(age, heightCm, weightKg) {
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5
  return Math.round(bmr * 1.2 - 500)
}

profileRoutes.get('/', (req, res) => {
  const profile = db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(req.user.userId)
  const user = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(req.user.userId)
  if (!profile || !user) return res.status(404).json({ error: 'Profile not found' })
  res.json({ ...profile, name: user.name, email: user.email })
})

profileRoutes.put('/', (req, res) => {
  const { name, age, height_cm, current_weight_kg, goal_weight_kg } = req.body
  const target = calcTarget(age, height_cm, current_weight_kg)
  db.prepare(`
    UPDATE profiles SET age=?, height_cm=?, current_weight_kg=?, goal_weight_kg=?, daily_calorie_target=?
    WHERE user_id=?
  `).run(age, height_cm, current_weight_kg, goal_weight_kg, target, req.user.userId)
  if (name) db.prepare('UPDATE users SET name=? WHERE id=?').run(name.trim(), req.user.userId)
  res.json({ success: true, daily_calorie_target: target })
})

profileRoutes.delete('/data', (req, res) => {
  const { userId } = req.user
  db.prepare('DELETE FROM food_entries WHERE user_id=?').run(userId)
  db.prepare('DELETE FROM meals_eaten WHERE user_id=?').run(userId)
  db.prepare('DELETE FROM water_logs WHERE user_id=?').run(userId)
  db.prepare('DELETE FROM weight_entries WHERE user_id=?').run(userId)
  res.json({ success: true })
})
