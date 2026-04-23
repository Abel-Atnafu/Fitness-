import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'
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
    const hash = await bcrypt.hash(password, 10)
    const result = db.prepare('INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)').run(email.toLowerCase().trim(), hash, name.trim())
    const userId = result.lastInsertRowid
    db.prepare('INSERT INTO profiles (user_id) VALUES (?)').run(userId)
    const token = jwt.sign({ userId, name: name.trim(), email: email.toLowerCase().trim() }, JWT_SECRET, { expiresIn: '30d' })
    res.status(201).json({ token, user: { id: userId, name: name.trim(), email: email.toLowerCase().trim() } })
  } catch (err) {
    if (err.message?.includes('UNIQUE')) return res.status(409).json({ error: 'An account with this email already exists' })
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

authRoutes.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' })
  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim())
    if (!user) return res.status(401).json({ error: 'Invalid email or password' })
    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) return res.status(401).json({ error: 'Invalid email or password' })
    const token = jwt.sign({ userId: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '30d' })
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})
