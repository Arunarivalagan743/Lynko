import React, { Suspense } from 'react'
import { Navigate, Route, Routes, Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/layout/Navbar.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import PublicRoute from './routes/PublicRoute.jsx'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import { routesConfig } from './routes/routesConfig.jsx'
import { PATHS } from './routes/paths.js'

// Simple structural loader to render while chunks are fetching
const PageLoader = () => (
  <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-background text-text-muted">
    <div className="flex items-center gap-3 rounded-full border border-border bg-surface px-4 py-2 text-sm">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-primary" />
      <span>Loading page assets...</span>
    </div>
  </div>
)

const App = () => {
  // Separate routes into their respective layout routing gates
  const generalRoutes = routesConfig.filter((r) => !r.isProtected && !r.isPublicOnly)
  const publicOnlyRoutes = routesConfig.filter((r) => r.isPublicOnly)
  const protectedRoutes = routesConfig.filter((r) => r.isProtected)

  return (
    <div className="min-h-screen bg-background text-text">
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* General/Public access routes */}
          <Route element={<><Navbar /><Outlet /></>}>
            {generalRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Route>

          {/* Public-Only gates (redirects to dashboard if logged in) */}
          <Route element={<PublicRoute />}>
            <Route element={<><Navbar /><Outlet /></>}>
              {publicOnlyRoutes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
            </Route>
          </Route>

          {/* Protected gates (redirects to login if anonymous) */}
          <Route element={<ProtectedRoute />}>
            {/* Nest all workspace dashboards inside the DashboardLayout shell */}
            <Route element={<DashboardLayout />}>
              {protectedRoutes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
            </Route>
          </Route>

          {/* Safe fallback for unmatched routes */}
          <Route path="*" element={<Navigate to={PATHS.HOME} replace />} />
        </Routes>
      </Suspense>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: 'rgb(var(--color-surface))',
            color: 'rgb(var(--color-text))',
            border: '1px solid rgb(var(--color-border))',
            borderRadius: '12px',
          },
        }}
      />
    </div>
  )
}

export default App
