import { motion } from 'framer-motion'
import { useApp } from '../../context/AppContext'

const MACROS = [
  { key: 'protein', label: 'Protein', color: '#f87171' },
  { key: 'carbs',   label: 'Carbs',   color: '#fbbf24' },
  { key: 'fat',     label: 'Fat',     color: '#a78bfa' },
]

function statusColor(current, target, baseColor) {
  if (target <= 0) return baseColor
  const ratio = current / target
  if (ratio > 1.1) return '#f87171'
  if (ratio < 0.6) return '#fbbf24'
  return baseColor
}

export function MacroBars() {
  const { macroTotals, macroTargets } = useApp()

  return (
    <div className="flex flex-col gap-3 mt-4">
      {MACROS.map((m, i) => {
        const current = Math.round(macroTotals[m.key] ?? 0)
        const target = macroTargets[m.key] ?? 0
        const pct = target > 0 ? Math.min(current / target, 1.2) : 0
        const color = statusColor(current, target, m.color)
        return (
          <div key={m.key}>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-white/50 text-[11px] font-semibold uppercase tracking-wider">{m.label}</span>
              <span className="text-white/40 text-[11px]">
                <span className="text-white/80 font-semibold">{current}</span>
                <span className="text-white/30"> / {target} g</span>
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: color }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(pct, 1) * 100}%` }}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.06 }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
