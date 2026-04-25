import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Save, LogOut } from 'lucide-react'
import { PageTransition } from '../components/ui/PageTransition'
import { useApp } from '../context/AppContext'
import { Spinner } from '../components/ui/Spinner'

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

export default function Profile() {
  const { profile, updateProfile, resetData, logout, bmi } = useApp()
  const [form, setForm] = useState({
    name: profile?.name ?? '',
    age: profile?.age ?? 22,
    heightCm: profile?.heightCm ?? 185,
    currentWeightKg: profile?.currentWeightKg ?? 95,
    goalWeightKg: profile?.goalWeightKg ?? 80,
    gender: profile?.gender ?? 'male',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)

  const setField = key => val => setForm(f => ({ ...f, [key]: val }))

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateProfile({
        name: form.name,
        age: parseInt(form.age),
        heightCm: parseFloat(form.heightCm),
        currentWeightKg: parseFloat(form.currentWeightKg),
        goalWeightKg: parseFloat(form.goalWeightKg),
        gender: form.gender,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } finally {
      setSaving(false)
    }
  }

  const liveCalTarget = (() => {
    const w = parseFloat(form.currentWeightKg)
    const h = parseFloat(form.heightCm)
    const a = parseInt(form.age)
    if (!w || !h || !a) return profile?.dailyCalorieTarget ?? 1900
    const constant = form.gender === 'female' ? -161 : form.gender === 'other' ? -78 : 5
    return Math.round((10 * w + 6.25 * h - 5 * a + constant) * 1.2 - 500)
  })()

  const bmiLabel = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese'
  const bmiColor = bmi < 25 ? '#84cc16' : bmi < 30 ? '#f59e0b' : '#f87171'

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
            <p>Auto-calculated</p>
            <p>from profile</p>
          </div>
        </div>

        {/* Edit form */}
        <div className="rounded-2xl p-5 flex flex-col gap-4"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-white/35 text-[11px] uppercase tracking-widest font-semibold">Edit Profile</p>
          <Field label="Name" value={form.name} onChange={setField('name')} type="text" />
          <div>
            <label className="text-white/35 text-[11px] font-semibold uppercase tracking-wider block mb-1.5">Gender</label>
            <div className="flex gap-2">
              {[
                { v: 'male', label: 'Male' },
                { v: 'female', label: 'Female' },
                { v: 'other', label: 'Other' },
              ].map(g => (
                <button
                  key={g.v}
                  type="button"
                  onClick={() => setField('gender')(g.v)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all"
                  style={form.gender === g.v
                    ? { background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.35)' }
                    : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {g.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Age" value={form.age} onChange={setField('age')} min="10" max="100" step="1" suffix="yrs" />
            <Field label="Height" value={form.heightCm} onChange={setField('heightCm')} min="100" max="250" suffix="cm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Weight" value={form.currentWeightKg} onChange={setField('currentWeightKg')} min="40" max="300" suffix="kg" />
            <Field label="Goal" value={form.goalWeightKg} onChange={setField('goalWeightKg')} min="40" max="300" suffix="kg" />
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
          <p className="text-white/35 text-[11px] uppercase tracking-widest font-semibold mb-3">Dietary Preferences</p>
          <div className="flex flex-wrap gap-2">
            {['🥑 Avocado', '🥗 Salad', '🥩 Meat', '🐟 Fish', '🇪🇹 Ethiopian', '🌍 International'].map(item => (
              <span key={item} className="text-xs px-3 py-1.5 rounded-full font-medium"
                style={{ background: 'rgba(132,204,22,0.09)', color: '#84cc16', border: '1px solid rgba(132,204,22,0.2)' }}>
                {item} ✓
              </span>
            ))}
            {['🥦 Vegetables', '🥛 Yogurt', '🥚 Boiled Eggs'].map(item => (
              <span key={item} className="text-xs px-3 py-1.5 rounded-full font-medium"
                style={{ background: 'rgba(248,113,113,0.09)', color: '#f87171', border: '1px solid rgba(248,113,113,0.18)' }}>
                {item} ✗
              </span>
            ))}
          </div>
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
