import { Router } from 'express'
import { query } from '../db.js'
import { authenticate } from '../middleware/auth.js'

export const profileRoutes = Router()
profileRoutes.use(authenticate)

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
  extreme: 1.9,
}

// Mifflin-St Jeor with sex branch, activity-adjusted TDEE, goal-based deficit,
// and a calorie floor to discourage dangerous restriction.
function calcTarget({ age, heightCm, weightKg, sex, activityLevel, goalType, weeklyRateKg }) {
  const sexConstant = sex === 'female' ? -161 : sex === 'male' ? 5 : -78
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + sexConstant
  const tdee = bmr * (ACTIVITY_MULTIPLIERS[activityLevel] ?? 1.2)
  let goalDelta
  if (goalType === 'lose') {
    // 1 kg fat ≈ 7700 kcal; weekly rate → daily deficit
    const rate = weeklyRateKg ?? 0.5
    goalDelta = -Math.round(rate * 7700 / 7)
  } else if (goalType === 'gain') {
    goalDelta = 300
  } else {
    goalDelta = 0
  }
  const target = Math.round(tdee + goalDelta)
  const floor = sex === 'female' ? 1200 : 1500
  return Math.max(target, floor)
}

profileRoutes.get('/', async (req, res) => {
  try {
    const [pr, ur] = await Promise.all([
      query('SELECT * FROM profiles WHERE user_id = $1', [req.user.userId]),
      query('SELECT id, name, email FROM users WHERE id = $1', [req.user.userId]),
    ])
    if (!pr.rows[0] || !ur.rows[0]) return res.status(404).json({ error: 'Profile not found' })
    res.json({ ...pr.rows[0], name: ur.rows[0].name, email: ur.rows[0].email })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Partial update: any field omitted from the body is preserved. The calorie
// target is always recomputed from the merged values.
profileRoutes.put('/', async (req, res) => {
  try {
    const {
      name, age, height_cm, current_weight_kg, goal_weight_kg,
      sex, activity_level, goal_type, dietary_preferences, allergies, weekly_rate_kg,
    } = req.body

    const { rows } = await query('SELECT * FROM profiles WHERE user_id = $1', [req.user.userId])
    const cur = rows[0]
    if (!cur) return res.status(404).json({ error: 'Profile not found' })

    const merged = {
      age: age ?? cur.age,
      heightCm: height_cm ?? cur.height_cm,
      weightKg: current_weight_kg ?? cur.current_weight_kg,
      goalWeightKg: goal_weight_kg ?? cur.goal_weight_kg,
      sex: sex ?? cur.sex,
      activityLevel: activity_level ?? cur.activity_level ?? 'sedentary',
      goalType: goal_type ?? cur.goal_type ?? 'lose',
      dietaryPreferences: dietary_preferences ?? cur.dietary_preferences ?? [],
      allergies: allergies ?? cur.allergies ?? [],
      weeklyRateKg: weekly_rate_kg ?? cur.weekly_rate_kg ?? 0.5,
    }
    const target = calcTarget(merged)

    await query(
      `UPDATE profiles SET
         age=$1, height_cm=$2, current_weight_kg=$3, goal_weight_kg=$4,
         daily_calorie_target=$5, sex=$6, activity_level=$7, goal_type=$8,
         dietary_preferences=$9, allergies=$10, weekly_rate_kg=$11
       WHERE user_id=$12`,
      [
        merged.age, merged.heightCm, merged.weightKg, merged.goalWeightKg,
        target, merged.sex, merged.activityLevel, merged.goalType,
        merged.dietaryPreferences, merged.allergies, merged.weeklyRateKg,
        req.user.userId,
      ]
    )
    if (name) {
      await query('UPDATE users SET name=$1 WHERE id=$2', [name.trim(), req.user.userId])
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
