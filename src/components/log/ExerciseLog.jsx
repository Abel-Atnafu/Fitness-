import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Trash2, Flame } from 'lucide-react'
import { EXERCISE_DATABASE, EXERCISE_CATEGORIES } from '../../data/exerciseDatabase'
import { useApp } from '../../context/AppContext'
import { parseISO, format } from 'date-fns'

const DURATION_CHIPS = [15, 30, 45, 60]

export function ExerciseLog() {
  const { logExercise, deleteExercise, todayLog, todayCaloriesBurned } = useApp()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [duration, setDuration] = useState(30)
  const [logging, setLogging] = useState(null)

  const exerciseEntries = todayLog.exerciseEntries ?? []

  const results = useMemo(() => {
    return EXERCISE_DATABASE.filter(ex => {
      const matchCat = category === 'All' || ex.category === category
      const matchQ = ex.name.toLowerCase().includes(query.toLowerCase())
      return matchCat && matchQ
    }).slice(0, 10)
  }, [query, category])

  const handleLog = async (ex) => {
    setLogging(ex.id)
    await logExercise({
      exercise_name: ex.name,
      duration_min: duration,
      calories_burned: Math.round(ex.calsPerMin * duration),
      category: ex.category,
      emoji: ex.emoji,
    })
    setTimeout(() => setLogging(null), 900)
  }

  const inputStyle = {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.09)',
  }

  return (
    <div>
      {/* Burned today summary */}
      {todayCaloriesBurned > 0 && (
        <div className="flex items-center gap-2 mb-4 px-4 py-3 rounded-2xl"
          style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.18)' }}>
          <Flame size={16} className="text-amber-400 flex-shrink-0" />
          <p className="text-sm text-white/70">
            Burned <span className="text-amber-400 font-semibold">{todayCaloriesBurned} kcal</span> today
            {exerciseEntries.length > 0 && <span className="text-white/35"> · {exerciseEntries.length} session{exerciseEntries.length > 1 ? 's' : ''}</span>}
          </p>
        </div>
      )}

      {/* Today's exercise list */}
      {exerciseEntries.length > 0 && (
        <div className="mb-4 rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
          {exerciseEntries.map((entry, i) => {
            let timeStr = ''
            try { timeStr = format(parseISO(entry.logged_at), 'h:mm a') } catch {}
            return (
              <div
                key={entry.id}
                className="flex items-center gap-3 px-4 py-3"
                style={{ borderBottom: i < exerciseEntries.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <span className="text-xl w-7 text-center flex-shrink-0">{entry.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white/85 text-sm font-medium truncate">{entry.exercise_name}</p>
                  <p className="text-white/30 text-[11px]">
                    {entry.duration_min} min · {entry.calories_burned} kcal burned
                    {timeStr && <span className="ml-1.5">· {timeStr}</span>}
                  </p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => deleteExercise(entry.id)}
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.18)' }}>
                  <Trash2 size={13} className="text-red-400" />
                </motion.button>
              </div>
            )
          })}
        </div>
      )}

      {/* Duration picker */}
      <div className="mb-4">
        <p className="text-xs text-white/40 mb-2">Duration</p>
        <div className="flex items-center gap-2">
          {DURATION_CHIPS.map(d => (
            <motion.button
              key={d}
              whileTap={{ scale: 0.9 }}
              onClick={() => setDuration(d)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold"
              style={duration === d
                ? { background: 'rgba(251,191,36,0.18)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.4)' }
                : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {d}m
            </motion.button>
          ))}
          <div className="flex items-center gap-1">
            <input
              type="number"
              min="1"
              max="300"
              value={duration}
              onChange={e => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 px-2 py-1.5 rounded-xl text-xs text-white text-center outline-none"
              style={inputStyle}
            />
            <span className="text-xs text-white/30">min</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
        <input
          type="text"
          placeholder="Search exercise..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-white/22 text-sm font-medium outline-none transition-all"
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = 'rgba(251,191,36,0.4)'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.09)'}
        />
      </div>

      {/* Category tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 mb-4 scrollbar-none">
        {EXERCISE_CATEGORIES.map(cat => (
          <motion.button
            key={cat}
            whileTap={{ scale: 0.93 }}
            onClick={() => setCategory(cat)}
            className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
            style={category === cat
              ? { background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' }
              : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.38)', border: '1px solid rgba(255,255,255,0.07)' }}>
            {cat}
          </motion.button>
        ))}
      </div>

      {/* Exercise results */}
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
        <AnimatePresence mode="popLayout">
          {results.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8 text-center">
              <p className="text-white/25 text-sm">No results for "{query}"</p>
            </motion.div>
          ) : results.map((ex, i) => {
            const estCals = Math.round(ex.calsPerMin * duration)
            return (
              <motion.div
                key={ex.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-3 px-4 py-3"
                style={{ borderBottom: i < results.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <span className="text-xl w-7 text-center flex-shrink-0">{ex.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white/85 text-sm font-medium truncate">{ex.name}</p>
                  <p className="text-white/30 text-[11px]">
                    {duration} min · <span className="text-amber-400/70">~{estCals} kcal</span>
                    <span className="text-white/20"> · {ex.calsPerMin} kcal/min</span>
                  </p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => handleLog(ex)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold flex-shrink-0"
                  style={logging === ex.id
                    ? { background: 'rgba(132,204,22,0.18)', color: '#84cc16', border: '1px solid rgba(132,204,22,0.35)' }
                    : { background: 'rgba(251,191,36,0.13)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.28)' }}>
                  {logging === ex.id ? 'Logged!' : 'Log'}
                </motion.button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
