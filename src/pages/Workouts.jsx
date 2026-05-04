import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Play, CheckCircle2, Clock, Zap, Dumbbell } from 'lucide-react'
import { PageTransition } from '../components/ui/PageTransition'
import { workoutPlans } from '../data/workoutPlans'

const LEVEL_STYLE = {
  Beginner:     { bg: 'rgba(132,204,22,0.15)',  color: '#84cc16' },
  Intermediate: { bg: 'rgba(251,191,36,0.15)',  color: '#fbbf24' },
  Advanced:     { bg: 'rgba(248,113,113,0.15)', color: '#f87171' },
}

function ExerciseRow({ ex }) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0">
      <span className="text-xl mt-0.5">{ex.emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold">{ex.name}</p>
        {ex.tip && <p className="text-white/30 text-xs mt-0.5 leading-snug">{ex.tip}</p>}
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-gold-400 text-xs font-bold">{ex.sets}×{ex.reps}</p>
        <p className="text-white/25 text-[10px]">rest {ex.rest}</p>
      </div>
    </div>
  )
}

function WorkoutCard({ plan }) {
  const [expanded, setExpanded] = useState(false)
  const [activeWeek, setActiveWeek] = useState(0)
  const [activeDay, setActiveDay] = useState(0)
  const levelStyle = LEVEL_STYLE[plan.level] ?? LEVEL_STYLE.Beginner

  const saved = localStorage.getItem('fitethio-active-workout')
  const isActive = saved === plan.id

  function startPlan() {
    localStorage.setItem('fitethio-active-workout', plan.id)
    window.dispatchEvent(new Event('workout-changed'))
  }

  const currentWorkout = plan.weeks[activeWeek]?.workouts[activeDay]

  return (
    <motion.div
      layout
      className="rounded-2xl overflow-hidden"
      style={{
        background: isActive
          ? 'linear-gradient(135deg, rgba(251,191,36,0.09), rgba(245,158,11,0.04))'
          : 'rgba(255,255,255,0.04)',
        border: isActive ? '1px solid rgba(251,191,36,0.3)' : '1px solid rgba(255,255,255,0.07)',
        transition: 'background 0.35s, border 0.35s',
      }}>

      {isActive && (
        <div className="h-px w-full"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.5), transparent)' }} />
      )}

      <div className="p-4 cursor-pointer" onClick={() => setExpanded(v => !v)}>
        <div className="flex items-start gap-3">
          <span className="text-3xl mt-0.5">{plan.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                style={levelStyle}>
                {plan.level}
              </span>
              {isActive && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                  style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}>
                  Active ✓
                </span>
              )}
            </div>
            <h3 className="font-display font-bold text-white text-[15px] leading-snug">{plan.name}</h3>
            <p className="text-white/35 text-[11px] mt-0.5">{plan.goal}</p>
            <div className="flex gap-3 mt-2">
              <span className="flex items-center gap-1 text-[10px] text-white/30">
                <Clock size={9} />{plan.duration}
              </span>
              <span className="flex items-center gap-1 text-[10px] text-white/30">
                <Zap size={9} />{plan.daysPerWeek}×/week
              </span>
            </div>
          </div>
          <ChevronDown size={14} className={`text-white/25 mt-1 flex-shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </div>
        <p className="text-white/40 text-xs mt-3 leading-relaxed">{plan.description}</p>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden">
            <div className="px-4 pb-4 pt-1 flex flex-col gap-4">

              {/* Week selector */}
              <div className="flex gap-2 overflow-x-auto scrollbar-none">
                {plan.weeks.map((w, i) => (
                  <button key={i} onClick={() => { setActiveWeek(i); setActiveDay(0) }}
                    className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    style={activeWeek === i
                      ? { background: 'linear-gradient(135deg,#d97706,#fbbf24)', color: '#060b18' }
                      : { background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)' }}>
                    Week {w.week}
                  </button>
                ))}
              </div>

              {/* Day selector */}
              <div className="flex gap-2 overflow-x-auto scrollbar-none">
                {plan.weeks[activeWeek]?.workouts.map((w, i) => (
                  <button key={i} onClick={() => setActiveDay(i)}
                    className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    style={activeDay === i
                      ? { background: 'rgba(132,204,22,0.2)', color: '#84cc16', border: '1px solid rgba(132,204,22,0.35)' }
                      : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    {w.day}
                  </button>
                ))}
              </div>

              {/* Exercises */}
              {currentWorkout && (
                <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Dumbbell size={13} className="text-gold-400" />
                    <p className="text-white/50 text-[11px] font-semibold uppercase tracking-wider">{currentWorkout.name}</p>
                  </div>
                  {currentWorkout.exercises.map((ex, i) => (
                    <ExerciseRow key={i} ex={ex} />
                  ))}
                </div>
              )}

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={startPlan}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm"
                style={isActive
                  ? { background: 'rgba(132,204,22,0.15)', color: '#84cc16', border: '1px solid rgba(132,204,22,0.3)' }
                  : { background: 'linear-gradient(135deg, #d97706, #fbbf24)', color: '#060b18' }}>
                {isActive ? <><CheckCircle2 size={15} />Currently Active</> : <><Play size={15} />Start This Program</>}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Workouts() {
  const [, forceUpdate] = useState(0)

  // Re-render when active workout changes
  useState(() => {
    const handler = () => forceUpdate(n => n + 1)
    window.addEventListener('workout-changed', handler)
    return () => window.removeEventListener('workout-changed', handler)
  })

  return (
    <PageTransition>
      <div className="py-2 flex flex-col gap-5">
        <div>
          <h1 className="font-display font-black text-2xl text-white">Workout Plans</h1>
          <p className="text-white/40 text-sm mt-0.5">Structured programs to reach your goals</p>
        </div>

        <div className="flex flex-col gap-3">
          {workoutPlans.map(plan => (
            <WorkoutCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </PageTransition>
  )
}
