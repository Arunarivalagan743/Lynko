import AppShell from '../components/layout/AppShell.jsx'
import Card from '../components/ui/Card.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const Profile = () => {
  const { user } = useAuth()

  return (
    <AppShell title="Profile" subtitle="Manage your account and workspace preferences.">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-text">Account details</p>
            <p className="text-xs text-text-muted">Primary identity for your workspace.</p>
          </div>
          <div className="grid gap-3 text-sm text-text-muted">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Email</p>
              <p className="text-text">{user?.email || 'Unknown'}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Status</p>
              <p className="text-text">Active</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Role</p>
              <p className="text-text">Owner</p>
            </div>
          </div>
        </Card>
        <Card className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-text">Workspace security</p>
            <p className="text-xs text-text-muted">Control authentication and access.</p>
          </div>
          <div className="space-y-3 text-sm text-text-muted">
            <div className="flex items-center justify-between">
              <span>Multi-factor authentication</span>
              <span className="text-success">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span>SSO providers</span>
              <span className="text-text">Not configured</span>
            </div>
            <div className="flex items-center justify-between">
              <span>API tokens</span>
              <span className="text-text">3 active</span>
            </div>
          </div>
          <button
            type="button"
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-text transition-colors hover:border-primary/40 hover:text-primary"
          >
            Manage security settings
          </button>
        </Card>
      </div>
    </AppShell>
  )
}

export default Profile
