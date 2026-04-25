import { Router } from 'express'
import { query } from '../db.js'
import { authenticate } from '../middleware/auth.js'

export const profileRoutes = Router()
profileRoutes.use(authenticate)

function calcTarget(age, heightCm, weightKg, gender = 'male') {
  // Mifflin-St Jeor: men +5, women -161, "other" averages the two (-78)
  const constant = gender === 'female' ? -161 : gender === 'other' ? -78 : 5
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + constant
  return Math.round(bmr * 1.2 - 500)
}

profileRoutes.get('/', async (req, res) => {
  try {
    const [pr, ur] = await Promise.all([
      query('SELECT * FROM profiles WHERE user_id = $1', [req.user.userId]),
      query('SELECT id, name, email, is_admin FROM users WHERE id = $1', [req.user.userId]),
    ])
    if (!pr.rows[0] || !ur.rows[0]) return res.status(404).json({ error: 'Profile not found' })
    res.json({
      ...pr.rows[0],
      name: ur.rows[0].name,
      email: ur.rows[0].email,
      is_admin: !!ur.rows[0].is_admin,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

profileRoutes.put('/', async (req, res) => {
  try {
    const { name, age, height_cm, current_weight_kg, goal_weight_kg, gender } = req.body
    const normalizedGender = ['male', 'female', 'other'].includes(gender) ? gender : 'male'
    const target = calcTarget(age, height_cm, current_weight_kg, normalizedGender)
    await query(
      `UPDATE profiles SET age=$1, height_cm=$2, current_weight_kg=$3, goal_weight_kg=$4, daily_calorie_target=$5, gender=$6
       WHERE user_id=$7`,
      [age, height_cm, current_weight_kg, goal_weight_kg, target, normalizedGender, req.user.userId]
    )
    if (name) {
      await query('UPDATE users SET name=$1 WHERE id=$2', [name.trim(), req.user.userId])
    }
    res.json({ success: true, daily_calorie_target: target, gender: normalizedGender })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

profileRoutes.delete('/data', async (req, res) => {
  try {
    const { userId } = req.user
    await Promise.all([
      query('DELETE FROM food_entries WHERE user_id=$1', [userId]),
      query('DELETE FROM meals_eaten WHERE user_id=$1', [userId]),
      query('DELETE FROM water_logs WHERE user_id=$1', [userId]),
      query('DELETE FROM weight_entries WHERE user_id=$1', [userId]),
    ])
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})
