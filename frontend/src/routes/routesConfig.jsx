import React, { lazy } from 'react'
import { PATHS } from './paths.js'

const lazyWithPreload = (factory) => {
  const Component = lazy(factory)
  Component.preload = factory
  return Component
}

// Lazy-loaded components for route chunks optimization
const Home = lazyWithPreload(() => import('../pages/Home.jsx'))
const Login = lazyWithPreload(() => import('../pages/auth/Login.jsx'))
const Signup = lazyWithPreload(() => import('../pages/auth/Signup.jsx'))
const ForgotPassword = lazyWithPreload(() => import('../pages/auth/ForgotPassword.jsx'))
const ResetPassword = lazyWithPreload(() => import('../pages/auth/ResetPassword.jsx'))
const Dashboard = lazyWithPreload(() => import('../pages/Dashboard.jsx'))
const Urls = lazyWithPreload(() => import('../pages/Urls.jsx'))
const Profile = lazyWithPreload(() => import('../pages/Profile.jsx'))
const BulkUpload = lazyWithPreload(() => import('../pages/BulkUpload.jsx'))
const PublicStats = lazyWithPreload(() => import('../pages/PublicStats.jsx'))
const Analytics = lazyWithPreload(() => import('../pages/Analytics.jsx'))
const EngagementDashboard = lazyWithPreload(() => import('../pages/EngagementDashboard.jsx'))
const NotFound = lazyWithPreload(() => import('../pages/NotFound.jsx'))

const routePreloaders = {
  [PATHS.HOME]: () => Home.preload(),
  [PATHS.LOGIN]: () => Login.preload(),
  [PATHS.SIGNUP]: () => Signup.preload(),
  [PATHS.FORGOT_PASSWORD]: () => ForgotPassword.preload(),
  [PATHS.RESET_PASSWORD]: () => ResetPassword.preload(),
  [PATHS.DASHBOARD]: () => Dashboard.preload(),
  [PATHS.URLS]: () => Urls.preload(),
  [PATHS.PROFILE]: () => Profile.preload(),
  [PATHS.BULK_UPLOAD]: () => BulkUpload.preload(),
  [PATHS.ANALYTICS_BASE]: () => Analytics.preload(),
  [PATHS.PUBLIC_STATS_BASE]: () => PublicStats.preload(),
  [PATHS.ENGAGEMENT]: () => EngagementDashboard.preload(),
}

export const preloadRoute = (path) => {
  const preload = routePreloaders[path]
  if (preload) {
    preload()
  }
}

export const routesConfig = [
  // Public Routes
  {
    path: PATHS.HOME,
    element: <Home />,
    isProtected: false,
    isPublicOnly: false,
  },
  {
    path: PATHS.PUBLIC_STATS_BASE,
    element: <PublicStats />,
    isProtected: false,
    isPublicOnly: false,
  },
  {
    path: PATHS.PUBLIC_STATS,
    element: <PublicStats />,
    isProtected: false,
    isPublicOnly: false,
  },
  // Public-only Routes (restricted if authenticated)
  {
    path: PATHS.LOGIN,
    element: <Login />,
    isProtected: false,
    isPublicOnly: true,
  },
  {
    path: PATHS.SIGNUP,
    element: <Signup />,
    isProtected: false,
    isPublicOnly: true,
  },
  {
    path: PATHS.FORGOT_PASSWORD,
    element: <ForgotPassword />,
    isProtected: false,
    isPublicOnly: true,
  },
  {
    path: PATHS.RESET_PASSWORD,
    element: <ResetPassword />,
    isProtected: false,
    isPublicOnly: true,
  },
  // Protected Routes (requires authenticated session)
  {
    path: PATHS.DASHBOARD,
    element: <Dashboard />,
    isProtected: true,
  },
  {
    path: PATHS.URLS,
    element: <Urls />,
    isProtected: true,
  },
  {
    path: PATHS.PROFILE,
    element: <Profile />,
    isProtected: true,
  },
  {
    path: PATHS.BULK_UPLOAD,
    element: <BulkUpload />,
    isProtected: true,
  },
  {
    path: PATHS.ANALYTICS_BASE,
    element: <Analytics />,
    isProtected: true,
  },
  {
    path: PATHS.ANALYTICS,
    element: <Analytics />,
    isProtected: true,
  },
  {
    path: PATHS.ENGAGEMENT,
    element: <EngagementDashboard />,
    isProtected: true,
  },
  {
    path: '*',
    element: <NotFound />,
    isProtected: false,
    isPublicOnly: false,
  },
]
