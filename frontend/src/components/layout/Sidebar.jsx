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
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { PATHS } from '../../routes/paths.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { preloadRoute } from '../../routes/routesConfig.jsx'
import Logo from '../ui/Logo.jsx'

export default function Sidebar({ isCollapsed = false, onToggleCollapse }) {
  const { logout } = useAuth()

  // Memoize navigation items list
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
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 288 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="hidden md:flex flex-col border-r-2 border-primary bg-white h-screen fixed left-0 top-0 z-30 overflow-hidden"
    >
      {/* Brand logo container */}
      <div className={`flex h-[72px] items-center border-b-2 border-primary bg-white transition-all duration-fast ${isCollapsed ? 'justify-center px-0' : 'justify-between px-6'}`}>
        {!isCollapsed ? (
          <>
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <Logo variant="full" size="md" />
            </Link>
            <button
              onClick={onToggleCollapse}
              className="p-1.5 rounded-none border-2 border-primary text-primary shadow-[2px_2px_0px_0px_rgba(0,50,45,1)] hover:bg-surface-container-low active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all duration-fast"
              title="Collapse Sidebar"
            >
              <ChevronLeft size={14} />
            </button>
          </>
        ) : (
          <button
            onClick={onToggleCollapse}
            className="w-full h-full flex items-center justify-center text-primary hover:bg-surface-container-low transition-colors"
            title="Expand Sidebar"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>

      {/* Main navigation list links */}
      <nav className="flex-1 space-y-3 px-4 py-6 overflow-y-auto overflow-x-hidden">
        {navigationItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onMouseEnter={() => preloadRoute(item.path)}
            onFocus={() => preloadRoute(item.path)}
            className="relative flex items-center w-full"
          >
            {({ isActive }) => (
              <div
                className={`flex items-center gap-3 w-full rounded-none border-2 border-primary font-space font-bold uppercase tracking-wider text-xs whitespace-nowrap transition-all duration-fast ${isCollapsed ? 'justify-center p-2.5 h-11 w-11 mx-auto' : 'px-4 py-3'
                  } ${isActive
                    ? 'bg-primary text-white border-primary shadow-none translate-x-[1px] translate-y-[1px]'
                    : 'bg-white text-primary border-primary shadow-[2px_2px_0px_0px_rgba(0,50,45,1)] hover:bg-surface-container-low hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none'
                  }`}
              >
                <item.icon size={16} className="shrink-0" />
                {!isCollapsed && <span>{item.name}</span>}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer / logout option */}
      <div className="p-4 border-t-2 border-primary bg-white">
        <button
          onClick={logout}
          className={`flex w-full items-center justify-center rounded-none border-2 border-primary bg-white py-2.5 text-xs font-space font-bold uppercase tracking-wider text-primary shadow-[2px_2px_0px_0px_rgba(0,50,45,1)] hover:bg-error/5 hover:text-error hover:border-error active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all duration-fast ${isCollapsed ? 'px-0' : 'gap-3 px-4'}`}
          title="Log out"
        >
          <LogOut size={16} className="shrink-0" />
          {!isCollapsed && <span>Log out</span>}
        </button>
      </div>
    </motion.aside>
  )
}
export { Sidebar }
