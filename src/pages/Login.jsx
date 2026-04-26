import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail, Lock, User, Phone, Eye, EyeOff, AlertCircle, Check, ArrowLeft,
  Sparkles, X, CheckCircle2, ShieldAlert,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Spinner } from '../components/ui/Spinner'
import {
  loadKnown, forgetAccount, initialsFromName,
} from '../utils/knownAccounts.js'

// ─── helpers ───────────────────────────────────────────────────────────────

const COUNTRY_CODES = [
  { code: '+251', label: '🇪🇹 +251' },
  { code: '+1',   label: '🇺🇸 +1' },
  { code: '+44',  label: '🇬🇧 +44' },
  { code: '+27',  label: '🇿🇦 +27' },
  { code: '+254', label: '🇰🇪 +254' },
  { code: '+255', label: '🇹🇿 +255' },
  { code: '+971', label: '🇦🇪 +971' },
  { code: '+966', label: '🇸🇦 +966' },
  { code: '+49',  label: '🇩🇪 +49' },
  { code: '+33',  label: '🇫🇷 +33' },
]

function isValidEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
}

// Combined country + national digits, with spaces/dashes stripped.
function isValidPhone(combined) {
  const cleaned = combined.replace(/[\s-]/g, '')
  return /^\+?[0-9]{7,15}$/.test(cleaned)
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

function parseResetHash() {
  // HashRouter hash looks like '#/reset?token=abc' — extract the token if present.
  const h = typeof window !== 'undefined' ? window.location.hash : ''
  if (!h.startsWith('#/reset')) return null
  const qIdx = h.indexOf('?')
  if (qIdx === -1) return null
  const params = new URLSearchParams(h.slice(qIdx + 1))
  const token = params.get('token')
  return token ? token : null
}

// ─── shared FloatingInput ──────────────────────────────────────────────────
// Label sits inside the field at rest and animates up on focus or fill.
// Keeps the existing checkmark + right-icon affordance.

function FloatingInput({
  icon: Icon,
  type = 'text',
  label,
  value,
  onChange,
  rightIcon,
  onRightClick,
  valid,
  autoFocus,
  autoComplete,
  inputMode,
  onCapsLock,
  onKeyDown,
  id,
}) {
  const [focused, setFocused] = useState(false)
  const filled = value && value.length > 0
  const lifted = focused || filled
  const inputId = id || (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined)

  return (
    <div className="relative">
      {Icon && (
        <Icon
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none z-10"
        />
      )}
      <input
        id={inputId}
        type={type}
        value={value}
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        inputMode={inputMode}
        onChange={e => onChange(e.target.value)}
        onFocus={e => {
          setFocused(true)
          e.target.style.borderColor = 'rgba(251,191,36,0.5)'
          e.target.style.boxShadow = '0 0 0 3px rgba(251,191,36,0.08)'
        }}
        onBlur={e => {
          setFocused(false)
          e.target.style.borderColor = 'rgba(255,255,255,0.1)'
          e.target.style.boxShadow = 'none'
        }}
        onKeyUp={e => {
          if (onCapsLock) onCapsLock(e.getModifierState && e.getModifierState('CapsLock'))
          if (onKeyDown) onKeyDown(e)
        }}
        className={`peer w-full ${Icon ? 'pl-11' : 'pl-4'} pr-11 pt-5 pb-2 rounded-2xl text-white text-sm font-medium outline-none transition-all`}
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      />
      <label
        htmlFor={inputId}
        className={`absolute ${Icon ? 'left-11' : 'left-4'} pointer-events-none transition-all duration-150 select-none`}
        style={{
          top: lifted ? 8 : '50%',
          transform: lifted ? 'translateY(0)' : 'translateY(-50%)',
          fontSize: lifted ? 11 : 13,
          color: focused ? 'rgba(251,191,36,0.85)' : 'rgba(255,255,255,0.35)',
          fontWeight: lifted ? 600 : 500,
          letterSpacing: lifted ? '0.02em' : 0,
        }}>
        {label}
      </label>
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
        <button
          type="button"
          onClick={onRightClick}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
          tabIndex={-1}>
          {rightIcon}
        </button>
      )}
    </div>
  )
}

