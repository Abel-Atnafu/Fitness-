import { motion } from 'framer-motion'
import { PageTransition } from '../components/ui/PageTransition'
import { CalorieRing } from '../components/dashboard/CalorieRing'
import { StreakCard } from '../components/dashboard/StreakCard'
import { QuickStats } from '../components/dashboard/QuickStats'
import { MotivationalQuote } from '../components/dashboard/MotivationalQuote'
import { WeightChart } from '../components/progress/WeightChart'
import { useApp } from '../context/AppContext'
import { getHours } from 'date-fns'

function getGreeting() {
  const h = getHours(new Date())
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function getDayNumber(weightEntries) {
  if (!weightEntries.length) return 1
  const first = weightEntries[0]?.date
  if (!first) return 1
  const diff = Math.floor((Date.now() - new Date(first).getTime()) / 86400000)
  return diff + 1
}

export default function Dashboard() {
  const { state } = useApp()
  const greeting = getGreeting()
  const dayNum = getDayNumber(state.weightEntries)
  const startWeight = state.weightEntries[0]?.weight || state.profile.currentWeightKg
  const currentW = state.weightEntries[state.weightEntries.length - 1]?.weight || state.profile.currentWeightKg
  const lost = +(startWeight - currentW).toFixed(1)
  const toGoal = +(currentW - state.profile.goalWeightKg).toFixed(1)

  return (
    <PageTransition>
      <div className="flex flex-col gap-5 py-2">

        {/* Greeting */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <h1 className="font-display font-bold text-2xl text-white">
            {greeting}, {state.profile.name} 👋
          </h1>
          <p className="text-white/40 text-sm mt-0.5">Day {dayNum} of your journey • You've got this!</p>
        </motion.div>

        {/* Weight progress mini bar */}
        {lost > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl"
            style={{ background: 'rgba(132,204,22,0.08)', border: '1px solid rgba(132,204,22,0.2)' }}>
            <span className="text-2xl">🎉</span>
            <div>
              <p className="font-display font-bold text-lime-400 text-base">-{lost} kg lost!</p>
              <p className="text-white/40 text-xs">{toGoal > 0 ? `${toGoal} kg to go` : 'Goal reached! 🏆'}</p>
            </div>
          </motion.div>
        )}

        {/* Calorie ring — hero element */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}>
          <div className="rounded-3xl p-6 w-full text-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))',
              border: '1px solid rgba(255,255,255,0.09)',
            }}>
            <div className="absolute top-0 left-8 right-8 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.4), transparent)' }} />
            <p className="text-white/35 text-xs uppercase tracking-widest font-semibold mb-4">Daily Calories</p>
            <CalorieRing />
          </div>
        </motion.div>

        {/* Streak + weight delta row */}
        <div className="flex gap-3">
          <StreakCard />
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex-1 rounded-2xl p-4 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
            <div className="text-white/40 text-xs uppercase tracking-widest font-medium mb-1">Current</div>
            <div className="font-display font-black text-3xl text-white">{currentW}<span className="text-lg font-bold text-white/50 ml-1">kg</span></div>
            <div className="text-white/30 text-xs mt-1">Goal: {state.profile.goalWeightKg} kg</div>
            <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #84cc16, #f59e0b)' }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(lost / (startWeight - state.profile.goalWeightKg) * 100, 100)}%` }}
                transition={{ duration: 1, delay: 0.4 }}
              />
            </div>
          </motion.div>
        </div>

        {/* Quick stats */}
        <QuickStats />

        {/* Quote */}
        <MotivationalQuote />

        {/* Mini weight chart */}
        {state.weightEntries.length >= 2 && (
          <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-3">Weight Trend</p>
            <WeightChart />
          </div>
        )}
      </div>
    </PageTransition>
  )
}
