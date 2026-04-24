import { initDb } from '../server/db.js'
import app from '../server/app.js'

// Runs once per cold start — initializes the Turso schema
await initDb()

export default app
