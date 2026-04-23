import { useLocation } from 'react-router-dom'
import { format } from 'date-fns'
import { useApp } from '../../context/AppContext'

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/meals': 'Meal Plan',
  '/log': 'Food Log',
  '/progress': 'Progress',
  '/profile': 'Profile',
}

export function Navbar() {
  const location = useLocation()
  const { state } = useApp()
  const title = PAGE_TITLES[location.pathname] || 'FitEthio'
  const today = format(new Date(), 'EEE, MMM d')

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14"
      style={{ background: 'rgba(6,11,24,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center gap-2">
        <span className="text-2xl">🔥</span>
        <span className="font-display font-bold text-lg"
          style={{ background: 'linear-gradient(90deg, #fbbf24, #f59e0b, #fbbf24)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          FitEthio
        </span>
      </div>
      <span className="font-display font-semibold text-white/90 text-base tracking-tight">{title}</span>
      <div className="flex flex-col items-end">
        <span className="text-xs text-white/40 font-medium">{today}</span>
        <div className="w-7 h-7 rounded-full bg-gold-gradient flex items-center justify-center text-navy-950 font-bold text-xs shadow-gold-glow mt-0.5">
          {state.profile.name?.[0]?.toUpperCase() || 'A'}
        </div>
      </div>
    </header>
  )
}
