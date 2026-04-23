import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageTransition } from '../components/ui/PageTransition'
import { useApp } from '../context/AppContext'
import { User, Target, Ruler, Weight, Trash2, X } from 'lucide-react'

function Field({ label, value, onChange, type = 'number', min, max, step = '0.1', suffix }) {
  return (
    <div>
      <label className="text-white/40 text-xs font-medium uppercase tracking-wider block mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={e => onChange(e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-white text-sm font-medium outline-none focus:ring-1 focus:ring-gold-500/50"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 text-xs">{suffix}</span>}
      </div>
    </div>
  )
}

export default function Profile() {
  const { state, dispatch } = useApp()
  const p = state.profile
  const [form, setForm] = useState({
    name: p.name,
    age: p.age,
    heightCm: p.heightCm,
    currentWeightKg: p.currentWeightKg,
    goalWeightKg: p.goalWeightKg,
  })
  const [saved, setSaved] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)

  const setField = (key) => (val) => setForm(f => ({ ...f, [key]: val }))

  const handleSave = () => {
    dispatch({
      type: 'UPDATE_PROFILE',
      payload: {
        name: form.name,
        age: parseInt(form.age),
        heightCm: parseFloat(form.heightCm),
        currentWeightKg: parseFloat(form.currentWeightKg),
        goalWeightKg: parseFloat(form.goalWeightKg),
      },
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const bmi = +(parseFloat(form.currentWeightKg) / ((parseFloat(form.heightCm) / 100) ** 2)).toFixed(1)
  const bmiLabel = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese'
  const bmiColor = bmi < 25 ? '#84cc16' : bmi < 30 ? '#fbbf24' : '#f87171'

  return (
    <PageTransition>
      <div className="py-2 flex flex-col gap-5">

        {/* Avatar / header */}
        <div className="flex items-center gap-4 p-4 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-gold-glow"
            style={{ background: 'linear-gradient(135deg, #d97706, #fbbf24)', color: '#060b18' }}>
            {form.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-white">{form.name}</h2>
            <p className="text-white/40 text-sm">Male · {form.age} yrs · {form.heightCm} cm</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ background: `${bmiColor}18`, color: bmiColor, border: `1px solid ${bmiColor}30` }}>
                BMI {bmi} — {bmiLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Calorie target display */}
        <div className="flex items-center justify-between px-4 py-3 rounded-2xl"
          style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
          <div>
            <p className="text-white/50 text-xs uppercase tracking-widest font-medium">Daily Calorie Target</p>
            <p className="font-display font-bold text-2xl text-gold-400 mt-0.5">{p.dailyCalorieTarget} kcal</p>
          </div>
          <div className="text-right text-xs text-white/30">
            <p>Auto-calculated</p>
            <p>from your profile</p>
          </div>
        </div>

        {/* Edit form */}
        <div className="rounded-2xl p-4 flex flex-col gap-4"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-white/40 text-xs uppercase tracking-widest font-semibold">Edit Profile</p>
          <Field label="Name" value={form.name} onChange={setField('name')} type="text" />
          <Field label="Age" value={form.age} onChange={setField('age')} min="10" max="100" step="1" suffix="yrs" />
          <Field label="Height" value={form.heightCm} onChange={setField('heightCm')} min="100" max="250" suffix="cm" />
          <Field label="Current Weight" value={form.currentWeightKg} onChange={setField('currentWeightKg')} min="40" max="250" suffix="kg" />
          <Field label="Goal Weight" value={form.goalWeightKg} onChange={setField('goalWeightKg')} min="40" max="250" suffix="kg" />

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="py-3.5 rounded-xl font-semibold text-navy-950 transition-all"
            style={{ background: saved ? 'linear-gradient(135deg, #065f46, #84cc16)' : 'linear-gradient(135deg, #d97706, #fbbf24)' }}>
            {saved ? '✓ Saved!' : 'Save Changes'}
          </motion.button>
        </div>

        {/* Food restrictions */}
        <div className="rounded-2xl p-4"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-3">Dietary Preferences</p>
          <div className="flex flex-wrap gap-2">
            {['🥑 Avocado ✓', '🥗 Salad ✓', '🥩 Meat ✓', '🐟 Fish ✓', '🇪🇹 Ethiopian ✓', '🌍 International ✓'].map(item => (
              <span key={item} className="text-xs px-3 py-1.5 rounded-full font-medium"
                style={{ background: 'rgba(132,204,22,0.1)', color: '#84cc16', border: '1px solid rgba(132,204,22,0.25)' }}>
                {item}
              </span>
            ))}
            {['🥦 Vegetables ✗', '🥛 Yogurt ✗', '🥚 Boiled Eggs ✗'].map(item => (
              <span key={item} className="text-xs px-3 py-1.5 rounded-full font-medium"
                style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' }}>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Danger zone */}
        <div className="rounded-2xl p-4"
          style={{ background: 'rgba(218,18,26,0.05)', border: '1px solid rgba(218,18,26,0.2)' }}>
          <p className="text-red-400/70 text-xs uppercase tracking-widest font-semibold mb-3">Danger Zone</p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setConfirmReset(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400"
            style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)' }}>
            <Trash2 size={14} />
            Reset All Data
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
              style={{ background: 'rgba(6,11,24,0.85)', backdropFilter: 'blur(8px)' }}
              onClick={() => setConfirmReset(false)}>
              <motion.div
                initial={{ scale: 0.85, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.85, y: 20 }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-sm rounded-2xl p-6"
                style={{ background: '#111d35', border: '1px solid rgba(255,255,255,0.1)' }}>
                <h3 className="font-display font-bold text-xl text-white mb-2">Reset Everything?</h3>
                <p className="text-white/50 text-sm mb-5">This will delete all your food logs, weight entries, and streak. Your profile settings will be kept.</p>
                <div className="flex gap-3">
                  <button onClick={() => setConfirmReset(false)}
                    className="flex-1 py-3 rounded-xl font-semibold text-white/60"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    Cancel
                  </button>
                  <button
                    onClick={() => { dispatch({ type: 'RESET_DATA' }); setConfirmReset(false) }}
                    className="flex-1 py-3 rounded-xl font-semibold text-white"
                    style={{ background: 'rgba(218,18,26,0.4)', border: '1px solid rgba(218,18,26,0.5)' }}>
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
