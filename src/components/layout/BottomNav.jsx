import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, UtensilsCrossed, PlusCircle, TrendingDown, User } from 'lucide-react'

const TABS = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/meals', icon: UtensilsCrossed, label: 'Meals' },
  { path: '/log', icon: PlusCircle, label: 'Log', center: true },
  { path: '/progress', icon: TrendingDown, label: 'Progress' },
  { path: '/profile', icon: User, label: 'Profile' },
]

export function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around h-16 px-2"
      style={{ background: 'rgba(6,11,24,0.92)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
      {TABS.map(({ path, icon: Icon, label, center }) => {
        const active = location.pathname === path
        if (center) {
          return (
            <motion.button
              key={path}
              whileTap={{ scale: 0.88 }}
              onClick={() => navigate(path)}
              className="relative -top-4 flex items-center justify-center w-14 h-14 rounded-full shadow-gold-glow"
              style={{ background: 'linear-gradient(135deg, #d97706, #fbbf24)' }}>
              <Icon size={26} className="text-navy-950" strokeWidth={2.5} />
            </motion.button>
          )
        }
        return (
          <motion.button
            key={path}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(path)}
            className="flex flex-col items-center gap-0.5 px-3 py-1">
            <motion.div animate={{ scale: active ? 1.15 : 1 }} transition={{ type: 'spring', stiffness: 300 }}>
              <Icon
                size={22}
                className={active ? 'text-gold-400' : 'text-white/35'}
                strokeWidth={active ? 2.5 : 1.8}
              />
            </motion.div>
            <span className={`text-[10px] font-medium transition-colors ${active ? 'text-gold-400' : 'text-white/30'}`}>
              {label}
            </span>
            {active && (
              <motion.div
                layoutId="nav-dot"
                className="w-1 h-1 rounded-full bg-gold-400"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </motion.button>
        )
      })}
    </nav>
  )
}
