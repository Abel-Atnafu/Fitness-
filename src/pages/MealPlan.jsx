import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, X, Check } from 'lucide-react'
import { PageTransition } from '../components/ui/PageTransition'
import { MealPlanDay } from '../components/meals/MealPlanDay'

// ─── Ingredient mapping ────────────────────────────────────────────────────────

const MEAL_INGREDIENTS = {
  // Ethiopian breakfasts
  'Firfir': ['Injera', 'Berbere', 'Niter Kibbeh', 'Onions'],
  'Sambusa': ['Sambusa Wrappers', 'Lentils', 'Onions', 'Jalapeños', 'Cooking Oil'],
  'Genfo': ['Barley Flour', 'Niter Kibbeh', 'Berbere'],
  'Foul': ['Fava Beans', 'Berbere', 'Niter Kibbeh', 'Onions'],
  // International breakfasts
  'Scrambled Eggs': ['Eggs', 'Whole Wheat Bread', 'Butter', 'Salt'],
  'Scrambled Eggs + Toast': ['Eggs', 'Whole Wheat Bread', 'Butter', 'Salt'],
  'Banana PB Smoothie': ['Banana', 'Peanut Butter', 'Whole Milk'],
  'Pancakes': ['Flour', 'Eggs', 'Milk', 'Butter', 'Honey'],
  'Greek Yogurt + Fruit': ['Greek Yogurt', 'Mango', 'Banana', 'Strawberries'],
  'Oatmeal + Banana': ['Rolled Oats', 'Banana', 'Peanut Butter', 'Milk'],
  // Ethiopian lunches
  'Shiro Wot + Injera': ['Injera', 'Chickpea Flour', 'Berbere', 'Niter Kibbeh', 'Onions'],
  'Dulet': ['Tripe', 'Beef Liver', 'Lean Beef', 'Niter Kibbeh', 'Mitmita'],
  'Kitfo': ['Lean Ground Beef', 'Mitmita', 'Niter Kibbeh', 'Injera'],
  'Tibs': ['Beef', 'Onions', 'Tomatoes', 'Berbere', 'Niter Kibbeh'],
  'Doro Wot': ['Chicken', 'Eggs', 'Berbere', 'Niter Kibbeh', 'Onions'],
  'Misir Wot': ['Red Lentils', 'Berbere', 'Niter Kibbeh', 'Onions', 'Injera'],
  // International lunches
  'Chicken + Avo Salad': ['Chicken Breast', 'Avocado', 'Mixed Greens', 'Lemon', 'Olive Oil'],
  'Chicken Caesar Wrap': ['Chicken Breast', 'Romaine Lettuce', 'Caesar Dressing', 'Flour Tortilla'],
  'Dal + Rice': ['Red Lentils', 'White Rice', 'Tomatoes', 'Cumin', 'Garlic'],
  'Vegetable Curry + Rice': ['Mixed Vegetables', 'Coconut Milk', 'Curry Powder', 'White Rice'],
  // Ethiopian dinners
  'Zilzil Tibs': ['Beef', 'Onions', 'Jalapeños', 'Niter Kibbeh', 'Injera'],
  'Beyaynetu': ['Injera', 'Red Lentils', 'Chickpea Flour', 'Spinach', 'Berbere'],
  // International dinners
  'Grilled Fish + Rice': ['Fish Fillet', 'White Rice', 'Lemon', 'Herbs', 'Olive Oil'],
  'Pasta + Chicken': ['Pasta', 'Chicken Breast', 'Tomato Sauce', 'Garlic', 'Parmesan'],
  'Beef Stir-Fry': ['Beef Strips', 'Bell Peppers', 'Broccoli', 'Soy Sauce', 'Garlic', 'White Rice'],
  'Salmon + Veggies': ['Salmon Fillet', 'Broccoli', 'Olive Oil', 'Garlic', 'Lemon'],
}

const CATEGORY_MAP = {
  // Proteins
  'Eggs': 'Proteins', 'Chicken Breast': 'Proteins', 'Beef': 'Proteins',
  'Lean Ground Beef': 'Proteins', 'Beef Strips': 'Proteins', 'Salmon Fillet': 'Proteins',
  'Fish Fillet': 'Proteins', 'Tripe': 'Proteins', 'Beef Liver': 'Proteins',
  'Lean Beef': 'Proteins', 'Chicken': 'Proteins', 'Greek Yogurt': 'Dairy & Fats',
  // Grains & Starches
  'Injera': 'Grains & Starches', 'Whole Wheat Bread': 'Grains & Starches',
  'White Rice': 'Grains & Starches', 'Rolled Oats': 'Grains & Starches',
  'Flour Tortilla': 'Grains & Starches', 'Pasta': 'Grains & Starches',
  'Barley Flour': 'Grains & Starches', 'Flour': 'Grains & Starches',
  'Chickpea Flour': 'Grains & Starches', 'Sambusa Wrappers': 'Grains & Starches',
  // Vegetables
  'Onions': 'Vegetables', 'Tomatoes': 'Vegetables', 'Mixed Greens': 'Vegetables',
  'Romaine Lettuce': 'Vegetables', 'Avocado': 'Vegetables', 'Broccoli': 'Vegetables',
  'Bell Peppers': 'Vegetables', 'Mixed Vegetables': 'Vegetables', 'Spinach': 'Vegetables',
  'Jalapeños': 'Vegetables', 'Garlic': 'Vegetables',
  // Fruits
  'Banana': 'Fruits & Extras', 'Mango': 'Fruits & Extras', 'Strawberries': 'Fruits & Extras',
  'Lemon': 'Fruits & Extras', 'Fava Beans': 'Fruits & Extras', 'Red Lentils': 'Fruits & Extras',
  'Lentils': 'Fruits & Extras',
  // Dairy & Fats
  'Butter': 'Dairy & Fats', 'Whole Milk': 'Dairy & Fats', 'Milk': 'Dairy & Fats',
  'Olive Oil': 'Dairy & Fats', 'Cooking Oil': 'Dairy & Fats', 'Peanut Butter': 'Dairy & Fats',
  'Niter Kibbeh': 'Dairy & Fats', 'Coconut Milk': 'Dairy & Fats',
  'Caesar Dressing': 'Dairy & Fats', 'Parmesan': 'Dairy & Fats',
  // Spices & Seasonings
  'Berbere': 'Spices & Seasonings', 'Mitmita': 'Spices & Seasonings',
  'Salt': 'Spices & Seasonings', 'Cumin': 'Spices & Seasonings',
  'Curry Powder': 'Spices & Seasonings', 'Soy Sauce': 'Spices & Seasonings',
  'Herbs': 'Spices & Seasonings', 'Honey': 'Spices & Seasonings',
  'Tomato Sauce': 'Spices & Seasonings',
}

