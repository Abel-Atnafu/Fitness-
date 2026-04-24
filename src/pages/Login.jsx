import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'

function Input({ icon: Icon, type, placeholder, value, onChange, rightIcon, onRightClick }) {
  return (
    <div className="relative">
      <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full pl-11 pr-11 py-3.5 rounded-2xl text-white placeholder-white/25 text-sm font-medium outline-none transition-all"
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
        onFocus={e => { e.target.style.borderColor = 'rgba(251,191,36,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(251,191,36,0.08)' }}
        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
      />
      {rightIcon && (
        <button type="button" onClick={onRightClick} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
          {rightIcon}
        </button>
      )}
    </div>
  )
}

export default function Login() {
  const { login, register, authLoading, error, setError } = useApp()
  const [tab, setTab] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      if (tab === 'login') await login(email, password)
      else await register(name, email, password)
    } catch {}
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #060b18 0%, #0d1526 50%, #111d35 100%)' }}>

      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-32 -left-32 w-72 h-72 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(7,137,48,0.08) 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 right-0 w-48 h-48 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(218,18,26,0.06) 0%, transparent 70%)' }} />
      </div>

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8">
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="text-6xl mb-3 inline-block">🔥</motion.div>
          <h1 className="font-display font-black text-4xl mb-1"
            style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b, #fbbf24)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            FitEthio
          </h1>
          <p className="text-white/35 text-sm">Your personal weight loss companion</p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl p-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
          }}>

          {/* Top edge highlight */}
          <div className="absolute top-0 left-8 right-8 h-px rounded-full"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.4), transparent)' }} />

          {/* Tabs */}
          <div className="flex gap-1 mb-6 p-1 rounded-2xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
            {[['login', 'Sign In'], ['register', 'Create Account']].map(([id, label]) => (
              <motion.button
                key={id}
                whileTap={{ scale: 0.97 }}
                onClick={() => { setTab(id); setError(null) }}
                className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all relative">
                {tab === id && (
                  <motion.div layoutId="tab-pill" className="absolute inset-0 rounded-xl"
                    style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                )}
                <span className={`relative z-10 ${tab === id ? 'text-gold-400' : 'text-white/40'}`}>{label}</span>
              </motion.button>
            ))}
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 overflow-hidden">
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-red-300"
                  style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)' }}>
                  <AlertCircle size={14} className="flex-shrink-0" />
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <AnimatePresence mode="wait">
              {tab === 'register' && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden">
                  <Input icon={User} type="text" placeholder="Your name" value={name} onChange={setName} />
                </motion.div>
              )}
            </AnimatePresence>

            <Input icon={Mail} type="email" placeholder="Email address" value={email} onChange={setEmail} />
            <Input
              icon={Lock}
              type={showPw ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={setPassword}
              rightIcon={showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              onRightClick={() => setShowPw(s => !s)}
            />

            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={authLoading}
              className="mt-2 py-4 rounded-2xl font-display font-bold text-base text-navy-950 transition-all disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #d97706, #fbbf24)', boxShadow: '0 0 20px rgba(251,191,36,0.25)' }}>
              {authLoading ? '...' : tab === 'login' ? 'Sign In' : 'Create Account'}
            </motion.button>
          </form>

          {tab === 'register' && (
            <p className="text-center text-white/25 text-xs mt-4">
              Your data is stored securely on the server.
            </p>
          )}
        </motion.div>

        <p className="text-center text-white/20 text-xs mt-6">
          {tab === 'login'
            ? <span>No account? <button onClick={() => setTab('register')} className="text-gold-500 hover:underline">Create one free</button></span>
            : <span>Already have an account? <button onClick={() => setTab('login')} className="text-gold-500 hover:underline">Sign in</button></span>
          }
        </p>
      </div>
    </div>
  )
}
