import jwt from 'jsonwebtoken'

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
