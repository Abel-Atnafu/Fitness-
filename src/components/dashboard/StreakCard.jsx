import { motion } from 'framer-motion'
import { AnimatedNumber } from '../ui/AnimatedNumber'
import { useApp } from '../../context/AppContext'

export function StreakCard({
  label = 'Streak',
  value,
  best,
  unit = 'days',
  activeEmoji = '🔥',
  idleEmoji = '❄️',
  accent = 'rgba(251,191,36,0.5)',
  hint,
}) {
  const ctx = useApp()
  const current = value ?? ctx.currentStreak

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="flex-1 rounded-2xl p-4 relative overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.05)',
        border: current > 0 ? `1px solid ${accent}` : '1px solid rgba(255,255,255,0.08)',
      }}>
      {current > 0 && (
        <div className="absolute top-0 left-4 right-4 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
      )}
      <div className="flex items-center gap-1.5 mb-2">
        <motion.span
          className="text-xl inline-block"
          animate={current > 0 ? { scale: [1, 1.15, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1.6 }}>
          {current > 0 ? activeEmoji : idleEmoji}
        </motion.span>
        <span className="text-white/40 text-[11px] font-semibold uppercase tracking-widest">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <AnimatedNumber value={current} className="font-display font-black text-3xl text-white" />
        <span className="text-white/40 text-sm">{unit}</span>
      </div>
      <p className="text-white/25 text-[11px] mt-1">
        {hint ?? (best != null
          ? `Best: ${best} ${unit}`
          : current === 0 ? 'Log food to start' : current >= 7 ? 'On fire! 💪' : 'Keep it up!')}
      </p>
    </motion.div>
  )
}
