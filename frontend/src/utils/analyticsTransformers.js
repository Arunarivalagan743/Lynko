/**
 * Helper utilities to map backend analytics payloads to formats required by charting libraries (like Recharts).
 */

/**
 * Transforms browser count object into a list of name-value pairs.
 * Input: { browsers: { chrome: 10, firefox: 2, safari: 4 } }
 * Output: [ { name: 'Chrome', value: 10 }, { name: 'Firefox', value: 2 }, { name: 'Safari', value: 4 } ]
 */
export const transformBrowserData = (data) => {
  const browsersObj = data?.browsers || data || {}
  return Object.entries(browsersObj)
    .map(([browser, count]) => ({
      name: browser.charAt(0).toUpperCase() + browser.slice(1),
      value: count,
    }))
    .sort((a, b) => b.value - a.value) // Descending order
}

/**
 * Transforms device count object into a list of name-value pairs.
 * Input: { devices: { mobile: 20, desktop: 30, tablet: 5 } }
 * Output: [ { name: 'Mobile', value: 20 }, { name: 'Desktop', value: 30 }, { name: 'Tablet', value: 5 } ]
 */
export const transformDeviceData = (data) => {
  const devicesObj = data?.devices || data || {}
  return Object.entries(devicesObj)
    .map(([device, count]) => ({
      name: device.charAt(0).toUpperCase() + device.slice(1),
      value: count,
    }))
    .sort((a, b) => b.value - a.value)
}

/**
 * Normalizes country breakdown list.
 * Input: { countries: [ { country: 'India', count: 12 } ] }
 * Output: [ { name: 'India', value: 12 } ]
 */
export const transformCountryData = (data) => {
  const countriesList = data?.countries || data || []
  return countriesList
    .map((item) => ({
      name: item.country || 'Unknown',
      value: item.count !== undefined ? item.count : item.value || 0,
    }))
    .sort((a, b) => b.value - a.value)
}

/**
 * Normalizes daily trends data for time-series charts.
 * Input: { trends: [ { date: '2026-06-01', count: 5 } ] }
 * Output: [ { date: '2026-06-01', clicks: 5, formattedDate: 'Jun 1' } ]
 */
export const transformTrendData = (data) => {
  const trendsList = data?.trends || data || []
  return trendsList.map((item) => {
    let formattedDate = item.date
    try {
      const parsedDate = new Date(item.date)
      if (!isNaN(parsedDate.getTime())) {
        formattedDate = parsedDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })
      }
    } catch (_err) {
      // Fallback to original string
    }

    return {
      date: item.date,
      clicks: item.count !== undefined ? item.count : item.clicks || 0,
      formattedDate,
    }
  })
}

/**
 * Maps recent visits log records to structured list items.
 */
export const transformVisitData = (data) => {
  const visitsList = data?.visits || data?.docs || data || []
  const pagination = {
    totalDocs: data?.totalDocs || visitsList.length,
    limit: data?.limit || 10,
    page: data?.page || 1,
    totalPages: data?.totalPages || 1,
  }

  const visits = visitsList.map((visit) => {
    const ip = visit.ipAddress || visit.ip || 'Anonymous'
    const isLocal = ip === '127.0.0.1' || ip === '::1' || ip.includes('127.0.0.1')
    const country = visit.country || (isLocal ? 'Localhost' : 'Unknown')

    return {
    id: visit._id || visit.id,
    ip,
    browser: visit.browser || 'Unknown',
    device: visit.device || 'Unknown',
    os: visit.os || 'Unknown',
    country,
    isBot: Boolean(visit.isBot),
    clickQuality: visit.clickQuality || 'good',
    referrer: visit.referrer || 'Direct',
    campaign: visit.campaign || 'None',
    clickedAt: visit.createdAt || visit.clickedAt || visit.timestamp,
    }
  })

  return {
    visits,
    pagination,
  }
}
