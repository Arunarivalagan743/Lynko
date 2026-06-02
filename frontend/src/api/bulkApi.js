import apiClient from './apiClient.js'

export const bulkCreateUrls = async (payload) => {
  const response = await apiClient.post('/api/urls/bulk', payload)
  return response.data
}
