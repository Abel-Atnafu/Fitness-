import jwt from 'jsonwebtoken'
import { query } from '../db.js'

export const JWT_SECRET = process.env.JWT_SECRET || 'fitethio-dev-secret-change-in-production'

export function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Authentication required' })
  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export async function adminOnly(req, res, next) {
  try {
    const { rows } = await query(
      'SELECT is_admin FROM users WHERE id = $1',
      [req.user.userId]
    )
    if (!rows[0]?.is_admin) return res.status(403).json({ error: 'Admin access required' })
    next()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}
