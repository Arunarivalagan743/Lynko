import React from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Menu, Search } from 'lucide-react'
import UserMenu from './UserMenu.jsx'
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
    <header className="sticky top-0 z-40 flex h-[72px] w-full items-center justify-between border-b-2 border-primary bg-surface px-5 md:px-8 shadow-header">
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger menu toggle button */}
        <button
          onClick={onMenuToggle}
          className="rounded-none p-2 bg-white border-2 border-primary shadow-brutal-sm hover:bg-surface-container-low focus:outline-none transition-colors lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={20} className="text-primary" />
        </button>

        <h1 className="text-2xl font-anton tracking-wider text-primary uppercase hidden sm:block">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex flex-1 max-w-lg mx-6 lg:mx-10">
        <div className="relative w-full">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/50" />
          <input
            type="text"
            placeholder="Search links by URL or code..."
            value={searchParams.get('q') || ''}
            onChange={(e) => {
              const query = e.target.value
              navigate(`/urls?q=${encodeURIComponent(query)}`)
            }}
            className="w-full rounded-none border-2 border-primary bg-surface-container-low pl-11 pr-4 py-2.5 text-sm text-primary placeholder:text-on-surface-variant/35 focus:border-secondary focus:outline-none transition-colors"
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
