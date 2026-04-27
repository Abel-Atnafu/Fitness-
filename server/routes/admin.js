import { Router } from 'express'
import { query } from '../db.js'

export const adminRoutes = Router()

// Platform-wide stats
adminRoutes.get('/stats', async (req, res) => {
  try {
    const [users, foodEntries, weightEntries, exerciseEntries, waterLogs] = await Promise.all([
      query('SELECT COUNT(*) AS count FROM users'),
      query('SELECT COUNT(*) AS count FROM food_entries'),
      query('SELECT COUNT(*) AS count FROM weight_entries'),
      query('SELECT COUNT(*) AS count FROM exercise_entries'),
      query('SELECT COUNT(*) AS count FROM water_logs'),
    ])
    const activeToday = await query(
      `SELECT COUNT(DISTINCT user_id) AS count FROM food_entries WHERE date = $1`,
      [new Date().toISOString().slice(0, 10)]
    )
    res.json({
      totalUsers: Number(users.rows[0].count),
      totalFoodEntries: Number(foodEntries.rows[0].count),
      totalWeightEntries: Number(weightEntries.rows[0].count),
      totalExerciseEntries: Number(exerciseEntries.rows[0].count),
      totalWaterLogs: Number(waterLogs.rows[0].count),
      activeUsersToday: Number(activeToday.rows[0].count),
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// List all users with basic stats
adminRoutes.get('/users', async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT
         u.id, u.name, u.email, u.phone, u.role, u.created_at,
         u.failed_login_count, u.locked_until,
         p.current_weight_kg, p.daily_calorie_target,
         (SELECT COUNT(*) FROM food_entries fe WHERE fe.user_id = u.id)::int AS food_entry_count,
         (SELECT COUNT(*) FROM weight_entries we WHERE we.user_id = u.id)::int AS weight_entry_count
       FROM users u
       LEFT JOIN profiles p ON p.user_id = u.id
       ORDER BY u.created_at DESC`
    )
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Change a user's role
adminRoutes.put('/users/:id/role', async (req, res) => {
  const { id } = req.params
  const { role } = req.body
  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Role must be "user" or "admin"' })
  }
  try {
    const { rows } = await query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role',
      [role, id]
    )
    if (!rows[0]) return res.status(404).json({ error: 'User not found' })
    res.json(rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Unlock a locked account
adminRoutes.put('/users/:id/unlock', async (req, res) => {
  const { id } = req.params
  try {
    const { rows } = await query(
      'UPDATE users SET failed_login_count = 0, locked_until = NULL WHERE id = $1 RETURNING id',
      [id]
    )
    if (!rows[0]) return res.status(404).json({ error: 'User not found' })
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// Delete a user (cascades all data)
adminRoutes.delete('/users/:id', async (req, res) => {
  const { id } = req.params
  try {
    const { rows } = await query('DELETE FROM users WHERE id = $1 RETURNING id', [id])
    if (!rows[0]) return res.status(404).json({ error: 'User not found' })
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})