const CATEGORY_ORDER = ['Proteins', 'Grains & Starches', 'Vegetables', 'Fruits & Extras', 'Dairy & Fats', 'Spices & Seasonings']

function getIngredientCategory(item) {
  return CATEGORY_MAP[item] ?? 'Fruits & Extras'
}

function buildShoppingList() {
  // Aggregate all unique ingredients from all mapped meals
  const all = new Set()
  Object.values(MEAL_INGREDIENTS).forEach(items => items.forEach(i => all.add(i)))
  const grouped = {}
  CATEGORY_ORDER.forEach(cat => { grouped[cat] = [] })
  all.forEach(item => {
    const cat = getIngredientCategory(item)
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(item)
  })
  // Sort each category alphabetically
  Object.keys(grouped).forEach(cat => grouped[cat].sort())
  return grouped
}

const SHOPPING_LIST = buildShoppingList()
const LS_KEY = 'fitethio-shopping-list'

function ShoppingListModal({ onClose }) {
  const [checked, setChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY) ?? '{}') } catch { return {} }
  })

  const toggle = (item) => {
    setChecked(prev => {
      const next = { ...prev, [item]: !prev[item] }
      localStorage.setItem(LS_KEY, JSON.stringify(next))
      return next
    })
  }

  const clearAll = () => {
    setChecked({})
    localStorage.removeItem(LS_KEY)
  }

  const totalItems = Object.values(SHOPPING_LIST).reduce((s, arr) => s + arr.length, 0)
  const checkedCount = Object.values(checked).filter(Boolean).length

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(6,11,24,0.8)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-[448px] rounded-t-3xl flex flex-col"
        style={{ background: '#0d1526', border: '1px solid rgba(255,255,255,0.1)', maxHeight: '85vh' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div>
            <h2 className="font-display font-bold text-xl text-white">Weekly Shopping List</h2>
            <p className="text-white/35 text-xs mt-0.5">{checkedCount} of {totalItems} items in cart</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={clearAll}
              className="text-white/35 text-xs px-3 py-1.5 rounded-lg font-medium"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}>
              Clear All
            </button>
            <button onClick={onClose}
              className="p-2 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.07)' }}>
              <X size={16} className="text-white/60" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1 px-5 py-4 flex flex-col gap-5">
          {CATEGORY_ORDER.map(cat => {
            const items = SHOPPING_LIST[cat]
            if (!items || items.length === 0) return null
            return (
              <div key={cat}>
                <p className="text-white/30 text-[10px] uppercase tracking-widest font-semibold mb-2">{cat}</p>
                <div className="flex flex-col gap-1.5">
                  {items.map(item => {
                    const isChecked = !!checked[item]
                    return (
                      <button key={item}
                        onClick={() => toggle(item)}
                        className="flex items-center gap-3 py-2.5 px-3 rounded-xl text-left transition-all active:opacity-70"
                        style={{
                          background: isChecked ? 'rgba(132,204,22,0.06)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${isChecked ? 'rgba(132,204,22,0.2)' : 'rgba(255,255,255,0.06)'}`,
                        }}>
                        <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                          style={{
                            background: isChecked ? 'rgba(132,204,22,0.3)' : 'rgba(255,255,255,0.07)',
                            border: `1px solid ${isChecked ? '#84cc16' : 'rgba(255,255,255,0.15)'}`,
                          }}>
                          {isChecked && <Check size={11} className="text-lime-400" strokeWidth={3} />}
                        </div>
                        <span className={`text-sm font-medium transition-all ${isChecked ? 'text-white/35 line-through' : 'text-white/80'}`}>
                          {item}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function MealPlan() {
  const [showShopping, setShowShopping] = useState(false)

  return (
    <PageTransition>
      <div className="py-2">
        <div className="flex items-start justify-between mb-5">
          <p className="text-white/40 text-xs leading-relaxed flex-1 mr-3">
            Your personalised <span className="text-gold-400 font-semibold">1,900 kcal</span> meal plan — 50% Ethiopian 🇪🇹 · 50% International 🌍
          </p>
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={() => setShowShopping(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold flex-shrink-0"
            style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.25)', color: '#fbbf24' }}>
            <ShoppingCart size={13} />
            Shop
          </motion.button>
        </div>
        <MealPlanDay />
      </div>

      <AnimatePresence>
        {showShopping && <ShoppingListModal onClose={() => setShowShopping(false)} />}
      </AnimatePresence>
    </PageTransition>
  )
}
