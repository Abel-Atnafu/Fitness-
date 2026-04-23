import { motion } from 'framer-motion'
import { getHours } from 'date-fns'
import { PageTransition } from '../components/ui/PageTransition'
import { CalorieRing } from '../components/dashboard/CalorieRing'
import { StreakCard } from '../components/dashboard/StreakCard'
import { QuickStats } from '../components/dashboard/QuickStats'
import { MotivationalQuote } from '../components/dashboard/MotivationalQuote'
import { WeightChart } from '../components/progress/WeightChart'
import { useApp } from '../context/AppContext'

function getGreeting() {
  const h = getHours(new Date())
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

export default function Dashboard() {
  const { profile, weightEntries } = useApp()
  const name = profile?.name?.split(' ')[0] ?? 'there'
  const greeting = getGreeting()
  const startWeight = weightEntries[0]?.weight ?? profile?.currentWeightKg ?? 95
  const currentWeight = weightEntries[weightEntries.length - 1]?.weight ?? profile?.currentWeightKg ?? 95
  const lost = +(startWeight - currentWeight).toFixed(1)
  const toGoal = +(currentWeight - (profile?.goalWeightKg ?? 80)).toFixed(1)
  const dayNum = weightEntries.length ? Math.floor((Date.now() - new Date(weightEntries[0].date + 'T12:00:00').getTime()) / 86400000) + 1 : 1
  const goalProgress = Math.min(lost / Math.max(startWeight - (profile?.goalWeightKg ?? 80), 1), 1)

  return (
    <PageTransition>
      <div className="flex flex-col gap-5 py-2">

        {/* Greeting */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display font-black text-[26px] text-white leading-tight">
            {greeting}, {name} 👋
          </h1>
          <p className="text-white/35 text-sm mt-0.5">Day {dayNum} of your journey</p>
        </motion.div>

        {/* Weight milestone */}
        {lost > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.07 }}
            className="flex items-center gap-4 px-4 py-3.5 rounded-2xl"
            style={{ background: 'rgba(132,204,22,0.07)', border: '1px solid rgba(132,204,22,0.18)' }}>
            <span className="text-2xl">🎉</span>
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-lime-400 text-[17px] leading-none">-{lost} kg lost</p>
              <p className="text-white/35 text-xs mt-1">
                {toGoal > 0 ? `${toGoal} kg to reach your goal` : '🏆 Goal reached!'}
              </p>
            </div>
            {/* mini progress bar */}
            <div className="w-16">
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <motion.div className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #84cc16, #f59e0b)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${goalProgress * 100}%` }}
                  transition={{ duration: 1, delay: 0.3 }} />
              </div>
              <p className="text-white/25 text-[9px] text-right mt-0.5">{Math.round(goalProgress * 100)}%</p>
            </div>
          </motion.div>
        )}

        {/* Calorie ring hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 180 }}
          className="rounded-3xl p-6 relative overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
          <div className="absolute top-0 left-10 right-10 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.35), transparent)' }} />
          <p className="text-center text-white/30 text-[11px] uppercase tracking-widest font-semibold mb-5">Daily Calories</p>
          <CalorieRing />
        </motion.div>

        {/* Streak + Current Weight */}
        <div className="flex gap-3">
          <StreakCard />
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex-1 rounded-2xl p-4 relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-white/35 text-[10px] uppercase tracking-widest font-semibold mb-1.5">Weight</p>
            <div className="flex items-baseline gap-1">
              <span className="font-display font-black text-3xl text-white">{currentWeight}</span>
              <span className="text-white/40 text-sm font-medium">kg</span>
            </div>
            <p className="text-white/25 text-xs mt-1">Goal: {profile?.goalWeightKg ?? 80} kg</p>
          </motion.div>
        </div>

        {/* Quick stats */}
        <QuickStats />

        {/* Quote */}
        <MotivationalQuote />

        {/* Mini weight chart */}
        {weightEntries.length >= 2 && (
          <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-white/30 text-[11px] uppercase tracking-widest font-semibold mb-4">Weight Trend</p>
            <WeightChart />
          </div>
        )}
      </div>
    </PageTransition>
  )
}
