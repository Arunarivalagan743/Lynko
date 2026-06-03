import React, { useState, useEffect, useMemo } from 'react'
import { toast } from 'react-hot-toast'
import { useAuth } from '../context/AuthContext.jsx'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Input from '../components/ui/Input.jsx'
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx'
import PageLoader from '../components/loading/PageLoader.jsx'
import {
  User as UserIcon,
  Mail,
  Calendar,
  LogOut,
  Settings,
  AlertCircle,
  Trash2,
  Phone,
} from 'lucide-react'
import { updateProfile, deleteAccount } from '../services/userApi.js'

export default function SettingsPage() {
  const { user, logout, getCurrentUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [confirmState, setConfirmState] = useState({ open: false, action: null })

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

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email)
    }
    if (user?.name) {
      setName(user.name)
    }
    if (user?.phone) {
      setPhone(user.phone)
    }
  }, [user?.email, user?.name, user?.phone])

  const handleLogout = async () => {
    setLoading(true)
    try {
      await logout()
    } catch (err) {
      setError(err.message || 'Logout failed. Please try again.')
      setLoading(false)
    }
  }

  const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email])
  const normalizedName = useMemo(() => name.trim(), [name])
  const normalizedPhone = useMemo(() => phone.trim(), [phone])

  const isEmailChanged = Boolean(
    user?.email && normalizedEmail && normalizedEmail !== user.email
  )
  const isNameChanged = Boolean(
    normalizedName && normalizedName !== (user?.name || '')
  )
  const isPhoneChanged = Boolean(
    normalizedPhone && normalizedPhone !== (user?.phone || '')
  )

  const nameError = useMemo(() => {
    if (!normalizedName) return null
    if (normalizedName.length < 2) return 'Name must be at least 2 characters'
    if (normalizedName.length > 60) return 'Name must be 60 characters or less'
    return null
  }, [normalizedName])

  const emailError = useMemo(() => {
    if (!email.trim()) return null
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    return ok ? null : 'Enter a valid email address'
  }, [email])

  const phoneError = useMemo(() => {
    if (!normalizedPhone) return null
    const ok = /^\+?[0-9]{7,15}$/.test(normalizedPhone)
    return ok ? null : 'Phone must be 7-15 digits (optionally starting with +)'
  }, [normalizedPhone])

  const hasValidationErrors = Boolean(
    emailError ||
      nameError ||
      phoneError
  )

  const isProfileDirty = Boolean(
    isEmailChanged || isNameChanged || isPhoneChanged
  )

  const openConfirm = (action) => {
    setConfirmState({ open: true, action })
  }

  const closeConfirm = () => {
    if (updateLoading || deleteLoading) return
    setConfirmState({ open: false, action: null })
  }

  const handleProfileSubmit = (event) => {
    event.preventDefault()
    if (!isProfileDirty || hasValidationErrors) return

    const payload = {}
    if (isEmailChanged) payload.email = normalizedEmail
    if (isNameChanged) payload.name = normalizedName
    if (isPhoneChanged) payload.phone = normalizedPhone
    openConfirm({ type: 'update-profile', payload })
  }

  const handleEditToggle = () => {
    if (updateLoading) return
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    if (updateLoading) return
    setEmail(user?.email || '')
    setName(user?.name || '')
    setPhone(user?.phone || '')
    setIsEditing(false)
  }

  const handleDeleteAccount = () => {
    openConfirm({ type: 'delete-account' })
  }

  const handleConfirmAction = async () => {
    if (!confirmState.action) return

    setError(null)

    if (confirmState.action.type === 'update-profile') {
      setUpdateLoading(true)
      try {
        await updateProfile(confirmState.action.payload)
        await getCurrentUser()
        toast.success('Profile updated')
        setConfirmState({ open: false, action: null })
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Profile update failed')
      } finally {
        setUpdateLoading(false)
      }
      return
    }

    setDeleteLoading(true)
    try {
      await deleteAccount()
      toast.success('Account deleted')
      await logout()
      setConfirmState({ open: false, action: null })
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Account deletion failed')
    } finally {
      setDeleteLoading(false)
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
        <div className="p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-space text-xs font-bold uppercase tracking-wider text-primary">Profile Details</h3>
              <p className="text-xs font-space font-semibold uppercase text-on-surface-variant">
                Update your account profile details in place.
              </p>
            </div>
            {isEditing ? (
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCancelEdit}
                  className="min-w-[140px]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  form="profile-form"
                  loading={updateLoading}
                  disabled={!isProfileDirty || hasValidationErrors}
                  className="min-w-[170px]"
                >
                  Save Changes
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                onClick={handleEditToggle}
                className="min-w-[170px]"
              >
                Update Profile
              </Button>
            )}
          </div>

          <form id="profile-form" onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Full Name"
                type="text"
                value={name}
                error={nameError}
                disabled={!isEditing}
                onChange={(event) => setName(event.target.value)}
              />
              <Input
                label="Email Address"
                type="email"
                value={email}
                error={emailError}
                disabled={!isEditing}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <Input
              label="Phone Number"
              type="tel"
              value={phone}
              error={phoneError}
              disabled={!isEditing}
              onChange={(event) => setPhone(event.target.value)}
            />
          </form>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-none border-2 border-primary bg-surface-container-low px-4 py-3">
              <p className="font-space text-[9px] font-bold text-on-surface-variant uppercase">Account Created Date</p>
              <p className="text-sm font-bold text-primary truncate">{createdDate}</p>
            </div>
            <div className="rounded-none border-2 border-primary bg-surface-container-low px-4 py-3">
              <p className="font-space text-[9px] font-bold text-on-surface-variant uppercase">User Name</p>
              <p className="text-sm font-bold text-primary truncate">{userName}</p>
            </div>
          </div>
        </div>

        {/* Session Management */}
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

        <div className="p-6 bg-surface-container-low flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h4 className="font-space text-xs font-bold uppercase text-primary">Danger Zone</h4>
            <p className="font-space text-[9px] font-bold text-on-surface-variant uppercase">
              Permanently delete your account, URLs, and analytics. This action cannot be undone.
            </p>
          </div>
          <Button
            onClick={handleDeleteAccount}
            loading={deleteLoading}
            variant="secondary"
            className="border-2 border-error bg-white text-error shadow-brutal hover:bg-error/10 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none font-semibold text-xs py-2 h-9 flex items-center gap-1.5"
          >
            <Trash2 size={14} />
            Delete Account
          </Button>
        </div>
      </Card>

      <ConfirmDialog
        open={confirmState.open}
        title={
          confirmState.action?.type === 'delete-account'
            ? 'Delete your account?'
            : 'Update account profile?'
        }
        description={
          confirmState.action?.type === 'delete-account'
            ? 'This permanently removes your account, links, and analytics. This action cannot be undone.'
            : 'Confirm the profile updates before saving.'
        }
        details={
          confirmState.action?.type === 'update-profile'
            ? [
                confirmState.action?.payload?.email
                  ? `New email: ${confirmState.action.payload.email}`
                  : null,
                confirmState.action?.payload?.name
                  ? `New name: ${confirmState.action.payload.name}`
                  : null,
                confirmState.action?.payload?.phone
                  ? `New phone: ${confirmState.action.payload.phone}`
                  : null,
              ].filter(Boolean)
            : ['All links and analytics will be removed']
        }
        confirmLabel={
          confirmState.action?.type === 'delete-account' ? 'Delete Account' : 'Confirm Update'
        }
        confirmTone={confirmState.action?.type === 'delete-account' ? 'danger' : 'primary'}
        loading={updateLoading || deleteLoading}
        onConfirm={handleConfirmAction}
        onCancel={closeConfirm}
      />
    </div>
  )
}
export { SettingsPage as Profile }
