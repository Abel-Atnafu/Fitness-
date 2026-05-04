import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, BellOff, Check } from 'lucide-react'

const REMINDERS = [
  { id: 'breakfast', label: 'Breakfast reminder', time: '08:00', emoji: '🍳' },
  { id: 'lunch',     label: 'Lunch reminder',     time: '12:30', emoji: '🥗' },
  { id: 'dinner',    label: 'Dinner reminder',     time: '19:00', emoji: '🍽️' },
  { id: 'water',     label: 'Water reminder',      time: '10:00', emoji: '💧' },
  { id: 'weight',    label: 'Weigh-in reminder',   time: '07:00', emoji: '⚖️' },
]

function getPermission() {
  if (!('Notification' in window)) return 'unsupported'
  return Notification.permission
}

async function requestPermission() {
  if (!('Notification' in window)) return 'unsupported'
  return Notification.requestPermission()
}

function scheduleReminder(id, time, label, emoji) {
  const [h, m] = time.split(':').map(Number)
  const now = new Date()
  const target = new Date()
  target.setHours(h, m, 0, 0)
  if (target <= now) target.setDate(target.getDate() + 1)
  const delay = target - now

  // Clear existing timer
  const key = `fitethio-notif-timer-${id}`
  const existingId = sessionStorage.getItem(key)
  if (existingId) clearTimeout(parseInt(existingId))

  // Schedule new notification
  const timerId = setTimeout(() => {
    if (Notification.permission === 'granted') {
      new Notification(`FitEthio ${emoji}`, {
        body: label,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
      })
    }
    sessionStorage.removeItem(key)
  }, delay)
  sessionStorage.setItem(key, String(timerId))
}

function clearReminder(id) {
  const key = `fitethio-notif-timer-${id}`
  const existingId = sessionStorage.getItem(key)
  if (existingId) { clearTimeout(parseInt(existingId)); sessionStorage.removeItem(key) }
}

export function NotificationSettings() {
  const [permission, setPermission] = useState(getPermission)
  const [enabled, setEnabled] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fitethio-notif-prefs') ?? '{}') } catch { return {} }
  })
  const [expanded, setExpanded] = useState(false)

  // Re-schedule on mount
  useEffect(() => {
    if (permission !== 'granted') return
    REMINDERS.forEach(r => {
      if (enabled[r.id]) scheduleReminder(r.id, r.time, r.label, r.emoji)
    })
  }, [])

  async function handleEnableAll() {
    const perm = await requestPermission()
    setPermission(perm)
    if (perm === 'granted') {
      const all = Object.fromEntries(REMINDERS.map(r => [r.id, true]))
      setEnabled(all)
      localStorage.setItem('fitethio-notif-prefs', JSON.stringify(all))
      REMINDERS.forEach(r => scheduleReminder(r.id, r.time, r.label, r.emoji))
    }
  }

  function toggleReminder(id) {
    const r = REMINDERS.find(r => r.id === id)
    const next = { ...enabled, [id]: !enabled[id] }
    setEnabled(next)
    localStorage.setItem('fitethio-notif-prefs', JSON.stringify(next))
    if (next[id]) scheduleReminder(id, r.time, r.label, r.emoji)
    else clearReminder(id)
  }

  const anyEnabled = Object.values(enabled).some(Boolean)

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <button
        className="w-full flex items-center gap-3 p-5"
        onClick={() => setExpanded(v => !v)}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: anyEnabled ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.07)' }}>
          {anyEnabled
            ? <Bell size={16} className="text-gold-400" />
            : <BellOff size={16} className="text-white/30" />}
        </div>
        <div className="flex-1 text-left">
          <p className="text-white text-sm font-semibold">Notifications</p>
          <p className="text-white/35 text-xs">
            {permission === 'unsupported' ? 'Not supported on this browser'
              : permission === 'denied' ? 'Blocked — enable in browser settings'
              : anyEnabled ? `${Object.values(enabled).filter(Boolean).length} reminder(s) active`
              : 'Tap to set up reminders'}
          </p>
        </div>
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 5l4 4 4-4" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden">
            <div className="px-5 pb-5 flex flex-col gap-3">
              {permission !== 'granted' && permission !== 'unsupported' && permission !== 'denied' && (
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={handleEnableAll}
                  className="w-full py-3 rounded-xl font-bold text-sm text-navy-950 flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #d97706, #fbbf24)' }}>
                  <Bell size={14} />Enable Notifications
                </motion.button>
              )}
              {permission === 'denied' && (
                <p className="text-red-400/70 text-xs px-1 py-2">
                  Notifications are blocked. Go to browser settings → Site Settings → Notifications to re-enable.
                </p>
              )}
              {(permission === 'granted' || permission === 'default') && (
                <div className="flex flex-col gap-2">
                  {REMINDERS.map(r => (
                    <div key={r.id} className="flex items-center gap-3">
                      <span className="text-lg">{r.emoji}</span>
                      <div className="flex-1">
                        <p className="text-white/80 text-sm">{r.label}</p>
                        <p className="text-white/30 text-xs">{r.time}</p>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.88 }}
                        onClick={async () => {
                          if (permission !== 'granted') {
                            const p = await requestPermission()
                            setPermission(p)
                            if (p !== 'granted') return
                          }
                          toggleReminder(r.id)
                        }}
                        className="w-10 h-6 rounded-full flex items-center transition-all relative"
                        style={{
                          background: enabled[r.id] ? 'rgba(251,191,36,0.3)' : 'rgba(255,255,255,0.1)',
                          padding: '0 2px',
                        }}>
                        <motion.div
                          animate={{ x: enabled[r.id] ? 18 : 0 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                          className="w-5 h-5 rounded-full"
                          style={{ background: enabled[r.id] ? '#fbbf24' : 'rgba(255,255,255,0.3)', flexShrink: 0 }}
                        />
                      </motion.button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
