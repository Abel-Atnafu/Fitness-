import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, CheckCircle2, Circle, Flame, X } from 'lucide-react'
import { format, subDays } from 'date-fns'
import { PageTransition } from '../components/ui/PageTransition'
import { api } from '../api/client'

const TODAY = format(new Date(), 'yyyy-MM-dd')

const PRESET_HABITS = [
  { name: 'Drink Water', emoji: '💧', color: '#38bdf8' },
  { name: 'Exercise', emoji: '🏃', color: '#84cc16' },
  { name: 'Meditate', emoji: '🧘', color: '#a78bfa' },
  { name: 'Read', emoji: '📚', color: '#fbbf24' },
  { name: 'Sleep Early', emoji: '🌙', color: '#818cf8' },
  { name: 'No Sugar', emoji: '🚫', color: '#f87171' },
  { name: 'Walk 10k Steps', emoji: '👟', color: '#34d399' },
  { name: 'Stretch', emoji: '🤸', color: '#fb923c' },
]

function getStreak(habitId, completions) {
  let streak = 0
  for (let i = 0; i <= 365; i++) {
    const d = format(subDays(new Date(), i), 'yyyy-MM-dd')
    if (completions.some(c => c.habit_id === habitId && c.date === d)) streak++
    else if (i > 0) break
  }
  return streak
}

function getLast7Days() {
  return Array.from({ length: 7 }, (_, i) => format(subDays(new Date(), 6 - i), 'yyyy-MM-dd'))
}

