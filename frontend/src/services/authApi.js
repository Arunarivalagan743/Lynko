import api from './http.js'

export const login = async (payload) => {
  const response = await api.post('/api/auth/login', payload)
  return response.data
}

export const signup = async (payload) => {
  const response = await api.post('/api/auth/signup', payload)
  return response.data
}

export const forgotPassword = async (payload) => {
  const response = await api.post('/api/auth/forgot-password', payload)
  return response.data
}

export const resetPassword = async (payload) => {
  const response = await api.post('/api/auth/reset-password', payload)
  return response.data
}

export const logout = async () => {
  const response = await api.post('/api/auth/logout')
  return response.data
}

export const refreshToken = async () => {
  const response = await api.post('/api/auth/refresh')
  return response.data
}

