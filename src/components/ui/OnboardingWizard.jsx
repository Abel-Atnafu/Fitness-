import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { useApp } from '../../context/AppContext'

const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'Sedentary',  hint: 'Desk job, little exercise' },
  { id: 'light',     label: 'Light',      hint: '1–3 sessions/week' },
  { id: 'moderate',  label: 'Moderate',   hint: '3–5 sessions/week' },
  { id: 'very',      label: 'Very Active',hint: '6–7 sessions/week' },
  { id: 'extreme',   label: 'Extreme',    hint: 'Athlete / physical job' },
]

const LOSS_RATES = [
  { value: 0.25, label: '0.25 kg/w', hint: 'Gentle' },
  { value: 0.5,  label: '0.5 kg/w',  hint: 'Standard' },
  { value: 0.75, label: '0.75 kg/w', hint: 'Aggressive' },
  { value: 1.0,  label: '1 kg/w',    hint: 'Maximum' },
]

function Seg({ active, onClick, children, sub }) {
  return (
    <button type="button" onClick={onClick}
      className="flex-1 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-center"
      style={{
        background: active ? 'rgba(251,191,36,0.18)' : 'rgba(255,255,255,0.06)',
        border: `1px solid ${active ? 'rgba(251,191,36,0.45)' : 'rgba(255,255,255,0.1)'}`,
        color: active ? '#fbbf24' : 'rgba(255,255,255,0.55)',
      }}>
      {children}
      {sub && <div className="text-[10px] font-normal opacity-60 mt-0.5">{sub}</div>}
    </button>
  )
}

function NumInput({ label, value, onChange, suffix, min, max, step = '0.1' }) {
  return (
    <div>
      <p className="text-white/35 text-[11px] font-semibold uppercase tracking-wider mb-1.5">{label}</p>
      <div className="relative">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={e => onChange(e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-white text-sm font-medium outline-none"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
          onFocus={e => e.target.style.borderColor = 'rgba(251,191,36,0.5)'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
        />
        {suffix && <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 text-xs">{suffix}</span>}
      </div>
    </div>
  )
}

const STEPS = [
  { title: 'About you',     emoji: '👤', subtitle: 'Used to calculate your calorie target accurately' },
  { title: 'Your goal',     emoji: '🎯', subtitle: 'What are you working toward?' },
  { title: 'Activity level',emoji: '⚡', subtitle: 'How active are you day-to-day?' },
]

export function OnboardingWizard() {
  const { profile, updateProfile } = useApp()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    sex: null,
    age: '',
    heightCm: '',
    currentWeightKg: '',
    goalWeightKg: '',
    goalType: 'lose',
    weeklyRateKg: 0.5,
    activityLevel: 'sedentary',
  })

  const setF = key => val => setForm(f => ({ ...f, [key]: val }))

  const canNext = () => {
    if (step === 0) return form.sex && form.age && form.heightCm && form.currentWeightKg
    if (step === 1) return form.goalWeightKg || form.goalType === 'maintain'
    return true
  }

  const handleFinish = async () => {
    setSaving(true)
    try {
      await updateProfile({
        name: profile?.name,
        age: parseInt(form.age) || profile?.age,
        heightCm: parseFloat(form.heightCm) || profile?.heightCm,
        currentWeightKg: parseFloat(form.currentWeightKg) || profile?.currentWeightKg,
        goalWeightKg: parseFloat(form.goalWeightKg) || profile?.goalWeightKg,
        sex: form.sex,
        activityLevel: form.activityLevel,
        goalType: form.goalType,
        weeklyRateKg: form.weeklyRateKg,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-6"
      style={{ background: 'rgba(6,11,24,0.88)', backdropFilter: 'blur(12px)' }}>
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 24 }}
        className="w-full max-w-sm rounded-3xl p-6"
        style={{ background: '#0d1526', border: '1px solid rgba(255,255,255,0.1)' }}>

        {/* Progress dots */}
        <div className="flex gap-1.5 mb-5 justify-center">
          {STEPS.map((_, i) => (
            <div key={i} className="h-1 rounded-full transition-all"
              style={{
                width: i === step ? 24 : 8,
                background: i <= step ? '#fbbf24' : 'rgba(255,255,255,0.15)',
              }} />
          ))}
        </div>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="text-4xl mb-2">{STEPS[step].emoji}</div>
          <h2 className="font-display font-black text-2xl text-white">{STEPS[step].title}</h2>
          <p className="text-white/40 text-sm mt-1">{STEPS[step].subtitle}</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.18 }}
            className="flex flex-col gap-3 mb-5">

            {/* Step 0: About you */}
            {step === 0 && (
              <>
                <div>
                  <p className="text-white/35 text-[11px] font-semibold uppercase tracking-wider mb-1.5">Biological sex</p>
                  <div className="flex gap-2">
                    <Seg active={form.sex === 'male'} onClick={() => setF('sex')('male')}>Male</Seg>
                    <Seg active={form.sex === 'female'} onClick={() => setF('sex')('female')}>Female</Seg>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <NumInput label="Age" value={form.age} onChange={setF('age')} suffix="yrs" min="10" max="100" step="1" />
                  <NumInput label="Height" value={form.heightCm} onChange={setF('heightCm')} suffix="cm" min="100" max="250" />
                </div>
                <NumInput label="Current weight" value={form.currentWeightKg} onChange={setF('currentWeightKg')} suffix="kg" min="30" max="300" />
              </>
            )}

            {/* Step 1: Goal */}
            {step === 1 && (
              <>
                <div>
                  <p className="text-white/35 text-[11px] font-semibold uppercase tracking-wider mb-1.5">Goal type</p>
                  <div className="flex gap-2">
                    <Seg active={form.goalType === 'lose'} onClick={() => setF('goalType')('lose')}>Lose fat</Seg>
                    <Seg active={form.goalType === 'maintain'} onClick={() => setF('goalType')('maintain')}>Maintain</Seg>
                    <Seg active={form.goalType === 'gain'} onClick={() => setF('goalType')('gain')}>Gain</Seg>
                  </div>
                </div>
                <NumInput label="Goal weight" value={form.goalWeightKg} onChange={setF('goalWeightKg')} suffix="kg" min="30" max="300" />
                {form.goalType === 'lose' && (
                  <div>
                    <p className="text-white/35 text-[11px] font-semibold uppercase tracking-wider mb-1.5">Loss rate</p>
                    <div className="grid grid-cols-2 gap-2">
                      {LOSS_RATES.map(r => (
                        <Seg key={r.value} active={form.weeklyRateKg === r.value} onClick={() => setF('weeklyRateKg')(r.value)} sub={r.hint}>
                          {r.label}
                        </Seg>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Step 2: Activity */}
            {step === 2 && (
              <div className="flex flex-col gap-2">
                {ACTIVITY_LEVELS.map(a => (
                  <Seg key={a.id} active={form.activityLevel === a.id} onClick={() => setF('activityLevel')(a.id)} sub={a.hint}>
                    {a.label}
                  </Seg>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <motion.button
          whileTap={{ scale: 0.96 }}
          disabled={!canNext() || saving}
          onClick={() => step < 2 ? setStep(s => s + 1) : handleFinish()}
          className="w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
          style={{
            background: canNext() ? 'linear-gradient(135deg, #d97706, #fbbf24)' : 'rgba(255,255,255,0.07)',
            color: canNext() ? '#060b18' : 'rgba(255,255,255,0.25)',
          }}>
          {step < 2 ? <>Continue <ChevronRight size={16} /></> : saving ? 'Setting up…' : "Let's go! 🚀"}
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
