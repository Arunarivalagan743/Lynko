import { Bell, ChevronDown, Search } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import Logo from '../ui/Logo.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

const sidebarLinks = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Links', to: '/links' },
  { label: 'Analytics', to: '/dashboard#analytics' },
  { label: 'QR Codes', to: '/dashboard#qr' },
  { label: 'Domains', to: '/dashboard#domains' },
  { label: 'Settings', to: '/profile' },
]

const AppShell = ({ title, subtitle, children, actions }) => {
  const { user } = useAuth()

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background">
      <div className="mx-auto flex w-full max-w-[1200px] gap-6 px-6 py-8">
        <aside className="hidden w-60 flex-col gap-6 rounded-card border border-border/70 bg-white p-6 shadow-subtle lg:flex">
          <div className="flex items-center gap-3">
            <Logo />
            <div>
              <p className="text-sm font-semibold text-text">Lynko</p>
              <p className="text-xs text-text-muted">Workspace</p>
            </div>
          </div>
          <nav className="flex flex-col gap-1 text-sm">
            {sidebarLinks.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 transition-colors ${
                    isActive
                      ? 'bg-surface text-text'
                      : 'text-text-muted hover:bg-surface hover:text-text'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="rounded-lg border border-border/70 bg-surface p-4 text-xs text-text-muted">
            <p className="font-semibold text-text">Growth plan</p>
            <p className="mt-1">Advanced analytics, team roles, and API access.</p>
            <button
              type="button"
              className="mt-3 w-full rounded-lg border border-border bg-white px-3 py-2 text-xs font-medium text-text transition-colors hover:border-primary/40 hover:text-primary"
            >
              Upgrade plan
            </button>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex flex-col gap-6">
            <header className="flex flex-col gap-4 rounded-card border border-border/70 bg-white p-6 shadow-subtle md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                  Workspace
                </p>
                <h1 className="text-2xl font-semibold text-text">{title}</h1>
                {subtitle && <p className="text-sm text-text-muted">{subtitle}</p>}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Search links"
                    className="h-10 w-56 rounded-lg border border-border bg-white pl-9 pr-3 text-sm text-text placeholder:text-text-muted/70 focus:border-primary/70 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-white text-text-muted transition-colors hover:text-text"
                >
                  <Bell size={18} />
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm text-text"
                >
                  <span className="h-7 w-7 rounded-full bg-surface text-xs font-semibold text-text flex items-center justify-center">
                    {user?.email ? user.email[0].toUpperCase() : 'U'}
                  </span>
                  <span className="text-sm font-medium">{user?.email || 'User'}</span>
                  <ChevronDown size={16} className="text-text-muted" />
                </button>
                {actions}
              </div>
            </header>

            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppShell
