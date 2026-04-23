import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, Check } from 'lucide-react'
import { FOOD_DATABASE, FOOD_CATEGORIES } from '../../data/foodDatabase'
import { useApp } from '../../context/AppContext'

export function FoodSearch() {
  const { dispatch } = useApp()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [added, setAdded] = useState(null)

  const results = useMemo(() => {
    return FOOD_DATABASE.filter(f => {
      const matchCat = category === 'All' || f.category === category
      const matchQ = f.name.toLowerCase().includes(query.toLowerCase())
      return matchCat && matchQ
    }).slice(0, 10)
  }, [query, category])

  const handleAdd = (food) => {
    dispatch({ type: 'LOG_FOOD', payload: { ...food, logId: Date.now() } })
    setAdded(food.id)
    setTimeout(() => setAdded(null), 1500)
  }

  return (
    <div>
      {/* Search input */}
      <div className="relative mb-3">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          placeholder="Search food..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-3 rounded-xl text-white placeholder-white/25 text-sm font-medium outline-none focus:ring-1 focus:ring-gold-500/50"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
        />
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-3 scrollbar-none">
        {FOOD_CATEGORIES.map(cat => (
          <motion.button
            key={cat}
            whileTap={{ scale: 0.93 }}
            onClick={() => setCategory(cat)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={category === cat
              ? { background: 'rgba(251,191,36,0.18)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.35)' }
              : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {cat}
          </motion.button>
        ))}
      </div>

      {/* Results */}
      <AnimatePresence mode="popLayout">
        {results.map((food, i) => (
          <motion.div
            key={food.id}
            layout
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ delay: i * 0.04, type: 'spring', stiffness: 280, damping: 24 }}
            className="flex items-center gap-3 py-3 border-b"
            style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <span className="text-2xl w-8 text-center">{food.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-white/85 text-sm font-medium truncate">{food.name}</p>
              <p className="text-white/35 text-xs">
                {food.calories} kcal · P:{food.protein}g C:{food.carbs}g F:{food.fat}g
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => handleAdd(food)}
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
              style={added === food.id
                ? { background: 'rgba(132,204,22,0.2)', border: '1px solid rgba(132,204,22,0.4)' }
                : { background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)' }}>
              {added === food.id
                ? <Check size={14} className="text-lime-400" />
                : <Plus size={14} className="text-gold-400" />}
            </motion.button>
          </motion.div>
        ))}
      </AnimatePresence>

      {results.length === 0 && (
        <p className="text-center text-white/25 text-sm py-6">No foods found</p>
      )}
    </div>
  )
}
