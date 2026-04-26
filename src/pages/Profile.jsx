import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Save, LogOut } from 'lucide-react'
import { PageTransition } from '../components/ui/PageTransition'
import { useApp } from '../context/AppContext'
import { Spinner } from '../components/ui/Spinner'

const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'Sedentary',  hint: 'Desk job, little exercise',     mult: 1.2 },
  { id: 'light',     label: 'Light',      hint: '1–3 sessions/week',             mult: 1.375 },
  { id: 'moderate',  label: 'Moderate',   hint: '3–5 sessions/week',             mult: 1.55 },
  { id: 'very',      label: 'Very',       hint: '6–7 sessions/week',             mult: 1.725 },
  { id: 'extreme',   label: 'Extreme',    hint: 'Athlete or physical job',       mult: 1.9 },
]

const GOALS = [
  { id: 'lose',     label: 'Lose fat' },
  { id: 'maintain', label: 'Maintain' },
  { id: 'gain',     label: 'Gain' },
]

const LOSS_RATES = [
  { value: 0.25, label: '0.25 kg/w', hint: 'Gentle' },
  { value: 0.5,  label: '0.5 kg/w',  hint: 'Standard' },
  { value: 0.75, label: '0.75 kg/w', hint: 'Aggressive' },
  { value: 1.0,  label: '1 kg/w',    hint: 'Max' },
]

const DIETARY_OPTIONS = [
  'Vegetarian', 'Vegan', 'Pescatarian', 'Halal', 'Kosher',
  'Keto', 'Mediterranean', 'Gluten-free', 'Dairy-free',
]

function liveTarget({ age, heightCm, weightKg, sex, activityLevel, goalType, weeklyRateKg }) {
  const w = parseFloat(weightKg), h = parseFloat(heightCm), a = parseInt(age)
  if (!w || !h || !a) return null
  const sexConst = sex === 'female' ? -161 : sex === 'male' ? 5 : -78
  const bmr = 10 * w + 6.25 * h - 5 * a + sexConst
  const mult = ACTIVITY_LEVELS.find(x => x.id === activityLevel)?.mult ?? 1.2
  const delta = goalType === 'lose'
    ? -Math.round((weeklyRateKg ?? 0.5) * 7700 / 7)
    : goalType === 'gain' ? 300 : 0
  const target = Math.round(bmr * mult + delta)
  const floor = sex === 'female' ? 1200 : 1500
  return Math.max(target, floor)
}

function Field({ label, value, onChange, type = 'number', min, max, step = '0.1', suffix }) {
  return (
    <div>
      <label className="text-white/35 text-[11px] font-semibold uppercase tracking-wider block mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={e => onChange(e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-white text-sm font-medium outline-none"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}
          onFocus={e => e.target.style.borderColor = 'rgba(251,191,36,0.4)'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.09)'}
        />
        {suffix && <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 text-xs">{suffix}</span>}
      </div>
    </div>
  )
}

function SegButton({ active, onClick, children, sub }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all"
      style={{
        background: active ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.05)',
        border: `1px solid ${active ? 'rgba(251,191,36,0.45)' : 'rgba(255,255,255,0.08)'}`,
        color: active ? '#fbbf24' : 'rgba(255,255,255,0.6)',
      }}>
      {children}
      {sub && <div className="text-[10px] font-normal opacity-60 mt-0.5">{sub}</div>}
    </button>
  )
}

function Chip({ active, onClick, children }) {
  return (
    <button type="button" onClick={onClick}
      className="text-xs px-3 py-1.5 rounded-full font-medium transition-all"
      style={{
        background: active ? 'rgba(132,204,22,0.15)' : 'rgba(255,255,255,0.05)',
        border: `1px solid ${active ? 'rgba(132,204,22,0.4)' : 'rgba(255,255,255,0.09)'}`,
        color: active ? '#84cc16' : 'rgba(255,255,255,0.5)',
      }}>
      {children}
    </button>
  )
}

