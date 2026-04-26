import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, Check, ArrowLeft, Sparkles } from 'lucide-react'
import { useGoogleLogin } from '@react-oauth/google'
import { useApp } from '../context/AppContext'
import { Spinner } from '../components/ui/Spinner'

const GOOGLE_ENABLED = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID)

function Input({ icon: Icon, type, placeholder, value, onChange, rightIcon, onRightClick, valid, autoFocus }) {
  return (
    <div className="relative">
      <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        autoFocus={autoFocus}
        onChange={e => onChange(e.target.value)}
        className="w-full pl-11 pr-11 py-3.5 rounded-2xl text-white placeholder-white/25 text-sm font-medium outline-none transition-all"
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
        onFocus={e => { e.target.style.borderColor = 'rgba(251,191,36,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(251,191,36,0.08)' }}
        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
      />
      <AnimatePresence>
        {valid && !rightIcon && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(132,204,22,0.18)', border: '1px solid rgba(132,204,22,0.4)' }}>
            <Check size={11} className="text-lime-400" strokeWidth={3} />
          </motion.div>
        )}
      </AnimatePresence>
      {rightIcon && (
        <button type="button" onClick={onRightClick} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
          {rightIcon}
        </button>
      )}
    </div>
  )
}

function GoogleIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
    </svg>
  )
}

function passwordStrength(pw) {
  if (!pw) return { score: 0, label: '', color: 'transparent' }
  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  if (score <= 2) return { score: 1, label: 'Weak', color: '#f87171' }
  if (score <= 3) return { score: 2, label: 'Fair', color: '#fbbf24' }
  return { score: 3, label: 'Strong', color: '#84cc16' }
}

function isValidEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
}

