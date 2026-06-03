import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Home, Compass } from 'lucide-react'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import notFoundImg from '../assets/404.png'

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-72px)] bg-background flex flex-col items-center justify-center p-4 sm:p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="max-w-md w-full px-2 sm:px-0 space-y-4 sm:space-y-6"
      >
        {/* Custom 404 illustration */}
        <div className="flex justify-center">
          <motion.img
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
            src={notFoundImg}
            alt="Page not found"
            className="h-28 xs:h-36 sm:h-44 w-auto object-contain shadow-none"
          />
        </div>

        <Card className="space-y-4 sm:space-y-6 !p-4 xs:!p-6 sm:!p-8 text-center" shadowSize="md" dogEar>
          <div className="space-y-2">
            <span className="font-space text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-secondary">
              Error 404
            </span>
            <h1 className="text-2xl xs:text-3xl sm:text-4xl font-anton uppercase tracking-wide text-primary leading-none">
              Lost in space
            </h1>
            <p className="text-xs sm:text-sm font-medium text-on-surface-variant leading-relaxed max-w-sm mx-auto">
              The digital trail you're looking for doesn't exist, has been removed, or has reached its expiration date.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-1 sm:pt-2">
            <Button
              as={Link}
              to="/"
              variant="secondary"
              className="w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <Home size={16} />
              Return Home
            </Button>
            <Button
              as={Link}
              to="/dashboard"
              className="w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <Compass size={16} />
              Workspace
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
