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
    <header className="sticky top-0 z-50 border-b-2 border-primary bg-surface">
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3">
          <Logo />
          <span className="text-xl font-anton uppercase tracking-wider text-primary">Lynko</span>
        </Link>

        <nav className="hidden items-center gap-8 text-xs font-space font-bold uppercase text-primary md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="transition-colors hover:text-secondary"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {!isInitializing && (
          <div className="hidden items-center gap-4 md:flex">
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/dashboard"
                  className="text-xs font-space font-bold uppercase text-primary transition-colors hover:text-secondary"
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/urls"
                  className="text-xs font-space font-bold uppercase text-primary transition-colors hover:text-secondary"
                >
                  Links
                </NavLink>
                <NavLink
                  to="/profile"
                  className="text-xs font-space font-bold uppercase text-primary transition-colors hover:text-secondary"
                >
                  Profile
                </NavLink>
                <Button variant="secondary" size="md" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="text-xs font-space font-bold uppercase text-primary transition-colors hover:text-secondary"
                >
                  Login
                </NavLink>
                <Button as={Link} to="/signup" size="md">
                  Start Free
                </Button>
              </>
            )}
          </div>
        )}

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-none border-2 border-primary bg-white p-2 text-primary md:hidden shadow-brutal-sm hover:bg-surface-container-low"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && !isInitializing && (
        <div className="border-t-2 border-primary bg-white md:hidden">
          <div className="flex flex-col gap-3 px-6 py-4 text-xs font-space font-bold uppercase text-primary">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="hover:text-secondary">
                {item.label}
              </a>
            ))}
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" className="hover:text-secondary">
                  Dashboard
                </NavLink>
                <NavLink to="/urls" className="hover:text-secondary">
                  Links
                </NavLink>
                <NavLink to="/profile" className="hover:text-secondary">
                  Profile
                </NavLink>
                <Button variant="secondary" onClick={handleLogout} className="w-full">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="hover:text-secondary">
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
