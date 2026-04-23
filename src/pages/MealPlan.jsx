import { PageTransition } from '../components/ui/PageTransition'
import { MealPlanDay } from '../components/meals/MealPlanDay'

export default function MealPlan() {
  return (
    <PageTransition>
      <div className="py-2">
        <p className="text-white/40 text-xs mb-5 leading-relaxed">
          Your personalised <span className="text-gold-400 font-semibold">1,900 kcal</span> meal plan — 50% Ethiopian 🇪🇹 · 50% International 🌍
        </p>
        <MealPlanDay />
      </div>
    </PageTransition>
  )
}
