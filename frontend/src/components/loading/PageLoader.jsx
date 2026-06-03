import React from 'react'
import { motion } from 'framer-motion'
import EarthLoader from './EarthLoader.jsx'

export default function PageLoader({ message = 'Loading application assets...' }) {
  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center bg-background px-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center gap-5 text-center"
      >
        <EarthLoader message={message} />
      </motion.div>
    </div>
  )
}
export { PageLoader }
