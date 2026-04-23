import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart, CartesianGrid } from 'recharts'
import { format, parseISO } from 'date-fns'
import { useApp } from '../../context/AppContext'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl px-3 py-2 text-sm" style={{ background: '#1a2a47', border: '1px solid rgba(251,191,36,0.3)' }}>
      <p className="text-white/50 text-xs mb-1">{label}</p>
      <p className="font-display font-bold text-gold-400">{payload[0].value} kg</p>
    </div>
  )
}

export function WeightChart() {
  const { state } = useApp()
  const entries = state.weightEntries

  const data = entries.slice(-14).map(e => ({
    date: format(parseISO(e.date), 'MMM d'),
    weight: e.weight,
  }))

  const goal = state.profile.goalWeightKg
  const minY = Math.min(...data.map(d => d.weight), goal) - 1
  const maxY = Math.max(...data.map(d => d.weight)) + 1

  if (data.length < 2) {
    return (
      <div className="h-40 flex flex-col items-center justify-center text-center">
        <span className="text-3xl">📈</span>
        <p className="text-white/30 text-sm mt-2">Log your weight to see progress</p>
        <p className="text-white/20 text-xs mt-1">Need at least 2 entries</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis domain={[minY, maxY]} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={goal} stroke="#84cc16" strokeDasharray="5 3" strokeWidth={1.5} label={{ value: `Goal ${goal}kg`, fill: '#84cc16', fontSize: 10 }} />
        <Area type="monotone" dataKey="weight" stroke="#f59e0b" strokeWidth={2.5} fill="url(#weightGrad)" dot={{ fill: '#f59e0b', r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: '#fbbf24' }} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
