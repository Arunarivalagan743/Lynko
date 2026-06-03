import { useState, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import {
  getAnalyticsSummary,
  getRecentVisits,
  getBrowserAnalytics,
  getDeviceAnalytics,
  getCountryAnalytics,
  getDailyTrends,
  getGeoPins,
} from '../api/analyticsApi.js'
import {
  transformBrowserData,
  transformDeviceData,
  transformCountryData,
  transformTrendData,
  transformVisitData,
} from '../utils/analyticsTransformers.js'

/**
 * Custom hook to manage state, filters, loading indicators, and api operations
 * for link-specific analytics dashboards.
 *
 * @param {string} urlId - The MongoDB ObjectId of the URL target.
 */
export const useUrlAnalytics = (urlId) => {
  // Query Filter Settings
  const [dateRange, setDateRange] = useState({ from: '', to: '' })
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  // Data States
  const [analytics, setAnalytics] = useState(null)
  const [visits, setVisits] = useState([])
  const [visitsPagination, setVisitsPagination] = useState({
    totalDocs: 0,
    limit: 10,
    page: 1,
    totalPages: 1,
  })
  const [browsers, setBrowsers] = useState([])
  const [devices, setDevices] = useState([])
  const [countries, setCountries] = useState([])
  const [trends, setTrends] = useState([])
  const [geoPins, setGeoPins] = useState([])

  // Action-specific Loading Indicators
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [visitsLoading, setVisitsLoading] = useState(false)
  const [browsersLoading, setBrowsersLoading] = useState(false)
  const [devicesLoading, setDevicesLoading] = useState(false)
  const [countriesLoading, setCountriesLoading] = useState(false)
  const [trendsLoading, setTrendsLoading] = useState(false)
  const [geoPinsLoading, setGeoPinsLoading] = useState(false)

  // Compile active parameters for queries
  const getQueryParams = useCallback((extra = {}) => {
    const params = {}
    if (dateRange.from) params.from = dateRange.from
    if (dateRange.to) params.to = dateRange.to
    return { ...params, ...extra }
  }, [dateRange])

  // Fetch summary counters
  const fetchSummary = useCallback(async (customParams = {}) => {
    if (!urlId) return
    setSummaryLoading(true)
    try {
      const params = getQueryParams(customParams)
      const data = await getAnalyticsSummary(urlId, params)
      setAnalytics(data?.summary || data?.analytics || data || null)
    } catch (err) {
      console.error('Failed fetching analytics summary:', err)
    } finally {
      setSummaryLoading(false)
    }
  }, [urlId, getQueryParams])

  // Fetch recent visits paginated logs
  const fetchVisits = useCallback(async (customPage = page, customLimit = limit) => {
    if (!urlId) return
    setVisitsLoading(true)
    try {
      const params = getQueryParams({ page: customPage, limit: customLimit })
      const rawData = await getRecentVisits(urlId, params)
      const { visits: transformedVisits, pagination } = transformVisitData(rawData)
      setVisits(transformedVisits)
      setVisitsPagination(pagination)
    } catch (err) {
      console.error('Failed fetching visits logs:', err)
      toast.error('Failed to load click logs')
    } finally {
      setVisitsLoading(false)
    }
  }, [urlId, page, limit, getQueryParams])

  // Fetch browser analytics split
  const fetchBrowsers = useCallback(async (customParams = {}) => {
    if (!urlId) return
    setBrowsersLoading(true)
    try {
      const params = getQueryParams(customParams)
      const rawData = await getBrowserAnalytics(urlId, params)
      setBrowsers(transformBrowserData(rawData))
    } catch (err) {
      console.error('Failed fetching browser analytics:', err)
    } finally {
      setBrowsersLoading(false)
    }
  }, [urlId, getQueryParams])

  // Fetch hardware device forms split
  const fetchDevices = useCallback(async (customParams = {}) => {
    if (!urlId) return
    setDevicesLoading(true)
    try {
      const params = getQueryParams(customParams)
      const rawData = await getDeviceAnalytics(urlId, params)
      setDevices(transformDeviceData(rawData))
    } catch (err) {
      console.error('Failed fetching device analytics:', err)
    } finally {
      setDevicesLoading(false)
    }
  }, [urlId, getQueryParams])

  const fetchCountries = useCallback(async (customParams = {}) => {
    if (!urlId) return
    setCountriesLoading(true)
    try {
      const params = getQueryParams(customParams)
      const rawData = await getCountryAnalytics(urlId, params)
      setCountries(transformCountryData(rawData))
    } catch (err) {
      console.error('Failed fetching country analytics:', err)
    } finally {
      setCountriesLoading(false)
    }
  }, [urlId, getQueryParams])

  // Fetch daily traffic trend history logs
  const fetchTrends = useCallback(async (customParams = {}) => {
    if (!urlId) return
    setTrendsLoading(true)
    try {
      const params = getQueryParams(customParams)
      const rawData = await getDailyTrends(urlId, params)
      setTrends(transformTrendData(rawData))
    } catch (err) {
      console.error('Failed fetching daily trends:', err)
    } finally {
      setTrendsLoading(false)
    }
  }, [urlId, getQueryParams])

  const fetchGeoPins = useCallback(async (customParams = {}) => {
    if (!urlId) return
    setGeoPinsLoading(true)
    try {
      const params = getQueryParams(customParams)
      const rawData = await getGeoPins(urlId, params)
      setGeoPins(rawData?.geoPins || [])
    } catch (err) {
      console.error('Failed fetching geo pins analytics:', err)
    } finally {
      setGeoPinsLoading(false)
    }
  }, [urlId, getQueryParams])

  // Triggers queries for all analytics modules concurrently
  const fetchAllAnalytics = useCallback(async () => {
    if (!urlId) return
    await Promise.all([
      fetchSummary(),
      fetchVisits(1, limit), // Reset to page 1 on search reload
      fetchBrowsers(),
      fetchDevices(),
      fetchCountries(),
      fetchTrends(),
      fetchGeoPins(),
    ])
  }, [urlId, fetchSummary, fetchVisits, fetchBrowsers, fetchDevices, fetchCountries, fetchTrends, fetchGeoPins, limit])

  // Update date ranges and re-execute queries
  const changeDateRange = useCallback((from, to) => {
    setDateRange({ from, to })
    setPage(1) // Reset pagination
  }, [])

  // Change page settings and re-execute query
  const changePage = useCallback((nextPage) => {
    setPage(nextPage)
    fetchVisits(nextPage, limit)
  }, [fetchVisits, limit])

  return {
    // Parameters
    dateRange,
    page,
    limit,
    visitsPagination,

    // Data States
    analytics,
    visits,
    browsers,
    devices,
    countries,
    trends,
    geoPins,

    // Loading Indicators
    summaryLoading,
    visitsLoading,
    browsersLoading,
    devicesLoading,
    countriesLoading,
    trendsLoading,
    geoPinsLoading,

    // Fetch Trigger Actions
    fetchSummary,
    fetchVisits,
    fetchBrowsers,
    fetchDevices,
    fetchCountries,
    fetchTrends,
    fetchGeoPins,
    fetchAllAnalytics,
    changeDateRange,
    changePage,
  }
}
