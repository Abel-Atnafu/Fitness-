import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

let initialized = false

export async function query(text, params = []) {
  const rows = await sql(text, params)
  return { rows }
}

export async function initDb() {
  if (initialized) return
  initialized = true
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
      daily_calorie_target INTEGER DEFAULT 1900,
      sex TEXT,
      activity_level TEXT DEFAULT 'sedentary',
      goal_type TEXT DEFAULT 'lose',
      dietary_preferences TEXT[] DEFAULT '{}',
      allergies TEXT[] DEFAULT '{}'
    )`,
    `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS sex TEXT`,
    `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS activity_level TEXT DEFAULT 'sedentary'`,
    `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS goal_type TEXT DEFAULT 'lose'`,
    `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS dietary_preferences TEXT[] DEFAULT '{}'`,
    `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS allergies TEXT[] DEFAULT '{}'`,
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
    await sql(stmt)
  }
}
