import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, Check } from 'lucide-react'
import { FOOD_DATABASE, FOOD_CATEGORIES } from '../../data/foodDatabase'
import { useApp } from '../../context/AppContext'

export function FoodSearch() {
  const { logFood } = useApp()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [added, setAdded] = useState(null)

  const results = useMemo(() => FOOD_DATABASE.filter(f => {
    const matchCat = category === 'All' || f.category === category
    const matchQ = f.name.toLowerCase().includes(query.toLowerCase())
    return matchCat && matchQ
  }).slice(0, 12), [query, category])

  const handleAdd = (food) => {
    logFood(food)
    setAdded(food.id)
    setTimeout(() => setAdded(null), 1400)
  }

  return (
    <div>
      {/* Search */}
      <div className="relative mb-3">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
        <input
          type="text"
          placeholder="Search food..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-white/22 text-sm font-medium outline-none transition-all"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}
          onFocus={e => e.target.style.borderColor = 'rgba(251,191,36,0.4)'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.09)'}
        />
      </div>

      {/* Category tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 mb-4 scrollbar-none">
        {FOOD_CATEGORIES.map(cat => (
          <motion.button
            key={cat}
            whileTap={{ scale: 0.93 }}
            onClick={() => setCategory(cat)}
            className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
            style={category === cat
              ? { background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' }
              : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.38)', border: '1px solid rgba(255,255,255,0.07)' }}>
            {cat}
          </motion.button>
        ))}
      </div>

      {/* Results */}
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
        <AnimatePresence mode="popLayout">
          {results.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-8 text-center">
              <p className="text-white/25 text-sm">No results for "{query}"</p>
            </motion.div>
          ) : results.map((food, i) => (
            <motion.div
              key={food.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-3 px-4 py-3"
              style={{ borderBottom: i < results.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <span className="text-xl w-7 text-center flex-shrink-0">{food.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white/85 text-sm font-medium truncate">{food.name}</p>
                <p className="text-white/30 text-[11px]">
                  {food.calories} kcal · P {food.protein}g · C {food.carbs}g · F {food.fat}g
                </p>
              </div>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => handleAdd(food)}
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                style={added === food.id
                  ? { background: 'rgba(132,204,22,0.18)', border: '1px solid rgba(132,204,22,0.35)' }
                  : { background: 'rgba(251,191,36,0.13)', border: '1px solid rgba(251,191,36,0.28)' }}>
                {added === food.id
                  ? <Check size={13} className="text-lime-400" />
                  : <Plus size={13} className="text-gold-400" />}
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
