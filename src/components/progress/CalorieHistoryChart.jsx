import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell, CartesianGrid } from 'recharts'
import { format, subDays, parseISO } from 'date-fns'
import { useApp } from '../../context/AppContext'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const val = payload[0].value
  return (
    <div className="rounded-xl px-3 py-2 text-sm" style={{ background: '#1a2a47', border: '1px solid rgba(255,255,255,0.12)' }}>
      <p className="text-white/50 text-xs mb-1">{label}</p>
      <p className="font-display font-bold" style={{ color: val > 1900 ? '#f87171' : '#84cc16' }}>{val} kcal</p>
    </div>
  )
}

export function CalorieHistoryChart() {
  const { state } = useApp()
  const target = state.profile.dailyCalorieTarget

  const data = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i)
    const key = format(date, 'yyyy-MM-dd')
    const log = state.dailyLogs[key]
    const calories = log ? (log.foodEntries || []).reduce((s, e) => s + e.calories, 0) : 0
    return { date: format(date, 'EEE'), calories }
  })

  const hasData = data.some(d => d.calories > 0)

  if (!hasData) {
    return (
      <div className="h-36 flex flex-col items-center justify-center text-center">
        <span className="text-3xl">📊</span>
        <p className="text-white/30 text-sm mt-2">Start logging food to see history</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }} barSize={28}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={target} stroke="rgba(251,191,36,0.5)" strokeDasharray="5 3" strokeWidth={1.5} />
        <Bar dataKey="calories" radius={[6, 6, 0, 0]}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.calories === 0 ? 'rgba(255,255,255,0.06)' : entry.calories > target ? '#f87171' : '#84cc16'}
              fillOpacity={entry.calories === 0 ? 1 : 0.85}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
