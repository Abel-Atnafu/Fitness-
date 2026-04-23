import { motion } from 'framer-motion'
import { MEAL_PLANS } from '../../data/mealPlans'
import { MealCard } from './MealCard'
import { useApp } from '../../context/AppContext'

const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1

export function MealPlanDay() {
  const { activeMealPlanDay, setActiveMealPlanDay } = useApp()
  const plan = MEAL_PLANS[activeMealPlanDay]

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

      {/* Cards */}
      <div className="flex flex-col gap-3">
        {['breakfast', 'lunch', 'dinner'].map(slot => (
          <MealCard key={slot} meal={plan.meals[slot]} slot={slot} dayIndex={activeMealPlanDay} />
        ))}
      </div>
    </div>
  )
}
