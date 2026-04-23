import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Clock } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { useApp } from '../../context/AppContext'

export function FoodLogList() {
  const { todayLog, todayCalories, state, dispatch } = useApp()
  const entries = todayLog.foodEntries || []
  const target = state.profile.dailyCalorieTarget
  const ratio = Math.min(todayCalories / target, 1)

  return (
    <div>
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white/50 text-xs font-medium">Today's Progress</span>
          <span className="font-display font-bold text-sm">
            <span className={todayCalories > target ? 'text-red-400' : 'text-gold-400'}>{todayCalories}</span>
            <span className="text-white/30"> / {target} kcal</span>
          </span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <motion.div
            className="h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${ratio * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ background: todayCalories > target ? '#f87171' : 'linear-gradient(90deg, #84cc16, #f59e0b)' }}
          />
        </div>
      </div>

      {/* Entry list */}
      {entries.length === 0 ? (
        <div className="text-center py-10">
          <span className="text-4xl">🍽️</span>
          <p className="text-white/30 text-sm mt-2">Nothing logged yet today</p>
          <p className="text-white/20 text-xs mt-1">Search and add foods above</p>
        </div>
      ) : (
        <AnimatePresence>
          {[...entries].reverse().map((entry) => (
            <motion.div
              key={entry.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80, transition: { duration: 0.22 } }}
              className="flex items-center gap-3 py-3 border-b"
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <span className="text-xl w-8 text-center">{entry.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white/85 text-sm font-medium truncate">{entry.name}</p>
                <p className="text-white/30 text-xs flex items-center gap-1">
                  <Clock size={9} />
                  {entry.time ? format(parseISO(entry.time), 'h:mm a') : 'now'}
                </p>
              </div>
              <span className="font-display font-bold text-gold-400 text-sm mr-1">{entry.calories}</span>
              <span className="text-white/25 text-xs mr-2">kcal</span>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => dispatch({ type: 'DELETE_FOOD', payload: entry.id })}
                className="w-7 h-7 flex items-center justify-center rounded-lg"
                style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)' }}>
                <Trash2 size={12} className="text-red-400" />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      )}

      {entries.length > 0 && (
        <div className="flex justify-between items-center pt-3 mt-1">
          <span className="text-white/35 text-xs font-medium">{entries.length} items logged</span>
          <span className="font-display font-bold text-base text-white">
            Total: <span className="text-gold-400">{todayCalories}</span> kcal
          </span>
        </div>
      )}
    </div>
  )
}
