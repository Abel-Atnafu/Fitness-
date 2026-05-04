import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X } from 'lucide-react'

export function InstallPrompt() {
  const [prompt, setPrompt] = useState(null)
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem('fitethio-install-dismissed') === '1'
  )

  useEffect(() => {
    function handler(e) {
      e.preventDefault()
      setPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  function install() {
    if (!prompt) return
    prompt.prompt()
    prompt.userChoice.then(() => setPrompt(null))
  }

  function dismiss() {
    setDismissed(true)
    localStorage.setItem('fitethio-install-dismissed', '1')
  }

  const show = prompt && !dismissed

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          className="fixed bottom-20 left-4 right-4 z-40 max-w-[416px] mx-auto rounded-2xl p-4 flex items-center gap-3"
          style={{ background: 'rgba(13,21,38,0.97)', border: '1px solid rgba(251,191,36,0.3)', backdropFilter: 'blur(20px)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#d97706,#fbbf24)' }}>
            <Download size={18} className="text-navy-950" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold">Install FitEthio</p>
            <p className="text-white/45 text-xs">Add to home screen for the full app experience</p>
          </div>
          <button onClick={install}
            className="px-3 py-1.5 rounded-lg text-xs font-bold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#d97706,#fbbf24)', color: '#060b18' }}>
            Install
          </button>
          <button onClick={dismiss} className="p-1 flex-shrink-0">
            <X size={14} className="text-white/35" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
