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

authRoutes.post('/google', async (req, res) => {
  const { access_token } = req.body
  if (!access_token) return res.status(400).json({ error: 'Missing access_token' })

  const expectedClientId = process.env.GOOGLE_CLIENT_ID
  if (!expectedClientId) {
    console.error('GOOGLE_CLIENT_ID env var is not set')
    return res.status(500).json({ error: 'Google sign-in is not configured on the server' })
  }

  try {
    // 1. Verify the access token belongs to OUR app (prevents token-substitution attacks).
    const tokenInfoRes = await fetch(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${encodeURIComponent(access_token)}`
    )
    if (!tokenInfoRes.ok) return res.status(401).json({ error: 'Invalid Google token' })
    const tokenInfo = await tokenInfoRes.json()
    if (tokenInfo.azp !== expectedClientId && tokenInfo.aud !== expectedClientId) {
      return res.status(401).json({ error: 'Token was not issued to this app' })
    }

    // 2. Fetch profile data.
    const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    })
    if (!userInfoRes.ok) return res.status(401).json({ error: 'Failed to fetch Google profile' })
    const profile = await userInfoRes.json()
    const { sub: googleId, email, name, email_verified } = profile
    if (!googleId || !email) return res.status(400).json({ error: 'Incomplete Google profile' })
    if (!email_verified) return res.status(403).json({ error: 'Google email is not verified' })

    const normalizedEmail = email.toLowerCase().trim()
    const displayName = (name || normalizedEmail.split('@')[0]).trim()

    // 3. Find or create user. Match by google_id first, then by email (link existing account).
    let { rows } = await query('SELECT * FROM users WHERE google_id = $1', [googleId])
    let user = rows[0]

    if (!user) {
      const existing = await query('SELECT * FROM users WHERE email = $1', [normalizedEmail])
      if (existing.rows[0]) {
        const updated = await query(
          'UPDATE users SET google_id = $1 WHERE id = $2 RETURNING *',
          [googleId, existing.rows[0].id]
        )
        user = updated.rows[0]
      } else {
        const inserted = await query(
          'INSERT INTO users (email, name, google_id) VALUES ($1, $2, $3) RETURNING *',
          [normalizedEmail, displayName, googleId]
        )
        user = inserted.rows[0]
        await query('INSERT INTO profiles (user_id) VALUES ($1)', [user.id])
      }
    }

    const token = jwt.sign(
      { userId: user.id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    )
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } })
  } catch (err) {
    console.error('Google auth error:', err)
    res.status(500).json({ error: 'Google sign-in failed' })
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
    if (!user || !user.password_hash) return res.status(401).json({ error: 'Invalid email or password' })
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