// ─── PasswordStrengthBar ───────────────────────────────────────────────────

function PasswordStrengthBar({ password }) {
  const strength = passwordStrength(password)
  return (
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
  )
}

// ─── ErrorBanner (inline) ──────────────────────────────────────────────────

function InlineNotice({ kind, children }) {
  if (!children) return null
  const palette = kind === 'success'
    ? { bg: 'rgba(132,204,22,0.10)', border: 'rgba(132,204,22,0.25)', color: '#bef264', Icon: CheckCircle2 }
    : kind === 'warn'
    ? { bg: 'rgba(251,191,36,0.10)', border: 'rgba(251,191,36,0.25)', color: '#fde68a', Icon: ShieldAlert }
    : { bg: 'rgba(248,113,113,0.10)', border: 'rgba(248,113,113,0.25)', color: '#fca5a5', Icon: AlertCircle }
  const { bg, border, color, Icon } = palette
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden">
      <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl text-sm"
        style={{ background: bg, border: `1px solid ${border}`, color }}>
        <Icon size={14} className="flex-shrink-0 mt-0.5" />
        <span className="leading-snug">{children}</span>
      </div>
    </motion.div>
  )
}

// ─── PrimaryButton ─────────────────────────────────────────────────────────

function PrimaryButton({ loading, disabled, children, type = 'submit', onClick }) {
  return (
    <motion.button
      whileTap={disabled || loading ? undefined : { scale: 0.97 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className="mt-2 py-4 rounded-2xl font-display font-bold text-base text-navy-950 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full"
      style={{ background: 'linear-gradient(135deg, #d97706, #fbbf24)', boxShadow: '0 0 20px rgba(251,191,36,0.25)' }}>
      {loading ? (<><Spinner size={18} /><span>Please wait…</span></>) : children}
    </motion.button>
  )
}

// ─── BrandHero ─────────────────────────────────────────────────────────────

const TAGLINES = {
  welcome:  'Welcome back',
  login:    "Let's pick up where you left off",
  register: 'Start your journey',
  forgot:   "We'll get you back in",
  reset:    'Choose a new password',
}

function BrandHero({ view }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-7">
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
      <AnimatePresence mode="wait">
        <motion.p
          key={view}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          className="text-white/45 text-sm">
          {TAGLINES[view] || ''}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Background blobs (visual only) ────────────────────────────────────────

function BackgroundBlobs() {
  return (
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
  )
}

// ─── WelcomeView ───────────────────────────────────────────────────────────
// Vertical list of account chips for tap-to-fill, plus paths to login/register.

function AccountChip({ account, onPick, onForget }) {
  const initials = initialsFromName(account.name, account.email)
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="group flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-colors hover:bg-white/[0.04]"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
      onClick={() => onPick(account)}>
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center font-display font-bold text-base text-navy-950 flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #d97706, #fbbf24)' }}>
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-white text-sm font-semibold truncate">
          {account.name || account.email.split('@')[0]}
        </div>
        <div className="text-white/40 text-xs truncate">{account.email}</div>
      </div>
      <button
        type="button"
        onClick={e => { e.stopPropagation(); onForget(account.email) }}
        aria-label={`Forget ${account.email}`}
        className="w-7 h-7 rounded-full flex items-center justify-center text-white/30 hover:text-white/80 hover:bg-white/[0.08] transition-all opacity-0 group-hover:opacity-100">
        <X size={14} />
      </button>
    </motion.div>
  )
}

// ─── LoginView ─────────────────────────────────────────────────────────────

function LoginView({
  initialEmail,
  onSubmit,
  onForgot,
  onRegister,
  onBackToWelcome,
  showBack,
  authLoading,
  error,
}) {
  const [email, setEmail] = useState(initialEmail || '')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [remember, setRemember] = useState(true)
  const [capsOn, setCapsOn] = useState(false)

  const emailValid = isValidEmail(email)
  const canSubmit = emailValid && password.length >= 1 && !authLoading

  function handle(e) {
    e.preventDefault()
    if (!canSubmit) return
    onSubmit({ email: email.trim(), password, remember })
  }

  return (
    <motion.div
      key="login"
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.2 }}>
      <div className="flex items-center gap-2 mb-5">
        {showBack && (
          <button
            type="button"
            onClick={onBackToWelcome}
            aria-label="Back"
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-all">
            <ArrowLeft size={16} />
          </button>
        )}
        <h2 className="font-display font-bold text-lg text-white">Sign in</h2>
      </div>

      <AnimatePresence>
        {error && <div className="mb-3"><InlineNotice kind="error">{error}</InlineNotice></div>}
      </AnimatePresence>

      <form onSubmit={handle} className="flex flex-col gap-3" autoComplete="on">
        <FloatingInput
          icon={Mail}
          type="email"
          label="Email address"
          value={email}
          onChange={v => setEmail(v.replace(/\s/g, ''))}
          valid={emailValid}
          autoComplete="email"
          inputMode="email"
          autoFocus={!initialEmail}
        />
        <FloatingInput
          icon={Lock}
          type={showPw ? 'text' : 'password'}
          label="Password"
          value={password}
          onChange={setPassword}
          rightIcon={showPw ? <EyeOff size={15} /> : <Eye size={15} />}
          onRightClick={() => setShowPw(s => !s)}
          autoComplete="current-password"
          onCapsLock={setCapsOn}
          autoFocus={!!initialEmail}
        />

        <AnimatePresence>
          {capsOn && password && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-amber-200"
                style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.18)' }}>
                <ShieldAlert size={12} /> Caps Lock is on
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between -mt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
              className="w-4 h-4 rounded accent-gold-400" />
            <span className="text-xs font-medium text-white/55">Remember me</span>
          </label>
          <button
            type="button"
            onClick={onForgot}
            className="text-xs text-white/40 hover:text-gold-400 transition-colors font-medium">
            Forgot password?
          </button>
        </div>

        <PrimaryButton loading={authLoading} disabled={!canSubmit}>
          Sign In
        </PrimaryButton>
      </form>

      <p className="text-center text-white/30 text-xs mt-5">
        New here?{' '}
        <button onClick={onRegister} className="text-gold-500 font-semibold hover:underline">
          Create an account
        </button>
      </p>
    </motion.div>
  )
}

