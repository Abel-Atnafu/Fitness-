import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogOut, ShieldCheck } from 'lucide-react'
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
  const navigate = useNavigate()
  const { profile, logout, isAdmin } = useApp()
  const title = PAGE_TITLES[location.pathname] || 'FitEthio'

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14 max-w-[448px] mx-auto"
      style={{ background: 'rgba(6,11,24,0.88)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>

      {/* Logo */}
      <button onClick={() => navigate('/')} className="flex items-center gap-1.5">
        <span className="text-xl">🔥</span>
        <span className="font-display font-bold text-base"
          style={{ background: 'linear-gradient(90deg, #fbbf24, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          FitEthio
        </span>
      </button>

      {/* Page title */}
      <span className="font-display font-semibold text-white/80 text-sm absolute left-1/2 -translate-x-1/2">{title}</span>

      {/* User + admin + logout */}
      <div className="flex items-center gap-2">
        {isAdmin && (
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => navigate('/admin')}
            title="Admin panel"
            className="w-7 h-7 flex items-center justify-center rounded-xl"
            style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}>
            <ShieldCheck size={13} className="text-amber-400" />
          </motion.button>
        )}
        <div className="w-7 h-7 rounded-xl flex items-center justify-center font-display font-bold text-xs text-navy-950"
          style={{ background: 'linear-gradient(135deg, #d97706, #fbbf24)' }}>
          {profile?.name?.[0]?.toUpperCase() ?? 'A'}
        </div>
        <motion.button whileTap={{ scale: 0.88 }} onClick={logout} className="w-7 h-7 flex items-center justify-center rounded-xl"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}>
          <LogOut size={13} className="text-white/45" />
        </motion.button>
      </div>
    </header>
  )
}
