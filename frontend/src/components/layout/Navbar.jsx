import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, LayoutDashboard, Link2, BarChart3, TrendingUp, UploadCloud, Globe, Settings } from 'lucide-react'
import { motion } from 'framer-motion'
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
    <header className="sticky top-0 z-50 border-b-2 border-primary bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] w-full max-w-[1280px] items-center justify-between px-6">
        {/* Brand logo */}
        <Link
          to="/"
          className="flex items-center flex-shrink-0"
          onMouseEnter={() => preloadRoute(PATHS.HOME)}
        >
          <Logo variant="full" size="md" />
        </Link>

        {/* Center Nav */}
        {!isInitializing && (
          <nav className="hidden items-center gap-0.5 md:flex h-full">
            {isAuthenticated ? (
              // Authenticated: show sidebar nav items
              authNavItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.path}
                  onMouseEnter={() => preloadRoute(item.path)}
                  className="relative flex items-center h-full"
                >
                  {({ isActive }) => (
                    <motion.div
                      whileHover="hover"
                      className={`relative flex items-center gap-1.5 px-3 py-2 text-sm font-sans font-semibold tracking-wide whitespace-nowrap transition-colors duration-fast ${
                        isActive ? 'text-primary' : 'text-primary/75 hover:text-primary'
                      }`}
                    >
                      <item.icon size={12} className="shrink-0" />
                      <span>{item.label}</span>

                      {/* Hover line */}
                      <motion.div
                        className="absolute bottom-0 left-3 right-3 h-[2px] bg-primary/30 origin-left"
                        initial={{ scaleX: 0 }}
                        variants={{
                          hover: { scaleX: 1 }
                        }}
                        transition={{ duration: 0.18 }}
                      />

                      {/* Active line sliding indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeNavbarLine"
                          className="absolute bottom-0 left-3 right-3 h-[2px] bg-primary"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </motion.div>
                  )}
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
          className="inline-flex items-center justify-center rounded-none border-2 border-primary bg-white p-2 text-primary shadow-[2px_2px_0px_0px_rgba(0,50,45,1)] hover:bg-surface-container-low active:translate-x-[1px] active:translate-y-[1px] active:shadow-none md:hidden transition-all duration-fast"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {open ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && !isInitializing && (
        <div className="border-t-2 border-primary bg-white md:hidden shadow-[0_4px_0_0_rgba(0,50,45,1)]">
          <div className="flex flex-col gap-3 px-4 py-4">
            {isAuthenticated ? (
              <>
                {authNavItems.map((item) => (
                  <NavLink
                    key={item.label}
                    to={item.path}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-none text-xs font-space font-bold uppercase tracking-wider whitespace-nowrap border-2 transition-all duration-fast ${
                        isActive
                          ? 'bg-primary text-white border-primary shadow-none translate-x-[1px] translate-y-[1px]'
                          : 'bg-white text-primary border-primary shadow-[2px_2px_0px_0px_rgba(0,50,45,1)] hover:bg-surface-container-low hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none'
                      }`
                    }
                  >
                    <item.icon size={16} className="shrink-0" />
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
                  className="flex items-center justify-center px-4 py-3 rounded-none border-2 border-primary bg-white text-xs font-space font-bold uppercase tracking-wider text-primary shadow-[2px_2px_0px_0px_rgba(0,50,45,1)] hover:bg-surface-container-low active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
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