function WelcomeView({ accounts, onPick, onForget, onUseDifferent, onCreate }) {
  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.2 }}>
      <div className="mb-4">
        <h2 className="font-display font-bold text-lg text-white">Choose an account</h2>
        <p className="text-white/40 text-xs mt-0.5">Pick up right where you left off.</p>
      </div>

      <div className="flex flex-col gap-2 mb-4">
        <AnimatePresence>
          {accounts.map(a => (
            <AccountChip key={a.email} account={a} onPick={onPick} onForget={onForget} />
          ))}
        </AnimatePresence>
      </div>

      <div className="flex flex-col gap-2 pt-2"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          type="button"
          onClick={onUseDifferent}
          className="text-sm font-semibold text-gold-400 hover:text-gold-300 py-2 transition-colors text-center">
          Sign in with another email
        </button>
        <button
          type="button"
          onClick={onCreate}
          className="text-xs font-medium text-white/40 hover:text-white/70 py-1 transition-colors text-center">
          New here? Create an account
        </button>
      </div>
    </motion.div>
  )
}

// ─── RegisterView ──────────────────────────────────────────────────────────

function RegisterView({ onSubmit, onBack, authLoading, error }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [countryCode, setCountryCode] = useState('+251')
  const [phoneNational, setPhoneNational] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [acceptTos, setAcceptTos] = useState(false)
  const [capsOn, setCapsOn] = useState(false)
  const [remember] = useState(true)

  const nameValid = name.trim().length >= 2
  const emailValid = isValidEmail(email)
  const fullPhone = `${countryCode}${phoneNational.replace(/[\s-]/g, '')}`
  const phoneValid = phoneNational.length > 0 && isValidPhone(fullPhone)
  const pwValid = password.length >= 6
  const strength = useMemo(() => passwordStrength(password), [password])
  const canSubmit = nameValid && emailValid && phoneValid && pwValid && acceptTos && !authLoading

  function handle(e) {
    e.preventDefault()
    if (!canSubmit) return
    onSubmit({
      name: name.trim(),
      email: email.trim(),
      phone: fullPhone,
      password,
      remember,
    })
  }

  return (
    <motion.div
      key="register"
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.2 }}>
      <div className="flex items-center gap-2 mb-5">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-all">
          <ArrowLeft size={16} />
        </button>
        <h2 className="font-display font-bold text-lg text-white inline-flex items-center gap-1.5">
          Create account <Sparkles size={14} className="text-gold-400" />
        </h2>
      </div>

      <AnimatePresence>
        {error && <div className="mb-3"><InlineNotice kind="error">{error}</InlineNotice></div>}
      </AnimatePresence>

      <form onSubmit={handle} className="flex flex-col gap-3" autoComplete="on">
        <FloatingInput
          icon={User}
          type="text"
          label="Your name"
          value={name}
          onChange={setName}
          valid={nameValid}
          autoComplete="name"
          autoFocus
        />
        <FloatingInput
          icon={Mail}
          type="email"
          label="Email address"
          value={email}
          onChange={v => setEmail(v.replace(/\s/g, ''))}
          valid={emailValid}
          autoComplete="email"
          inputMode="email"
        />

        {/* Country code + phone — single row */}
        <div className="flex gap-2">
          <div className="relative flex-shrink-0">
            <select
              value={countryCode}
              onChange={e => setCountryCode(e.target.value)}
              aria-label="Country code"
              className="appearance-none h-full pl-3 pr-7 py-3.5 rounded-2xl text-white text-sm font-medium outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                minWidth: 96,
              }}
              onFocus={e => { e.target.style.borderColor = 'rgba(251,191,36,0.5)' }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)' }}>
              {COUNTRY_CODES.map(c => (
                <option key={c.code} value={c.code} style={{ background: '#0d1526' }}>
                  {c.label}
                </option>
              ))}
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none text-xs">▾</span>
          </div>
          <div className="flex-1 min-w-0">
            <FloatingInput
              icon={Phone}
              type="tel"
              label="Phone number"
              value={phoneNational}
              onChange={v => setPhoneNational(v.replace(/[^\d\s-]/g, ''))}
              valid={phoneValid}
              autoComplete="tel"
              inputMode="tel"
            />
          </div>
        </div>

        <FloatingInput
          icon={Lock}
          type={showPw ? 'text' : 'password'}
          label="Password"
          value={password}
          onChange={setPassword}
          rightIcon={showPw ? <EyeOff size={15} /> : <Eye size={15} />}
          onRightClick={() => setShowPw(s => !s)}
          autoComplete="new-password"
          onCapsLock={setCapsOn}
        />

        <p className="text-[11px] text-white/35 px-1 -mt-1">
          At least 6 characters. Mix letters, numbers and a symbol for extra strength.
        </p>

        <AnimatePresence>
          {password && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden">
              <PasswordStrengthBar password={password} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {capsOn && password && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-amber-200"
                style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.18)' }}>
                <ShieldAlert size={12} /> Caps Lock is on
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <label className="flex items-start gap-2 cursor-pointer select-none mt-1">
          <input
            type="checkbox"
            checked={acceptTos}
            onChange={e => setAcceptTos(e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded accent-gold-400 flex-shrink-0" />
          <span className="text-xs text-white/55 leading-snug">
            I agree to the{' '}
            <a href="#/terms" className="text-gold-400 hover:underline font-medium">Terms of Service</a>
            {' '}and{' '}
            <a href="#/privacy" className="text-gold-400 hover:underline font-medium">Privacy Policy</a>.
          </span>
        </label>

        <PrimaryButton loading={authLoading} disabled={!canSubmit}>
          Create Account
        </PrimaryButton>
      </form>

      <p className="text-center text-white/30 text-xs mt-5">
        Already have an account?{' '}
        <button onClick={onBack} className="text-gold-500 font-semibold hover:underline">
          Sign in
        </button>
      </p>
    </motion.div>
  )
}

// ─── ForgotView ────────────────────────────────────────────────────────────

function ForgotView({ onSubmit, onBack }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState(null)

  const emailValid = isValidEmail(email)

  async function handle(e) {
    e.preventDefault()
    if (!emailValid) { setErr('Enter a valid email address'); return }
    setErr(null)
    setLoading(true)
    try {
      await onSubmit(email.trim())
      setSent(true)
    } catch (e2) {
      // Backend always returns 200 — only network errors land here.
      setErr('Could not reach the server. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      key="forgot"
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.2 }}>
      <div className="flex items-center gap-2 mb-5">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-all">
          <ArrowLeft size={16} />
        </button>
        <h2 className="font-display font-bold text-lg text-white">
          {sent ? 'Check your inbox' : 'Reset password'}
        </h2>
      </div>

      <AnimatePresence mode="wait">
        {!sent ? (
          <motion.form
            key="forgot-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handle}
            className="flex flex-col gap-3">
            <p className="text-white/45 text-sm leading-relaxed mb-1">
              Enter your account email and we'll send a link to choose a new password.
            </p>
            <AnimatePresence>
              {err && <InlineNotice kind="error">{err}</InlineNotice>}
            </AnimatePresence>
            <FloatingInput
              icon={Mail}
              type="email"
              label="Email address"
              value={email}
              onChange={v => setEmail(v.replace(/\s/g, ''))}
              valid={emailValid}
              autoComplete="email"
              inputMode="email"
              autoFocus
            />
            <PrimaryButton loading={loading} disabled={!emailValid || loading}>
              Send Reset Link
            </PrimaryButton>
          </motion.form>
        ) : (
          <motion.div
            key="forgot-sent"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="flex flex-col items-center text-center py-3">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="text-5xl mb-3">📬</motion.div>
            <p className="text-white/80 text-sm font-medium mb-1">
              We sent a reset link to
            </p>
            <p className="text-gold-400 text-sm font-semibold mb-3 break-all">
              {email}
            </p>
            <p className="text-white/40 text-xs leading-relaxed mb-5 px-2">
              The link expires in 30 minutes. Don't see it? Check your spam folder.
            </p>
            <button
              type="button"
              onClick={onBack}
              className="text-sm font-semibold text-gold-400 hover:text-gold-300 transition-colors">
              Back to sign in
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── ResetView ─────────────────────────────────────────────────────────────

function ResetView({ token, onSubmit, onBack }) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState(null)
  const [capsOn, setCapsOn] = useState(false)

  const pwValid = password.length >= 6
  const matches = pwValid && password === confirm
  const canSubmit = pwValid && matches && !loading

  async function handle(e) {
    e.preventDefault()
    if (!canSubmit) return
    setErr(null)
    setLoading(true)
    try {
      await onSubmit(token, password)
    } catch (e2) {
      setErr(e2?.message || 'Could not reset password. The link may have expired.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      key="reset"
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.2 }}>
      <div className="flex items-center gap-2 mb-5">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back"
          className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-all">
          <ArrowLeft size={16} />
        </button>
        <h2 className="font-display font-bold text-lg text-white">Choose a new password</h2>
      </div>

      <AnimatePresence>
        {err && <div className="mb-3"><InlineNotice kind="error">{err}</InlineNotice></div>}
      </AnimatePresence>

      <form onSubmit={handle} className="flex flex-col gap-3">
        <FloatingInput
          icon={Lock}
          type={showPw ? 'text' : 'password'}
          label="New password"
          value={password}
          onChange={setPassword}
          rightIcon={showPw ? <EyeOff size={15} /> : <Eye size={15} />}
          onRightClick={() => setShowPw(s => !s)}
          autoComplete="new-password"
          onCapsLock={setCapsOn}
          autoFocus
        />
        <FloatingInput
          icon={Lock}
          type={showPw ? 'text' : 'password'}
          label="Confirm new password"
          value={confirm}
          onChange={setConfirm}
          autoComplete="new-password"
          valid={matches}
        />

        <AnimatePresence>
          {password && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden">
              <PasswordStrengthBar password={password} />
            </motion.div>
          )}
        </AnimatePresence>

        {confirm && !matches && (
          <p className="text-[11px] text-red-300 px-1">Passwords don't match.</p>
        )}

        <AnimatePresence>
          {capsOn && password && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-amber-200"
                style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.18)' }}>
                <ShieldAlert size={12} /> Caps Lock is on
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <PrimaryButton loading={loading} disabled={!canSubmit}>
          Update Password
        </PrimaryButton>
      </form>
    </motion.div>
  )
}

// ─── Main Login ────────────────────────────────────────────────────────────

export default function Login() {
  const { login, register, forgotPassword, resetPassword, authLoading, error, setError } = useApp()

  const [accounts, setAccounts] = useState(() => loadKnown())
  const [resetToken, setResetToken] = useState(() => parseResetHash())
  const [view, setView] = useState(() => {
    if (parseResetHash()) return 'reset'
    return loadKnown().length > 0 ? 'welcome' : 'login'
  })
  const [pickedEmail, setPickedEmail] = useState('')
  const [successNotice, setSuccessNotice] = useState(null)

  // Keep view in sync if user navigates the hash manually.
  useEffect(() => {
    function onHash() {
      const t = parseResetHash()
      if (t) {
        setResetToken(t)
        setView('reset')
      }
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  function go(next) {
    setError(null)
    setView(next)
  }

  function handlePick(account) {
    setPickedEmail(account.email)
    go('login')
  }

  function handleForget(email) {
    forgetAccount(email)
    const next = loadKnown()
    setAccounts(next)
    if (next.length === 0) go('login')
  }

  async function handleLogin({ email, password, remember }) {
    try {
      await login(email, password, remember)
    } catch {}
  }

  async function handleRegister({ name, email, phone, password, remember }) {
    try {
      await register(name, email, phone, password, remember)
    } catch {}
  }

  async function handleForgotSubmit(email) {
    await forgotPassword(email)
  }

  async function handleResetSubmit(token, password) {
    await resetPassword(token, password)
    // Clear token from URL so a refresh doesn't replay the reset view.
    if (window.location.hash.startsWith('#/reset')) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search + '#/')
    }
    setResetToken(null)
    setSuccessNotice('Password updated — sign in below.')
    setAccounts(loadKnown())
    go('login')
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5 py-8 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #060b18 0%, #0d1526 50%, #111d35 100%)' }}>

      <BackgroundBlobs />

      <div className="w-full max-w-sm relative z-10">
        <BrandHero view={view} />

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

          <AnimatePresence>
            {successNotice && (
              <div className="mb-3">
                <InlineNotice kind="success">{successNotice}</InlineNotice>
              </div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {view === 'welcome' && (
              <WelcomeView
                key="welcome"
                accounts={accounts}
                onPick={handlePick}
                onForget={handleForget}
                onUseDifferent={() => { setPickedEmail(''); go('login') }}
                onCreate={() => go('register')}
              />
            )}
            {view === 'login' && (
              <LoginView
                key="login"
                initialEmail={pickedEmail}
                onSubmit={handleLogin}
                onForgot={() => go('forgot')}
                onRegister={() => go('register')}
                onBackToWelcome={() => go('welcome')}
                showBack={accounts.length > 0}
                authLoading={authLoading}
                error={error}
              />
            )}
            {view === 'register' && (
              <RegisterView
                key="register"
                onSubmit={handleRegister}
                onBack={() => go(accounts.length > 0 ? 'welcome' : 'login')}
                authLoading={authLoading}
                error={error}
              />
            )}
            {view === 'forgot' && (
              <ForgotView
                key="forgot"
                onSubmit={handleForgotSubmit}
                onBack={() => go('login')}
              />
            )}
            {view === 'reset' && (
              <ResetView
                key="reset"
                token={resetToken}
                onSubmit={handleResetSubmit}
                onBack={() => go('login')}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
