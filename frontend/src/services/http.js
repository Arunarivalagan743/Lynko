import apiClient from '../api/apiClient.js'

/**
 * Sets or deletes the default Authorization header on the unified apiClient instance.
 *
 * @param {string|null} token - The access token string or null to clear the header.
 */
export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`
    return
  }

  delete apiClient.defaults.headers.common.Authorization
}

export default apiClient
