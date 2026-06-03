import React, { useMemo } from 'react'
import { NavLink, Link } from 'react-router-dom'
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

  if (!isOpen) return null

  return (
    <div className="lg:hidden fixed inset-0 z-50 flex">
      {/* Overlay backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />

      {/* Drawer content panel */}
      <aside className="relative flex flex-col w-72 max-w-xs border-r-2 border-primary bg-surface-container h-full z-10 transition-transform">
        <div className="flex h-[72px] items-center justify-between px-7 border-b-2 border-primary bg-surface">
          <Link to="/" onClick={onClose} className="hover:opacity-85 transition-opacity">
            <span className="text-3xl font-anton uppercase tracking-wider text-primary select-none">
              LYNKO
            </span>
          </Link>
          <button
            onClick={onClose}
            className="rounded-none p-1.5 bg-white border-2 border-primary shadow-brutal-sm hover:bg-surface-container-low transition-colors focus:outline-none"
            aria-label="Close menu"
          >
            <X size={18} className="text-primary" />
          </button>
        </div>

        {/* Main navigation list links */}
        <nav className="flex-1 space-y-1 px-4 py-8 overflow-y-auto">
          {navigationItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onClose}
              onMouseEnter={() => preloadRoute(item.path)}
              onFocus={() => preloadRoute(item.path)}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 text-[15px] font-medium whitespace-nowrap transition-all duration-normal ${isActive
                  ? 'bg-secondary-container/40 text-primary border-l-[3px] border-primary font-semibold'
                  : 'text-on-surface-variant border-l-[3px] border-transparent hover:bg-surface-container-high/60 hover:text-primary'
                }`
              }
            >
              <item.icon size={20} className="shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer / logout option */}
        <div className="p-5 border-t-2 border-primary bg-surface">
          <button
            onClick={() => {
              onClose()
              logout()
            }}
            className="flex w-full items-center gap-3 rounded-none border-2 border-primary bg-white px-4 py-2.5 text-sm font-bold text-error shadow-brutal-sm hover:bg-error-container active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-fast"
          >
            <LogOut size={18} />
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </div>
  )
}
export { MobileSidebar }
