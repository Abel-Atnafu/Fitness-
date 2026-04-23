import { motion } from 'framer-motion'
import { Droplets, UtensilsCrossed, Flame, Activity } from 'lucide-react'
import { useApp } from '../../context/AppContext'

function StatTile({ icon: Icon, label, value, sub, color, delay, onClick }) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={onClick}
      className="rounded-2xl p-4 text-left w-full"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex items-center gap-2 mb-2.5">
        <div className="w-7 h-7 rounded-xl flex items-center justify-center"
          style={{ background: `${color}1a` }}>
          <Icon size={14} style={{ color }} />
        </div>
        <span className="text-white/35 text-[10px] font-semibold uppercase tracking-widest">{label}</span>
      </div>
      <div className="font-display font-bold text-xl text-white leading-none">{value}</div>
      <div className="text-white/30 text-[11px] mt-1">{sub}</div>
    </motion.button>
  )
}

export function QuickStats() {
  const { todayLog, mealsCompletedToday, calorieDeficit, bmi, logWater } = useApp()
  const water = todayLog.waterGlasses ?? 0
  const bmiLabel = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese'
  const bmiColor = bmi < 25 ? '#84cc16' : bmi < 30 ? '#f59e0b' : '#f87171'

  return (
    <div className="grid grid-cols-2 gap-3">
      <StatTile icon={Droplets} label="Water" value={`${water} / 8`} sub="tap to log a glass" color="#38bdf8" delay={0.08} onClick={logWater} />
      <StatTile icon={UtensilsCrossed} label="Meals" value={`${mealsCompletedToday} / 3`} sub="completed today" color="#84cc16" delay={0.12} />
      <StatTile
        icon={Flame}
        label="Deficit"
        value={calorieDeficit >= 0 ? `${calorieDeficit}` : `+${Math.abs(calorieDeficit)}`}
        sub={calorieDeficit >= 0 ? 'kcal remaining' : 'kcal over budget'}
        color={calorieDeficit >= 0 ? '#f59e0b' : '#f87171'}
        delay={0.16}
      />
      <StatTile icon={Activity} label="BMI" value={bmi || '—'} sub={bmiLabel} color={bmiColor} delay={0.2} />
    </div>
  )
}
