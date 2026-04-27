import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, BarChart3, Trash2, ShieldCheck, ShieldOff,
  Search, ArrowLeft, RefreshCw, LogOut, LockOpen, Flame,
  Utensils, Dumbbell, Droplets, Scale
} from 'lucide-react'
import { api } from '../api/client.js'
import { useApp } from '../context/AppContext.jsx'

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 rounded-2xl p-4"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: color + '22' }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div>
        <p className="text-white/45 text-xs font-medium">{label}</p>
        <p className="text-white font-display font-bold text-xl leading-tight">{value ?? '—'}</p>
      </div>
    </motion.div>
  )
}

function RoleBadge({ role }) {
  if (role === 'admin') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
        style={{ background: 'rgba(245,158,11,0.18)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)' }}>
        <ShieldCheck size={10} /> ADMIN
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
      style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
      USER
    </span>
  )
}

export default function Admin() {
  const { logout, profile } = useApp()
  const navigate = useNavigate()

  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)
  const [error, setError] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [s, u] = await Promise.all([
        api.get('/api/admin/stats'),
        api.get('/api/admin/users'),
      ])
      setStats(s)
      setUsers(u)
    } catch (err) {
      setError(err.message || 'Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function toggleRole(user) {
    const newRole = user.role === 'admin' ? 'user' : 'admin'
    setActionLoading(`role-${user.id}`)
    try {
      const updated = await api.put(`/api/admin/users/${user.id}/role`, { role: newRole })
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: updated.role } : u))
    } catch (err) {
      setError(err.message || 'Failed to update role')
    } finally {
      setActionLoading(null)
    }
  }

  async function unlockUser(user) {
    setActionLoading(`unlock-${user.id}`)
    try {
      await api.put(`/api/admin/users/${user.id}/unlock`, {})
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, locked_until: null, failed_login_count: 0 } : u))
    } catch (err) {
      setError(err.message || 'Failed to unlock account')
    } finally {
      setActionLoading(null)
    }
  }

  async function deleteUser(userId) {
    setActionLoading(`delete-${userId}`)
    setConfirmDelete(null)
    try {
      await api.delete(`/api/admin/users/${userId}`)
      setUsers(prev => prev.filter(u => u.id !== userId))
      if (stats) setStats(prev => ({ ...prev, totalUsers: prev.totalUsers - 1 }))
    } catch (err) {
      setError(err.message || 'Failed to delete user')
    } finally {
      setActionLoading(null)
    }
  }

  const filtered = users.filter(u => {
    const q = search.toLowerCase()
    return !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
  })

  const isLocked = (u) => u.locked_until && new Date(u.locked_until) > new Date()

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #060b18 0%, #0d1526 50%, #111d35 100%)' }}>
      {/* Decorative blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)' }} />
        <div className="absolute bottom-32 left-8 w-56 h-56 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(132,204,22,0.06) 0%, transparent 70%)' }} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-5 h-14"
        style={{ background: 'rgba(6,11,24,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white/60 hover:text-white/90 transition-colors">
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back to App</span>
        </button>
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={16} className="text-amber-400" />
          <span className="font-display font-bold text-sm"
            style={{ background: 'linear-gradient(90deg, #fbbf24, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Admin Panel
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} title="Refresh" className="w-8 h-8 flex items-center justify-center rounded-xl transition-colors hover:bg-white/08"
            style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <RefreshCw size={14} className={`text-white/45 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={logout} title="Log out" className="w-8 h-8 flex items-center justify-center rounded-xl"
            style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <LogOut size={14} className="text-white/45" />
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-3xl mx-auto px-4 py-6 pb-10">
        {/* Welcome */}
        <div className="mb-6">
          <h1 className="font-display font-bold text-2xl text-white">Admin Dashboard</h1>
          <p className="text-white/40 text-sm mt-0.5">Signed in as <span className="text-amber-400">{profile?.email}</span></p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl text-red-300 text-sm"
            style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)' }}>
            {error}
          </div>
        )}

        {/* Stats Grid */}
        {loading && !stats ? (
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-20 rounded-2xl animate-pulse"
                style={{ background: 'rgba(255,255,255,0.04)' }} />
            ))}
          </div>
        ) : stats && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <StatCard icon={Users} label="Total Users" value={stats.totalUsers} color="#fbbf24" />
            <StatCard icon={Flame} label="Active Today" value={stats.activeUsersToday} color="#f97316" />
            <StatCard icon={Utensils} label="Food Entries" value={stats.totalFoodEntries} color="#84cc16" />
            <StatCard icon={Dumbbell} label="Exercises" value={stats.totalExerciseEntries} color="#a78bfa" />
            <StatCard icon={Scale} label="Weight Logs" value={stats.totalWeightEntries} color="#38bdf8" />
            <StatCard icon={Droplets} label="Water Logs" value={stats.totalWaterLogs} color="#22d3ee" />
          </div>
        )}

        {/* Users Section */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          {/* Table header */}
          <div className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-2">
              <Users size={16} className="text-amber-400" />
              <span className="font-display font-semibold text-white text-sm">Users</span>
              <span className="text-white/30 text-xs">({filtered.length})</span>
            </div>
            {/* Search */}
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search…"
                className="pl-7 pr-3 py-1.5 rounded-lg text-xs text-white placeholder-white/25 outline-none w-36"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}
              />
            </div>
          </div>

          {/* User rows */}
          {loading && users.length === 0 ? (
            <div className="py-8 text-center text-white/30 text-sm">Loading users…</div>
          ) : filtered.length === 0 ? (
            <div className="py-8 text-center text-white/30 text-sm">No users found</div>
          ) : (
            <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              {filtered.map(u => (
                <div key={u.id} className="px-4 py-3 flex items-start justify-between gap-3">
                  {/* Avatar + info */}
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center font-display font-bold text-xs flex-shrink-0"
                      style={{ background: u.role === 'admin' ? 'linear-gradient(135deg, #d97706, #fbbf24)' : 'rgba(255,255,255,0.08)' }}>
                      <span className={u.role === 'admin' ? 'text-navy-950' : 'text-white/60'}>
                        {u.name?.[0]?.toUpperCase() ?? '?'}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-white text-sm font-medium truncate">{u.name}</span>
                        <RoleBadge role={u.role} />
                        {isLocked(u) && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
                            style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' }}>
                            LOCKED
                          </span>
                        )}
                      </div>
                      <p className="text-white/40 text-xs truncate">{u.email}</p>
                      <p className="text-white/25 text-[10px] mt-0.5">
                        {u.food_entry_count} logs · joined {new Date(u.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {isLocked(u) && (
                      <motion.button
                        whileTap={{ scale: 0.88 }}
                        onClick={() => unlockUser(u)}
                        disabled={!!actionLoading}
                        title="Unlock account"
                        className="w-8 h-8 flex items-center justify-center rounded-xl transition-colors"
                        style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)' }}>
                        {actionLoading === `unlock-${u.id}`
                          ? <RefreshCw size={13} className="text-cyan-400 animate-spin" />
                          : <LockOpen size={13} className="text-cyan-400" />}
                      </motion.button>
                    )}
                    <motion.button
                      whileTap={{ scale: 0.88 }}
                      onClick={() => toggleRole(u)}
                      disabled={!!actionLoading}
                      title={u.role === 'admin' ? 'Remove admin' : 'Make admin'}
                      className="w-8 h-8 flex items-center justify-center rounded-xl transition-colors"
                      style={{
                        background: u.role === 'admin' ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.05)',
                        border: u.role === 'admin' ? '1px solid rgba(245,158,11,0.3)' : '1px solid rgba(255,255,255,0.08)',
                      }}>
                      {actionLoading === `role-${u.id}`
                        ? <RefreshCw size={13} className="text-amber-400 animate-spin" />
                        : u.role === 'admin'
                          ? <ShieldOff size={13} className="text-amber-400" />
                          : <ShieldCheck size={13} className="text-white/40" />}
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.88 }}
                      onClick={() => setConfirmDelete(u)}
                      disabled={!!actionLoading}
                      title="Delete user"
                      className="w-8 h-8 flex items-center justify-center rounded-xl transition-colors"
                      style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                      {actionLoading === `delete-${u.id}`
                        ? <RefreshCw size={13} className="text-red-400 animate-spin" />
                        : <Trash2 size={13} className="text-red-400" />}
                    </motion.button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-6"
            style={{ background: 'rgba(6,11,24,0.85)', backdropFilter: 'blur(8px)' }}
            onClick={() => setConfirmDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl p-6"
              style={{ background: '#0d1526', border: '1px solid rgba(239,68,68,0.25)' }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ background: 'rgba(239,68,68,0.12)' }}>
                <Trash2 size={22} className="text-red-400" />
              </div>
              <h3 className="font-display font-bold text-white text-lg">Delete user?</h3>
              <p className="text-white/50 text-sm mt-1 mb-5">
                This will permanently delete <span className="text-white font-medium">{confirmDelete.name}</span> and all their data. This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white/60"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  Cancel
                </button>
                <button onClick={() => deleteUser(confirmDelete.id)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #dc2626, #ef4444)' }}>
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
