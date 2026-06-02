import React, { useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Link2, 
  BarChart3, 
  UploadCloud, 
  Globe, 
  Settings, 
  LogOut 
} from 'lucide-react'
import { PATHS } from '../../routes/paths.js'
import { useAuth } from '../../context/AuthContext.jsx'

export default function Sidebar() {
  const { logout } = useAuth()

  // Memoize navigation items list
  const navigationItems = useMemo(() => [
    { name: 'Dashboard', path: PATHS.DASHBOARD, icon: LayoutDashboard },
    { name: 'URLs', path: PATHS.URLS, icon: Link2 },
    { name: 'Analytics', path: PATHS.ANALYTICS_BASE, icon: BarChart3 },
    { name: 'Bulk Upload', path: PATHS.BULK_UPLOAD, icon: UploadCloud },
    { name: 'Public Stats', path: PATHS.PUBLIC_STATS_BASE, icon: Globe },
    { name: 'Settings', path: PATHS.PROFILE, icon: Settings },
  ], [])

  return (
    <aside className="hidden lg:flex flex-col w-72 border-r-2 border-primary bg-surface-container h-screen fixed left-0 top-0 z-30">
      {/* Brand logo container */}
      <div className="flex h-[72px] items-center px-7 border-b-2 border-primary bg-surface">
        <span className="text-3xl font-anton uppercase tracking-wider text-primary select-none">
          LYNKO
        </span>
      </div>

      {/* Main navigation list links */}
      <nav className="flex-1 space-y-1 px-4 py-8 overflow-y-auto">
        {navigationItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-4 py-3 text-[15px] font-medium whitespace-nowrap transition-all duration-normal ${
                isActive
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
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-none border-2 border-primary bg-white px-4 py-2.5 text-sm font-bold text-error shadow-brutal-sm hover:bg-error-container active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-fast"
        >
          <LogOut size={18} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  )
}
export { Sidebar }
