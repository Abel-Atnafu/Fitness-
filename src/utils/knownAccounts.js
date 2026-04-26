// Tracks recently-used accounts so the welcome view can offer tap-to-fill.
// Stores only display data (name + email) — never tokens, never passwords.

const KEY = 'fitethio-known-accounts'
const MAX = 3

export function loadKnown() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter(a => a && typeof a.email === 'string')
      .sort((a, b) => (b.lastLoginAt ?? 0) - (a.lastLoginAt ?? 0))
      .slice(0, MAX)
  } catch {
    return []
  }
}

export function rememberAccount({ email, name }) {
  if (!email) return
  const list = loadKnown().filter(a => a.email !== email)
  list.unshift({ email, name: name ?? '', lastLoginAt: Date.now() })
  const trimmed = list.slice(0, MAX)
  try {
    localStorage.setItem(KEY, JSON.stringify(trimmed))
  } catch {}
}

export function forgetAccount(email) {
  const list = loadKnown().filter(a => a.email !== email)
  try {
    localStorage.setItem(KEY, JSON.stringify(list))
  } catch {}
}

export function initialsFromName(name, email) {
  const source = (name || email || '').trim()
  if (!source) return '?'
  const parts = source.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  const first = parts[0]
  if (first.includes('@')) return first[0].toUpperCase()
  return first.slice(0, 2).toUpperCase()
}
