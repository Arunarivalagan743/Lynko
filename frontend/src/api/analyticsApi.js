import apiClient from './apiClient.js'

export const getAnalyticsSummary = async (id, params = {}) => {
  const response = await apiClient.get(`/api/urls/${id}/analytics`, { params })
  return response.data
}

export const getRecentVisits = async (id, params = {}) => {
  const response = await apiClient.get(`/api/urls/${id}/visits`, { params })
  return response.data
}

export const getBrowserAnalytics = async (id, params = {}) => {
  const response = await apiClient.get(`/api/urls/${id}/browsers`, { params })
  return response.data
}

export const getDeviceAnalytics = async (id, params = {}) => {
  const response = await apiClient.get(`/api/urls/${id}/devices`, { params })
  return response.data
}

export const getCountryAnalytics = async (id, params = {}) => {
  const response = await apiClient.get(`/api/urls/${id}/countries`, { params })
  return response.data
}

export const getDailyTrends = async (id, params = {}) => {
  const response = await apiClient.get(`/api/urls/${id}/trends`, { params })
  return response.data
}
