import { motion } from 'framer-motion'
import { getDayOfYear } from 'date-fns'

const QUOTES = [
  { text: "A journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
  { text: "Injera is built layer by layer — so is your body.", author: "Ethiopian Wisdom" },
  { text: "Success is the sum of small efforts repeated every day.", author: "Robert Collier" },
  { text: "Your body can do it. It's your mind you need to convince.", author: "Unknown" },
  { text: "When spider webs unite, they can tie up a lion.", author: "Ethiopian Proverb" },
  { text: "Fall seven times, stand up eight.", author: "Japanese Proverb" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "A river cuts through rock, not because of its power but its persistence.", author: "Jim Watkins" },
  { text: "Coffee and determination — the Ethiopian way to conquer the day.", author: "FitEthio" },
  { text: "The body achieves what the mind believes.", author: "Unknown" },
  { text: "One who tells the truth has no need of a good memory.", author: "Ethiopian Proverb" },
  { text: "Progress, not perfection. Every meal logged is a win.", author: "FitEthio" },
  { text: "Difficult roads often lead to beautiful destinations.", author: "Unknown" },
  { text: "You are stronger than your cravings.", author: "FitEthio" },
  { text: "Eat to fuel the body, not to feed emotions.", author: "Unknown" },
  { text: "Small daily improvements lead to stunning long-term results.", author: "Robin Sharma" },
  { text: "Your future self is watching you right now.", author: "Unknown" },
  { text: "Don't count the days. Make the days count.", author: "Muhammad Ali" },
  { text: "Every sunrise is a new chance to get it right.", author: "Ethiopian Proverb" },
]

export function MotivationalQuote() {
  const quote = QUOTES[getDayOfYear(new Date()) % QUOTES.length]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="rounded-2xl p-4 relative overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderLeft: '3px solid #f59e0b',
      }}>
      <p className="text-white/75 text-sm italic leading-relaxed">"{quote.text}"</p>
      <p className="text-gold-500 text-xs font-semibold mt-2">— {quote.author}</p>
    </motion.div>
  )
}