export default function Habits() {
  const [habits, setHabits] = useState([])
  const [completions, setCompletions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmoji, setNewEmoji] = useState('⭐')
  const [newColor, setNewColor] = useState('#fbbf24')
  const [adding, setAdding] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const last7 = getLast7Days()

  useEffect(() => {
    api.get('/api/habits')
      .then(({ habits: h, completions: c }) => {
        setHabits(h ?? [])
        setCompletions(c ?? [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function toggleToday(habitId) {
    const wasCompleted = completions.some(c => c.habit_id === habitId && c.date === TODAY)
    setCompletions(prev =>
      wasCompleted
        ? prev.filter(c => !(c.habit_id === habitId && c.date === TODAY))
        : [...prev, { habit_id: habitId, date: TODAY }]
    )
    try {
      await api.post(`/api/habits/${habitId}/complete`, { date: TODAY })
    } catch {
      setCompletions(prev =>
        wasCompleted
          ? [...prev, { habit_id: habitId, date: TODAY }]
          : prev.filter(c => !(c.habit_id === habitId && c.date === TODAY))
      )
    }
  }

  async function addHabit(preset) {
    const name = preset ? preset.name : newName.trim()
    const emoji = preset ? preset.emoji : newEmoji
    const color = preset ? preset.color : newColor
    if (!name) return
    setAdding(true)
    try {
      const h = await api.post('/api/habits', { name, emoji, color })
      setHabits(prev => [...prev, h])
      setNewName(''); setShowAdd(false)
    } catch {}
    setAdding(false)
  }

  async function deleteHabit(id) {
    setDeletingId(id)
    try {
      await api.delete(`/api/habits/${id}`)
      setHabits(prev => prev.filter(h => h.id !== id))
      setCompletions(prev => prev.filter(c => c.habit_id !== id))
    } catch {}
    setDeletingId(null)
  }

  const completedToday = habits.filter(h => completions.some(c => c.habit_id === h.id && c.date === TODAY)).length

  return (
    <PageTransition>
      <div className="py-2 flex flex-col gap-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-black text-2xl text-white">Daily Habits</h1>
            <p className="text-white/40 text-sm mt-0.5">
              {completedToday}/{habits.length} done today
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowAdd(v => !v)}
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #d97706, #fbbf24)' }}>
            <Plus size={20} className="text-navy-950" />
          </motion.button>
        </div>

        {/* Today's progress bar */}
        {habits.length > 0 && (
          <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/40 text-xs font-semibold uppercase tracking-wider">Today's Progress</span>
              <span className="text-gold-400 font-bold text-sm">{Math.round((completedToday / habits.length) * 100)}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #d97706, #fbbf24)' }}
                initial={{ width: 0 }}
                animate={{ width: `${(completedToday / habits.length) * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}

        {/* Add habit form */}
        <AnimatePresence>
          {showAdd && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden">
              <div className="rounded-2xl p-4 flex flex-col gap-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-white/40 text-[11px] uppercase tracking-widest font-semibold">Quick Add</p>
                <div className="flex flex-wrap gap-2">
                  {PRESET_HABITS.filter(p => !habits.some(h => h.name === p.name)).map(p => (
                    <motion.button
                      key={p.name}
                      whileTap={{ scale: 0.93 }}
                      onClick={() => addHabit(p)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                      style={{ background: `${p.color}18`, color: p.color, border: `1px solid ${p.color}40` }}>
                      {p.emoji} {p.name}
                    </motion.button>
                  ))}
                </div>
                <div className="h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
                <p className="text-white/40 text-[11px] uppercase tracking-widest font-semibold">Custom Habit</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Habit name…"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addHabit(null)}
                    className="flex-1 px-3 py-2.5 rounded-xl text-white text-sm outline-none"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                  <input
                    type="text"
                    placeholder="😊"
                    value={newEmoji}
                    onChange={e => setNewEmoji(e.target.value)}
                    className="w-12 px-2 py-2.5 rounded-xl text-white text-center text-lg outline-none"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                  <motion.button
                    whileTap={{ scale: 0.93 }}
                    onClick={() => addHabit(null)}
                    disabled={!newName.trim() || adding}
                    className="px-4 py-2.5 rounded-xl font-bold text-sm text-navy-950"
                    style={{ background: 'linear-gradient(135deg, #d97706, #fbbf24)', opacity: newName.trim() ? 1 : 0.5 }}>
                    Add
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Habit cards */}
        {loading ? (
          <p className="text-white/30 text-sm text-center py-8">Loading habits…</p>
        ) : habits.length === 0 ? (
          <div className="rounded-2xl p-8 text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-4xl mb-3">✅</p>
            <p className="text-white/50 text-sm font-semibold mb-1">No habits yet</p>
            <p className="text-white/25 text-xs">Tap + to add your first daily habit</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {habits.map(habit => {
              const doneToday = completions.some(c => c.habit_id === habit.id && c.date === TODAY)
              const streak = getStreak(habit.id, completions)
              return (
                <motion.div
                  key={habit.id}
                  layout
                  className="rounded-2xl p-4"
                  style={{
                    background: doneToday
                      ? `linear-gradient(135deg, ${habit.color}12, ${habit.color}06)`
                      : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${doneToday ? habit.color + '35' : 'rgba(255,255,255,0.07)'}`,
                    transition: 'background 0.3s, border 0.3s',
                  }}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{habit.emoji}</span>
                    <div className="flex-1">
                      <p className="text-white font-semibold text-sm">{habit.name}</p>
                      {streak > 0 && (
                        <p className="text-[11px] flex items-center gap-1 mt-0.5" style={{ color: habit.color }}>
                          <Flame size={10} /> {streak} day streak
                        </p>
                      )}
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.88 }}
                      onClick={() => toggleToday(habit.id)}
                      className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                      style={doneToday
                        ? { background: `${habit.color}22`, border: `1px solid ${habit.color}50` }
                        : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
                      {doneToday
                        ? <CheckCircle2 size={18} style={{ color: habit.color }} />
                        : <Circle size={18} className="text-white/30" />}
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.88 }}
                      onClick={() => deleteHabit(habit.id)}
                      disabled={deletingId === habit.id}
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(248,113,113,0.08)' }}>
                      <Trash2 size={13} className="text-red-400/60" />
                    </motion.button>
                  </div>

                  {/* 7-day grid */}
                  <div className="flex gap-1.5">
                    {last7.map(d => {
                      const done = completions.some(c => c.habit_id === habit.id && c.date === d)
                      const isToday = d === TODAY
                      return (
                        <div key={d} className="flex-1 flex flex-col items-center gap-1">
                          <div
                            className="w-full rounded-md"
                            style={{
                              height: 20,
                              background: done ? habit.color : 'rgba(255,255,255,0.07)',
                              border: isToday ? `1px solid ${habit.color}60` : 'none',
                              opacity: done ? 1 : 0.6,
                            }}
                          />
                          <span className="text-[8px] text-white/20">
                            {format(new Date(d + 'T12:00:00'), 'EEE')[0]}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </PageTransition>
  )
}
