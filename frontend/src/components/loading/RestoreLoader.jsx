import React from 'react'
import { motion } from 'framer-motion'
import Logo from '../ui/Logo.jsx'

export default function RestoreLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
      {/* Animated Brand Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex flex-col items-center space-y-6"
      >
        {/* Logo with breathing effect */}
        <motion.div
          animate={{
            scale: [1, 1.04, 1],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Logo variant="full" size="lg" />
        </motion.div>

        {/* Elegant minimalist infinite loader bar */}
        <div className="relative w-36 h-1 bg-primary/10 rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 bottom-0 left-0 bg-primary rounded-full"
            initial={{ left: '-100%', right: '100%' }}
            animate={{
              left: ['-100%', '0%', '100%'],
              right: ['100%', '0%', '-100%']
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        </div>

        {/* Professional status descriptor */}
        <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-primary/40 select-none animate-pulse">
          Connecting
        </span>
      </motion.div>
    </div>
  )
}
export { RestoreLoader }
