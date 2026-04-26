// Driver selection — happens once at module load:
//   • DATABASE_URL unset / "local" / "pglite:..."  → embedded PGlite (zero-config local dev)
//   • Anything else (e.g. a Neon HTTPS URL)        → Neon HTTP serverless driver
//
// PGlite is a devDependency, so production deploys (Vercel) only ship the
// Neon path.

const url = process.env.DATABASE_URL ?? ''
const useLocal = !url || url === 'local' || url.startsWith('pglite:')

let sqlFn
if (useLocal) {
  const { PGlite } = await import('@electric-sql/pglite')
  const dataDir = url.startsWith('pglite:') ? url.slice('pglite:'.length) : './.local-db'
  const db = new PGlite(dataDir)
  await db.waitReady
  console.log(`[db] using local PGlite at ${dataDir}`)
  sqlFn = async (text, params = []) => {
    const r = await db.query(text, params)
    return r.rows
  }
} else {
  const { neon } = await import('@neondatabase/serverless')
  const neonSql = neon(url)
  sqlFn = async (text, params = []) => neonSql(text, params)
}

let initialized = false

export async function query(text, params = []) {
  const rows = await sqlFn(text, params)
  return { rows }
}

export async function initDb() {
  if (initialized) return
  const stmts = [
    `CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id TEXT UNIQUE`,
    `ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS failed_login_count INTEGER NOT NULL DEFAULT 0`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS locked_until TIMESTAMPTZ`,
    `CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMPTZ NOT NULL,
      used BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`,
    `CREATE INDEX IF NOT EXISTS password_reset_tokens_user_id_idx ON password_reset_tokens(user_id)`,
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
    `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS weekly_rate_kg REAL DEFAULT 0.5`,
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
    `CREATE TABLE IF NOT EXISTS exercise_entries (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      date TEXT NOT NULL,
      exercise_name TEXT NOT NULL,
      duration_min INTEGER NOT NULL DEFAULT 30,
      calories_burned INTEGER NOT NULL DEFAULT 0,
      category TEXT DEFAULT 'Cardio',
      emoji TEXT DEFAULT '🏃',
      logged_at TIMESTAMPTZ DEFAULT NOW()
    )`,
  ]
  for (const stmt of stmts) {
    await sqlFn(stmt, [])
  }
  initialized = true
}
