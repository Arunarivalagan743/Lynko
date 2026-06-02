import { ERROR_MESSAGES } from './errorMessages.js'

/**
 * Maps any Axios error, network dropout, or validation failure into a 
 * standardized client-side error shape: { title, message, severity }.
 *
 * @param {Error|Object} error - The caught error instance.
 * @returns {Object} { title, message, severity }
 */
export const mapApiError = (error) => {
  // 1. Check Network Timeout
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return ERROR_MESSAGES.TIMEOUT
  }

  // 2. Check Network Disconnected
  if (error.message === 'Network Error' || !error.response) {
    return ERROR_MESSAGES.NETWORK
  }

  const { status, data } = error.response
  const backendMessage = data?.message || ''

  // 3. Map HTTP status codes and backend error signals
  switch (status) {
    case 400:
      // Handle malware block or URL safety fail alerts
      if (backendMessage.toLowerCase().includes('safety') || backendMessage.toLowerCase().includes('virus')) {
        return ERROR_MESSAGES.SAFETY_BLOCKED
      }
      return {
        ...ERROR_MESSAGES.VALIDATION_ERROR,
        message: backendMessage || ERROR_MESSAGES.VALIDATION_ERROR.message,
      }

    case 401:
      // Check if credentials are invalid or if refresh failed
      if (backendMessage.toLowerCase().includes('credentials') || error.config?.url?.includes('/login')) {
        return ERROR_MESSAGES.AUTH_INVALID
      }
      return ERROR_MESSAGES.AUTH_EXPIRED

    case 403:
      return ERROR_MESSAGES.FORBIDDEN

    case 404:
      return {
        ...ERROR_MESSAGES.NOT_FOUND,
        message: backendMessage || ERROR_MESSAGES.NOT_FOUND.message,
      }

    case 409:
      if (backendMessage.toLowerCase().includes('alias')) {
        return ERROR_MESSAGES.CONFLICT_ALIAS
      }
      return {
        title: 'Conflict Detected',
        message: backendMessage || 'This operation conflicts with existing data.',
        severity: 'warning',
      }

    case 429:
      return ERROR_MESSAGES.RATE_LIMIT

    case 500:
    case 502:
    case 503:
    case 504:
      return ERROR_MESSAGES.SERVER_ERROR

    default:
      return {
        title: ERROR_MESSAGES.GENERIC.title,
        message: backendMessage || ERROR_MESSAGES.GENERIC.message,
        severity: 'error',
      }
  }
}