export default function Login() {
  const { login, register, googleLogin, authLoading, error, setError } = useApp()
  const [tab, setTab] = useState('login') // 'login' | 'register' | 'forgot'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetSent, setResetSent] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [notice, setNotice] = useState(null)

  const strength = useMemo(() => passwordStrength(password), [password])
  const emailValid = isValidEmail(email)
  const nameValid = name.trim().length >= 2
  const pwValid = password.length >= 6

  function switchTab(t) {
    setTab(t)
    setError(null)
    setNotice(null)
    setResetSent(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      if (tab === 'login') await login(email, password)
      else await register(name, email, password)
    } catch {}
  }

  async function handleForgot(e) {
    e.preventDefault()
    if (!isValidEmail(resetEmail)) { setError('Enter a valid email address'); return }
    setError(null)
    setResetLoading(true)
    // Email delivery requires backend setup (Resend). Simulating UX so the flow is wired up
    // and ready to swap in the real API call.
    await new Promise(r => setTimeout(r, 700))
    setResetLoading(false)
    setResetSent(true)
  }

  const triggerGoogle = useGoogleLogin({
    onSuccess: async ({ access_token }) => {
      setNotice(null)
      try {
        await googleLogin(access_token)
      } catch {}
    },
    onError: () => setError('Google sign-in failed. Please try again.'),
    onNonOAuthError: (err) => {
      // popup_closed, popup_failed_to_open, etc. — silent unless it's a real failure.
      if (err?.type !== 'popup_closed') setError('Google sign-in was cancelled')
    },
  })

  function handleGoogle() {
    setError(null)
    if (!GOOGLE_ENABLED) {
      setNotice('Google sign-in is not configured. Set VITE_GOOGLE_CLIENT_ID and restart.')
      setTimeout(() => setNotice(null), 4000)
      return
    }
    triggerGoogle()
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #060b18 0%, #0d1526 50%, #111d35 100%)' }}>

      {/* Animated background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 14, ease: 'easeInOut' }}
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.18) 0%, transparent 70%)' }} />
        <motion.div
          animate={{ x: [0, -25, 0], y: [0, 25, 0] }}
          transition={{ repeat: Infinity, duration: 18, ease: 'easeInOut' }}
          className="absolute -bottom-32 -left-32 w-72 h-72 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(7,137,48,0.10) 0%, transparent 70%)' }} />
        <motion.div
          animate={{ x: [0, 15, 0], y: [0, -30, 0] }}
          transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut' }}
          className="absolute top-1/2 right-0 w-48 h-48 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(218,18,26,0.08) 0%, transparent 70%)' }} />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 16, ease: 'easeInOut' }}
          className="absolute top-10 left-1/4 w-32 h-32 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(132,204,22,0.06) 0%, transparent 70%)' }} />
      </div>

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8">
          <div className="relative inline-block mb-3">
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="absolute inset-0 rounded-full blur-xl"
              style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.5) 0%, transparent 70%)' }} />
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="text-6xl relative">🔥</motion.div>
          </div>
          <motion.h1
            animate={{ backgroundPosition: ['0% center', '200% center'] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
            className="font-display font-black text-4xl mb-1"
            style={{
              background: 'linear-gradient(90deg, #fbbf24, #f59e0b, #fde68a, #fbbf24)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
            FitEthio
          </motion.h1>
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

          <AnimatePresence mode="wait">
            {tab !== 'forgot' ? (
              <motion.div
                key="auth"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}>

                {/* Tabs */}
                <div className="flex gap-1 mb-5 p-1 rounded-2xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                  {[['login', 'Sign In'], ['register', 'Create Account']].map(([id, label]) => (
                    <motion.button
                      key={id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => switchTab(id)}
                      className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all relative">
                      {tab === id && (
                        <motion.div layoutId="tab-pill" className="absolute inset-0 rounded-xl"
                          style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)' }}
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                      )}
                      <span className={`relative z-10 inline-flex items-center justify-center gap-1.5 ${tab === id ? 'text-gold-400' : 'text-white/40'}`}>
                        {label}
                        {id === 'register' && (
                          <Sparkles size={11} className={tab === id ? 'text-gold-400' : 'text-white/30'} />
                        )}
                      </span>
                    </motion.button>
                  ))}
                </div>

                {/* Error / notice */}
                <AnimatePresence>
                  {(error || notice) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4 overflow-hidden">
                      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm"
                        style={error
                          ? { background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', color: '#fca5a5' }
                          : { background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', color: '#fde68a' }}>
                        <AlertCircle size={14} className="flex-shrink-0" />
                        {error || notice}
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
                        <Input icon={User} type="text" placeholder="Your name" value={name} onChange={setName} valid={nameValid} />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Input icon={Mail} type="email" placeholder="Email address" value={email} onChange={setEmail} valid={emailValid} />
                  <Input
                    icon={Lock}
                    type={showPw ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={setPassword}
                    rightIcon={showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    onRightClick={() => setShowPw(s => !s)}
                  />

                  {/* Password strength bar (register only) */}
                  <AnimatePresence>
                    {tab === 'register' && password && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden">
                        <div className="flex items-center gap-2 px-1">
                          <div className="flex-1 flex gap-1">
                            {[1, 2, 3].map(i => (
                              <div key={i} className="flex-1 h-1 rounded-full overflow-hidden"
                                style={{ background: 'rgba(255,255,255,0.06)' }}>
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: strength.score >= i ? '100%' : 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="h-full rounded-full"
                                  style={{ background: strength.color }} />
                              </div>
                            ))}
                          </div>
                          <span className="text-xs font-medium" style={{ color: strength.color, minWidth: 42, textAlign: 'right' }}>
                            {strength.label}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Forgot password link (login only) */}
                  {tab === 'login' && (
                    <div className="flex justify-end -mt-1">
                      <button
                        type="button"
                        onClick={() => switchTab('forgot')}
                        className="text-xs text-white/40 hover:text-gold-400 transition-colors font-medium">
                        Forgot password?
                      </button>
                    </div>
                  )}

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={authLoading}
                    className="mt-2 py-4 rounded-2xl font-display font-bold text-base text-navy-950 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #d97706, #fbbf24)', boxShadow: '0 0 20px rgba(251,191,36,0.25)' }}>
                    {authLoading ? (
                      <>
                        <Spinner size={18} />
                        <span>Please wait…</span>
                      </>
                    ) : tab === 'login' ? 'Sign In' : 'Create Account'}
                  </motion.button>
                </form>

                {/* OR divider */}
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)' }} />
                  <span className="text-xs font-medium text-white/30 uppercase tracking-wider">or continue with</span>
                  <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)' }} />
                </div>

                {/* Social login */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={handleGoogle}
                  className="w-full py-3 rounded-2xl font-semibold text-sm text-white/85 transition-all flex items-center justify-center gap-2.5 hover:bg-white/[0.08]"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <GoogleIcon size={16} />
                  <span>Continue with Google</span>
                </motion.button>

                {tab === 'register' && (
                  <p className="text-center text-white/25 text-xs mt-4">
                    Your data is stored securely on the server.
                  </p>
                )}
              </motion.div>
            ) : (
              /* Forgot password card */
              <motion.div
                key="forgot"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}>

                <div className="flex items-center gap-2 mb-5">
                  <button
                    type="button"
                    onClick={() => switchTab('login')}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-all">
                    <ArrowLeft size={16} />
                  </button>
                  <h2 className="font-display font-bold text-lg text-white">
                    {resetSent ? 'Check your inbox' : 'Reset password'}
                  </h2>
                </div>

                <AnimatePresence mode="wait">
                  {!resetSent ? (
                    <motion.form
                      key="forgot-form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleForgot}
                      className="flex flex-col gap-3">
                      <p className="text-white/45 text-sm leading-relaxed mb-1">
                        Enter the email associated with your account and we'll send you a link to reset your password.
                      </p>

                      <AnimatePresence>
                        {error && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden">
                            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-red-300"
                              style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)' }}>
                              <AlertCircle size={14} className="flex-shrink-0" />
                              {error}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <Input
                        icon={Mail}
                        type="email"
                        placeholder="Email address"
                        value={resetEmail}
                        onChange={setResetEmail}
                        valid={isValidEmail(resetEmail)}
                        autoFocus
                      />

                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        type="submit"
                        disabled={resetLoading}
                        className="mt-2 py-4 rounded-2xl font-display font-bold text-base text-navy-950 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                        style={{ background: 'linear-gradient(135deg, #d97706, #fbbf24)', boxShadow: '0 0 20px rgba(251,191,36,0.25)' }}>
                        {resetLoading ? (
                          <>
                            <Spinner size={18} />
                            <span>Sending…</span>
                          </>
                        ) : 'Send Reset Link'}
                      </motion.button>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="forgot-sent"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      className="flex flex-col items-center text-center py-4">
                      <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{ repeat: Infinity, duration: 2.5 }}
                        className="text-5xl mb-3">📬</motion.div>
                      <p className="text-white/80 text-sm font-medium mb-1">
                        We sent a reset link to
                      </p>
                      <p className="text-gold-400 text-sm font-semibold mb-4 break-all">
                        {resetEmail}
                      </p>
                      <p className="text-white/40 text-xs leading-relaxed mb-5 px-2">
                        The link will expire in 1 hour. Don't see it? Check your spam folder.
                      </p>
                      <button
                        type="button"
                        onClick={() => switchTab('login')}
                        className="text-sm font-semibold text-gold-400 hover:text-gold-300 transition-colors">
                        Back to sign in
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {tab !== 'forgot' && (
          <p className="text-center text-white/20 text-xs mt-6">
            {tab === 'login'
              ? <span>No account? <button onClick={() => switchTab('register')} className="text-gold-500 hover:underline">Create one free</button></span>
              : <span>Already have an account? <button onClick={() => switchTab('login')} className="text-gold-500 hover:underline">Sign in</button></span>
            }
          </p>
        )}
      </div>
    </div>
  )
}
