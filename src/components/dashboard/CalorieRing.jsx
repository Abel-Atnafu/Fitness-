import { motion } from 'framer-motion'
import { ProgressRing } from '../ui/ProgressRing'
import { AnimatedNumber } from '../ui/AnimatedNumber'
import { useApp } from '../../context/AppContext'

export function CalorieRing() {
  const { todayCalories, state } = useApp()
  const target = state.profile.dailyCalorieTarget
  const ratio = Math.min(todayCalories / target, 1)
  const remaining = Math.max(target - todayCalories, 0)
  const over = todayCalories > target

  const protein = todayCalories * 0.3 / 4
  const carbs = todayCalories * 0.45 / 4
  const fat = todayCalories * 0.25 / 9

  const ringColor = over ? '#da121a' : ratio > 0.85 ? '#f59e0b' : '#84cc16'

  return (
    <div className="flex flex-col items-center gap-4">
      <ProgressRing size={220} strokeWidth={16} value={ratio} color={ringColor} bgColor="rgba(255,255,255,0.06)" delay={0.3}>
        <div className="flex flex-col items-center">
          <AnimatedNumber value={todayCalories} className="font-display font-bold text-4xl text-white" />
          <span className="text-white/40 text-xs font-medium tracking-wider uppercase">kcal eaten</span>
          <div className={`mt-1 text-sm font-semibold ${over ? 'text-red-400' : 'text-gold-400'}`}>
            {over ? `+${todayCalories - target} over` : `${remaining} left`}
          </div>
        </div>
      </ProgressRing>

      {/* Macro pills */}
      <div className="flex gap-3">
        {[
          { label: 'Protein', value: Math.round(protein), unit: 'g', color: '#84cc16' },
          { label: 'Carbs', value: Math.round(carbs), unit: 'g', color: '#fbbf24' },
          { label: 'Fat', value: Math.round(fat), unit: 'g', color: '#f87171' },
        ].map(m => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col items-center px-4 py-2 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span className="font-display font-bold text-base" style={{ color: m.color }}>{m.value}{m.unit}</span>
            <span className="text-white/40 text-[10px] font-medium uppercase tracking-wider">{m.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
