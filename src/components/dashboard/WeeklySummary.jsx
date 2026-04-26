import { motion } from 'framer-motion'
import { format, subDays } from 'date-fns'
import { useApp } from '../../context/AppContext'

export function WeeklySummary() {
  const { recentHistory, profile } = useApp()
  const target = profile?.dailyCalorieTarget ?? 1900

  const last7 = Array.from({ length: 7 }, (_, i) =>
    format(subDays(new Date(), i), 'yyyy-MM-dd')
  )

  let daysLogged = 0
  let daysOnTarget = 0
  let totalCals = 0

  last7.forEach(d => {
    const entry = recentHistory.find(h => h.date === d)
    const cals = entry?.totalCalories ?? 0
    if (cals > 0) {
      daysLogged++
      totalCals += cals
      if (cals <= target) daysOnTarget++
    }
  })

  const avgCals = daysLogged > 0 ? Math.round(totalCals / daysLogged) : 0
  const compliancePct = Math.round((daysOnTarget / 7) * 100)

  if (daysLogged === 0) return null

  const barColor = daysOnTarget >= 5 ? '#84cc16' : daysOnTarget >= 3 ? '#f59e0b' : '#f87171'
  const message = daysOnTarget >= 6 ? 'Excellent week! 🔥'
    : daysOnTarget >= 4 ? 'Solid effort 💪'
    : daysOnTarget >= 2 ? 'Keep pushing 📈'
    : 'Needs improvement'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18 }}
      className="rounded-2xl p-4"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-white/35 text-[10px] uppercase tracking-widest font-semibold">This Week</p>
        <span className="text-xs font-semibold" style={{ color: barColor }}>{message}</span>
      </div>

      {/* Day dots */}
      <div className="flex gap-1.5 mb-3">
        {last7.slice().reverse().map((d, i) => {
          const entry = recentHistory.find(h => h.date === d)
          const cals = entry?.totalCalories ?? 0
          const onTarget = cals > 0 && cals <= target
          const logged = cals > 0
          const isToday = i === 6
          return (
            <div key={d} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full h-1.5 rounded-full"
                style={{
                  background: onTarget ? '#84cc16'
                    : logged ? '#f59e0b'
                    : 'rgba(255,255,255,0.08)',
                }}
              />
              <span className="text-[9px]" style={{ color: isToday ? '#fbbf24' : 'rgba(255,255,255,0.2)' }}>
                {format(new Date(d + 'T12:00:00'), 'EEE')[0]}
              </span>
            </div>
          )
        })}
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-between">
        <div className="text-center">
          <p className="font-display font-black text-lg" style={{ color: barColor }}>{daysOnTarget}<span className="text-white/30 font-normal text-xs">/7</span></p>
          <p className="text-white/30 text-[10px]">on target</p>
        </div>
        <div className="h-8 w-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
        <div className="text-center">
          <p className="font-display font-black text-lg text-white/80">{daysLogged}<span className="text-white/30 font-normal text-xs">/7</span></p>
          <p className="text-white/30 text-[10px]">days logged</p>
        </div>
        <div className="h-8 w-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
        <div className="text-center">
          <p className="font-display font-black text-lg text-white/80">{avgCals}</p>
          <p className="text-white/30 text-[10px]">avg kcal</p>
        </div>
      </div>
    </motion.div>
  )
}
