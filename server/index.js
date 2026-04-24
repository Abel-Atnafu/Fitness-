import { initDb } from './db.js'
import app from './app.js'

const PORT = process.env.PORT || 3001

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\n  🔥 FitEthio API running at http://localhost:${PORT}\n`)
    })
  })
  .catch(err => {
    console.error('Failed to initialize database:', err)
    process.exit(1)
  })
