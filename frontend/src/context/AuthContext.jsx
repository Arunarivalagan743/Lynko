import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { login as loginRequest, logout as logoutRequest, signup as signupRequest } from '../services/authApi.js'
import { setAuthToken } from '../services/http.js'

const AuthContext = createContext(null)

const STORAGE_KEY = 'lynko_auth'

const readStoredAuth = () => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return null
    }

    return JSON.parse(raw)
  } catch (_err) {
    return null
  }
}

const writeStoredAuth = (payload) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

const clearStoredAuth = () => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(STORAGE_KEY)
}

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    accessToken: null,
    refreshToken: null,
    isInitializing: true,
  })

  useEffect(() => {
    const stored = readStoredAuth()
    if (stored?.accessToken) {
      setAuthToken(stored.accessToken)
      setAuthState({
        user: stored.user || null,
        accessToken: stored.accessToken,
        refreshToken: stored.refreshToken || null,
        isInitializing: false,
      })
      return
    }

    setAuthToken(null)
    setAuthState((prev) => ({
      ...prev,
      isInitializing: false,
    }))
  }, [])

  const login = useCallback(async (payload) => {
    const response = await loginRequest(payload)
    const nextState = {
      user: response.user || null,
      accessToken: response.accessToken || null,
      refreshToken: response.refreshToken || null,
      isInitializing: false,
    }

    writeStoredAuth(nextState)
    setAuthToken(nextState.accessToken)
    setAuthState(nextState)

    return response
  }, [])

  const signup = useCallback(async (payload) => {
    const response = await signupRequest(payload)
    return response
  }, [])

  const logout = useCallback(async () => {
    try {
      if (authState.refreshToken) {
        await logoutRequest({ refreshToken: authState.refreshToken })
      }
    } catch (_err) {
      // Ignore network errors on logout and clear client state anyway.
    } finally {
      clearStoredAuth()
      setAuthToken(null)
      setAuthState({
        user: null,
        accessToken: null,
        refreshToken: null,
        isInitializing: false,
      })
    }
  }, [authState.refreshToken])

  const value = useMemo(
    () => ({
      ...authState,
      isAuthenticated: Boolean(authState.accessToken),
      login,
      signup,
      logout,
    }),
    [authState, login, logout, signup],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
