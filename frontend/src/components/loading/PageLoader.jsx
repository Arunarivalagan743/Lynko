import React from 'react'
import { motion } from 'framer-motion'

export default function PageLoader({ message = 'Loading application assets...' }) {
  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center bg-background px-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center gap-5 text-center"
      >
        {/* Modern circular spin ring */}
        <div className="relative flex items-center justify-center h-10 w-10">
          <div className="absolute inset-0 rounded-full border-2 border-primary/10" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
        </div>

        {message && (
          <p className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-primary/60 animate-pulse max-w-xs leading-relaxed">
            {message}
          </p>
        )}
      </motion.div>
    </div>
  )
}
export { PageLoader }
