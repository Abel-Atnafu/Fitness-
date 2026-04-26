import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, addDays } from 'date-fns'
import { TrendingDown, Trophy, Calendar, Scale, Target } from 'lucide-react'
import { PageTransition } from '../components/ui/PageTransition'
import { WeightChart } from '../components/progress/WeightChart'
import { CalorieHistoryChart } from '../components/progress/CalorieHistoryChart'
import { useApp } from '../context/AppContext'

const MILESTONES = [92, 90, 87, 85, 83, 80]

function getProjection(weightEntries, goalWeightKg) {
  if (weightEntries.length < 3) return null
  const sorted = [...weightEntries].sort((a, b) => a.date.localeCompare(b.date))
  const first = sorted[0], last = sorted[sorted.length - 1]
  const daysDiff = (new Date(last.date) - new Date(first.date)) / 86400000
  if (daysDiff < 1) return null
  const dailyRate = (last.weight - first.weight) / daysDiff
  if (dailyRate >= 0) return { trending: 'up', rate: dailyRate }
  const daysLeft = (last.weight - goalWeightKg) / Math.abs(dailyRate)
  if (daysLeft < 0) return { trending: 'reached' }
  return {
    trending: 'down',
    rate: dailyRate,
    weeklyRate: dailyRate * 7,
    projectedDate: addDays(new Date(), Math.round(daysLeft)),
  }
}

function StatCard({ icon: Icon, label, value, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-2xl p-4"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} style={{ color }} />
        <span className="text-white/35 text-[10px] font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <div className="font-display font-black text-xl" style={{ color }}>{value}</div>
    </motion.div>
  )
}

