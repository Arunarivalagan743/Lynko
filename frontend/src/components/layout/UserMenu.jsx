import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, User, Settings, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { PATHS } from '../../routes/paths.js'

export default function UserMenu() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  // Toggle menu open/close
  const toggleMenu = () => setIsOpen((prev) => !prev)

  // Close menu on clicks outside of the element
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  // Resolve user initials dynamically
  const initials = (() => {
    if (!user) return 'U'
    const name = user.name || ''
    const email = user.email || ''

    if (name.trim()) {
      const parts = name.trim().split(/\s+/)
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase()
      }
      return name.substring(0, 2).toUpperCase()
    }

    if (email.trim()) {
      return email.substring(0, 2).toUpperCase()
    }

    return 'U'
  })()

  const displayName = user?.name || user?.email?.split('@')[0] || 'User'
  const displayEmail = user?.email || 'user@lynko.io'

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="flex items-center gap-2 rounded-none p-1.5 bg-white border-2 border-primary shadow-brutal-sm hover:bg-surface-container-low focus:outline-none transition-all duration-100"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-none bg-secondary-container border border-primary text-primary font-anton text-sm select-none">
          {initials}
        </div>
        <span className="hidden md:inline font-bold text-primary text-xs tracking-wide">{displayName}</span>
        <ChevronDown size={14} className="text-primary hidden md:inline" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 rounded-none border-2 border-primary bg-white p-1.5 shadow-brutal focus:outline-none z-50">
          <div className="px-3 py-2 border-b-2 border-primary mb-1 bg-surface-container-low">
            <p className="text-sm font-anton tracking-wide text-primary truncate">{displayName.toUpperCase()}</p>
            <p className="text-xs font-space text-on-surface-variant truncate">{displayEmail}</p>
          </div>

          <Link
            to={PATHS.PROFILE}
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2 rounded-none px-3 py-2 text-sm font-semibold text-primary hover:bg-surface-container-low transition-colors"
          >
            <User size={16} className="text-primary" />
            <span>My Profile</span>
          </Link>

          <Link
            to={PATHS.PROFILE}
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2 rounded-none px-3 py-2 text-sm font-semibold text-primary hover:bg-surface-container-low transition-colors"
          >
            <Settings size={16} className="text-primary" />
            <span>Settings</span>
          </Link>

          <button
            onClick={() => {
              setIsOpen(false)
              logout()
            }}
            className="flex w-full items-center gap-2 rounded-none px-3 py-2 text-sm font-bold text-error hover:bg-error-container hover:text-error border-t-2 border-primary mt-1 pt-2"
          >
            <LogOut size={16} />
            <span>Log out</span>
          </button>
        </div>
      )}
    </div>
  )
}
