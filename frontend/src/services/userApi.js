import api from './http.js'

export const getProfile = async () => {
  const response = await api.get('/api/users/me')
  return response.data
}

export const updateProfile = async (payload) => {
  const response = await api.patch('/api/users/me', payload)
  return response.data
}

export const deleteAccount = async () => {
  const response = await api.delete('/api/users/me')
  return response.data
}
