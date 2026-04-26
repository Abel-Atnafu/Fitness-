import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AppProvider, useApp } from './context/AppContext'
import { Navbar } from './components/layout/Navbar'
import { BottomNav } from './components/layout/BottomNav'
import { LoadingScreen } from './components/ui/Spinner'
import { ErrorBanner } from './components/ui/ErrorBanner'
import { OnboardingWizard } from './components/ui/OnboardingWizard'
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
  const { token, loading, profile } = useApp()

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
      {profile && profile.sex === null && <OnboardingWizard />}
      <ErrorBanner />
      <Navbar />
      <main className="relative z-10 pt-14 pb-20 px-4 max-w-[448px] mx-auto">
        <AnimatedRoutes />
      </main>
      <BottomNav />
    </div>
  )
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AppProvider>
        <HashRouter>
          <AppShell />
        </HashRouter>
      </AppProvider>
    </GoogleOAuthProvider>
  )
}
