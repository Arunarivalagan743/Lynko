import { useState, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { getPublicStats as getPublicStatsRequest } from '../api/statsApi.js'
import {
  transformBrowserData,
  transformDeviceData,
  transformTrendData,
} from '../utils/analyticsTransformers.js'

/**
 * Custom hook to retrieve and parse unauthenticated public link statistics.
 *
 * @param {string} shortCode - The short code or custom alias of the link.
 */
export const usePublicStats = (shortCode) => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchStats = useCallback(async () => {
    if (!shortCode) return
    setLoading(true)
    setError(null)
    try {
      const response = await getPublicStatsRequest(shortCode)
      const rawStats = response.stats || response

      // Map raw data objects into chart-friendly formats
      const transformed = {
        totalClicks: rawStats.totalClicks || 0,
        humanClicks: rawStats.humanClicks || 0,
        botClicks: rawStats.botClicks || 0,
        suspiciousClicks: rawStats.suspiciousClicks || 0,
        browsers: transformBrowserData(rawStats.browsers),
        devices: transformDeviceData(rawStats.devices),
        trends: transformTrendData(rawStats.trends),
      }

      setStats(transformed)
      return transformed
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Failed to load public stats'
      setError(msg)
      toast.error(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [shortCode])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  }
}
