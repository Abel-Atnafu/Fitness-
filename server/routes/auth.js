import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { query } from '../db.js'
import { JWT_SECRET } from '../middleware/auth.js'

export const authRoutes = Router()

function getClientIp(req) {
  const fwd = req.headers['x-forwarded-for']
  if (fwd) return String(fwd).split(',')[0].trim()
  return req.ip || req.socket?.remoteAddress || null
}

authRoutes.post('/register', async (req, res) => {
  const { name, email, password } = req.body
  if (!name?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' })
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' })
  }
  try {
    const hash = await bcrypt.hash(password, 10)
    const { rows: countRows } = await query('SELECT COUNT(*)::int AS c FROM users', [])
    const isFirst = (countRows[0]?.c ?? 0) === 0
    const { rows } = await query(
      'INSERT INTO users (email, password_hash, name, is_admin) VALUES ($1, $2, $3, $4) RETURNING id, is_admin',
      [email.toLowerCase().trim(), hash, name.trim(), isFirst]
    )
    const userId = rows[0].id
    const isAdmin = !!rows[0].is_admin
    await query('INSERT INTO profiles (user_id) VALUES ($1)', [userId])
    const ip = getClientIp(req)
    const ua = req.headers['user-agent'] || null
    await query(
      'INSERT INTO login_logs (user_id, ip_address, user_agent) VALUES ($1, $2, $3)',
      [userId, ip, ua]
    )
    await query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [userId])
    const token = jwt.sign(
      { userId, name: name.trim(), email: email.toLowerCase().trim() },
      JWT_SECRET,
      { expiresIn: '30d' }
    )
    res.status(201).json({
      token,
      user: { id: userId, name: name.trim(), email: email.toLowerCase().trim(), is_admin: isAdmin },
    })
  } catch (err) {
    if (err.message?.includes('unique') || err.message?.includes('duplicate')) {
      return res.status(409).json({ error: 'An account with this email already exists' })
    }
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

authRoutes.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' })
  try {
    const { rows } = await query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    )
    const user = rows[0]
    if (!user) return res.status(401).json({ error: 'Invalid email or password' })
    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' })
    const ip = getClientIp(req)
    const ua = req.headers['user-agent'] || null
    await query(
      'INSERT INTO login_logs (user_id, ip_address, user_agent) VALUES ($1, $2, $3)',
      [user.id, ip, ua]
    )
    await query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id])
    const token = jwt.sign(
      { userId: user.id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    )
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, is_admin: !!user.is_admin },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})
