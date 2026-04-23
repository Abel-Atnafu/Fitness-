import { motion } from 'framer-motion'
import { AnimatedNumber } from '../ui/AnimatedNumber'
import { useApp } from '../../context/AppContext'

export function StreakCard() {
  const { currentStreak } = useApp()

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="flex-1 rounded-2xl p-4 relative overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.05)',
        border: currentStreak > 0 ? '1px solid rgba(251,191,36,0.25)' : '1px solid rgba(255,255,255,0.08)',
      }}>
      {currentStreak > 0 && (
        <div className="absolute top-0 left-4 right-4 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.5), transparent)' }} />
      )}
      <div className="flex items-center gap-1.5 mb-2">
        <motion.span
          className="text-xl inline-block"
          animate={currentStreak > 0 ? { scale: [1, 1.15, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1.6 }}>
          {currentStreak > 0 ? '🔥' : '❄️'}
        </motion.span>
        <span className="text-white/40 text-[11px] font-semibold uppercase tracking-widest">Streak</span>
      </div>
      <div className="flex items-baseline gap-1">
        <AnimatedNumber value={currentStreak} className="font-display font-black text-3xl text-white" />
        <span className="text-white/40 text-sm">days</span>
      </div>
      <p className="text-white/25 text-[11px] mt-1">
        {currentStreak === 0 ? 'Log food to start' : currentStreak >= 7 ? 'On fire! 💪' : 'Keep it up!'}
      </p>
    </motion.div>
  )
}
