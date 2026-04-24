import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, X } from 'lucide-react'
import { AppProvider, useApp } from './context/AppContext'
import { Navbar } from './components/layout/Navbar'
import { BottomNav } from './components/layout/BottomNav'
import { LoadingScreen } from './components/ui/Spinner'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import MealPlan from './pages/MealPlan'
import FoodLog from './pages/FoodLog'
import Progress from './pages/Progress'
import Profile from './pages/Profile'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/meals" element={<MealPlan />} />
        <Route path="/log" element={<FoodLog />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

function AppShell() {
  const { token, loading, error, setError } = useApp()

  if (loading) return <LoadingScreen />
  if (!token) return <Login />

  return (
    <div className="min-h-screen relative" style={{ background: 'linear-gradient(135deg, #060b18 0%, #0d1526 50%, #111d35 100%)' }}>
      {/* Decorative blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 -left-24 w-56 h-56 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(132,204,22,0.07) 0%, transparent 70%)' }} />
        <div className="absolute bottom-32 right-8 w-44 h-44 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(218,18,26,0.05) 0%, transparent 70%)' }} />
      </div>
      <Navbar />
      {/* Global error banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="fixed top-14 left-0 right-0 z-40 px-4 pt-2 max-w-[448px] mx-auto">
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-red-300"
              style={{ background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.25)', backdropFilter: 'blur(8px)' }}>
              <AlertCircle size={14} className="flex-shrink-0" />
              <span className="flex-1 text-xs">{error}</span>
              <button onClick={() => setError(null)} className="text-red-400/60 hover:text-red-300 transition-colors">
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <main className="relative z-10 pt-14 pb-20 px-4 max-w-[448px] mx-auto">
        <AnimatedRoutes />
      </main>
      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <AppShell />
      </HashRouter>
    </AppProvider>
  )
}
