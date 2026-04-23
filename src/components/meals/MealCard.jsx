import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, CheckCircle2, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const SLOT_LABELS = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner' }
const SLOT_TIMES = { breakfast: '7–9 AM', lunch: '12–2 PM', dinner: '6–8 PM' }

export function MealCard({ meal, slot, dayIndex }) {
  const { state, dispatch, todayLog } = useApp()
  const [expanded, setExpanded] = useState(false)
  const [swapping, setSwapping] = useState(false)

  const isToday = dayIndex === (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1)
  const eaten = isToday && todayLog.mealsEaten?.[slot]

  const handleEaten = () => {
    if (isToday) dispatch({ type: 'TOGGLE_MEAL_EATEN', payload: slot })
  }

  const handleSwap = (e) => {
    e.stopPropagation()
    setSwapping(true)
    dispatch({ type: 'SWAP_MEAL', payload: { day: dayIndex, slot } })
    setTimeout(() => setSwapping(false), 600)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className="rounded-2xl overflow-hidden relative"
      style={{
        background: eaten
          ? 'linear-gradient(135deg, rgba(251,191,36,0.1), rgba(245,158,11,0.05))'
          : 'linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))',
        border: eaten ? '1px solid rgba(251,191,36,0.35)' : '1px solid rgba(255,255,255,0.08)',
        transition: 'background 0.4s, border 0.4s',
      }}>
      {eaten && (
        <div className="absolute top-0 left-4 right-4 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.6), transparent)' }} />
      )}

      <div className="p-4" onClick={() => setExpanded(e => !e)}>
        {/* Header row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: meal.type === 'ethiopian' ? 'rgba(7,137,48,0.2)' : 'rgba(56,189,248,0.15)',
                color: meal.type === 'ethiopian' ? '#4ade80' : '#38bdf8',
                border: `1px solid ${meal.type === 'ethiopian' ? 'rgba(74,222,128,0.25)' : 'rgba(56,189,248,0.2)'}`,
              }}>
              {meal.flag} {SLOT_LABELS[slot]}
            </span>
            <span className="text-white/30 text-xs flex items-center gap-1">
              <Clock size={10} />{SLOT_TIMES[slot]}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-gold-400 text-base">{meal.calories}</span>
            <span className="text-white/30 text-xs">kcal</span>
            {expanded ? <ChevronUp size={14} className="text-white/30" /> : <ChevronDown size={14} className="text-white/30" />}
          </div>
        </div>

        {/* Meal name */}
        <div className="flex items-center gap-3">
          <span className="text-3xl">{meal.emoji}</span>
          <div>
            <h3 className="font-display font-bold text-white text-base leading-tight">{meal.name}</h3>
            <p className="text-white/40 text-xs">{meal.fullName}</p>
          </div>
        </div>

        {/* Macro row */}
        <div className="flex gap-3 mt-3">
          {[
            { label: 'P', value: meal.protein, color: '#84cc16' },
            { label: 'C', value: meal.carbs, color: '#fbbf24' },
            { label: 'F', value: meal.fat, color: '#f87171' },
          ].map(m => (
            <span key={m.label} className="text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{ background: `${m.color}18`, color: m.color, border: `1px solid ${m.color}30` }}>
              {m.label}: {m.value}g
            </span>
          ))}
        </div>
      </div>

      {/* Expanded description */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden">
            <div className="px-4 pb-3">
              <p className="text-white/55 text-sm leading-relaxed">{meal.description}</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                {meal.tags?.map(tag => (
                  <span key={tag} className="text-[10px] text-white/30 border border-white/10 rounded-full px-2 py-0.5">{tag}</span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action buttons */}
      {isToday && (
        <div className="flex gap-2 px-4 pb-4">
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={handleEaten}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all"
            style={eaten
              ? { background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' }
              : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <CheckCircle2 size={16} />
            {eaten ? 'Eaten ✓' : 'Mark Eaten'}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={handleSwap}
            className="w-11 flex items-center justify-center rounded-xl"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <motion.div animate={swapping ? { rotate: 360 } : { rotate: 0 }} transition={{ duration: 0.5 }}>
              <RefreshCw size={15} className="text-white/50" />
            </motion.div>
          </motion.button>
        </div>
      )}
    </motion.div>
  )
}
