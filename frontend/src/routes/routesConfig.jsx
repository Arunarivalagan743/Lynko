import React, { lazy } from 'react'
import { PATHS } from './paths.js'

// Lazy-loaded components for route chunks optimization
const Home = lazy(() => import('../pages/Home.jsx'))
const Login = lazy(() => import('../pages/auth/Login.jsx'))
const Signup = lazy(() => import('../pages/auth/Signup.jsx'))
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword.jsx'))
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword.jsx'))
const Dashboard = lazy(() => import('../pages/Dashboard.jsx'))
const Urls = lazy(() => import('../pages/Urls.jsx'))
const Profile = lazy(() => import('../pages/Profile.jsx'))
const BulkUpload = lazy(() => import('../pages/BulkUpload.jsx'))
const PublicStats = lazy(() => import('../pages/PublicStats.jsx'))
const Analytics = lazy(() => import('../pages/Analytics.jsx'))

export const routesConfig = [
  // Public Routes
  {
    path: PATHS.HOME,
    element: <Home />,
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
    path: PATHS.ANALYTICS,
    element: <Analytics />,
    isProtected: true,
  },
]
