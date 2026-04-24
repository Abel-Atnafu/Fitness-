import { createClient } from '@libsql/client'

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:server/fitethio.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
})

let initialized = false

export async function initDb() {
  if (initialized) return
  initialized = true
  const stmts = [
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
    )`,
    `CREATE TABLE IF NOT EXISTS profiles (
      user_id INTEGER PRIMARY KEY,
      age INTEGER DEFAULT 22,
      height_cm REAL DEFAULT 185,
      current_weight_kg REAL DEFAULT 95,
      goal_weight_kg REAL DEFAULT 80,
      daily_calorie_target INTEGER DEFAULT 1900,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS food_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      food_name TEXT NOT NULL,
      calories INTEGER NOT NULL,
      protein REAL DEFAULT 0,
      carbs REAL DEFAULT 0,
      fat REAL DEFAULT 0,
      emoji TEXT DEFAULT '🍽️',
      category TEXT DEFAULT 'Other',
      logged_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS meals_eaten (
      user_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      slot TEXT NOT NULL,
      eaten INTEGER DEFAULT 0,
      PRIMARY KEY (user_id, date, slot),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS water_logs (
      user_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      glasses INTEGER DEFAULT 0,
      PRIMARY KEY (user_id, date),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS weight_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      weight_kg REAL NOT NULL,
      UNIQUE(user_id, date),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
  ]
  for (const sql of stmts) {
    await db.execute(sql)
  }
}

export default db
