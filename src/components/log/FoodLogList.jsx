import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Clock } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { useApp } from '../../context/AppContext'

export function FoodLogList() {
  const { todayLog, todayCalories, profile, deleteFood } = useApp()
  const entries = todayLog.foodEntries ?? []
  const target = profile?.dailyCalorieTarget ?? 1900
  const ratio = Math.min(todayCalories / target, 1)
  const over = todayCalories > target

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white/40 text-xs font-medium">Today's Progress</span>
          <span className="font-display font-bold text-sm">
            <span style={{ color: over ? '#f87171' : '#fbbf24' }}>{todayCalories}</span>
            <span className="text-white/25"> / {target} kcal</span>
          </span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
          <motion.div
            className="h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${ratio * 100}%` }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            style={{ background: over ? '#f87171' : 'linear-gradient(90deg, #84cc16, #f59e0b)' }}
          />
        </div>
      </div>

      {/* Entry list */}
      {entries.length === 0 ? (
        <div className="text-center py-10 flex flex-col items-center gap-2">
          <span className="text-4xl opacity-40">🍽️</span>
          <p className="text-white/25 text-sm">Nothing logged yet</p>
          <p className="text-white/15 text-xs">Search and add foods below</p>
        </div>
      ) : (
        <div>
          <AnimatePresence>
            {[...entries].reverse().map(entry => (
              <motion.div
                key={entry.id}
                layout
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60, transition: { duration: 0.2 } }}
                className="flex items-center gap-3 py-3"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="text-lg w-7 text-center flex-shrink-0">{entry.emoji ?? '🍽️'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white/85 text-sm font-medium truncate">{entry.name}</p>
                  <p className="text-white/28 text-[11px] flex items-center gap-1 mt-0.5">
                    <Clock size={9} />
                    {entry.time ? format(parseISO(entry.time), 'h:mm a') : 'now'}
                  </p>
                </div>
                <span className="font-display font-bold text-gold-400 text-sm">{entry.calories}</span>
                <span className="text-white/20 text-[10px] mr-1">kcal</span>
                <motion.button
                  whileTap={{ scale: 0.82 }}
                  onClick={() => deleteFood(entry.id)}
                  className="w-7 h-7 flex items-center justify-center rounded-xl flex-shrink-0"
                  style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.18)' }}>
                  <Trash2 size={11} className="text-red-400" />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Total */}
          <div className="flex justify-between items-center pt-3 mt-1">
            <span className="text-white/30 text-xs">{entries.length} item{entries.length !== 1 ? 's' : ''} logged</span>
            <div className="font-display font-bold text-base">
              <span className="text-white/50">Total: </span>
              <span style={{ color: over ? '#f87171' : '#fbbf24' }}>{todayCalories}</span>
              <span className="text-white/25 text-sm"> kcal</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
