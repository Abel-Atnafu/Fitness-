import { motion } from 'framer-motion'
import { MEAL_PLANS } from '../../data/mealPlans'
import { MealCard } from './MealCard'
import { useApp } from '../../context/AppContext'
import { getConflicts } from '../../utils/dietary'

const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1

export function MealPlanDay() {
  const { activeMealPlanDay, setActiveMealPlanDay, mealSwapIndices, profile } = useApp()
  const plan = MEAL_PLANS[activeMealPlanDay]
  const prefs = {
    allergies: profile?.allergies ?? [],
    dietaryPreferences: profile?.dietaryPreferences ?? [],
  }

  return (
    <div>
      {/* Day selector */}
      <div className="flex gap-1 mb-5">
        {MEAL_PLANS.map((p, i) => {
          const isToday = i === todayIndex
          const isActive = i === activeMealPlanDay
          return (
            <motion.button
              key={i}
              whileTap={{ scale: 0.88 }}
              onClick={() => setActiveMealPlanDay(i)}
              className="flex flex-col items-center gap-1 flex-1 py-2.5 rounded-xl transition-all"
              style={isActive
                ? { background: 'rgba(251,191,36,0.13)', border: '1px solid rgba(251,191,36,0.35)' }
                : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span className={`text-[11px] font-bold ${isActive ? 'text-gold-400' : 'text-white/35'}`}>
                {p.dayShort}
              </span>
              {isToday && <div className="w-1 h-1 rounded-full bg-gold-400" />}
            </motion.button>
          )
        })}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display font-bold text-white text-xl leading-none">{plan.dayName}</h2>
          {activeMealPlanDay === todayIndex && (
            <span className="text-gold-400 text-xs font-semibold">Today</span>
          )}
        </div>
        <div className="text-right">
          <div className="font-display font-black text-gold-400 text-xl">{plan.totalCalories}</div>
          <div className="text-white/30 text-[11px]">kcal total</div>
        </div>
      </div>

      {/* Cards — derive displayed meal from alternates pool via swap index.
          Pool is filtered by user prefs; if everything conflicts, fall back to
          the unfiltered pool and surface conflict reasons on the card. */}
      <div className="flex flex-col gap-3">
        {['breakfast', 'lunch', 'dinner'].map(slot => {
          const primary = plan.meals[slot]
          const fullPool = [primary, ...(primary.alternates ?? [])]
          const allowedPool = fullPool.filter(m => getConflicts(m, prefs).length === 0)
          const pool = allowedPool.length > 0 ? allowedPool : fullPool
          const swapKey = `${activeMealPlanDay}-${slot}`
          const swapIdx = mealSwapIndices[swapKey] ?? 0
          const { alternates: _dropped, ...meal } = pool[swapIdx % pool.length]
          const conflicts = getConflicts(meal, prefs)
          return (
            <MealCard
              key={slot}
              meal={meal}
              slot={slot}
              dayIndex={activeMealPlanDay}
              poolSize={pool.length}
              conflicts={conflicts}
            />
          )
        })}
      </div>
    </div>
  )
}
