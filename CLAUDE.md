# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Run both frontend (Vite :5173) and backend (Express :3001) concurrently
npm run dev

# Build frontend only (outputs to dist/)
npm run build

# Run backend only
npm run server
```

No test suite exists in this project.

## Environment Variables

**Local dev** — no `.env` required. With `DATABASE_URL` unset, `server/db.js`
boots an embedded PGlite (Postgres in WASM) at `./.local-db/` and `JWT_SECRET`
falls back to a hardcoded dev value. Just `npm install && npm run dev`.

To use a real Postgres locally, create a `.env`:
```
DATABASE_URL=postgresql://...   # Neon URL, or anything localhost
JWT_SECRET=any-random-string
```
URL routing in `server/db.js`:
- unset / `local` / `pglite:<path>` → embedded PGlite (devDependency)
- anything else → `@neondatabase/serverless` HTTP driver

Vite proxies `/api/*` → `http://localhost:3001` so the frontend always calls relative `/api/` URLs.

**Vercel production** — set `DATABASE_URL` and `JWT_SECRET` in Vercel → Settings → Environment Variables.

## Architecture

### Split entry points
The Express app is intentionally split into three files:
- `server/app.js` — Express app definition (no `listen`). Imported by both entry points below.
- `server/index.js` — local dev entry: calls `initDb()` then `app.listen(3001)`.
- `api/index.js` — Vercel serverless handler: awaits `initDb()` then passes requests to `app`. Returns 503 if DB init fails.

### Database
`server/db.js` exports:
- `query(text, params[])` — wraps `@neondatabase/serverless` HTTP client, returns `{ rows }`.
- `initDb()` — runs `CREATE TABLE IF NOT EXISTS` for all 6 tables on cold start. Safe to call repeatedly.

PostgreSQL via Neon (serverless HTTP transport). All parameterised queries use `$1, $2, ...` placeholders. No ORM.

Tables: `users`, `profiles`, `food_entries`, `meals_eaten`, `water_logs`, `weight_entries`.

### Auth
JWT stored in `localStorage` under key `fitethio-token` (30-day expiry). Every API request attaches it as `Authorization: Bearer <token>`. The `authenticate` middleware in `server/middleware/auth.js` verifies it and sets `req.user = { userId, name, email }`.

### Frontend state
All server-derived state lives in a single React context: `src/context/AppContext.jsx`. It exposes actions (`logFood`, `deleteFood`, `logWater`, `decrementWater`, `logWeight`, `toggleMealEaten`, `updateProfile`, `resetData`, `swapMeal`) and derived values (`todayCalories`, `calorieDeficit`, `bmi`, `mealsCompletedToday`). Components read from context via `useApp()`.

Optimistic updates are used for food logging (UUID placeholder replaced with server ID on success, rolled back on failure) and water (debounced 400 ms to avoid race conditions on rapid taps).

### Routing
`HashRouter` is used (not `BrowserRouter`) so deep links work on Vercel's static hosting without server-side route handling. The `/(.*) → /index.html` rewrite in `vercel.json` is a safety net only.

### Meal plan data
`src/data/mealPlans.js` contains 7 days × 3 slots of static meal objects. Each meal has an `alternates: [MealObject, MealObject]` array. `MealPlanDay.jsx` builds a pool `[primary, ...alternates]` and cycles through it via `mealSwapIndices` state in context.

### Calorie target
Calculated server-side in `server/routes/profile.js` using Mifflin-St Jeor BMR × 1.2 (sedentary) − 500 kcal deficit. Recalculated and stored in `profiles.daily_calorie_target` on every profile PUT.

## Key Conventions

- All route files import `{ query }` from `../db.js` — never import the Neon client directly.
- `process.env.VERCEL` (auto-set to `"1"` by Vercel) is used to detect the deployment environment, not `NODE_ENV`.
- CORS is disabled (`origin: false`) on Vercel (same-origin), enabled only for `localhost:5173` in dev.
- `logged_at` timestamps are stored as `TIMESTAMPTZ` and formatted in SQL as `to_char(logged_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')` so the frontend receives ISO 8601 strings ready for `parseISO`.
