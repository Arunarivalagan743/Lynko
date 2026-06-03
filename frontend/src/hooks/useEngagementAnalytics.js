import { useState, useCallback } from 'react'
import {
  getTopLinks,
  getReferrerAnalytics,
  getGeographyAnalytics,
  getRecentActivity,
  getTrafficQuality,
  getSmartInsights,
  getPlatformAnalytics,
} from '../api/engagementApi.js'

/**
 * useEngagementAnalytics
 *
 * Manages all state and data fetching for the 6 engagement analytics features:
 *   1. Top performing links   (user-scoped)
 *   2. Referrer breakdown     (urlId-scoped)
 *   3. Geographic breakdown   (urlId-scoped)
 *   4. Recent activity feed   (user-scoped)
 *   5. Traffic quality split  (user-scoped)
 *   6. Smart insights         (urlId-scoped)
 *
 * @param {string|null} urlId - Selected URL's MongoDB ObjectId (null = no URL selected)
 */
export const useEngagementAnalytics = (urlId = null) => {
  // ── Data states ──────────────────────────────────────────────────────────
  const [topLinks, setTopLinks]           = useState([])
  const [referrers, setReferrers]         = useState([])
  const [geography, setGeography]         = useState([])
  const [activity, setActivity]           = useState([])
  const [trafficQuality, setTrafficQuality] = useState(null)
  const [insights, setInsights]           = useState([])
  const [platformStats, setPlatformStats]   = useState([])

  // ── Loading flags (one per fetch) ────────────────────────────────────────
  const [topLinksLoading, setTopLinksLoading]             = useState(false)
  const [referrersLoading, setReferrersLoading]           = useState(false)
  const [geographyLoading, setGeographyLoading]           = useState(false)
  const [activityLoading, setActivityLoading]             = useState(false)
  const [trafficQualityLoading, setTrafficQualityLoading] = useState(false)
  const [insightsLoading, setInsightsLoading]             = useState(false)
  const [platformStatsLoading, setPlatformStatsLoading]   = useState(false)

  // ── Individual fetch functions ───────────────────────────────────────────

  /** FEATURE 1 – Top 10 links by clicks (user-scoped, no urlId needed) */
  const fetchTopLinks = useCallback(async () => {
    setTopLinksLoading(true)
    try {
      const data = await getTopLinks()
      console.log("topLinks", data)
      setTopLinks(data?.topLinks ?? [])
    } catch (err) {
      console.error('fetchTopLinks failed:', err)
    } finally {
      setTopLinksLoading(false)
    }
  }, [])

  /** FEATURE 2 – Referrer breakdown for a specific URL */
  const fetchReferrers = useCallback(async (id = urlId) => {
    if (!id) return
    setReferrersLoading(true)
    try {
      const data = await getReferrerAnalytics(id)
      setReferrers(data?.referrers ?? [])
    } catch (err) {
      console.error('fetchReferrers failed:', err)
    } finally {
      setReferrersLoading(false)
    }
  }, [urlId])

  /** FEATURE 3 – Country breakdown for a specific URL */
  const fetchGeography = useCallback(async (id = urlId) => {
    if (!id) return
    setGeographyLoading(true)
    try {
      const data = await getGeographyAnalytics(id)
      // Normalise to { name, value } for Recharts
      const rows = (data?.countries ?? []).map((c) => ({
        name: c.country || 'Unknown',
        value: c.clicks ?? 0,
      }))
      setGeography(rows)
    } catch (err) {
      console.error('fetchGeography failed:', err)
    } finally {
      setGeographyLoading(false)
    }
  }, [urlId])

  /** FEATURE 4 – Latest 20 visits across all user links (user-scoped) */
  const fetchActivity = useCallback(async () => {
    setActivityLoading(true)
    try {
      const data = await getRecentActivity()
      console.log("recentActivity", data)
      setActivity(data?.activities ?? [])
    } catch (err) {
      console.error('fetchActivity failed:', err)
    } finally {
      setActivityLoading(false)
    }
  }, [])

  /** FEATURE 5 – Human / bot / suspicious split (user-scoped) */
  const fetchTrafficQuality = useCallback(async () => {
    setTrafficQualityLoading(true)
    try {
      const data = await getTrafficQuality()
      console.log("trafficQuality", data)
      setTrafficQuality(data ?? null)
    } catch (err) {
      console.error('fetchTrafficQuality failed:', err)
    } finally {
      setTrafficQualityLoading(false)
    }
  }, [])

  /** FEATURE 6 – Smart insights for a specific URL */
  const fetchInsights = useCallback(async (id = urlId) => {
    if (!id) return
    setInsightsLoading(true)
    try {
      const data = await getSmartInsights(id)
      setInsights(data?.insights ?? [])
    } catch (err) {
      console.error('fetchInsights failed:', err)
    } finally {
      setInsightsLoading(false)
    }
  }, [urlId])

  /** FEATURE 7 – Platform analytics for a specific URL */
  const fetchPlatformStats = useCallback(async (id = urlId) => {
    if (!id) return
    setPlatformStatsLoading(true)
    try {
      const data = await getPlatformAnalytics(id)
      setPlatformStats(data?.platforms ?? [])
    } catch (err) {
      console.error('fetchPlatformStats failed:', err)
    } finally {
      setPlatformStatsLoading(false)
    }
  }, [urlId])

  // ── Bulk loaders ─────────────────────────────────────────────────────────

  /** Fetch user-scoped data (Features 1, 4, 5) — no urlId required */
  const fetchUserScopedData = useCallback(() => {
    return Promise.all([
      fetchTopLinks(),
      fetchActivity(),
      fetchTrafficQuality(),
    ])
  }, [fetchTopLinks, fetchActivity, fetchTrafficQuality])

  /** Fetch urlId-scoped data (Features 2, 3, 6) — requires a selected urlId */
  const fetchUrlScopedData = useCallback((id = urlId) => {
    if (!id) return Promise.resolve()
    return Promise.all([
      fetchReferrers(id),
      fetchGeography(id),
      fetchInsights(id),
      fetchPlatformStats(id),
    ])
  }, [urlId, fetchReferrers, fetchGeography, fetchInsights, fetchPlatformStats])

  /** Fetch everything in parallel */
  const fetchAll = useCallback((id = urlId) => {
    return Promise.all([
      fetchUserScopedData(),
      fetchUrlScopedData(id),
    ])
  }, [urlId, fetchUserScopedData, fetchUrlScopedData])

  return {
    // Data
    topLinks,
    referrers,
    geography,
    activity,
    trafficQuality,
    insights,
    platformStats,

    // Loading flags
    topLinksLoading,
    referrersLoading,
    geographyLoading,
    activityLoading,
    trafficQualityLoading,
    insightsLoading,
    platformStatsLoading,

    // Fetch triggers
    fetchTopLinks,
    fetchReferrers,
    fetchGeography,
    fetchActivity,
    fetchTrafficQuality,
    fetchInsights,
    fetchPlatformStats,
    fetchUserScopedData,
    fetchUrlScopedData,
    fetchAll,
  }
}
