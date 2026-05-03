import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts'
import { format, subDays } from 'date-fns'
import { useApp } from '../../context/AppContext'

const MACROS = [
  { key: 'totalProtein', targetKey: 'protein', label: 'Protein', color: '#f87171' },
  { key: 'totalCarbs',   targetKey: 'carbs',   label: 'Carbs',   color: '#fbbf24' },
  { key: 'totalFat',     targetKey: 'fat',     label: 'Fat',     color: '#a78bfa' },
]

function Tip({ active, payload, label, color, suffix }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl px-3 py-2 text-sm" style={{ background: '#1a2a47', border: '1px solid rgba(255,255,255,0.1)' }}>
      <p className="text-white/40 text-xs mb-1">{label}</p>
      <p className="font-display font-bold" style={{ color }}>{Math.round(payload[0].value)} {suffix}</p>
    </div>
  )
}

export function MacroTrendChart({ days = 30 }) {
  const { recentHistory, macroTargets } = useApp()

  const map = Object.fromEntries(recentHistory.map(h => [h.date, h]))
  const labelFmt = days <= 7 ? 'EEE' : days <= 30 ? 'd' : 'MMM d'
  const interval = days <= 7 ? 0 : days <= 30 ? 4 : 13

  const series = Array.from({ length: days }, (_, i) => {
    const d = subDays(new Date(), days - 1 - i)
    const key = format(d, 'yyyy-MM-dd')
    const row = map[key]
    return {
      date: format(d, labelFmt),
      totalProtein: row?.totalProtein ?? 0,
      totalCarbs: row?.totalCarbs ?? 0,
      totalFat: row?.totalFat ?? 0,
    }
  })

  const hasData = series.some(s => s.totalProtein || s.totalCarbs || s.totalFat)
  if (!hasData) {
    return (
      <div className="h-36 flex flex-col items-center justify-center text-center gap-2">
        <span className="text-3xl opacity-40">🍗</span>
        <p className="text-white/25 text-sm">Log food with macros to see trends</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {MACROS.map(m => {
        const target = macroTargets[m.targetKey] ?? 0
        return (
          <div key={m.key}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-white/55 text-[11px] font-semibold uppercase tracking-wider">{m.label}</span>
              <span className="text-white/30 text-[10px]">target {target} g</span>
            </div>
            <ResponsiveContainer width="100%" height={70}>
              <LineChart data={series} margin={{ top: 4, right: 6, left: -28, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.28)', fontSize: 9 }}
                  axisLine={false} tickLine={false} interval={interval} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.28)', fontSize: 9 }} axisLine={false} tickLine={false} width={32} />
                <Tooltip content={<Tip color={m.color} suffix="g" />} />
                {target > 0 && (
                  <ReferenceLine y={target} stroke={m.color} strokeOpacity={0.35} strokeDasharray="4 3" />
                )}
                <Line type="monotone" dataKey={m.key} stroke={m.color} strokeWidth={2}
                  dot={false} activeDot={{ r: 4, fill: m.color, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )
      })}
    </div>
  )
}
