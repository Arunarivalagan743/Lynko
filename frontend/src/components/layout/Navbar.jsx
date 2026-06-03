import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, LayoutDashboard, Link2, BarChart3, TrendingUp, UploadCloud, Globe, Settings } from 'lucide-react'
import Logo from '../ui/Logo.jsx'
import Button from '../ui/Button.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { preloadRoute } from '../../routes/routesConfig.jsx'
import { PATHS } from '../../routes/paths.js'

// Authenticated nav links — mirrors the sidebar
const authNavItems = [
  { label: 'Dashboard', path: PATHS.DASHBOARD, icon: LayoutDashboard },
  { label: 'URLs', path: PATHS.URLS, icon: Link2 },
  { label: 'Analytics', path: PATHS.ANALYTICS_BASE, icon: BarChart3 },
  { label: 'Engagement', path: PATHS.ENGAGEMENT, icon: TrendingUp },
  { label: 'Bulk Upload', path: PATHS.BULK_UPLOAD, icon: UploadCloud },
  { label: 'Public Stats', path: PATHS.PUBLIC_STATS_BASE, icon: Globe },
  { label: 'Settings', path: PATHS.PROFILE, icon: Settings },
]

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { isAuthenticated, isInitializing, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    setOpen(false)
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-50 border-b-2 border-primary bg-surface">
      <div className="mx-auto flex h-[72px] w-full max-w-[1280px] items-center justify-between px-6">
        {/* Brand logo */}
        <Link
          to="/"
          className="flex items-center gap-3 flex-shrink-0"
          onMouseEnter={() => preloadRoute(PATHS.HOME)}
        >
          <Logo />
          <span className="text-2xl font-anton uppercase tracking-wider text-primary">Lynko</span>
        </Link>

        {/* Center Nav */}
        {!isInitializing && (
          <nav className="hidden items-center gap-1 md:flex">
            {isAuthenticated ? (
              // Authenticated: show sidebar nav items
              authNavItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.path}
                  onMouseEnter={() => preloadRoute(item.path)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-none px-3.5 py-2 font-space text-xs font-bold uppercase tracking-wider transition-all duration-fast whitespace-nowrap ${isActive
                      ? 'bg-secondary-container text-primary border-b-2 border-primary'
                      : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
                    }`
                  }
                >
                  <item.icon size={14} />
                  {item.label}
                </NavLink>
              ))
            ) : (
              // Public: no center nav items needed
              <div />
            )}
          </nav>
        )}

        {/* Right Actions */}
        {!isInitializing && (
          <div className="hidden items-center gap-3 md:flex flex-shrink-0">
            {isAuthenticated ? (
              <Button variant="secondary" size="md" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <>
                <NavLink
                  to="/login"
                  onMouseEnter={() => preloadRoute(PATHS.LOGIN)}
                  className="font-space text-xs font-bold uppercase tracking-wider text-primary transition-colors hover:text-secondary"
                >
                  Login
                </NavLink>
                <Button
                  as={Link}
                  to="/signup"
                  size="md"
                  onMouseEnter={() => preloadRoute(PATHS.SIGNUP)}
                >
                  Start Free
                </Button>
              </>
            )}
          </div>
        )}

        {/* Mobile hamburger */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-none border-2 border-primary bg-white p-2 text-primary md:hidden shadow-brutal-sm hover:bg-surface-container-low"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && !isInitializing && (
        <div className="border-t-2 border-primary bg-white md:hidden">
          <div className="flex flex-col gap-1 px-5 py-4">
            {isAuthenticated ? (
              <>
                {authNavItems.map((item) => (
                  <NavLink
                    key={item.label}
                    to={item.path}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 font-space text-xs font-bold uppercase tracking-wider transition-colors ${isActive
                        ? 'bg-secondary-container text-primary'
                        : 'text-on-surface-variant hover:text-primary'
                      }`
                    }
                  >
                    <item.icon size={14} />
                    {item.label}
                  </NavLink>
                ))}
                <div className="border-t-2 border-primary mt-2 pt-3">
                  <Button variant="secondary" onClick={handleLogout} className="w-full">
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="px-3 py-2.5 font-space text-xs font-bold uppercase tracking-wider text-primary hover:text-secondary transition-colors"
                >
                  Login
                </NavLink>
                <Button
                  as={Link}
                  to="/signup"
                  onClick={() => setOpen(false)}
                  className="w-full mt-1"
                >
                  Start Free
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
