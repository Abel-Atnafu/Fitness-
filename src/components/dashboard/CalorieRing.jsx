import { motion } from 'framer-motion'
import { ProgressRing } from '../ui/ProgressRing'
import { AnimatedNumber } from '../ui/AnimatedNumber'
import { useApp } from '../../context/AppContext'

export function CalorieRing() {
  const { todayCalories, todayLog, profile } = useApp()
  const target = profile?.dailyCalorieTarget ?? 1900
  const ratio = Math.min(todayCalories / target, 1)
  const remaining = Math.max(target - todayCalories, 0)
  const over = todayCalories > target

  const ringColor = over ? '#f87171' : ratio > 0.88 ? '#f59e0b' : '#84cc16'

  const entries = todayLog.foodEntries ?? []
  const totalProtein = Math.round(entries.reduce((s, e) => s + (e.protein ?? 0), 0))
  const totalCarbs = Math.round(entries.reduce((s, e) => s + (e.carbs ?? 0), 0))
  const totalFat = Math.round(entries.reduce((s, e) => s + (e.fat ?? 0), 0))

  return (
    <div className="flex flex-col items-center gap-5">
      <ProgressRing size={220} strokeWidth={14} value={ratio} color={ringColor} bgColor="rgba(255,255,255,0.05)" delay={0.25}>
        <div className="flex flex-col items-center gap-0.5">
          <AnimatedNumber value={todayCalories} className="font-display font-black text-4xl text-white" />
          <span className="text-white/35 text-[11px] font-medium tracking-widest uppercase">kcal eaten</span>
          <div className={`mt-1.5 px-3 py-1 rounded-full text-xs font-bold ${over ? 'text-red-400' : 'text-gold-400'}`}
            style={{ background: over ? 'rgba(248,113,113,0.12)' : 'rgba(251,191,36,0.12)' }}>
            {over ? `+${todayCalories - target} over` : `${remaining} remaining`}
          </div>
        </div>
      </ProgressRing>

      {/* Target line */}
      <div className="flex items-center gap-2 text-xs text-white/30">
        <div className="w-6 h-px" style={{ background: 'rgba(255,255,255,0.2)' }} />
        Target: <span className="text-white/55 font-semibold">{target} kcal/day</span>
        <div className="w-6 h-px" style={{ background: 'rgba(255,255,255,0.2)' }} />
      </div>

      {/* Macro pills */}
      <div className="flex gap-2 w-full">
        {[
          { label: 'Protein', value: totalProtein, unit: 'g', color: '#84cc16', bg: 'rgba(132,204,22,0.1)' },
          { label: 'Carbs', value: totalCarbs, unit: 'g', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
          { label: 'Fat', value: totalFat, unit: 'g', color: '#f87171', bg: 'rgba(248,113,113,0.1)' },
        ].map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.07 }}
            className="flex-1 flex flex-col items-center py-2.5 rounded-2xl"
            style={{ background: m.bg, border: `1px solid ${m.color}20` }}>
            <span className="font-display font-bold text-base" style={{ color: m.color }}>
              {m.value}<span className="text-xs font-medium ml-0.5">{m.unit}</span>
            </span>
            <span className="text-white/30 text-[10px] font-medium uppercase tracking-wider mt-0.5">{m.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
