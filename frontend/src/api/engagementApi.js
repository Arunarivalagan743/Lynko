import apiClient from './apiClient.js'

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE 1 – Top Performing Links
// GET /api/analytics/top-links
// ─────────────────────────────────────────────────────────────────────────────
export const getTopLinks = async () => {
  const response = await apiClient.get('/api/analytics/top-links')
  return response.data
}

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE 2 – Referrer Analytics
// GET /api/analytics/referrers/:urlId
// ─────────────────────────────────────────────────────────────────────────────
export const getReferrerAnalytics = async (urlId) => {
  const response = await apiClient.get(`/api/analytics/referrers/${urlId}`)
  return response.data
}

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE 3 – Geographic Analytics
// GET /api/analytics/geography/:urlId
// ─────────────────────────────────────────────────────────────────────────────
export const getGeographyAnalytics = async (urlId) => {
  const response = await apiClient.get(`/api/analytics/geography/${urlId}`)
  return response.data
}

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE 4 – Recent Activity Feed
// GET /api/analytics/recent-activity
// ─────────────────────────────────────────────────────────────────────────────
export const getRecentActivity = async () => {
  const response = await apiClient.get('/api/analytics/recent-activity')
  return response.data
}

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE 5 – Traffic Quality Breakdown
// GET /api/analytics/traffic-quality
// ─────────────────────────────────────────────────────────────────────────────
export const getTrafficQuality = async () => {
  const response = await apiClient.get('/api/analytics/traffic-quality')
  return response.data
}

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE 6 – Smart Insights
// GET /api/analytics/insights/:urlId
// ─────────────────────────────────────────────────────────────────────────────
export const getSmartInsights = async (urlId) => {
  const response = await apiClient.get(`/api/analytics/insights/${urlId}`)
  return response.data
}

// ─────────────────────────────────────────────────────────────────────────────
// FEATURE 7 – Platform-Specific Tracking Links Analytics
// GET /api/analytics/platforms/:urlId
// ─────────────────────────────────────────────────────────────────────────────
export const getPlatformAnalytics = async (urlId) => {
  const response = await apiClient.get(`/api/analytics/platforms/${urlId}`)
  return response.data
}
