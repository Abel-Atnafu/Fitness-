import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts'
import { format, parseISO } from 'date-fns'
import { useApp } from '../../context/AppContext'

function Tip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl px-3 py-2 text-sm" style={{ background: '#1a2a47', border: '1px solid rgba(251,191,36,0.3)' }}>
      <p className="text-white/40 text-xs mb-1">{label}</p>
      <p className="font-display font-bold text-gold-400">{payload[0].value} kg</p>
    </div>
  )
}

export function WeightChart() {
  const { weightEntries, profile } = useApp()
  const goal = profile?.goalWeightKg ?? 80

  const data = weightEntries.slice(-14).map(e => ({
    date: format(parseISO(e.date), 'MMM d'),
    weight: e.weight,
  }))

  if (data.length < 2) {
    return (
      <div className="h-40 flex flex-col items-center justify-center text-center gap-2">
        <span className="text-3xl opacity-40">📈</span>
        <p className="text-white/25 text-sm">Log your weight to see your trend</p>
      </div>
    )
  }

  const minY = Math.floor(Math.min(...data.map(d => d.weight), goal)) - 1
  const maxY = Math.ceil(Math.max(...data.map(d => d.weight))) + 1

  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 8, right: 6, left: -22, bottom: 0 }}>
        <defs>
          <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.22} />
            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.28)', fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis domain={[minY, maxY]} tick={{ fill: 'rgba(255,255,255,0.28)', fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip content={<Tip />} />
        <ReferenceLine y={goal} stroke="#84cc16" strokeDasharray="5 3" strokeWidth={1.5}
          label={{ value: `Goal ${goal}kg`, fill: '#84cc16', fontSize: 10, position: 'insideTopRight' }} />
        <Area type="monotone" dataKey="weight" stroke="#f59e0b" strokeWidth={2.5} fill="url(#wGrad)"
          dot={{ fill: '#f59e0b', r: 3.5, strokeWidth: 0 }}
          activeDot={{ r: 5.5, fill: '#fbbf24', strokeWidth: 0 }} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
