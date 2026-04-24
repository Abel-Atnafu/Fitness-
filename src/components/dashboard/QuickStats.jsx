import { motion } from 'framer-motion'
import { Droplets, UtensilsCrossed, Flame, Activity, Plus, Minus } from 'lucide-react'
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

function WaterTile({ delay }) {
  const { todayLog, logWater, decrementWater } = useApp()
  const water = todayLog.waterGlasses ?? 0
  const pct = Math.min(water / 8, 1)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-2xl p-4"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex items-center gap-2 mb-2.5">
        <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'rgba(56,189,248,0.1)' }}>
          <Droplets size={14} style={{ color: '#38bdf8' }} />
        </div>
        <span className="text-white/35 text-[10px] font-semibold uppercase tracking-widest">Water</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="font-display font-bold text-xl text-white leading-none">{water}<span className="text-white/30 text-sm font-normal"> / 8</span></div>
        <div className="flex gap-1">
          <motion.button whileTap={{ scale: 0.84 }} onClick={decrementWater} disabled={water === 0}
            className="w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-30"
            style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)' }}>
            <Minus size={11} className="text-sky-400" />
          </motion.button>
          <motion.button whileTap={{ scale: 0.84 }} onClick={() => logWater(1)} disabled={water >= 12}
            className="w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-30"
            style={{ background: 'rgba(56,189,248,0.15)', border: '1px solid rgba(56,189,248,0.3)' }}>
            <Plus size={11} className="text-sky-400" />
          </motion.button>
        </div>
      </div>
      <div className="h-1 rounded-full overflow-hidden mt-2.5" style={{ background: 'rgba(255,255,255,0.07)' }}>
        <motion.div className="h-full rounded-full" style={{ background: '#38bdf8' }}
          animate={{ width: `${pct * 100}%` }} transition={{ duration: 0.4 }} />
      </div>
    </motion.div>
  )
}

export function QuickStats() {
  const { mealsCompletedToday, calorieDeficit, bmi } = useApp()
  const bmiLabel = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese'
  const bmiColor = bmi < 25 ? '#84cc16' : bmi < 30 ? '#f59e0b' : '#f87171'

  return (
    <div className="grid grid-cols-2 gap-3">
      <WaterTile delay={0.08} />
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
