import React, { useMemo } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Link2,
  BarChart3,
  TrendingUp,
  UploadCloud,
  Globe,
  Settings,
  LogOut,
  X
} from 'lucide-react'
import { PATHS } from '../../routes/paths.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { preloadRoute } from '../../routes/routesConfig.jsx'
import Logo from '../ui/Logo.jsx'

export default function MobileSidebar({ isOpen, onClose }) {
  const { logout } = useAuth()

  // Memoize navigation configuration list to prevent unnecessary re-renders
  const navigationItems = useMemo(() => [
    { name: 'Dashboard', path: PATHS.DASHBOARD, icon: LayoutDashboard },
    { name: 'URLs', path: PATHS.URLS, icon: Link2 },
    { name: 'Analytics', path: PATHS.ANALYTICS_BASE, icon: BarChart3 },
    { name: 'Engagement', path: PATHS.ENGAGEMENT, icon: TrendingUp },
    { name: 'Bulk Upload', path: PATHS.BULK_UPLOAD, icon: UploadCloud },
    { name: 'Public Stats', path: PATHS.PUBLIC_STATS_BASE, icon: Globe },
    { name: 'Settings', path: PATHS.PROFILE, icon: Settings },
  ], [])

  return (
    <div className="md:hidden fixed inset-0 z-50 flex">
      {/* Overlay backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Drawer content panel */}
      <motion.aside
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="relative flex flex-col w-72 max-w-xs border-r-2 border-primary bg-white h-full z-10 shadow-none"
      >
        <div className="flex h-[72px] items-center justify-between px-6 border-b-2 border-primary bg-white">
          <Link to="/" onClick={onClose} className="hover:opacity-80 transition-opacity">
            <Logo variant="full" size="md" />
          </Link>
          <button
            onClick={onClose}
            className="p-1.5 rounded-none border-2 border-primary text-primary shadow-[2px_2px_0px_0px_rgba(0,50,45,1)] hover:bg-surface-container-low active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all duration-fast"
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        </div>

        {/* Main navigation list links */}
        <nav className="flex-1 space-y-3 px-4 py-6 overflow-y-auto overflow-x-hidden">
          {navigationItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onClose}
              onMouseEnter={() => preloadRoute(item.path)}
              onFocus={() => preloadRoute(item.path)}
              className="relative flex items-center"
            >
              {({ isActive }) => (
                <div
                  className={`flex items-center gap-3 w-full rounded-none border-2 border-primary font-space font-bold uppercase tracking-wider text-xs whitespace-nowrap transition-all duration-fast px-4 py-3 ${isActive
                      ? 'bg-primary text-white border-primary shadow-none translate-x-[1px] translate-y-[1px]'
                      : 'bg-white text-primary border-primary shadow-[2px_2px_0px_0px_rgba(0,50,45,1)] hover:bg-surface-container-low hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none'
                    }`}
                >
                  <item.icon size={16} className="shrink-0" />
                  <span>{item.name}</span>
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer / logout option */}
        <div className="p-4 border-t-2 border-primary bg-white">
          <button
            onClick={() => {
              onClose()
              logout()
            }}
            className="flex w-full items-center justify-center gap-3 rounded-none border-2 border-primary bg-white py-2.5 text-xs font-space font-bold uppercase tracking-wider text-primary shadow-[2px_2px_0px_0px_rgba(0,50,45,1)] hover:bg-error/5 hover:text-error hover:border-error active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all duration-fast px-4"
            title="Log out"
          >
            <LogOut size={16} className="shrink-0" />
            <span>Log out</span>
          </button>
        </div>
      </motion.aside>
    </div>
  )
}
export { MobileSidebar }
