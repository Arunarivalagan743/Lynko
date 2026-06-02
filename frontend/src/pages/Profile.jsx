import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import PageLoader from '../components/loading/PageLoader.jsx'
import { 
  User as UserIcon, 
  Mail, 
  Calendar, 
  LogOut, 
  Settings, 
  AlertCircle 
} from 'lucide-react'

export default function SettingsPage() {
  const { user, logout, getCurrentUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Reload user info on mount to ensure we have fresh data
  useEffect(() => {
    const fetchFreshUser = async () => {
      setLoading(true)
      setError(null)
      try {
        await getCurrentUser()
      } catch (err) {
        setError(err.message || 'Failed to load user account profile data')
      } finally {
        setLoading(false)
      }
    }
    fetchFreshUser()
  }, [getCurrentUser])

  const handleLogout = async () => {
    setLoading(true)
    try {
      await logout()
    } catch (err) {
      setError(err.message || 'Logout failed. Please try again.')
      setLoading(false)
    }
  }

  if (loading && !user) {
    return <PageLoader message="Loading your account settings..." />
  }

  // Fallback for user name when schema doesn't have it natively
  const userName = user?.name || user?.email?.split('@')[0] || 'Lynko User'
  const createdDate = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) 
    : 'N/A'

  return (
    <div className="space-y-6 max-w-2xl mx-auto py-6">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-xl font-anton tracking-wider text-primary uppercase flex items-center gap-2">
          <Settings size={20} className="text-primary" />
          Account Settings
        </h1>
        <p className="text-sm font-medium text-on-surface-variant">
          Manage your personal workspace preferences and authentication.
        </p>
      </div>

      {/* Error State Banner */}
      {error && (
        <Card className="border-error bg-white flex items-start gap-3 p-4" shadowSize="sm">
          <AlertCircle className="text-error flex-shrink-0 mt-0.5" size={18} />
          <div className="space-y-1">
            <h4 className="font-space text-xs font-bold uppercase text-error">Account Operation Error</h4>
            <p className="font-space text-xs text-error font-semibold">{error}</p>
          </div>
        </Card>
      )}

      {/* Main Settings Card */}
      <Card className="divide-y-2 divide-primary p-0 overflow-hidden" shadowSize="md">
        {/* User Identity Details */}
        <div className="p-6 space-y-4">
          <h3 className="font-space text-xs font-bold uppercase tracking-wider text-primary">User Identity Details</h3>
          
          <div className="space-y-3.5">
            {/* User Name */}
            <div className="flex items-center gap-4 text-sm">
              <div className="h-9 w-9 rounded-none border-2 border-primary bg-surface-container-low flex items-center justify-center text-primary flex-shrink-0">
                <UserIcon size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-space text-[9px] font-bold text-on-surface-variant uppercase">User Name</p>
                <p className="text-sm font-bold text-primary truncate">{userName}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-4 text-sm">
              <div className="h-9 w-9 rounded-none border-2 border-primary bg-surface-container-low flex items-center justify-center text-primary flex-shrink-0">
                <Mail size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-space text-[9px] font-bold text-on-surface-variant uppercase">Email Address</p>
                <p className="text-sm font-bold text-primary truncate">{user?.email || 'N/A'}</p>
              </div>
            </div>

            {/* Account Created Date */}
            <div className="flex items-center gap-4 text-sm">
              <div className="h-9 w-9 rounded-none border-2 border-primary bg-surface-container-low flex items-center justify-center text-primary flex-shrink-0">
                <Calendar size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-space text-[9px] font-bold text-on-surface-variant uppercase">Account Created Date</p>
                <p className="text-sm font-bold text-primary truncate">{createdDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Danger/Access Zone */}
        <div className="p-6 bg-surface-container-low flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-space text-xs font-bold uppercase text-primary">Session Management</h4>
            <p className="font-space text-[9px] font-bold text-on-surface-variant uppercase">
              Revoke active authentication cookies and sign out from this browser.
            </p>
          </div>
          
          <Button
            onClick={handleLogout}
            loading={loading}
            className="border-2 border-primary bg-error text-white shadow-brutal hover:bg-error/80 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none font-semibold text-xs py-2 h-9 flex items-center gap-1.5"
          >
            <LogOut size={14} />
            Logout Account
          </Button>
        </div>
      </Card>
    </div>
  )
}
export { SettingsPage as Profile }
