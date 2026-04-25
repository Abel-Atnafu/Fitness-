import { Router } from 'express'
import { query } from '../db.js'
import { authenticate, adminOnly } from '../middleware/auth.js'

export const adminRoutes = Router()
adminRoutes.use(authenticate, adminOnly)

adminRoutes.get('/users', async (_req, res) => {
  try {
    const { rows } = await query(
      `SELECT
         u.id,
         u.name,
         u.email,
         u.is_admin,
         to_char(u.created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS created_at,
         to_char(u.last_login_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS last_login_at,
         COALESCE(l.login_count, 0)::int AS login_count
       FROM users u
       LEFT JOIN (
         SELECT user_id, COUNT(*) AS login_count
         FROM login_logs
         GROUP BY user_id
       ) l ON l.user_id = u.id
       ORDER BY u.created_at DESC`,
      []
    )
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

adminRoutes.get('/login-logs', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 200)
    const offset = parseInt(req.query.offset) || 0
    const { rows } = await query(
      `SELECT
         ll.id,
         ll.user_id,
         u.name,
         u.email,
         ll.ip_address,
         to_char(ll.logged_in_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS logged_in_at
       FROM login_logs ll
       JOIN users u ON u.id = ll.user_id
       ORDER BY ll.logged_in_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    )
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

adminRoutes.get('/stats', async (_req, res) => {
  try {
    const [totalUsers, loginsToday, activeWeek] = await Promise.all([
      query('SELECT COUNT(*)::int AS c FROM users', []),
      query(
        `SELECT COUNT(*)::int AS c FROM login_logs
         WHERE logged_in_at >= (NOW() AT TIME ZONE 'UTC')::date`,
        []
      ),
      query(
        `SELECT COUNT(DISTINCT user_id)::int AS c FROM login_logs
         WHERE logged_in_at >= NOW() - INTERVAL '7 days'`,
        []
      ),
    ])
    res.json({
      total_users: totalUsers.rows[0]?.c ?? 0,
      logins_today: loginsToday.rows[0]?.c ?? 0,
      active_last_7_days: activeWeek.rows[0]?.c ?? 0,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})
