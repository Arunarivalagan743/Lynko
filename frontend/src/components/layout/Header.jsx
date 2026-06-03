import React from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Menu, Search } from 'lucide-react'
import UserMenu from './UserMenu.jsx'
import Logo from '../ui/Logo.jsx'
import { PATHS } from '../../routes/paths.js'

export default function Header({ onMenuToggle }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const pathname = location.pathname

  // Derive current page title dynamically from pathname
  const getPageTitle = () => {
    if (pathname === PATHS.DASHBOARD) return 'Dashboard'
    if (pathname === PATHS.URLS) return 'My Links'
    if (pathname.startsWith('/analytics')) return 'Link Analytics'
    if (pathname === PATHS.BULK_UPLOAD) return 'Bulk Import'
    if (pathname === PATHS.PROFILE) return 'Account Settings'
    if (pathname.startsWith('/stats')) return 'Link Statistics'
    return 'Lynko'
  }

  return (
    <header className="sticky top-0 z-40 flex h-[72px] w-full items-center justify-between border-b-2 border-primary bg-white/90 backdrop-blur-md px-5 md:px-8">
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger menu toggle button */}
        <button
          onClick={onMenuToggle}
          className="rounded-none border-2 border-primary bg-white p-2 text-primary shadow-[2px_2px_0px_0px_rgba(0,50,45,1)] hover:bg-surface-container-low active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all duration-fast md:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={16} />
        </button>

        {/* Show logo on mobile, page title on desktop */}
        <div className="md:hidden">
          <Logo variant="full" size="sm" />
        </div>
        <h1 className="text-lg font-anton uppercase tracking-wide text-primary hidden md:block">
          {getPageTitle()}
        </h1>
      </div>

      <div className="hidden sm:flex flex-1 max-w-lg mx-4 md:mx-6 lg:mx-10">
        <div className="relative w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/40 pointer-events-none" />
          <input
            type="text"
            placeholder="Search links by URL or code..."
            value={searchParams.get('q') || ''}
            onChange={(e) => {
              const query = e.target.value
              navigate(`/urls?q=${encodeURIComponent(query)}`)
            }}
            className="w-full rounded-none border-2 border-primary bg-white pl-10 pr-4 py-2 font-space text-xs text-primary placeholder:text-primary/40 focus:border-secondary focus:outline-none focus:ring-0 shadow-[2px_2px_0px_0px_rgba(0,50,45,1)] transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <UserMenu />
      </div>
    </header>
  )
}
export { Header }
