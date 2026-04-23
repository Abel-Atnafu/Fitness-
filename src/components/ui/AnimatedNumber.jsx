import { useEffect, useRef, useState } from 'react'

export function AnimatedNumber({ value, duration = 800, className = '' }) {
  const [display, setDisplay] = useState(0)
  const startRef = useRef(0)
  const startTimeRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    startRef.current = display
    startTimeRef.current = null

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(startRef.current + (value - startRef.current) * eased))
      if (progress < 1) rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [value])

  return <span className={className}>{display.toLocaleString()}</span>
}
