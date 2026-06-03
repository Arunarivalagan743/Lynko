import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useUrlAnalytics } from '../hooks/useUrlAnalytics.js'
import { useUrls } from '../hooks/useUrls.js'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import SkeletonCard from '../components/loading/SkeletonCard.jsx'
import SkeletonTable from '../components/loading/SkeletonTable.jsx'
import { ENV } from '../constants/env.js'
import { 
  Calendar, 
  TrendingUp, 
  Monitor, 
  Globe, 
  RefreshCw, 
  AlertCircle, 
  ExternalLink
} from 'lucide-react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts'


export default function AnalyticsPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  // Fetch all URLs for selector
  const { urls, fetchUrls, isLoading: urlsLoading } = useUrls()
  
  // Custom hook for url analytics
  const {
    dateRange,
    page,
    limit,
    visitsPagination,
    analytics,
    visits,
    browsers,
    devices,
    trends,
    summaryLoading,
    visitsLoading,
    browsersLoading,
    devicesLoading,
    trendsLoading,
    fetchAllAnalytics,
    changeDateRange,
    changePage,
  } = useUrlAnalytics(id)

  // Local filter states
  const [fromDate, setFromDate] = useState(dateRange.from)
  const [toDate, setToDate] = useState(dateRange.to)

  // Load URL list on mount to populate selector
  useEffect(() => {
    fetchUrls()
  }, [fetchUrls])

  const latestUrl = useMemo(() => {
    if (!urls.length) return null
    const sorted = [...urls].sort((a, b) => {
      const aDate = a?.createdAt ? new Date(a.createdAt).getTime() : 0
      const bDate = b?.createdAt ? new Date(b.createdAt).getTime() : 0
      return bDate - aDate
    })
    return sorted[0]
  }, [urls])

  useEffect(() => {
    if (!id && !urlsLoading && latestUrl?._id) {
      navigate(`/analytics/${latestUrl._id}`, { replace: true })
    }
  }, [id, urlsLoading, latestUrl, navigate])

  // Fetch analytics data when URL ID changes or date filters are applied
  useEffect(() => {
    if (id) {
      fetchAllAnalytics()
    }
  }, [id, fetchAllAnalytics, dateRange])

  // Sync date inputs if external date range updates
  useEffect(() => {
    setFromDate(dateRange.from)
    setToDate(dateRange.to)
  }, [dateRange])

  const handleApplyFilters = (e) => {
    e.preventDefault()
    changeDateRange(fromDate, toDate)
  }

  const handleClearFilters = () => {
    setFromDate('')
    setToDate('')
    changeDateRange('', '')
  }

  const handleUrlSelect = (e) => {
    const selectedId = e.target.value
    if (selectedId) {
      navigate(`/analytics/${selectedId}`)
    } else {
      navigate('/analytics')
    }
  }

  const currentUrl = urls.find(u => u._id === id)
  const fullShortUrl = currentUrl ? `${ENV.VITE_API_URL}/r/${currentUrl.shortCode}` : ''

  // Chart color palette
  const CHART_COLORS = ['#00322d', '#2c6956', '#636037', '#ba1a1a', '#004b44', '#bfc9c6']

  // Shared tooltip style
  const tooltipStyle = { background: '#f8faf5', borderRadius: '0px', border: '2px solid #00322d', fontSize: '11px', fontFamily: 'Space Mono', color: '#00322d' }

  return (
    <div className="space-y-8">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="space-y-3">
          <p className="label-overline">Insights</p>
          <h1 className="heading-page">Link Analytics</h1>
          <p className="text-base text-on-surface-variant font-medium">
            {currentUrl 
              ? `Performance data for: ${currentUrl.shortCode}` 
              : 'Select a link to analyze its traffic metrics.'}
          </p>
        </div>

        {/* URL Selector Dropdown */}
        <div className="flex items-center gap-3 max-w-sm w-full">
          <label className="font-space text-xs font-bold uppercase tracking-wider text-primary whitespace-nowrap">Link:</label>
          <select
            value={id || ''}
            onChange={handleUrlSelect}
            disabled={urlsLoading}
            className="w-full rounded-none border-2 border-primary bg-white px-4 py-2.5 text-sm text-primary font-semibold focus:border-secondary focus:outline-none focus:ring-0 disabled:opacity-60"
          >
            <option value="">-- Select a Short Link --</option>
            {urls.map((u) => (
              <option key={u._id} value={u._id}>
                {u.shortCode} ({u.originalUrl.substring(0, 24)}...)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* If no URL ID selected, render empty state selection guide */}
      {!id ? (
        <Card className="flex flex-col items-center justify-center text-center !p-16 min-h-[40vh] space-y-5">
          <TrendingUp size={52} className="text-primary animate-pulse" />
          <div className="space-y-3">
            <h2 className="heading-section">No URL Selected</h2>
            <p className="text-base text-on-surface-variant font-medium max-w-md mx-auto">
              Please choose one of your shortened URLs from the select dropdown at the top right to load click statistics and browser breakdowns.
            </p>
          </div>
        </Card>
      ) : (
        <>
          {/* URL Overview Details Card */}
          {currentUrl && (
            <Card className="space-y-3 !py-5" shadowSize="sm">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1.5">
                  <span className="font-space text-[11px] font-bold uppercase text-primary">Target URL</span>
                  <a 
                    href={currentUrl.originalUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm font-semibold text-secondary hover:underline break-all flex items-center gap-1.5"
                  >
                    {currentUrl.originalUrl} <ExternalLink size={14} />
                  </a>
                </div>
                <div className="space-y-1.5 text-right">
                  <span className="font-space text-[11px] font-bold uppercase text-primary">Short URL</span>
                  <a 
                    href={fullShortUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm font-bold text-secondary hover:underline block break-all"
                  >
                    {fullShortUrl}
                  </a>
                </div>
              </div>
            </Card>
          )}

          {/* Date Filtering Panel */}
          <Card shadowSize="sm" className="!py-5">
            <form onSubmit={handleApplyFilters} className="flex flex-wrap items-end gap-5">
              <div className="space-y-2">
                <label className="font-space text-[13px] font-bold uppercase tracking-wider text-primary">Start Date</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full rounded-none border-2 border-primary bg-white px-4 py-2.5 text-sm text-primary font-semibold focus:border-secondary focus:outline-none focus:ring-0"
                />
              </div>

              <div className="space-y-2">
                <label className="font-space text-[13px] font-bold uppercase tracking-wider text-primary">End Date</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full rounded-none border-2 border-primary bg-white px-4 py-2.5 text-sm text-primary font-semibold focus:border-secondary focus:outline-none focus:ring-0"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" size="md">
                  Apply Filters
                </Button>
                {(dateRange.from || dateRange.to) && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={handleClearFilters}
                  >
                    Clear
                  </Button>
                )}
              </div>
            </form>
          </Card>

          {/* 1. Analytics Summary Metrics Grid */}
          <div className="grid gap-5 sm:grid-cols-2">
            {summaryLoading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <SkeletonCard key={i} variant="analytics" />
              ))
            ) : (
              <>
                {/* Total Clicks Card */}
                <Card className="flex flex-col justify-between !p-6 space-y-3 !bg-white" shadowSize="sm" hover>
                  <div className="flex items-center justify-between text-primary">
                    <span className="font-space text-xs font-bold uppercase tracking-wider">Total Clicks</span>
                    <TrendingUp size={18} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-4xl font-anton text-primary">{analytics?.totalClicks ?? 0}</h3>
                    <p className="label-meta">Accumulated redirections</p>
                  </div>
                </Card>

                {/* Last Visit Card */}
                <Card className="flex flex-col justify-between !p-6 space-y-3 col-span-1 !bg-surface-container-low" shadowSize="sm" hover>
                  <div className="flex items-center justify-between text-primary">
                    <span className="font-space text-xs font-bold uppercase tracking-wider">Last Visit</span>
                    <Calendar size={18} />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h3 className="text-base font-bold text-primary truncate">
                      {analytics?.lastVisit 
                        ? new Date(analytics.lastVisit).toLocaleDateString()
                        : 'Never'}
                    </h3>
                    <p className="label-meta truncate">
                      {analytics?.lastVisit 
                        ? new Date(analytics.lastVisit).toLocaleTimeString()
                        : 'No activity registered'}
                    </p>
                  </div>
                </Card>
              </>
            )}
          </div>

          {/* Browser, Device, and Daily Trends Splits */}
          <div className="grid gap-8 md:grid-cols-3">
            {/* 3. Browser Analytics */}
            <Card className="space-y-5" shadowSize="sm">
              <h2 className="heading-section flex items-center gap-2 border-b-2 border-primary pb-3">
                <Monitor size={18} className="text-primary" />
                Browser Breakdown
              </h2>
              {browsersLoading ? (
                <div className="h-72 flex items-center justify-center label-meta">Loading browser data...</div>
              ) : (
                <div className="space-y-5">
                  {/* Browser Pie Chart */}
                  <div className="h-72 w-full flex items-center justify-center">
                    {browsers.some(b => b.value > 0) ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={browsers.filter(b => b.value > 0)}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {browsers.filter(b => b.value > 0).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % 6]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={tooltipStyle} />
                          <Legend verticalAlign="bottom" height={36} iconType="square" iconSize={8} wrapperStyle={{ fontSize: '10px', fontFamily: 'Space Mono' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex flex-col items-center justify-center w-full h-full py-16 text-center space-y-2 border-2 border-dashed border-primary/20 bg-surface-container-low/20">
                        <Monitor size={32} className="text-primary/30" />
                        <p className="label-meta select-none">No browser clicks recorded</p>
                      </div>
                    )}
                  </div>

                  {browsers.length > 0 && browsers.some(b => b.value > 0) && (
                    <table className="w-full text-sm text-left border-collapse">
                      <thead>
                        <tr className="border-b-2 border-primary font-space text-[11px] font-bold uppercase text-primary">
                          <th className="py-2 font-bold">Browser</th>
                          <th className="py-2 font-bold text-right">Clicks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-primary/15">
                        {browsers.map((b, idx) => (
                          <tr key={b.name} className={idx % 2 === 0 ? '' : 'bg-surface-container-low/40'}>
                            <td className="py-2 font-semibold text-primary">{b.name}</td>
                            <td className="py-2 text-right font-bold text-primary font-space">{b.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </Card>

            {/* 4. Device Analytics */}
            <Card className="space-y-5" shadowSize="sm">
              <h2 className="heading-section flex items-center gap-2 border-b-2 border-primary pb-3">
                <Monitor size={18} className="text-primary" />
                Device Breakdown
              </h2>
              {devicesLoading ? (
                <div className="h-72 flex items-center justify-center label-meta">Loading device data...</div>
              ) : (
                <div className="space-y-5">
                  {/* Device Bar Chart */}
                  <div className="h-72 w-full flex items-center justify-center">
                    {devices.some(d => d.value > 0) ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={devices} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d8dbd6" />
                          <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={10} stroke="#00322d" style={{ fontFamily: 'Space Mono', fontWeight: 'bold' }} />
                          <YAxis tickLine={false} axisLine={false} fontSize={10} stroke="#00322d" style={{ fontFamily: 'Space Mono', fontWeight: 'bold' }} />
                          <Tooltip 
                            cursor={{ fill: 'rgba(44, 105, 86, 0.05)' }}
                            contentStyle={tooltipStyle}
                          />
                          <Bar dataKey="value" fill="#00322d" radius={[0, 0, 0, 0]} barSize={28} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex flex-col items-center justify-center w-full h-full py-16 text-center space-y-2 border-2 border-dashed border-primary/20 bg-surface-container-low/20">
                        <Monitor size={32} className="text-primary/30" />
                        <p className="label-meta select-none">No device clicks recorded</p>
                      </div>
                    )}
                  </div>

                  {devices.length > 0 && devices.some(d => d.value > 0) && (
                    <table className="w-full text-sm text-left border-collapse">
                      <thead>
                        <tr className="border-b-2 border-primary font-space text-[11px] font-bold uppercase text-primary">
                          <th className="py-2 font-bold">Device</th>
                          <th className="py-2 font-bold text-right">Clicks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-primary/15">
                        {devices.map((d, idx) => (
                          <tr key={d.name} className={idx % 2 === 0 ? '' : 'bg-surface-container-low/40'}>
                            <td className="py-2 font-semibold text-primary">{d.name}</td>
                            <td className="py-2 text-right font-bold text-primary font-space">{d.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </Card>

            {/* 5. Daily Trends */}
            <Card className="space-y-5" shadowSize="sm">
              <h2 className="heading-section flex items-center gap-2 border-b-2 border-primary pb-3">
                <TrendingUp size={18} className="text-primary" />
                Daily Trends Log
              </h2>
              {trendsLoading ? (
                <div className="h-72 flex items-center justify-center label-meta">Loading trends history...</div>
              ) : (
                <div className="space-y-5">
                  {/* Daily Trends Line Chart */}
                  <div className="h-72 w-full flex items-center justify-center">
                    {trends.some(t => t.clicks > 0) ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trends} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d8dbd6" />
                          <XAxis dataKey="formattedDate" tickLine={false} axisLine={false} fontSize={10} stroke="#00322d" style={{ fontFamily: 'Space Mono', fontWeight: 'bold' }} />
                          <YAxis tickLine={false} axisLine={false} fontSize={10} stroke="#00322d" style={{ fontFamily: 'Space Mono', fontWeight: 'bold' }} />
                          <Tooltip contentStyle={tooltipStyle} />
                          <Line 
                            type="monotone" 
                            dataKey="clicks" 
                            stroke="#00322d" 
                            strokeWidth={2} 
                            dot={{ stroke: '#00322d', strokeWidth: 1, r: 2.5, fill: 'white' }}
                            activeDot={{ r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex flex-col items-center justify-center w-full h-full py-16 text-center space-y-2 border-2 border-dashed border-primary/20 bg-surface-container-low/20">
                        <TrendingUp size={32} className="text-primary/30" />
                        <p className="label-meta select-none">No click history logged</p>
                      </div>
                    )}
                  </div>

                  {trends.length > 0 && trends.some(t => t.clicks > 0) && (
                    <table className="w-full text-sm text-left border-collapse">
                      <thead>
                        <tr className="border-b-2 border-primary font-space text-[11px] font-bold uppercase text-primary">
                          <th className="py-2 font-bold">Date</th>
                          <th className="py-2 font-bold text-right">Clicks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-primary/15">
                        {trends.map((t, idx) => (
                          <tr key={t.date} className={idx % 2 === 0 ? '' : 'bg-surface-container-low/40'}>
                            <td className="py-2 font-semibold text-primary">{t.formattedDate || t.date}</td>
                            <td className="py-2 text-right font-bold text-primary font-space">{t.clicks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </Card>
          </div>

          {/* 2. Recent Visitor Logs Table */}
          <Card className="space-y-5">
            <div className="flex items-center justify-between border-b-2 border-primary pb-3">
              <h2 className="heading-section flex items-center gap-2">
                <Globe size={18} className="text-primary" />
                Recent Visitor Logs
              </h2>
              <span className="font-space text-[11px] font-bold uppercase bg-surface-container-low border-2 border-primary rounded-none px-2.5 py-1 text-primary">
                Total Rows: {visitsPagination.totalDocs}
              </span>
            </div>

            {visitsLoading ? (
              <SkeletonTable variant="visits" rowsCount={5} />
            ) : visits.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-3 border-2 border-dashed border-primary/20 bg-surface-container-low/20">
                <Globe size={36} className="text-primary/30 animate-pulse" />
                <p className="label-meta">
                  No redirection activity logs recorded for this link yet.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="overflow-x-auto border-2 border-primary rounded-none bg-white">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low text-primary border-b-2 border-primary font-space text-[11px] font-bold uppercase">
                        <th className="p-3.5 border-r border-primary/15">Timestamp</th>
                        <th className="p-3.5 border-r border-primary/15">IP Address</th>
                        <th className="p-3.5 border-r border-primary/15">Browser</th>
                        <th className="p-3.5 border-r border-primary/15">Device</th>
                        <th className="p-3.5 border-r border-primary/15">Country</th>
                        <th className="p-3.5">Quality</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-primary/15">
                      {visits.map((visit, idx) => (
                        <tr key={visit.id || visit.clickedAt} className={idx % 2 === 0 ? 'bg-white' : 'bg-surface-container-low/30'}>
                          <td className="p-3.5 text-on-surface-variant font-medium border-r border-primary/10 select-none">
                            {new Date(visit.clickedAt).toLocaleString()}
                          </td>
                          <td className="p-3.5 text-primary font-bold border-r border-primary/10 select-all font-space text-xs">
                            {visit.ip}
                          </td>
                          <td className="p-3.5 text-on-surface-variant font-semibold border-r border-primary/10">
                            {visit.browser}
                          </td>
                          <td className="p-3.5 text-on-surface-variant font-semibold border-r border-primary/10">
                            {visit.device}
                          </td>
                          <td className="p-3.5 text-on-surface-variant font-semibold border-r border-primary/10">
                            {visit.country || 'Unknown'}
                          </td>
                          <td className="p-3.5">
                            <span className={`inline-block rounded-none px-2.5 py-0.5 text-[10px] font-bold font-space uppercase border ${
                              visit.clickQuality === 'human'
                                ? 'bg-secondary-container/10 text-secondary border-secondary'
                                : visit.clickQuality === 'bot'
                                ? 'bg-tertiary-container/10 text-tertiary border-tertiary'
                                : 'bg-error-container/10 text-error border-error'
                            }`}>
                              {visit.clickQuality.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {visitsPagination.totalPages > 1 && (
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-space text-xs font-bold text-on-surface-variant uppercase select-none">
                      Page {visitsPagination.page} of {visitsPagination.totalPages}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => changePage(visitsPagination.page - 1)}
                        disabled={visitsPagination.page <= 1}
                        className="rounded-none border-2 border-primary bg-white text-primary px-4 py-2 text-xs font-space font-bold uppercase shadow-brutal-sm hover:bg-surface-container-low active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-fast disabled:opacity-40 disabled:cursor-not-allowed select-none"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => changePage(visitsPagination.page + 1)}
                        disabled={visitsPagination.page >= visitsPagination.totalPages}
                        className="rounded-none border-2 border-primary bg-white text-primary px-4 py-2 text-xs font-space font-bold uppercase shadow-brutal-sm hover:bg-surface-container-low active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all duration-fast disabled:opacity-40 disabled:cursor-not-allowed select-none"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  )
}
export { AnalyticsPage }
