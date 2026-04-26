import { useState } from 'react'
import { motion } from 'framer-motion'
import { PageTransition } from '../components/ui/PageTransition'
import { FoodSearch } from '../components/log/FoodSearch'
import { FoodLogList } from '../components/log/FoodLogList'
import { ExerciseLog } from '../components/log/ExerciseLog'

const TABS = ['Food', 'Exercise']

export default function FoodLog() {
  const [activeTab, setActiveTab] = useState('Food')

  return (
    <PageTransition>
      <div className="py-2">
        <p className="text-white/40 text-xs mb-5">
          {activeTab === 'Food' ? 'Search and log everything you eat today.' : 'Log workouts to see your net calorie burn.'}
        </p>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 p-1 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          {TABS.map(tab => (
            <motion.button
              key={tab}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all"
              style={activeTab === tab
                ? { background: 'rgba(251,191,36,0.18)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.35)' }
                : { color: 'rgba(255,255,255,0.35)' }}>
              {tab}
            </motion.button>
          ))}
        </div>

        {activeTab === 'Food' ? (
          <>
            {/* Today's food log */}
            <div className="rounded-2xl p-4 mb-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-3">Today's Log</p>
              <FoodLogList />
            </div>

            {/* Food search & add */}
            <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-3">Add Food</p>
              <FoodSearch />
            </div>
          </>
        ) : (
          <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-3">Log Exercise</p>
            <ExerciseLog />
          </div>
        )}
      </div>
    </PageTransition>
  )
}
