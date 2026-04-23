import { motion } from 'framer-motion'
import { Droplets, UtensilsCrossed, Flame, Activity } from 'lucide-react'
import { useApp } from '../../context/AppContext'

function StatTile({ icon: Icon, label, value, sub, color, delay, onClick }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={onClick}
      className="rounded-2xl p-4 cursor-pointer"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: `${color}22` }}>
          <Icon size={15} style={{ color }} />
        </div>
        <span className="text-white/40 text-[11px] font-medium uppercase tracking-wider">{label}</span>
      </div>
      <div className="font-display font-bold text-xl text-white">{value}</div>
      <div className="text-white/35 text-xs mt-0.5">{sub}</div>
    </motion.div>
  )
}

export function QuickStats() {
  const { todayLog, mealsCompletedToday, calorieDeficit, bmi, dispatch } = useApp()
  const water = todayLog.waterGlasses || 0

  const bmiLabel = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese'
  const bmiColor = bmi < 25 ? '#84cc16' : bmi < 30 ? '#fbbf24' : '#f87171'

  return (
    <div className="grid grid-cols-2 gap-3">
      <StatTile
        icon={Droplets}
        label="Water"
        value={`${water}/8`}
        sub="glasses today"
        color="#38bdf8"
        delay={0.1}
        onClick={() => dispatch({ type: 'LOG_WATER' })}
      />
      <StatTile
        icon={UtensilsCrossed}
        label="Meals"
        value={`${mealsCompletedToday}/3`}
        sub="completed today"
        color="#84cc16"
        delay={0.15}
      />
      <StatTile
        icon={Flame}
        label="Deficit"
        value={calorieDeficit > 0 ? `${calorieDeficit}` : `+${Math.abs(calorieDeficit)}`}
        sub={calorieDeficit >= 0 ? 'kcal remaining' : 'kcal over budget'}
        color={calorieDeficit >= 0 ? '#f59e0b' : '#f87171'}
        delay={0.2}
      />
      <StatTile
        icon={Activity}
        label="BMI"
        value={bmi}
        sub={bmiLabel}
        color={bmiColor}
        delay={0.25}
      />
    </div>
  )
}
