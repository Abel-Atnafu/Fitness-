import { motion } from 'framer-motion'
import { AnimatedNumber } from '../ui/AnimatedNumber'
import { useApp } from '../../context/AppContext'

export function StreakCard() {
  const { state } = useApp()
  const streak = state.currentStreak

  return (
    <motion.div
      whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(251,191,36,0.25)' }}
      className="flex-1 rounded-2xl p-4 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))',
        border: '1px solid rgba(251,191,36,0.2)',
      }}>
      {/* top edge highlight */}
      <div className="absolute top-0 left-4 right-4 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.5), transparent)' }} />
      <div className="flex items-center gap-2 mb-1">
        <motion.span
          className="text-2xl animate-fire inline-block"
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ repeat: Infinity, duration: 1.4 }}>
          🔥
        </motion.span>
        <span className="text-white/50 text-xs font-medium uppercase tracking-widest">Streak</span>
      </div>
      <div className="flex items-baseline gap-1">
        <AnimatedNumber value={streak} className="font-display font-black text-3xl text-white" />
        <span className="text-white/50 text-sm font-medium">days</span>
      </div>
      <p className="text-white/30 text-xs mt-1">Keep it going!</p>
    </motion.div>
  )
}