export default function Profile() {
  const { profile, updateProfile, resetData, logout, bmi } = useApp()
  const [form, setForm] = useState({
    name: profile?.name ?? '',
    age: profile?.age ?? 22,
    heightCm: profile?.heightCm ?? 185,
    currentWeightKg: profile?.currentWeightKg ?? 95,
    goalWeightKg: profile?.goalWeightKg ?? 80,
    sex: profile?.sex ?? null,
    activityLevel: profile?.activityLevel ?? 'sedentary',
    goalType: profile?.goalType ?? 'lose',
    weeklyRateKg: profile?.weeklyRateKg ?? 0.5,
    dietaryPreferences: profile?.dietaryPreferences ?? [],
    allergies: profile?.allergies ?? [],
  })
  const [allergyInput, setAllergyInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)

  const setField = key => val => setForm(f => ({ ...f, [key]: val }))

  function togglePref(p) {
    setForm(f => ({
      ...f,
      dietaryPreferences: f.dietaryPreferences.includes(p)
        ? f.dietaryPreferences.filter(x => x !== p)
        : [...f.dietaryPreferences, p],
    }))
  }

  function addAllergy() {
    const t = allergyInput.trim()
    if (!t) return
    if (form.allergies.some(a => a.toLowerCase() === t.toLowerCase())) {
      setAllergyInput(''); return
    }
    setForm(f => ({ ...f, allergies: [...f.allergies, t] }))
    setAllergyInput('')
  }

  function removeAllergy(a) {
    setForm(f => ({ ...f, allergies: f.allergies.filter(x => x !== a) }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateProfile({
        name: form.name,
        age: parseInt(form.age),
        heightCm: parseFloat(form.heightCm),
        currentWeightKg: parseFloat(form.currentWeightKg),
        goalWeightKg: parseFloat(form.goalWeightKg),
        sex: form.sex,
        activityLevel: form.activityLevel,
        goalType: form.goalType,
        weeklyRateKg: form.weeklyRateKg,
        dietaryPreferences: form.dietaryPreferences,
        allergies: form.allergies,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } finally {
      setSaving(false)
    }
  }

  const liveCalTarget = liveTarget({ ...form, weightKg: form.currentWeightKg }) ?? profile?.dailyCalorieTarget ?? 1900
  const deficitLabel = form.goalType === 'lose'
    ? `− ${Math.round((form.weeklyRateKg ?? 0.5) * 7700 / 7)} kcal/day deficit`
    : form.goalType === 'gain' ? '+ 300 kcal surplus' : 'maintenance'
  const bmiLabel = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese'
  const bmiColor = bmi < 25 ? '#84cc16' : bmi < 30 ? '#f59e0b' : '#f87171'
  const sexMissing = !form.sex

  return (
    <PageTransition>
      <div className="py-2 flex flex-col gap-5">

        {/* Profile header */}
        <div className="flex items-center gap-4 p-5 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-display font-black text-3xl text-navy-950 flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #d97706, #fbbf24)' }}>
            {profile?.name?.[0]?.toUpperCase() ?? 'A'}
          </div>
          <div className="min-w-0">
            <h2 className="font-display font-bold text-xl text-white truncate">{profile?.name}</h2>
            <p className="text-white/35 text-sm">{profile?.email}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: `${bmiColor}18`, color: bmiColor }}>
                BMI {bmi} — {bmiLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Calorie target */}
        <div className="flex items-center justify-between px-5 py-4 rounded-2xl"
          style={{ background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.18)' }}>
          <div>
            <p className="text-white/40 text-[11px] uppercase tracking-widest font-semibold">Daily Target</p>
            <p className="font-display font-black text-3xl text-gold-400 mt-0.5">{liveCalTarget}<span className="text-base font-semibold text-gold-500/70 ml-1">kcal</span></p>
          </div>
          <div className="text-right text-xs text-white/25 leading-relaxed">
            <p>BMR × activity</p>
            <p>{deficitLabel}</p>
          </div>
        </div>

        {sexMissing && (
          <div className="px-4 py-3 rounded-xl text-xs"
            style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)', color: '#fbbf24' }}>
            Pick your biological sex below — without it your calorie target can be off by ~165 kcal/day.
          </div>
        )}

        {/* Edit form */}
        <div className="rounded-2xl p-5 flex flex-col gap-4"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-white/35 text-[11px] uppercase tracking-widest font-semibold">Edit Profile</p>
          <Field label="Name" value={form.name} onChange={setField('name')} type="text" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Age" value={form.age} onChange={setField('age')} min="10" max="100" step="1" suffix="yrs" />
            <Field label="Height" value={form.heightCm} onChange={setField('heightCm')} min="100" max="250" suffix="cm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Weight" value={form.currentWeightKg} onChange={setField('currentWeightKg')} min="40" max="300" suffix="kg" />
            <Field label="Goal" value={form.goalWeightKg} onChange={setField('goalWeightKg')} min="40" max="300" suffix="kg" />
          </div>

          {/* Sex */}
          <div>
            <p className="text-white/35 text-[11px] font-semibold uppercase tracking-wider mb-1.5">Biological sex</p>
            <div className="flex gap-2">
              <SegButton active={form.sex === 'male'} onClick={() => setField('sex')('male')}>Male</SegButton>
              <SegButton active={form.sex === 'female'} onClick={() => setField('sex')('female')}>Female</SegButton>
            </div>
          </div>

          {/* Goal type */}
          <div>
            <p className="text-white/35 text-[11px] font-semibold uppercase tracking-wider mb-1.5">Goal</p>
            <div className="flex gap-2">
              {GOALS.map(g => (
                <SegButton key={g.id} active={form.goalType === g.id} onClick={() => setField('goalType')(g.id)}>
                  {g.label}
                </SegButton>
              ))}
            </div>
          </div>

          {/* Loss rate — only when goal is lose */}
          {form.goalType === 'lose' && (
            <div>
              <p className="text-white/35 text-[11px] font-semibold uppercase tracking-wider mb-1.5">Loss rate</p>
              <div className="grid grid-cols-2 gap-2">
                {LOSS_RATES.map(r => (
                  <SegButton key={r.value} active={form.weeklyRateKg === r.value} onClick={() => setField('weeklyRateKg')(r.value)} sub={r.hint}>
                    {r.label}
                  </SegButton>
                ))}
              </div>
            </div>
          )}

          {/* Activity level */}
          <div>
            <p className="text-white/35 text-[11px] font-semibold uppercase tracking-wider mb-1.5">Activity level</p>
            <div className="grid grid-cols-2 gap-2">
              {ACTIVITY_LEVELS.map(a => (
                <SegButton key={a.id} active={form.activityLevel === a.id} onClick={() => setField('activityLevel')(a.id)} sub={a.hint}>
                  {a.label}
                </SegButton>
              ))}
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all"
            style={{
              background: saved ? 'linear-gradient(135deg, #065f46, #84cc16)' : 'linear-gradient(135deg, #d97706, #fbbf24)',
              color: '#060b18',
            }}>
            {saving ? <Spinner size={16} /> : <Save size={15} />}
            {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save Changes'}
          </motion.button>
        </div>

        {/* Dietary preferences */}
        <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-white/35 text-[11px] uppercase tracking-widest font-semibold mb-3">Dietary patterns</p>
          <div className="flex flex-wrap gap-2">
            {DIETARY_OPTIONS.map(p => (
              <Chip key={p} active={form.dietaryPreferences.includes(p)} onClick={() => togglePref(p)}>
                {p}
              </Chip>
            ))}
          </div>
        </div>

        {/* Allergies */}
        <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-white/35 text-[11px] uppercase tracking-widest font-semibold mb-3">Allergies & intolerances</p>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={allergyInput}
              onChange={e => setAllergyInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addAllergy() } }}
              placeholder="e.g. peanuts, lactose"
              className="flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-medium outline-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}
            />
            <button type="button" onClick={addAllergy}
              className="px-4 py-2.5 rounded-xl text-xs font-bold"
              style={{ background: 'rgba(248,113,113,0.12)', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)' }}>
              Add
            </button>
          </div>
          {form.allergies.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {form.allergies.map(a => (
                <button key={a} type="button" onClick={() => removeAllergy(a)}
                  className="text-xs px-3 py-1.5 rounded-full font-medium"
                  style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.25)' }}>
                  {a} ✕
                </button>
              ))}
            </div>
          ) : (
            <p className="text-white/30 text-xs">None added yet.</p>
          )}
        </div>

        {/* Account actions */}
        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={logout}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white/55"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}>
            <LogOut size={14} />Sign Out
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => setConfirmReset(true)}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-red-400"
            style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.18)' }}>
            <Trash2 size={14} />Reset Data
          </motion.button>
        </div>

        {/* Confirm reset modal */}
        <AnimatePresence>
          {confirmReset && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center px-6"
              style={{ background: 'rgba(6,11,24,0.82)', backdropFilter: 'blur(10px)' }}
              onClick={() => setConfirmReset(false)}>
              <motion.div
                initial={{ scale: 0.88, y: 16 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.88, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-sm rounded-2xl p-6"
                style={{ background: '#111d35', border: '1px solid rgba(255,255,255,0.1)' }}>
                <h3 className="font-display font-bold text-xl text-white mb-2">Reset all data?</h3>
                <p className="text-white/45 text-sm mb-5 leading-relaxed">This deletes all food logs, weight entries, and your streak. Your profile is kept.</p>
                <div className="flex gap-3">
                  <button onClick={() => setConfirmReset(false)}
                    className="flex-1 py-3 rounded-xl font-semibold text-white/50 text-sm"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    Cancel
                  </button>
                  <button
                    onClick={() => { resetData(); setConfirmReset(false) }}
                    className="flex-1 py-3 rounded-xl font-bold text-white text-sm"
                    style={{ background: 'rgba(218,18,26,0.35)', border: '1px solid rgba(218,18,26,0.45)' }}>
                    Reset
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}
