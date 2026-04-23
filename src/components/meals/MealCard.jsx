import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, CheckCircle2, Clock, ChevronDown } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const SLOT_LABELS = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner' }
const SLOT_TIMES  = { breakfast: '7–9 AM',   lunch: '12–2 PM', dinner: '6–8 PM' }

export function MealCard({ meal, slot, dayIndex }) {
  const { toggleMealEaten, swapMeal, todayLog } = useApp()
  const [expanded, setExpanded] = useState(false)
  const [swapping, setSwapping] = useState(false)

  const isToday = dayIndex === (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1)
  const eaten = isToday && !!todayLog.mealsEaten?.[slot]

  const handleSwap = (e) => {
    e.stopPropagation()
    setSwapping(true)
    swapMeal(dayIndex, slot)
    setTimeout(() => setSwapping(false), 500)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 26 }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: eaten
          ? 'linear-gradient(135deg, rgba(251,191,36,0.09), rgba(245,158,11,0.04))'
          : 'rgba(255,255,255,0.04)',
        border: eaten ? '1px solid rgba(251,191,36,0.3)' : '1px solid rgba(255,255,255,0.08)',
        transition: 'background 0.35s, border 0.35s',
      }}>

      {/* Top glow when eaten */}
      {eaten && (
        <div className="h-px w-full"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.5), transparent)' }} />
      )}

      {/* Main row — tap to expand */}
      <div className="p-4 cursor-pointer" onClick={() => setExpanded(v => !v)}>
        <div className="flex items-start gap-3">
          <div className="text-3xl mt-0.5 flex-shrink-0">{meal.emoji}</div>

          <div className="flex-1 min-w-0">
            {/* Type badge + time */}
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                style={{
                  background: meal.type === 'ethiopian' ? 'rgba(7,137,48,0.18)' : 'rgba(56,189,248,0.12)',
                  color: meal.type === 'ethiopian' ? '#4ade80' : '#38bdf8',
                }}>
                {meal.flag} {SLOT_LABELS[slot]}
              </span>
              <span className="text-white/25 text-[10px] flex items-center gap-1">
                <Clock size={9} />{SLOT_TIMES[slot]}
              </span>
            </div>

            {/* Name + calories */}
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="font-display font-bold text-white text-[15px] leading-snug">{meal.name}</h3>
              <span className="font-display font-black text-gold-400 text-base flex-shrink-0">{meal.calories}</span>
            </div>
            <p className="text-white/35 text-[11px] mt-0.5 truncate">{meal.fullName}</p>

            {/* Macros */}
            <div className="flex gap-2 mt-2.5">
              {[['P', meal.protein, '#84cc16'], ['C', meal.carbs, '#fbbf24'], ['F', meal.fat, '#f87171']].map(([l, v, c]) => (
                <span key={l} className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                  style={{ background: `${c}18`, color: c }}>
                  {l} {v}g
                </span>
              ))}
              <span className="text-white/20 text-[10px] ml-auto">kcal</span>
            </div>
          </div>

          <ChevronDown size={14} className={`text-white/25 mt-1 flex-shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Expanded */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden">
            <div className="px-4 pb-3 pt-0">
              <p className="text-white/50 text-sm leading-relaxed">{meal.description}</p>
              <div className="flex gap-1.5 mt-2.5 flex-wrap">
                {meal.tags?.map(tag => (
                  <span key={tag} className="text-[10px] text-white/25 border border-white/10 rounded-full px-2 py-0.5">{tag}</span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action buttons (today only) */}
      {isToday && (
        <div className="flex gap-2 px-4 pb-4 pt-1">
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => toggleMealEaten(slot)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={eaten
              ? { background: 'rgba(251,191,36,0.14)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' }
              : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.65)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <CheckCircle2 size={15} />
            {eaten ? 'Marked Eaten' : 'Mark as Eaten'}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSwap}
            className="w-10 h-10 flex items-center justify-center rounded-xl"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}>
            <motion.div animate={swapping ? { rotate: 360 } : { rotate: 0 }} transition={{ duration: 0.45 }}>
              <RefreshCw size={14} className="text-white/40" />
            </motion.div>
          </motion.button>
        </div>
      )}
    </motion.div>
  )
}
