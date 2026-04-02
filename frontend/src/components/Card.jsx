import { motion } from 'framer-motion'

export default function Card({ className = '', children, ...props }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 260, damping: 25 }}
      className={`glass-card border border-white/10 p-6 shadow-glow ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}
