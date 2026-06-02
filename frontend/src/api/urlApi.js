import apiClient from './apiClient.js'

export const createUrl = async (payload) => {
  const response = await apiClient.post('/api/urls', payload)
  return response.data
}

export const getUrls = async () => {
  const response = await apiClient.get('/api/urls')
  return response.data
}

export const getUrlById = async (id) => {
  const response = await apiClient.get(`/api/urls/${id}`)
  return response.data
}

export const updateUrl = async (id, payload) => {
  const response = await apiClient.patch(`/api/urls/${id}`, payload)
  return response.data
}

export const deleteUrl = async (id) => {
  const response = await apiClient.delete(`/api/urls/${id}`)
  return response.data
}
