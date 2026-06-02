import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Logo from '../ui/Logo.jsx'
import Button from '../ui/Button.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

const navItems = [
  { label: 'Features', href: '#features' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Developers', href: '#developers' },
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
    <header className="sticky top-0 z-50 border-b border-border/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3">
          <Logo />
          <span className="text-base font-semibold tracking-tight text-text">Lynko</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-text-muted md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="transition-colors hover:text-text"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {!isInitializing && (
          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/dashboard"
                  className="text-sm font-medium text-text-muted transition-colors hover:text-text"
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/links"
                  className="text-sm font-medium text-text-muted transition-colors hover:text-text"
                >
                  Links
                </NavLink>
                <NavLink
                  to="/profile"
                  className="text-sm font-medium text-text-muted transition-colors hover:text-text"
                >
                  Profile
                </NavLink>
                <Button variant="secondary" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="text-sm font-medium text-text-muted transition-colors hover:text-text"
                >
                  Login
                </NavLink>
                <Button as={Link} to="/signup">
                  Start Free
                </Button>
              </>
            )}
          </div>
        )}

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-border/70 p-2 text-text md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && !isInitializing && (
        <div className="border-t border-border/70 bg-white md:hidden">
          <div className="flex flex-col gap-3 px-6 py-4 text-sm text-text-muted">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="hover:text-text">
                {item.label}
              </a>
            ))}
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" className="hover:text-text">
                  Dashboard
                </NavLink>
                <NavLink to="/links" className="hover:text-text">
                  Links
                </NavLink>
                <NavLink to="/profile" className="hover:text-text">
                  Profile
                </NavLink>
                <Button variant="secondary" onClick={handleLogout} className="w-full">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="hover:text-text">
                  Login
                </NavLink>
                <Button as={Link} to="/signup" className="w-full">
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
