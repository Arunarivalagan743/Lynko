import { useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { useAuth } from '../context/AuthContext.jsx'
import { mapApiError } from '../utils/errorMapper.js'

/**
 * Custom hook to standardise and handle API exceptions in components,
 * integrating with React Hot Toast alerts and the AuthContext logout flow.
 */
export const useApiError = () => {
  const { logout } = useAuth()

  const handleError = useCallback((error) => {
    const mapped = mapApiError(error)

    // Trigger toast alerts based on standardized error severity levels
    switch (mapped.severity) {
      case 'critical':
        toast.error(`${mapped.title}: ${mapped.message}`, {
          duration: 5000,
          id: 'api-critical-toast', // prevents duplicate toast spam
        })
        break
      case 'error':
        toast.error(mapped.message, {
          id: 'api-error-toast',
        })
        break
      case 'warning':
        toast.error(mapped.message, {
          icon: '⚠️',
          id: 'api-warning-toast',
        })
        break
      case 'info':
      default:
        toast(mapped.message, {
          icon: 'ℹ️',
          id: 'api-info-toast',
        })
        break
    }

    // Trigger session cleanup for critical authentication failures
    if (mapped.severity === 'critical' && error.response?.status === 401) {
      logout()
    }

    return mapped
  }, [logout])

  return { handleError }
}
