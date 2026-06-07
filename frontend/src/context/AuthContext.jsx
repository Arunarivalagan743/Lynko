import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { 
  login as loginRequest, 
  signup as signupRequest, 
  logout as logoutRequest, 
  refreshToken as refreshRequest 
} from '../services/authApi.js'
import { getProfile as getProfileRequest } from '../services/userApi.js'
import { setAuthToken } from '../services/http.js'
import { injectAuthActions } from '../api/apiClient.js'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    accessToken: null,
    isInitializing: true,
  })
  const [authActionLoading, setAuthActionLoading] = useState(false)

  // Synchronize token value to a ref for synchronous client access without stale render lags
  const tokenRef = useRef(null)

  useEffect(() => {
    tokenRef.current = authState.accessToken
  }, [authState.accessToken])

  // Resolves the current user's profile metadata from the backend
  const getCurrentUser = useCallback(async () => {
    try {
      const response = await getProfileRequest()
      const user = response.user || response
      setAuthState((prev) => ({
        ...prev,
        user,
      }))
      return user
    } catch (err) {
      // Clear session if user loading fails (indicates invalid token session)
      setAuthToken(null)
      setAuthState({
        user: null,
        accessToken: null,
        isInitializing: false,
      })
      throw err
    }
  }, [])

  // Refreshes the session using the HttpOnly cookie automatic transmission
  const refreshSession = useCallback(async () => {
    try {
      const response = await refreshRequest()
      const { accessToken } = response

      // Store new access token in memory & update HTTP client defaults
      setAuthToken(accessToken)

      setAuthState((prev) => ({
        ...prev,
        accessToken,
      }))

      // Fetch user profile info following token updates
      const user = await getProfileRequest()
      const parsedUser = user.user || user

      setAuthState((prev) => ({
        ...prev,
        user: parsedUser,
        isInitializing: false,
      }))

      return { accessToken, user: parsedUser }
    } catch (err) {
      setAuthToken(null)
      setAuthState({
        user: null,
        accessToken: null,
        isInitializing: false,
      })
      throw err
    }
  }, [])

  // User Login Action
  const login = useCallback(async (payload) => {
    setAuthActionLoading(true)
    try {
      const response = await loginRequest(payload)
      const { user, accessToken } = response

      setAuthToken(accessToken)

      setAuthState({
        user: user || null,
        accessToken,
        isInitializing: false,
      })

      return response
    } finally {
      setAuthActionLoading(false)
    }
  }, [])

  // User Signup Action (auto-logs in user upon registration success)
  const signup = useCallback(async (payload) => {
    setAuthActionLoading(true)
    try {
      const response = await signupRequest(payload)
      const { user, accessToken } = response

      if (accessToken) {
        setAuthToken(accessToken)

        setAuthState({
          user: user || null,
          accessToken,
          isInitializing: false,
        })
      }

      return response
    } finally {
      setAuthActionLoading(false)
    }
  }, [])

  // User Logout Action
  const logout = useCallback(async () => {
    setAuthActionLoading(true)
    try {
      await logoutRequest()
    } catch (_err) {
      // Clear client state even if backend API revocation call fails
    } finally {
      setAuthToken(null)
      setAuthState({
        user: null,
        accessToken: null,
        isInitializing: false,
      })
      setAuthActionLoading(false)
    }
  }, [])

  // Inject authentication actions into the HTTP client interceptor tier
  useEffect(() => {
    injectAuthActions(
      () => tokenRef.current,
      refreshSession,
      logout
    )
  }, [refreshSession, logout])

  // Startup Session Restoration Logic
  useEffect(() => {
    refreshSession().catch((_err) => {
      // Silent catch on startup failure; user is redirected to public view cleanly
    })
  }, [refreshSession])

  const value = useMemo(
    () => ({
      ...authState,
      isAuthenticated: Boolean(authState.accessToken),
      authActionLoading,
      login,
      signup,
      logout,
      refreshSession,
      getCurrentUser,
    }),
    [authState, authActionLoading, login, signup, logout, refreshSession, getCurrentUser]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
export default AuthContext
