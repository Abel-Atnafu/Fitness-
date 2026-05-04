import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { format, subDays } from 'date-fns'
import { PageTransition } from '../components/ui/PageTransition'
import { useApp } from '../context/AppContext'
import { ProgressRing } from '../components/ui/ProgressRing'

function buildAchievements({ currentStreak, weightEntries, recentHistory, todayLog, profile, bmi }) {
  const currentWeight = weightEntries[weightEntries.length - 1]?.weight ?? profile?.currentWeightKg ?? 0
  const startWeight = weightEntries[0]?.weight ?? profile?.currentWeightKg ?? 0
  const lost = Math.max(0, startWeight - currentWeight)
  const daysLogged = recentHistory.filter(h => h.totalCalories > 0).length

  // Count exercise entries in last 7 days
  const last7 = Array.from({ length: 7 }, (_, i) => format(subDays(new Date(), i), 'yyyy-MM-dd'))
  const exerciseDays = (todayLog.exerciseEntries ?? []).length > 0 ? 1 : 0

  return [
    // Streak milestones
    {
      id: 'streak-3', category: 'Streaks', emoji: '🔥', title: '3-Day Streak',
      desc: 'Log calories 3 days in a row', unlocked: currentStreak >= 3,
      progress: Math.min(currentStreak / 3, 1), progressLabel: `${currentStreak}/3 days`,
    },
    {
      id: 'streak-7', category: 'Streaks', emoji: '🗓️', title: 'Week Warrior',
      desc: 'Maintain a 7-day logging streak', unlocked: currentStreak >= 7,
      progress: Math.min(currentStreak / 7, 1), progressLabel: `${currentStreak}/7 days`,
    },
    {
      id: 'streak-30', category: 'Streaks', emoji: '🏅', title: 'Month Master',
      desc: '30 consecutive days logged', unlocked: currentStreak >= 30,
      progress: Math.min(currentStreak / 30, 1), progressLabel: `${currentStreak}/30 days`,
    },
    {
      id: 'streak-100', category: 'Streaks', emoji: '💎', title: 'Century Club',
      desc: '100 consecutive days', unlocked: currentStreak >= 100,
      progress: Math.min(currentStreak / 100, 1), progressLabel: `${currentStreak}/100 days`,
    },
    // Weight loss
    {
      id: 'lost-1', category: 'Weight Loss', emoji: '⚖️', title: 'First Kilo',
      desc: 'Lose your first kilogram', unlocked: lost >= 1,
      progress: Math.min(lost / 1, 1), progressLabel: `${lost.toFixed(1)}/1 kg`,
    },
    {
      id: 'lost-5', category: 'Weight Loss', emoji: '🌟', title: '5 kg Down',
      desc: 'Lose 5 kg from starting weight', unlocked: lost >= 5,
      progress: Math.min(lost / 5, 1), progressLabel: `${lost.toFixed(1)}/5 kg`,
    },
    {
      id: 'lost-10', category: 'Weight Loss', emoji: '🏆', title: '10 kg Down',
      desc: 'Incredible — 10 kg lost!', unlocked: lost >= 10,
      progress: Math.min(lost / 10, 1), progressLabel: `${lost.toFixed(1)}/10 kg`,
    },
    {
      id: 'goal-reached', category: 'Weight Loss', emoji: '🎯', title: 'Goal Reached',
      desc: 'Hit your target weight', unlocked: profile?.goalWeightKg && currentWeight <= profile.goalWeightKg,
      progress: profile?.goalWeightKg
        ? Math.min(Math.max(0, (startWeight - currentWeight) / Math.max(startWeight - profile.goalWeightKg, 0.1)), 1)
        : 0,
      progressLabel: `${currentWeight.toFixed(1)} / ${profile?.goalWeightKg ?? '?'} kg`,
    },
    // Logging
    {
      id: 'first-log', category: 'Logging', emoji: '📝', title: 'First Log',
      desc: 'Log your first meal', unlocked: daysLogged >= 1,
      progress: daysLogged >= 1 ? 1 : 0, progressLabel: daysLogged >= 1 ? 'Done!' : 'Not yet',
    },
    {
      id: 'log-7', category: 'Logging', emoji: '📊', title: '7 Days Logged',
      desc: 'Log food on 7 different days', unlocked: daysLogged >= 7,
      progress: Math.min(daysLogged / 7, 1), progressLabel: `${daysLogged}/7 days`,
    },
    {
      id: 'log-30', category: 'Logging', emoji: '📈', title: '30 Days Logged',
      desc: 'Log food on 30 different days', unlocked: daysLogged >= 30,
      progress: Math.min(daysLogged / 30, 1), progressLabel: `${daysLogged}/30 days`,
    },
    // Hydration
    {
      id: 'hydro-hero', category: 'Hydration', emoji: '💧', title: 'Hydration Hero',
      desc: 'Drink 8+ glasses in a day', unlocked: (todayLog.waterGlasses ?? 0) >= 8,
      progress: Math.min((todayLog.waterGlasses ?? 0) / 8, 1),
      progressLabel: `${todayLog.waterGlasses ?? 0}/8 glasses today`,
    },
    {
      id: 'water-logged', category: 'Hydration', emoji: '🌊', title: 'Logged Water',
      desc: 'Track your water intake', unlocked: (todayLog.waterGlasses ?? 0) > 0,
      progress: (todayLog.waterGlasses ?? 0) > 0 ? 1 : 0, progressLabel: `${todayLog.waterGlasses ?? 0} glasses`,
    },
    // Fitness
    {
      id: 'bmi-normal', category: 'Health', emoji: '💚', title: 'Healthy BMI',
      desc: 'Achieve a BMI under 25', unlocked: bmi > 0 && bmi < 25,
      progress: bmi >= 25 ? Math.max(0, 1 - (bmi - 25) / 10) : bmi > 0 ? 1 : 0,
      progressLabel: `BMI ${bmi}`,
    },
    {
      id: 'exercise-today', category: 'Fitness', emoji: '🏋️', title: 'Exercise Logged',
      desc: 'Log an exercise session', unlocked: (todayLog.exerciseEntries ?? []).length > 0,
      progress: (todayLog.exerciseEntries ?? []).length > 0 ? 1 : 0,
      progressLabel: `${(todayLog.exerciseEntries ?? []).length} sessions today`,
    },
  ]
}

