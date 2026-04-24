import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export function ErrorBanner() {
  const { error, setError } = useApp()

  useEffect(() => {
    if (!error) return
    const t = setTimeout(() => setError(null), 4000)
    return () => clearTimeout(t)
  }, [error])

  if (!error) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="fixed top-16 left-0 right-0 z-40 px-4 pointer-events-none">
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm text-red-300 pointer-events-auto"
        style={{
          background: 'rgba(127,29,29,0.85)',
          border: '1px solid rgba(248,113,113,0.3)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        }}>
        <AlertCircle size={16} className="flex-shrink-0 text-red-400" />
        <span className="flex-1 font-medium">{error}</span>
        <button
          onClick={() => setError(null)}
          className="flex-shrink-0 text-red-400/60 hover:text-red-300 transition-colors">
          <X size={15} />
        </button>
      </div>
    </motion.div>
  )
}
