import { PageTransition } from '../components/ui/PageTransition'
import { MealPlanDay } from '../components/meals/MealPlanDay'
import { useApp } from '../context/AppContext'

export default function MealPlan() {
  const { profile, todayCalories } = useApp()
  const target = profile?.dailyCalorieTarget ?? 1900
  const dayTotal = todayCalories
  const pct = target > 0 ? Math.min(100, Math.round((dayTotal / target) * 100)) : 0
  const diff = Math.abs(dayTotal - target) / Math.max(target, 1)
  const barColor = diff <= 0.1 ? '#84cc16' : diff <= 0.3 ? '#f59e0b' : '#f87171'

  return (
    <PageTransition>
      <div className="py-2">
        <p className="text-white/40 text-xs mb-3 leading-relaxed">
          Your personalised <span className="text-gold-400 font-semibold">{target.toLocaleString()} kcal</span> meal plan — 50% Ethiopian 🇪🇹 · 50% International 🌍
        </p>

        <div className="rounded-2xl px-4 py-3 mb-5"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-white/40 text-[11px] uppercase tracking-widest font-semibold">Today vs Target</span>
            <span className="text-white/85 text-xs font-bold">
              {dayTotal} <span className="text-white/35 font-medium">/ {target} kcal</span>
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="h-full transition-all rounded-full"
              style={{ width: `${pct}%`, background: barColor }} />
          </div>
        </div>

        <MealPlanDay />
      </div>
    </PageTransition>
  )
}
