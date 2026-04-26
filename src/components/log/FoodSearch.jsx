import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, Check, ShieldAlert, ChevronDown, PenLine } from 'lucide-react'
import { FOOD_DATABASE, FOOD_CATEGORIES } from '../../data/foodDatabase'
import { useApp } from '../../context/AppContext'
import { isAllowed } from '../../utils/dietary'

const SERVING_CHIPS = [0.5, 1, 1.5, 2]

export function FoodSearch() {
  const { logFood, profile } = useApp()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [showFiltered, setShowFiltered] = useState(false)
  const [portioning, setPortioning] = useState(null) // { food, servings }
  const [showCustom, setShowCustom] = useState(false)
  const [customFood, setCustomFood] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '', category: 'Other' })
  const [customAdded, setCustomAdded] = useState(false)

  const prefs = {
    allergies: profile?.allergies ?? [],
    dietaryPreferences: profile?.dietaryPreferences ?? [],
  }
  const hasPrefs = prefs.allergies.length > 0 || prefs.dietaryPreferences.length > 0

  const filteredOut = useMemo(() => {
    if (!hasPrefs) return 0
    return FOOD_DATABASE.filter(f => !isAllowed(f, prefs)).length
  }, [hasPrefs, prefs.allergies.join('|'), prefs.dietaryPreferences.join('|')])

  const results = useMemo(() => {
    return FOOD_DATABASE.filter(f => {
      const matchCat = category === 'All' || f.category === category
      const matchQ = f.name.toLowerCase().includes(query.toLowerCase())
      const matchPrefs = showFiltered || !hasPrefs || isAllowed(f, prefs)
      return matchCat && matchQ && matchPrefs
    }).slice(0, 12)
  }, [query, category, showFiltered, hasPrefs, prefs.allergies.join('|'), prefs.dietaryPreferences.join('|')])

  const handlePlusClick = (food) => {
    if (portioning?.food?.id === food.id) {
      setPortioning(null)
    } else {
      setPortioning({ food, servings: 1 })
    }
  }

  const handleLogPortioned = () => {
    if (!portioning) return
    const { food, servings } = portioning
    const s = parseFloat(servings) || 1
    logFood({
      name: food.name,
      calories: Math.round(food.calories * s),
      protein: +(food.protein * s).toFixed(1),
      carbs: +(food.carbs * s).toFixed(1),
      fat: +(food.fat * s).toFixed(1),
      emoji: food.emoji,
      category: food.category,
    })
    setPortioning(null)
  }

  const handleCustomSubmit = (e) => {
    e.preventDefault()
    const cal = parseInt(customFood.calories)
    if (!customFood.name.trim() || !cal) return
    logFood({
      name: customFood.name.trim(),
      calories: cal,
      protein: parseFloat(customFood.protein) || 0,
      carbs: parseFloat(customFood.carbs) || 0,
      fat: parseFloat(customFood.fat) || 0,
      emoji: '🍽️',
      category: customFood.category || 'Other',
    })
    setCustomAdded(true)
    setCustomFood({ name: '', calories: '', protein: '', carbs: '', fat: '', category: 'Other' })
    setTimeout(() => { setCustomAdded(false); setShowCustom(false) }, 1400)
  }

  const inputStyle = {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.09)',
  }

  return (
    <div>
      {/* Search row + Custom toggle */}
      <div className="flex gap-2 mb-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
          <input
            type="text"
            placeholder="Search food..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-white/22 text-sm font-medium outline-none transition-all"
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = 'rgba(251,191,36,0.4)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.09)'}
          />
        </div>
        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={() => { setShowCustom(s => !s); setPortioning(null) }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold flex-shrink-0"
          style={showCustom
            ? { background: 'rgba(251,191,36,0.18)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.35)' }
            : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.09)' }}>
          <PenLine size={13} />
          Custom
        </motion.button>
      </div>

      {/* Custom food form */}
      <AnimatePresence>
        {showCustom && (
          <motion.div
            key="custom-form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-3">
            <form onSubmit={handleCustomSubmit} className="rounded-2xl p-4 space-y-3" style={{ background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.18)' }}>
              <p className="text-xs font-semibold text-amber-400/80 mb-1">Custom food entry</p>
              <input
                type="text"
                placeholder="Food name *"
                value={customFood.name}
                onChange={e => setCustomFood(f => ({ ...f, name: e.target.value }))}
                required
                className="w-full px-3 py-2.5 rounded-xl text-white placeholder-white/25 text-sm outline-none"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(251,191,36,0.4)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.09)'}
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Calories *"
                  value={customFood.calories}
                  onChange={e => setCustomFood(f => ({ ...f, calories: e.target.value }))}
                  required
                  min="0"
                  className="px-3 py-2.5 rounded-xl text-white placeholder-white/25 text-sm outline-none"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'rgba(251,191,36,0.4)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.09)'}
                />
                <select
                  value={customFood.category}
                  onChange={e => setCustomFood(f => ({ ...f, category: e.target.value }))}
                  className="px-3 py-2.5 rounded-xl text-white text-sm outline-none"
                  style={{ ...inputStyle, color: 'rgba(255,255,255,0.7)' }}>
                  {['Ethiopian', 'Foreign', 'Fruits & Veg', 'Snacks', 'Drink', 'Supplement', 'Other'].map(c => (
                    <option key={c} value={c} style={{ background: '#1a1a2e' }}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[['protein', 'Protein g'], ['carbs', 'Carbs g'], ['fat', 'Fat g']].map(([key, ph]) => (
                  <input
                    key={key}
                    type="number"
                    placeholder={ph}
                    value={customFood[key]}
                    onChange={e => setCustomFood(f => ({ ...f, [key]: e.target.value }))}
                    min="0"
                    step="0.1"
                    className="px-3 py-2.5 rounded-xl text-white placeholder-white/25 text-sm outline-none"
                    style={inputStyle}
                    onFocus={ev => ev.target.style.borderColor = 'rgba(251,191,36,0.4)'}
                    onBlur={ev => ev.target.style.borderColor = 'rgba(255,255,255,0.09)'}
                  />
                ))}
              </div>
              <motion.button
                whileTap={{ scale: 0.96 }}
                type="submit"
                className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                style={customAdded
                  ? { background: 'rgba(132,204,22,0.18)', color: '#84cc16', border: '1px solid rgba(132,204,22,0.35)' }
                  : { background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' }}>
                {customAdded ? <><Check size={14} /> Logged!</> : <><Plus size={14} /> Log custom food</>}
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter banner */}
      {hasPrefs && filteredOut > 0 && (
        <button
          type="button"
          onClick={() => setShowFiltered(s => !s)}
          className="w-full flex items-center gap-2 mb-3 px-3 py-2 rounded-xl text-[11px] font-medium text-left"
          style={{
            background: showFiltered ? 'rgba(248,113,113,0.08)' : 'rgba(132,204,22,0.08)',
            border: `1px solid ${showFiltered ? 'rgba(248,113,113,0.22)' : 'rgba(132,204,22,0.22)'}`,
            color: showFiltered ? '#f87171' : '#84cc16',
          }}>
          <ShieldAlert size={12} className="flex-shrink-0" />
          <span className="flex-1">
            {showFiltered
              ? `Showing all foods, including ${filteredOut} that conflict with your preferences`
              : `Hiding ${filteredOut} ${filteredOut === 1 ? 'food' : 'foods'} that conflict with your preferences`}
          </span>
          <span className="text-[10px] opacity-70">{showFiltered ? 'Hide them' : 'Show all'}</span>
        </button>
      )}

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
              <button
                onClick={() => { setShowCustom(true); setPortioning(null) }}
                className="mt-2 text-amber-400/70 text-xs underline underline-offset-2">
                Add a custom food instead
              </button>
            </motion.div>
          ) : results.map((food, i) => (
            <motion.div key={food.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.03 }}>
              {/* Food row */}
              <div
                className="flex items-center gap-3 px-4 py-3"
                style={{ borderBottom: (portioning?.food?.id === food.id || i < results.length - 1) ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <span className="text-xl w-7 text-center flex-shrink-0">{food.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white/85 text-sm font-medium truncate">{food.name}</p>
                  <p className="text-white/30 text-[11px]">
                    {food.calories} kcal · P {food.protein}g · C {food.carbs}g · F {food.fat}g
                  </p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => handlePlusClick(food)}
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                  style={portioning?.food?.id === food.id
                    ? { background: 'rgba(251,191,36,0.18)', border: '1px solid rgba(251,191,36,0.4)' }
                    : { background: 'rgba(251,191,36,0.13)', border: '1px solid rgba(251,191,36,0.28)' }}>
                  {portioning?.food?.id === food.id
                    ? <ChevronDown size={13} className="text-amber-400" />
                    : <Plus size={13} className="text-amber-400" />}
                </motion.button>
              </div>

              {/* Portion panel */}
              <AnimatePresence>
                {portioning?.food?.id === food.id && (
                  <motion.div
                    key="portion"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden px-4 pb-3"
                    style={{ background: 'rgba(251,191,36,0.04)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <p className="text-[11px] text-white/40 mb-2 pt-2">Serving size</p>
                    <div className="flex items-center gap-2 mb-3">
                      {SERVING_CHIPS.map(s => (
                        <motion.button
                          key={s}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setPortioning(p => ({ ...p, servings: s }))}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                          style={(parseFloat(portioning.servings) === s)
                            ? { background: 'rgba(251,191,36,0.22)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.45)' }
                            : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.09)' }}>
                          {s}×
                        </motion.button>
                      ))}
                      <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={portioning.servings}
                        onChange={e => setPortioning(p => ({ ...p, servings: e.target.value }))}
                        className="w-16 px-2 py-1.5 rounded-lg text-xs text-white outline-none text-center"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-xs text-white/50 flex-1">
                        → <span className="text-white/80 font-semibold">{Math.round(food.calories * (parseFloat(portioning.servings) || 1))} kcal</span>
                        {' '}· P {+(food.protein * (parseFloat(portioning.servings) || 1)).toFixed(1)}g
                        · C {+(food.carbs * (parseFloat(portioning.servings) || 1)).toFixed(1)}g
                        · F {+(food.fat * (parseFloat(portioning.servings) || 1)).toFixed(1)}g
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setPortioning(null)}
                          className="px-2 py-1.5 rounded-lg text-xs text-white/35">
                          Cancel
                        </button>
                        <motion.button
                          whileTap={{ scale: 0.93 }}
                          onClick={handleLogPortioned}
                          className="px-4 py-1.5 rounded-lg text-xs font-semibold"
                          style={{ background: 'rgba(251,191,36,0.18)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.35)' }}>
                          Log
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
