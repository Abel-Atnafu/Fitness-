import { neon } from '@neondatabase/serverless'

let sql = null
let initialized = false

function getSql() {
  if (sql) return sql
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set. Add it in Vercel → Settings → Environment Variables.')
  }
  sql = neon(process.env.DATABASE_URL)
  return sql
}

export async function query(text, params = []) {
  const rows = await getSql()(text, params)
  return { rows }
}

export async function initDb() {
  if (initialized) return
  const db = getSql()
  const stmts = [
    `CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS profiles (
      user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      age INTEGER DEFAULT 22,
      height_cm REAL DEFAULT 185,
      current_weight_kg REAL DEFAULT 95,
      goal_weight_kg REAL DEFAULT 80,
      daily_calorie_target INTEGER DEFAULT 1900
    )`,
    `CREATE TABLE IF NOT EXISTS food_entries (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      date TEXT NOT NULL,
      food_name TEXT NOT NULL,
      calories INTEGER NOT NULL,
      protein REAL DEFAULT 0,
      carbs REAL DEFAULT 0,
      fat REAL DEFAULT 0,
      emoji TEXT DEFAULT '🍽️',
      category TEXT DEFAULT 'Other',
      logged_at TIMESTAMPTZ DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS meals_eaten (
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      date TEXT NOT NULL,
      slot TEXT NOT NULL,
      eaten INTEGER DEFAULT 0,
      PRIMARY KEY (user_id, date, slot)
    )`,
    `CREATE TABLE IF NOT EXISTS water_logs (
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      date TEXT NOT NULL,
      glasses INTEGER DEFAULT 0,
      PRIMARY KEY (user_id, date)
    )`,
    `CREATE TABLE IF NOT EXISTS weight_entries (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      date TEXT NOT NULL,
      weight_kg REAL NOT NULL,
      UNIQUE(user_id, date)
    )`,
  ]
  for (const stmt of stmts) {
    await db(stmt)
  }
  initialized = true
}
