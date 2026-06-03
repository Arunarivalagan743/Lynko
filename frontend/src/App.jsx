import React, { Suspense } from 'react'
import { Navigate, Route, Routes, Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/layout/Navbar.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import PublicRoute from './routes/PublicRoute.jsx'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import RestoreLoader from './components/loading/RestoreLoader.jsx'
import { routesConfig } from './routes/routesConfig.jsx'
import { PATHS } from './routes/paths.js'

const App = () => {
  // Separate routes into their respective layout routing gates
  const generalRoutes = routesConfig.filter((r) => !r.isProtected && !r.isPublicOnly)
  const publicOnlyRoutes = routesConfig.filter((r) => r.isPublicOnly)
  const protectedRoutes = routesConfig.filter((r) => r.isProtected)

  return (
    <div className="min-h-screen bg-background text-text">
      <Suspense fallback={<RestoreLoader />}>
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
            background: '#f8faf5',
            color: '#191c1a',
            border: '2px solid #00322d',
            borderRadius: '0px',
            fontFamily: '"Hanken Grotesk", sans-serif',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '4px 4px 0px 0px #00322d',
          },
        }}
      />
    </div>
  )
}

export default App
