import { motion } from 'framer-motion'
import { MEAL_PLANS } from '../../data/mealPlans'
import { MealCard } from './MealCard'
import { useApp } from '../../context/AppContext'

const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1

const containerVariants = {
  animate: { transition: { staggerChildren: 0.1 } },
}

export function MealPlanDay() {
  const { state, dispatch } = useApp()
  const activeDay = state.activeMealPlanDay
  const plan = MEAL_PLANS[activeDay]

  return (
    <div>
      {/* Day selector */}
      <div className="flex justify-between gap-1 mb-5">
        {MEAL_PLANS.map((p, i) => {
          const isToday = i === todayIndex
          const isActive = i === activeDay
          return (
            <motion.button
              key={i}
              whileTap={{ scale: 0.9 }}
              onClick={() => dispatch({ type: 'SET_ACTIVE_DAY', payload: i })}
              className="flex flex-col items-center gap-1 flex-1 py-2 rounded-xl transition-all"
              style={isActive
                ? { background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.4)' }
                : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <span className={`text-[11px] font-semibold ${isActive ? 'text-gold-400' : 'text-white/40'}`}>
                {p.dayShort}
              </span>
              {isToday && <div className="w-1 h-1 rounded-full bg-gold-400" />}
            </motion.button>
          )
        })}
      </div>

      {/* Day header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display font-bold text-white text-xl">{plan.dayName}</h2>
          {activeDay === todayIndex && <span className="text-gold-400 text-xs font-semibold">Today</span>}
        </div>
        <div className="text-right">
          <div className="font-display font-bold text-gold-400 text-lg">{plan.totalCalories}</div>
          <div className="text-white/35 text-xs">kcal total</div>
        </div>
      </div>

      {/* Meal cards */}
      <motion.div className="flex flex-col gap-3" variants={containerVariants} animate="animate">
        {['breakfast', 'lunch', 'dinner'].map((slot) => (
          <MealCard key={slot} meal={plan.meals[slot]} slot={slot} dayIndex={activeDay} />
        ))}
      </motion.div>
    </div>
  )
}
