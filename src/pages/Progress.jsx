import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageTransition } from '../components/ui/PageTransition'
import { WeightChart } from '../components/progress/WeightChart'
import { CalorieHistoryChart } from '../components/progress/CalorieHistoryChart'
import { useApp } from '../context/AppContext'
import { Trophy, TrendingDown, Calendar, Zap } from 'lucide-react'
import { format } from 'date-fns'

const MILESTONES = [92, 90, 87, 85, 83, 80]

export default function Progress() {
  const { state, dispatch, todayKey } = useApp()
  const [weightInput, setWeightInput] = useState('')
  const [celebration, setCelebration] = useState(false)

  const entries = state.weightEntries
  const startWeight = entries[0]?.weight || state.profile.currentWeightKg
  const currentWeight = entries[entries.length - 1]?.weight || state.profile.currentWeightKg
  const totalLost = +(startWeight - currentWeight).toFixed(1)
  const weeksTracking = entries.length ? Math.ceil(entries.length / 7) : 0
  const toGoal = +(currentWeight - state.profile.goalWeightKg).toFixed(1)

  const handleLogWeight = () => {
    const w = parseFloat(weightInput)
    if (!w || w < 40 || w > 250) return
    const prev = currentWeight
    dispatch({ type: 'LOG_WEIGHT', payload: w })
    setWeightInput('')
    if (Math.floor(prev) !== Math.floor(w) && w < prev) {
      setCelebration(true)
      setTimeout(() => setCelebration(false), 2500)
    }
  }

  return (
    <PageTransition>
      <div className="py-2 flex flex-col gap-5">

        {/* Celebration overlay */}
        <AnimatePresence>
          {celebration && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
              <div className="text-center">
                <div className="text-7xl mb-3 animate-float">🎉</div>
                <p className="font-display font-black text-3xl text-gold-400">New Low!</p>
                <p className="text-white/60 mt-1">You crushed it</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Log weight */}
        <div className="rounded-2xl p-4 relative overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-3">Log Today's Weight</p>
          <div className="flex gap-3">
            <input
              type="number"
              step="0.1"
              placeholder={`e.g. ${currentWeight}`}
              value={weightInput}
              onChange={e => setWeightInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogWeight()}
              className="flex-1 px-4 py-3 rounded-xl text-white placeholder-white/25 text-sm font-medium outline-none focus:ring-1 focus:ring-gold-500/50"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={handleLogWeight}
              className="px-5 py-3 rounded-xl font-semibold text-sm text-navy-950"
              style={{ background: 'linear-gradient(135deg, #d97706, #fbbf24)' }}>
              Log
            </motion.button>
          </div>
          {entries.length > 0 && (
            <p className="text-white/30 text-xs mt-2">
              Last logged: {entries[entries.length - 1].weight} kg on {format(new Date(entries[entries.length - 1].date + 'T12:00:00'), 'MMM d')}
            </p>
          )}
        </div>

        {/* Key stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: TrendingDown, label: 'Total Lost', value: `${totalLost > 0 ? '-' : ''}${totalLost} kg`, color: '#84cc16' },
            { icon: Trophy, label: 'To Goal', value: `${toGoal > 0 ? toGoal : '0'} kg`, color: '#fbbf24' },
            { icon: Calendar, label: 'Weeks Tracking', value: `${weeksTracking}`, color: '#38bdf8' },
            { icon: Zap, label: 'Current Weight', value: `${currentWeight} kg`, color: '#f87171' },
          ].map(({ icon: Icon, label, value, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl p-4"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-center gap-2 mb-1">
                <Icon size={14} style={{ color }} />
                <span className="text-white/35 text-[11px] font-medium uppercase tracking-wider">{label}</span>
              </div>
              <div className="font-display font-bold text-xl" style={{ color }}>{value}</div>
            </motion.div>
          ))}
        </div>

        {/* Weight chart */}
        <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-3">Weight History</p>
          <WeightChart />
        </div>

        {/* Calorie history */}
        <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-white/40 text-xs uppercase tracking-widest font-semibold">7-Day Calories</p>
            <div className="flex items-center gap-3 text-[10px] text-white/30">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-lime-500 inline-block" />Under</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" />Over</span>
            </div>
          </div>
          <CalorieHistoryChart />
        </div>

        {/* Milestones */}
        <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-4">Milestones</p>
          <div className="flex flex-col gap-3">
            {MILESTONES.map((milestone, i) => {
              const reached = currentWeight <= milestone
              const progress = reached ? 1 : Math.max(0, (startWeight - currentWeight) / (startWeight - milestone))
              return (
                <div key={milestone} className="flex items-center gap-3">
                  <div className={`text-lg ${reached ? '' : 'grayscale opacity-40'}`}>
                    {reached ? '🏆' : '🎯'}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-xs font-semibold ${reached ? 'text-gold-400' : 'text-white/40'}`}>
                        {milestone} kg {reached ? '✓' : ''}
                      </span>
                      <span className="text-white/25 text-xs">{Math.round(progress * 100)}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: reached ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' : 'linear-gradient(90deg, #84cc16, #a3e635)' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress * 100}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
