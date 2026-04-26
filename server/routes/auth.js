import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { query } from '../db.js'
import { JWT_SECRET } from '../middleware/auth.js'

export const authRoutes = Router()

authRoutes.post('/register', async (req, res) => {
  const { name, email, password } = req.body
  if (!name?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' })
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' })
  }
  try {
    const { rows: countRows } = await query('SELECT COUNT(*) AS cnt FROM users')
    if (parseInt(countRows[0].cnt, 10) >= 50) {
      return res.status(403).json({ error: 'This app has reached its maximum capacity of 50 users.' })
    }
    const hash = await bcrypt.hash(password, 10)
    const { rows } = await query(
      'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id',
      [email.toLowerCase().trim(), hash, name.trim()]
    )
    const userId = rows[0].id
    await query('INSERT INTO profiles (user_id) VALUES ($1)', [userId])
    const token = jwt.sign(
      { userId, name: name.trim(), email: email.toLowerCase().trim() },
      JWT_SECRET,
      { expiresIn: '30d' }
    )
    res.status(201).json({ token, user: { id: userId, name: name.trim(), email: email.toLowerCase().trim() } })
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
    const token = jwt.sign(
      { userId: user.id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    )
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})
