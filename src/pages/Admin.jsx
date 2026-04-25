import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { Shield, Users, LogIn, Activity } from 'lucide-react'
import { PageTransition } from '../components/ui/PageTransition'
import { Spinner } from '../components/ui/Spinner'
import { useApp } from '../context/AppContext'

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="flex-1 rounded-2xl p-4"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2"
        style={{ background: `${accent}1f`, border: `1px solid ${accent}3a` }}>
        <Icon size={15} style={{ color: accent }} />
      </div>
      <p className="text-white/35 text-[10px] uppercase tracking-widest font-semibold">{label}</p>
      <p className="font-display font-black text-2xl text-white mt-0.5">{value}</p>
    </div>
  )
}

function relativeTime(iso) {
  if (!iso) return '—'
  try {
    return formatDistanceToNow(parseISO(iso), { addSuffix: true })
  } catch {
    return '—'
  }
}

export default function Admin() {
  const { isAdmin, fetchAdminData, profile } = useApp()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(null)

  useEffect(() => {
    if (!isAdmin) return
    let cancelled = false
    fetchAdminData()
      .then(d => { if (!cancelled) setData(d) })
      .catch(e => { if (!cancelled) setErr(e.message || 'Failed to load admin data') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [isAdmin, fetchAdminData])

  if (profile && !isAdmin) return <Navigate to="/" replace />

  return (
    <PageTransition>
      <div className="py-2 flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #d97706, #fbbf24)' }}>
            <Shield size={18} className="text-navy-950" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-white">Admin Dashboard</h2>
            <p className="text-white/35 text-xs">User activity & login tracking</p>
          </div>
        </div>

        {loading && (
          <div className="py-12 flex justify-center"><Spinner size={24} /></div>
        )}
        {err && !loading && (
          <div className="rounded-xl px-4 py-3 text-sm text-red-400"
            style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }}>
            {err}
          </div>
        )}

        {data && !loading && (
          <>
            <div className="flex gap-3">
              <StatCard icon={Users} label="Total Users" value={data.stats.total_users} accent="#fbbf24" />
              <StatCard icon={LogIn} label="Logins Today" value={data.stats.logins_today} accent="#84cc16" />
              <StatCard icon={Activity} label="Active 7d" value={data.stats.active_last_7_days} accent="#60a5fa" />
            </div>

            <div className="rounded-2xl overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="px-4 py-3 flex items-center justify-between"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <p className="text-white/55 text-xs uppercase tracking-widest font-semibold">Users</p>
                <p className="text-white/30 text-[11px]">{data.users.length} total</p>
              </div>
              <div className="max-h-[320px] overflow-y-auto">
                {data.users.map((u, i) => (
                  <div key={u.id} className="flex items-center gap-3 px-4 py-3"
                    style={{ borderBottom: i < data.users.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs text-navy-950 flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #d97706, #fbbf24)' }}>
                      {u.name?.[0]?.toUpperCase() ?? '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-white/85 text-sm font-semibold truncate">{u.name}</p>
                        {u.is_admin && (
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded text-navy-950"
                            style={{ background: '#fbbf24' }}>ADMIN</span>
                        )}
                      </div>
                      <p className="text-white/30 text-[11px] truncate">{u.email}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-white/55 text-[11px]">{u.login_count} logins</p>
                      <p className="text-white/25 text-[10px]">last {relativeTime(u.last_login_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <p className="text-white/55 text-xs uppercase tracking-widest font-semibold">Recent Logins</p>
              </div>
              <div className="max-h-[320px] overflow-y-auto">
                {data.logs.length === 0 && (
                  <p className="px-4 py-6 text-center text-white/25 text-xs">No logins yet</p>
                )}
                {data.logs.map((l, i) => (
                  <div key={l.id} className="flex items-center gap-3 px-4 py-2.5"
                    style={{ borderBottom: i < data.logs.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    <LogIn size={12} className="text-white/25 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white/75 text-xs font-medium truncate">{l.name}</p>
                      <p className="text-white/25 text-[10px] truncate">{l.email}{l.ip_address ? ` · ${l.ip_address}` : ''}</p>
                    </div>
                    <p className="text-white/35 text-[10px] flex-shrink-0">{relativeTime(l.logged_in_at)}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </PageTransition>
  )
}
