import axios from 'axios'
import { ENV } from '../constants/env.js'
import { mapApiError } from '../utils/errorMapper.js'
import { toast } from 'react-hot-toast'

// Create Axios Client Instance
const apiClient = axios.create({
  baseURL: ENV.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Callbacks injected from AuthContext to decouple auth states from the HTTP layer
let getAccessTokenCb = () => null
let refreshSessionCb = async () => null
let logoutCb = () => {}

/**
 * Inject authentication actions from AuthContext into the HTTP client
 * to avoid circular dependency trees.
 */
export const injectAuthActions = (getAccessToken, refreshSession, logout) => {
  getAccessTokenCb = getAccessToken
  refreshSessionCb = refreshSession
  logoutCb = logout
}

// Request Interceptor: Inject Bearer Token if available
apiClient.interceptors.request.use(
  (config) => {
    // Skip token injection for public paths (e.g., auth registration, stats retrieval)
    const isAuthEndpoint = config.url?.includes('/api/auth/')
    const isPublicStats = config.url?.includes('/stats/')
    const isPublicRedirect = config.url?.includes('/r/')

    if (!isAuthEndpoint && !isPublicStats && !isPublicRedirect) {
      const token = getAccessTokenCb()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor: Manage 401 Unauthorized errors and refresh-token rotation
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Intercept 401 errors, ignoring auth endpoints to prevent endless recursion
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/api/auth/')
    ) {
      // If a token rotation is already executing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return apiClient(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Execute refresh token rotation
        const session = await refreshSessionCb()
        const newAccessToken = session?.accessToken

        if (newAccessToken) {
          processQueue(null, newAccessToken)
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return apiClient(originalRequest)
        } else {
          throw new Error('Session restoration failed - no access token returned')
        }
      } catch (refreshError) {
        processQueue(refreshError, null)
        // Session invalid: logout client, wipe localStorage indicators, and route to Login
        logoutCb()
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // Globally intercept and notify for other response failures (excluding 401s and standard 400 validations)
    if (error.response?.status !== 401) {
      const mapped = mapApiError(error)
      // Only toast 400 validation failures if they are critical safety blocks
      if (error.response?.status !== 400 || mapped.severity === 'critical') {
        toast.error(mapped.message, { id: 'global-api-error-toast' })
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient
