import { motion } from 'framer-motion'

const variants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.32, ease: [0.4, 0, 0.2, 1] },
  },
  exit: { opacity: 0, y: -12, transition: { duration: 0.18 } },
}

export function PageTransition({ children }) {
  return (
    <motion.div variants={variants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  )
}
