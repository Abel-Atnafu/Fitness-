import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import rateLimit from 'express-rate-limit'
import { query } from '../db.js'
import { JWT_SECRET, authenticate } from '../middleware/auth.js'
import { sendPasswordResetEmail } from '../lib/mailer.js'

export const authRoutes = Router()

const PHONE_RE = /^\+?[0-9]{7,15}$/
const MAX_FAILED_ATTEMPTS = 5
const LOCKOUT_MINUTES = 15
const RESET_TOKEN_TTL_MS = 30 * 60 * 1000

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
})

function cookieOpts() {
  return {
    httpOnly: true,
    secure: !!process.env.VERCEL,
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  }
}

function normalizePhone(raw) {
  if (typeof raw !== 'string') return ''
  return raw.replace(/[\s-]/g, '')
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex')
}

function publicBaseUrl(req) {
  if (process.env.PUBLIC_BASE_URL) return process.env.PUBLIC_BASE_URL.replace(/\/$/, '')
  const proto = req.headers['x-forwarded-proto'] || (req.secure ? 'https' : 'http')
  const host = req.headers['x-forwarded-host'] || req.headers.host
  return `${proto}://${host}`
}

authRoutes.post('/register', authLimiter, async (req, res) => {
  const { name, email, password, phone } = req.body
  if (!name?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' })
  }
  const normalizedPhone = normalizePhone(phone)
  if (!normalizedPhone) {
    return res.status(400).json({ error: 'Phone number is required' })
  }
  if (!PHONE_RE.test(normalizedPhone)) {
    return res.status(400).json({ error: 'Enter a valid phone number (7–15 digits, optional + prefix)' })
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' })
  }
  try {
    const hash = await bcrypt.hash(password, 10)
    const { rows } = await query(
      'INSERT INTO users (email, password_hash, name, phone) VALUES ($1, $2, $3, $4) RETURNING id',
      [email.toLowerCase().trim(), hash, name.trim(), normalizedPhone]
    )
    const userId = rows[0].id
    await query('INSERT INTO profiles (user_id) VALUES ($1)', [userId])
    const token = jwt.sign(
      { userId, name: name.trim(), email: email.toLowerCase().trim() },
      JWT_SECRET,
      { expiresIn: '30d' }
    )
    res.cookie('fitethio_token', token, cookieOpts())
    res.status(201).json({ user: { id: userId, name: name.trim(), email: email.toLowerCase().trim() } })
  } catch (err) {
    if (err.message?.includes('unique') || err.message?.includes('duplicate')) {
      return res.status(409).json({ error: 'An account with this email already exists' })
    }
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

authRoutes.post('/login', authLimiter, async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' })
  try {
    const { rows } = await query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    )
    const user = rows[0]
    if (!user || !user.password_hash) return res.status(401).json({ error: 'Invalid email or password' })

    if (user.locked_until) {
      const lockedUntil = new Date(user.locked_until)
      if (lockedUntil.getTime() > Date.now()) {
        const minutesLeft = Math.max(1, Math.ceil((lockedUntil.getTime() - Date.now()) / 60000))
        return res.status(423).json({
          error: `Account temporarily locked. Try again in ${minutesLeft} minute${minutesLeft === 1 ? '' : 's'}.`,
        })
      }
    }

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      const newCount = (user.failed_login_count ?? 0) + 1
      if (newCount >= MAX_FAILED_ATTEMPTS) {
        const lockUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000)
        await query(
          'UPDATE users SET failed_login_count = 0, locked_until = $1 WHERE id = $2',
          [lockUntil.toISOString(), user.id]
        )
        return res.status(423).json({
          error: `Too many failed attempts. Account locked for ${LOCKOUT_MINUTES} minutes.`,
        })
      }
      await query(
        'UPDATE users SET failed_login_count = $1 WHERE id = $2',
        [newCount, user.id]
      )
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    if ((user.failed_login_count ?? 0) > 0 || user.locked_until) {
      await query(
        'UPDATE users SET failed_login_count = 0, locked_until = NULL WHERE id = $1',
        [user.id]
      )
    }

    const token = jwt.sign(
      { userId: user.id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    )
    res.cookie('fitethio_token', token, cookieOpts())
    res.json({ user: { id: user.id, name: user.name, email: user.email } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

authRoutes.post('/logout', (req, res) => {
  res.clearCookie('fitethio_token', { httpOnly: true, secure: !!process.env.VERCEL, sameSite: 'lax' })
  res.json({ ok: true })
})

authRoutes.get('/me', authenticate, async (req, res) => {
  try {
    const { rows } = await query(
      'SELECT id, name, email FROM users WHERE id = $1',
      [req.user.userId]
    )
    if (!rows[0]) return res.status(401).json({ error: 'User not found' })
    const u = rows[0]
    res.json({ id: u.id, name: u.name, email: u.email })
  } catch (err) {
    console.error('[me]', err)
    res.status(500).json({ error: 'Server error' })
  }
})

authRoutes.post('/forgot-password', authLimiter, async (req, res) => {
  const { email } = req.body
  if (!email || typeof email !== 'string') return res.json({ ok: true })

  try {
    const { rows } = await query(
      'SELECT id, email, name FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    )
    const user = rows[0]
    if (!user) return res.json({ ok: true })

    await query(
      'DELETE FROM password_reset_tokens WHERE user_id = $1 AND used = FALSE',
      [user.id]
    )

    const rawToken = crypto.randomBytes(32).toString('hex')
    const tokenHash = hashToken(rawToken)
    const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS).toISOString()

    await query(
      'INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
      [user.id, tokenHash, expiresAt]
    )

    const base = publicBaseUrl(req)
    const resetUrl = `${base}/#/reset?token=${rawToken}`

    try {
      await sendPasswordResetEmail({ to: user.email, name: user.name, resetUrl })
    } catch (err) {
      console.error('[forgot-password] mail send failed:', err)
    }

    return res.json({ ok: true })
  } catch (err) {
    console.error('[forgot-password]', err)
    return res.json({ ok: true })
  }
})

authRoutes.post('/reset-password', authLimiter, async (req, res) => {
  const { token, password } = req.body
  if (!token || !password) {
    return res.status(400).json({ error: 'Token and new password are required' })
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' })
  }
  try {
    const tokenHash = hashToken(token)
    const { rows } = await query(
      'SELECT id, user_id, expires_at, used FROM password_reset_tokens WHERE token_hash = $1',
      [tokenHash]
    )
    const record = rows[0]
    if (!record || record.used) {
      return res.status(400).json({ error: 'This reset link is invalid or has already been used.' })
    }
    if (new Date(record.expires_at).getTime() <= Date.now()) {
      return res.status(400).json({ error: 'This reset link has expired. Request a new one.' })
    }

    const hash = await bcrypt.hash(password, 10)
    await query(
      'UPDATE users SET password_hash = $1, failed_login_count = 0, locked_until = NULL WHERE id = $2',
      [hash, record.user_id]
    )
    await query(
      'UPDATE password_reset_tokens SET used = TRUE WHERE id = $1',
      [record.id]
    )
    await query(
      'DELETE FROM password_reset_tokens WHERE user_id = $1 AND used = FALSE',
      [record.user_id]
    )
    return res.json({ ok: true })
  } catch (err) {
    console.error('[reset-password]', err)
    return res.status(500).json({ error: 'Server error' })
  }
})
