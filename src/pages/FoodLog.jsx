import { motion } from 'framer-motion'
import { PageTransition } from '../components/ui/PageTransition'
import { FoodSearch } from '../components/log/FoodSearch'
import { FoodLogList } from '../components/log/FoodLogList'

export default function FoodLog() {
  return (
    <PageTransition>
      <div className="py-2">
        <p className="text-white/40 text-xs mb-5">Search and log everything you eat today.</p>

        {/* Food log list first (today's progress) */}
        <div className="rounded-2xl p-4 mb-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-3">Today's Log</p>
          <FoodLogList />
        </div>

        {/* Search & add */}
        <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-3">Add Food</p>
          <FoodSearch />
        </div>
      </div>
    </PageTransition>
  )
}