const CATEGORY_COLORS = {
  Streaks: '#f97316',
  'Weight Loss': '#fbbf24',
  Logging: '#38bdf8',
  Hydration: '#38bdf8',
  Health: '#84cc16',
  Fitness: '#a78bfa',
}

export default function Achievements() {
  const { currentStreak, weightEntries, recentHistory, todayLog, profile, bmi } = useApp()

  const achievements = useMemo(() =>
    buildAchievements({ currentStreak, weightEntries, recentHistory, todayLog, profile, bmi }),
    [currentStreak, weightEntries, recentHistory, todayLog, profile, bmi]
  )

  const unlocked = achievements.filter(a => a.unlocked).length
  const total = achievements.length
  const pct = Math.round((unlocked / total) * 100)

  const categories = [...new Set(achievements.map(a => a.category))]

  return (
    <PageTransition>
      <div className="py-2 flex flex-col gap-5">

        {/* Summary ring */}
        <div className="rounded-2xl p-5 flex items-center gap-5"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <ProgressRing value={pct} size={72} stroke={6} color="#fbbf24" />
          <div>
            <h1 className="font-display font-black text-2xl text-white">{unlocked}<span className="text-white/30 font-medium text-lg">/{total}</span></h1>
            <p className="text-white/50 text-sm">Achievements Unlocked</p>
            <p className="text-gold-400 text-xs font-semibold mt-1">{pct}% complete</p>
          </div>
        </div>

        {/* Achievement categories */}
        {categories.map(cat => {
          const items = achievements.filter(a => a.category === cat)
          const color = CATEGORY_COLORS[cat] ?? '#fbbf24'
          return (
            <div key={cat}>
              <p className="text-white/35 text-[11px] uppercase tracking-widest font-semibold mb-3">{cat}</p>
              <div className="flex flex-col gap-2">
                {items.map((a, i) => (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-2xl p-4 flex items-center gap-3"
                    style={{
                      background: a.unlocked ? `${color}10` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${a.unlocked ? color + '30' : 'rgba(255,255,255,0.06)'}`,
                    }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl"
                      style={{
                        background: a.unlocked ? `${color}18` : 'rgba(255,255,255,0.05)',
                        opacity: a.unlocked ? 1 : 0.4,
                      }}>
                      {a.unlocked ? a.emoji : <Lock size={16} className="text-white/20" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${a.unlocked ? 'text-white' : 'text-white/35'}`}>{a.title}</p>
                      <p className="text-white/25 text-xs mt-0.5">{a.desc}</p>
                      {!a.unlocked && a.progress > 0 && (
                        <div className="mt-2">
                          <div className="flex justify-between text-[10px] text-white/25 mb-1">
                            <span>{a.progressLabel}</span>
                            <span>{Math.round(a.progress * 100)}%</span>
                          </div>
                          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                            <motion.div
                              className="h-full rounded-full"
                              style={{ background: color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${a.progress * 100}%` }}
                              transition={{ duration: 0.6, delay: i * 0.05 }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    {a.unlocked && (
                      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: `${color}20` }}>
                        <span className="text-[10px]">✓</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </PageTransition>
  )
}
