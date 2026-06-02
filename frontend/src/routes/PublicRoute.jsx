import { Navigate, Outlet } from 'react-router-dom'
import Spinner from '../components/ui/Spinner.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const RestoreLoader = ({ label }) => {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-6">
      <div className="flex items-center gap-3 rounded-full border border-border/70 bg-surface px-4 py-2 text-sm text-text-muted">
        <Spinner className="border-border/60 border-t-primary" />
        <span>{label}</span>
      </div>
    </div>
  )
}

const PublicRoute = () => {
  const { isAuthenticated, isInitializing } = useAuth()

  if (isInitializing) {
    return <RestoreLoader label="Restoring your session" />
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

export default PublicRoute
