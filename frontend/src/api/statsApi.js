import apiClient from './apiClient.js'

export const getPublicStats = async (shortCode) => {
  const response = await apiClient.get(`/stats/${shortCode}`)
  return response.data
}
