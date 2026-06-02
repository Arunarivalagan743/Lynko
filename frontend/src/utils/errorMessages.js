export const ERROR_MESSAGES = {
  NETWORK: {
    title: 'Network Disconnected',
    message: 'Unable to connect to the server. Please verify your internet connection.',
    severity: 'error',
  },
  TIMEOUT: {
    title: 'Request Timeout',
    message: 'The request took too long to respond. Please try again later.',
    severity: 'warning',
  },
  AUTH_INVALID: {
    title: 'Invalid Credentials',
    message: 'The email or password you entered is incorrect.',
    severity: 'warning',
  },
  AUTH_EXPIRED: {
    title: 'Session Expired',
    message: 'Your login session has expired. Please sign in again.',
    severity: 'critical',
  },
  FORBIDDEN: {
    title: 'Access Denied',
    message: 'You do not have permission to view or modify this resource.',
    severity: 'error',
  },
  NOT_FOUND: {
    title: 'Link Not Found',
    message: 'The requested link details or statistics could not be found.',
    severity: 'info',
  },
  CONFLICT_ALIAS: {
    title: 'Alias Already Taken',
    message: 'This custom URL alias is already in use. Please select a different one.',
    severity: 'warning',
  },
  SAFETY_BLOCKED: {
    title: 'Unsafe URL Blocked',
    message: 'This URL has been flagged as suspicious or malicious by our safety systems.',
    severity: 'critical',
  },
  RATE_LIMIT: {
    title: 'Too Many Requests',
    message: 'You are doing that too fast. Please wait a moment before trying again.',
    severity: 'warning',
  },
  SERVER_ERROR: {
    title: 'Internal Server Error',
    message: 'Something went wrong on our end. Our engineering team has been notified.',
    severity: 'error',
  },
  VALIDATION_ERROR: {
    title: 'Validation Failed',
    message: 'Please review and correct the invalid inputs highlighted in the form.',
    severity: 'warning',
  },
  GENERIC: {
    title: 'An Error Occurred',
    message: 'An unexpected error occurred. Please try again.',
    severity: 'error',
  },
}