export default function Progress() {
  const { weightEntries, profile, logWeight, todayKey } = useApp()
  const [weightInput, setWeightInput] = useState('')
  const [celebration, setCelebration] = useState(false)

  const projection = getProjection(weightEntries, profile?.goalWeightKg ?? 80)
  const startWeight = weightEntries[0]?.weight ?? profile?.currentWeightKg ?? 95
  const currentWeight = weightEntries[weightEntries.length - 1]?.weight ?? profile?.currentWeightKg ?? 95
  const lost = +(startWeight - currentWeight).toFixed(1)
  const toGoal = +(currentWeight - (profile?.goalWeightKg ?? 80)).toFixed(1)
  const weeksTracking = Math.ceil(weightEntries.length / 7) || 0
  const lastEntry = weightEntries[weightEntries.length - 1]

  const handleLog = () => {
    const w = parseFloat(weightInput)
    if (!w || w < 40 || w > 300) return
    const prevFloor = Math.floor(currentWeight)
    logWeight(w)
    setWeightInput('')
    if (Math.floor(w) < prevFloor) {
      setCelebration(true)
      setTimeout(() => setCelebration(false), 2800)
    }
  }

  return (
    <PageTransition>
      <div className="py-2 flex flex-col gap-5">

        {/* Celebration */}
        <AnimatePresence>
          {celebration && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
              style={{ background: 'rgba(6,11,24,0.5)', backdropFilter: 'blur(4px)' }}>
              <motion.div
                initial={{ scale: 0.5, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="text-center">
                <div className="text-7xl mb-3 animate-float">🎉</div>
                <p className="font-display font-black text-4xl text-gold-400">New Low!</p>
                <p className="text-white/50 mt-2 text-lg">You're crushing it</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Log weight */}
        <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-white/35 text-[11px] uppercase tracking-widest font-semibold mb-3">Log Today's Weight</p>
          <div className="flex gap-3">
            <input
              type="number"
              step="0.1"
              placeholder={`e.g. ${currentWeight}`}
              value={weightInput}
              onChange={e => setWeightInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLog()}
              className="flex-1 px-4 py-3 rounded-xl text-white placeholder-white/20 text-sm font-medium outline-none"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
              onFocus={e => e.target.style.borderColor = 'rgba(251,191,36,0.4)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={handleLog}
              className="px-6 py-3 rounded-xl font-bold text-sm text-navy-950"
              style={{ background: 'linear-gradient(135deg, #d97706, #fbbf24)' }}>
              Log
            </motion.button>
          </div>
          {lastEntry && (
            <p className="text-white/25 text-xs mt-2.5">
              Last: {lastEntry.weight} kg on {format(new Date(lastEntry.date + 'T12:00:00'), 'MMM d')}
            </p>
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={TrendingDown} label="Total Lost" value={`${lost > 0 ? '-' : ''}${lost} kg`} color="#84cc16" delay={0.05} />
          <StatCard icon={Trophy} label="To Goal" value={`${Math.max(toGoal, 0)} kg`} color="#fbbf24" delay={0.1} />
          <StatCard icon={Calendar} label="Weeks Tracking" value={weeksTracking} color="#38bdf8" delay={0.15} />
          <StatCard icon={Scale} label="Current" value={`${currentWeight} kg`} color="#f87171" delay={0.2} />
        </div>

        {/* Weight chart */}
        <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-white/30 text-[11px] uppercase tracking-widest font-semibold mb-4">Weight History</p>
          <WeightChart />
        </div>

        {/* Projected goal date */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl p-4"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-2 mb-3">
            <Target size={13} style={{ color: '#fbbf24' }} />
            <p className="text-white/30 text-[11px] uppercase tracking-widest font-semibold">Projected Goal Date</p>
          </div>
          {!projection ? (
            <p className="text-white/35 text-sm">Log at least 3 weigh-ins to see your projected goal date.</p>
          ) : projection.trending === 'reached' ? (
            <p className="text-lime-400 text-sm font-semibold">You've already reached your goal weight! 🎉</p>
          ) : projection.trending === 'up' ? (
            <p className="text-red-400/80 text-sm">Your weight is trending upward — stay on track with your calorie target.</p>
          ) : (
            <div>
              <p className="text-white/70 text-sm">
                At your current pace, you'll reach{' '}
                <span className="text-amber-400 font-semibold">{profile?.goalWeightKg ?? 80} kg</span>
                {' '}by{' '}
                <span className="text-white font-semibold">{format(projection.projectedDate, 'MMMM d, yyyy')}</span>
              </p>
              <p className="text-white/30 text-xs mt-1.5">
                Rate: <span className="text-lime-400/80">{Math.abs(projection.weeklyRate).toFixed(2)} kg/week</span>
              </p>
            </div>
          )}
        </motion.div>

        {/* 7-day calorie chart */}
        <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-white/30 text-[11px] uppercase tracking-widest font-semibold">7-Day Calories</p>
            <div className="flex items-center gap-3 text-[10px] text-white/25">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-lime-500 inline-block" />Under</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" />Over</span>
            </div>
          </div>
          <CalorieHistoryChart />
        </div>

        {/* Milestones */}
        <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-white/30 text-[11px] uppercase tracking-widest font-semibold mb-4">Milestones</p>
          <div className="flex flex-col gap-4">
            {MILESTONES.map((m, i) => {
              const reached = currentWeight <= m
              const progress = reached ? 1 : Math.max(0, (startWeight - currentWeight) / Math.max(startWeight - m, 0.01))
              return (
                <div key={m} className="flex items-center gap-3">
                  <span className={`text-lg ${reached ? '' : 'opacity-30'}`}>{reached ? '🏆' : '🎯'}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className={`text-xs font-semibold ${reached ? 'text-gold-400' : 'text-white/35'}`}>
                        {m} kg {reached && '✓'}
                      </span>
                      <span className="text-white/20 text-[10px]">{Math.round(Math.min(progress, 1) * 100)}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: reached ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' : 'linear-gradient(90deg, #84cc16, #a3e635)' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(progress, 1) * 100}%` }}
                        transition={{ duration: 0.8, delay: i * 0.08 }}
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
