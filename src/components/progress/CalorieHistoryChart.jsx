import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell, CartesianGrid } from 'recharts'
import { format, subDays } from 'date-fns'
import { useApp } from '../../context/AppContext'

function Tip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const val = payload[0].value
  return (
    <div className="rounded-xl px-3 py-2 text-sm" style={{ background: '#1a2a47', border: '1px solid rgba(255,255,255,0.1)' }}>
      <p className="text-white/40 text-xs mb-1">{label}</p>
      <p className="font-display font-bold" style={{ color: val > 1900 ? '#f87171' : '#84cc16' }}>{val} kcal</p>
    </div>
  )
}

export function CalorieHistoryChart() {
  const { recentHistory, profile } = useApp()
  const target = profile?.dailyCalorieTarget ?? 1900

  const historyMap = Object.fromEntries(recentHistory.map(h => [h.date, h.totalCalories]))

  const data = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), 6 - i)
    const key = format(d, 'yyyy-MM-dd')
    return { date: format(d, 'EEE'), calories: historyMap[key] ?? 0 }
  })

  const hasData = data.some(d => d.calories > 0)

  if (!hasData) {
    return (
      <div className="h-36 flex flex-col items-center justify-center text-center gap-2">
        <span className="text-3xl opacity-40">📊</span>
        <p className="text-white/25 text-sm">Log food to see your history</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={150}>
      <BarChart data={data} margin={{ top: 6, right: 6, left: -22, bottom: 0 }} barSize={26}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip content={<Tip />} />
        <ReferenceLine y={target} stroke="rgba(251,191,36,0.45)" strokeDasharray="5 3" strokeWidth={1.5} />
        <Bar dataKey="calories" radius={[6, 6, 0, 0]}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.calories === 0 ? 'rgba(255,255,255,0.05)' : entry.calories > target ? '#f87171' : '#84cc16'}
              fillOpacity={entry.calories === 0 ? 1 : 0.8}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
