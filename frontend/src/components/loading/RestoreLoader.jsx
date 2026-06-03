import React from 'react'
import { motion } from 'framer-motion'
import EarthLoader from './EarthLoader.jsx'

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
        <EarthLoader message="Connecting..." />
      </motion.div>
    </div>
  )
}
export { RestoreLoader }
