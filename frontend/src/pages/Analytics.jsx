import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useUrlAnalytics } from '../hooks/useUrlAnalytics.js'
import { useUrls } from '../hooks/useUrls.js'
import { useSocket } from '../context/SocketContext.jsx'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import SkeletonCard from '../components/loading/SkeletonCard.jsx'
import SkeletonTable from '../components/loading/SkeletonTable.jsx'
import { ENV } from '../constants/env.js'
import clsx from 'clsx'
import analyticsImg from '../assets/analyticsjsx.png'
import analyticsNoDataImg from '../assets/analatysnodata.png'
import { motion } from 'framer-motion'
import {
  Calendar,
  TrendingUp,
  Monitor,
  Globe,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  QrCode,
  X
} from 'lucide-react'
import { toast } from 'react-hot-toast'
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


const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 20 }
  }
}

export default function AnalyticsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const socket = useSocket()

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
  const [activeQrModal, setActiveQrModal] = useState(null)
  const [activeStatModal, setActiveStatModal] = useState(null)

  const handleShareQr = async (qrDataUrl, shortCode, shortUrl) => {
    if (navigator.share) {
      try {
        const response = await fetch(qrDataUrl)
        const blob = await response.blob()
        const file = new File([blob], `qr_${shortCode}.png`, { type: 'image/png' })
        
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `QR Code for /${shortCode}`,
            text: `Scan to visit: ${shortUrl}`,
          })
          toast.success('Shared successfully!')
          return
        }
      } catch (err) {
        console.error('Error preparing file share:', err)
      }

      try {
        await navigator.share({
          title: `QR Code for /${shortCode}`,
          text: `Scan to visit: ${shortUrl}`,
          url: shortUrl,
        })
        toast.success('Shared successfully!')
        return
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Share failed:', err)
        } else {
          return
        }
      }
    }

    try {
      await navigator.clipboard.writeText(shortUrl)
      toast.success('Link copied to clipboard! (Web Share API not supported)')
    } catch (err) {
      toast.error('Could not copy link.')
    }
  }

  const exportChartAsPng = (containerId) => {
    return new Promise((resolve, reject) => {
      try {
        const container = document.getElementById(containerId)
        if (!container) return reject(new Error('Container not found'))
        const svgElement = container.querySelector('svg')
        if (!svgElement) return reject(new Error('SVG not found'))

        const svgString = new XMLSerializer().serializeToString(svgElement)
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
        const URL = window.URL || window.webkitURL || window
        const blobURL = URL.createObjectURL(svgBlob)

        const image = new Image()
        image.onload = () => {
          const canvas = document.createElement('canvas')
          const bbox = svgElement.getBoundingClientRect()
          canvas.width = bbox.width * 2
          canvas.height = bbox.height * 2
          const context = canvas.getContext('2d')
          context.scale(2, 2)
          
          context.fillStyle = '#ffffff'
          context.fillRect(0, 0, bbox.width, bbox.height)
          context.drawImage(image, 0, 0, bbox.width, bbox.height)
          
          const pngDataUrl = canvas.toDataURL('image/png')
          URL.revokeObjectURL(blobURL)
          resolve(pngDataUrl)
        }
        image.onerror = (err) => {
          URL.revokeObjectURL(blobURL)
          reject(err)
        }
        image.src = blobURL
      } catch (err) {
        reject(err)
      }
    })
  }

  const handleDownloadChart = async (containerId, title) => {
    try {
      const dataUrl = await exportChartAsPng(containerId)
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `${title.toLowerCase().replace(/\s+/g, '_')}_chart.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('Chart image downloaded!')
    } catch (err) {
      console.error(err)
      toast.error('Failed to export chart image.')
    }
  }

  const handleShareChart = async (containerId, title) => {
    try {
      const dataUrl = await exportChartAsPng(containerId)
      if (navigator.share) {
        const response = await fetch(dataUrl)
        const blob = await response.blob()
        const file = new File([blob], `${title.toLowerCase().replace(/\s+/g, '_')}_chart.png`, { type: 'image/png' })
        
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `${title} Chart Report`,
            text: `Redirection traffic analytics for Lynko short link /${currentUrl?.shortCode || ''}`,
          })
          toast.success('Chart shared successfully!')
          return
        }
      }
      toast.error('Native sharing of files is not supported on this browser.')
    } catch (err) {
      console.error(err)
      toast.error('Failed to share chart.')
    }
  }

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

  // Listen to socket clicks for the currently selected URL
  useEffect(() => {
    if (!socket || !id) return

    const handleRealTimeAnalytics = (data) => {
      if (data.urlId === id) {
        fetchAllAnalytics()
      }
    }

    socket.on('click', handleRealTimeAnalytics)
    return () => {
      socket.off('click', handleRealTimeAnalytics)
    }
  }, [socket, id, fetchAllAnalytics])

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
  const CHART_COLORS = ['#00322d', '#b2ad7d', '#2c6956', '#ba1a1a', '#7ebab0', '#d97706', '#4f46e5']

  // Shared tooltip style - updated to premium rounded styles
  const tooltipStyle = {
    background: '#ffffff',
    borderRadius: '8px',
    border: '1px solid rgba(0, 50, 45, 0.1)',
    boxShadow: '0 4px 6px -1px rgba(0, 50, 45, 0.05), 0 2px 4px -1px rgba(0, 50, 45, 0.03)',
    fontSize: '12px',
    fontFamily: 'Inter, sans-serif',
    color: '#191c1a'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="space-y-8"
    >
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-outline-variant pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="space-y-3">
            <p className="label-overline">Insights</p>
            <h1 className="heading-page">Link Analytics</h1>
            <p className="text-base text-on-surface-variant font-medium">
              {currentUrl
                ? `Performance data for: ${currentUrl.shortCode}`
                : 'Select a link to analyze its traffic metrics.'}
            </p>
          </div>
          <div className="flex-shrink-0 hidden sm:block">
            <img src={analyticsImg} alt="" className="h-20 w-auto object-contain shadow-none" />
          </div>
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
          <img src={analyticsNoDataImg} alt="" className="h-24 w-auto object-contain shadow-none" />
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
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="!py-5" shadowSize="sm">
                <div className="flex flex-col sm:flex-row items-center gap-6 justify-between">
                  {/* Left & Middle: Details */}
                  <div className="flex-1 min-w-0 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <div className="space-y-1.5">
                      <span className="font-space text-[11px] font-bold uppercase text-primary">Short URL</span>
                      <a
                        href={fullShortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-bold text-secondary hover:underline block break-all font-mono"
                      >
                        {fullShortUrl}
                      </a>
                    </div>
                  </div>

                  {/* Right: QR Code Trigger */}
                  {(() => {
                    const qrUrl = currentUrl.qrCodeDataUrl || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(fullShortUrl)}`
                    return (
                      <div className="flex items-center gap-3 bg-surface-container-low/30 border border-primary/10 p-2.5 rounded-lg w-full sm:w-auto justify-between sm:justify-start">
                        <div className="space-y-0.5">
                          <span className="font-space text-[10px] font-bold uppercase text-primary block">QR Code</span>
                          <span className="text-[10px] text-on-surface-variant font-medium block">Click to view</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveQrModal({ shortCode: currentUrl.shortCode, qrUrl, shortUrl: fullShortUrl })}
                          className="relative group border border-primary/20 bg-white p-1 rounded-md shadow-sm hover:border-primary transition-colors cursor-pointer"
                          title="View/Download/Share QR Code"
                        >
                          <img src={qrUrl} alt="QR" className="h-11 w-11 object-contain" />
                          <div className="absolute inset-0 bg-primary/95 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md text-[9px] text-white font-semibold uppercase">
                            Open
                          </div>
                        </button>
                      </div>
                    )
                  })()}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Date Filtering Panel */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <Card shadowSize="sm" className="!py-5">
              <form onSubmit={handleApplyFilters} className="flex flex-col gap-4 md:flex-row md:items-end md:gap-5">
                <div className="space-y-2 w-full md:w-auto md:flex-1 max-w-md">
                  <label className="font-space text-[13px] font-bold uppercase tracking-wider text-primary">Start Date</label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full rounded-none border-2 border-primary bg-white px-4 py-2.5 text-sm text-primary font-semibold focus:border-secondary focus:outline-none focus:ring-0"
                  />
                </div>

                <div className="space-y-2 w-full md:w-auto md:flex-1 max-w-md">
                  <label className="font-space text-[13px] font-bold uppercase tracking-wider text-primary">End Date</label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full rounded-none border-2 border-primary bg-white px-4 py-2.5 text-sm text-primary font-semibold focus:border-secondary focus:outline-none focus:ring-0"
                  />
                </div>

                <div className="flex gap-2 w-full md:w-auto pt-2 md:pt-0">
                  <Button type="submit" size="md" className="flex-1 md:flex-none">
                    Apply Filters
                  </Button>
                  {(dateRange.from || dateRange.to) && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="md"
                      onClick={handleClearFilters}
                      className="flex-1 md:flex-none"
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </form>
            </Card>
          </motion.div>

          {/* 1. Analytics Summary Metrics Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid gap-5 sm:grid-cols-2"
          >
            {summaryLoading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="w-full">
                  <SkeletonCard variant="analytics" />
                </div>
              ))
            ) : (
              <>
                {/* Total Clicks Card */}
                <motion.div variants={itemVariants} whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Card onClick={() => setActiveStatModal('clicks')} className="flex flex-col justify-between !p-6 space-y-3 !bg-white h-full cursor-pointer hover:border-primary transition-colors" shadowSize="sm" hover>
                    <div className="flex items-center justify-between text-primary">
                      <span className="font-space text-xs font-bold uppercase tracking-wider">Total Clicks</span>
                      <TrendingUp size={18} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-4xl font-anton text-primary">{analytics?.totalClicks ?? 0}</h3>
                      <p className="label-meta">Accumulated redirections</p>
                    </div>
                  </Card>
                </motion.div>

                {/* Last Visit Card */}
                <motion.div variants={itemVariants} whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Card onClick={() => setActiveStatModal('visits')} className="flex flex-col justify-between !p-6 space-y-3 col-span-1 !bg-surface-container-low h-full cursor-pointer hover:border-primary transition-colors" shadowSize="sm" hover>
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
                </motion.div>
              </>
            )}
          </motion.div>



          {/* Browser, Device, and Daily Trends Splits */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {/* 3. Browser Analytics */}
            <motion.div variants={itemVariants}>
              <Card className="space-y-5 h-full" shadowSize="sm">
                <h2 className="heading-section flex items-center gap-2 border-b-2 border-primary pb-3">
                  <Monitor size={18} className="text-primary" />
                  Browser Breakdown
                </h2>
                {browsersLoading ? (
                  <div className="h-72 flex items-center justify-center label-meta">Loading browser data...</div>
                ) : (
                  <div className="space-y-5">
                    {/* Browser Pie Chart */}
                    <div onClick={() => setActiveStatModal('browser')} className="h-72 w-full flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity" title="Click to view/download/share chart">
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
                        <div className="flex flex-col items-center justify-center w-full h-full py-16 text-center space-y-3 border-2 border-dashed border-primary/20 bg-surface-container-low/20">
                          <img src={analyticsNoDataImg} alt="" className="h-12 w-auto object-contain shadow-none" />
                          <p className="label-meta select-none">No browser clicks recorded</p>
                        </div>
                      )}
                    </div>

                    {browsers.length > 0 && browsers.some(b => b.value > 0) && (
                      <table className="w-full text-sm text-left border-collapse">
                        <thead>
                          <tr className="border-b border-primary/10 text-xs font-semibold uppercase tracking-wider text-primary">
                            <th className="py-2 font-semibold">Browser</th>
                            <th className="py-2 font-semibold text-right">Clicks</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/15">
                          {browsers.map((b, idx) => (
                            <tr key={b.name} className={idx % 2 === 0 ? '' : 'bg-surface-container-low/40'}>
                              <td className="py-2 font-semibold text-primary">{b.name}</td>
                              <td className="py-2 text-right font-semibold text-primary font-mono">{b.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </Card>
            </motion.div>

            {/* 4. Device Analytics */}
            <motion.div variants={itemVariants}>
              <Card className="space-y-5 h-full" shadowSize="sm">
                <h2 className="heading-section flex items-center gap-2 border-b-2 border-primary pb-3">
                  <Monitor size={18} className="text-primary" />
                  Device Breakdown
                </h2>
                {devicesLoading ? (
                  <div className="h-72 flex items-center justify-center label-meta">Loading device data...</div>
                ) : (
                  <div className="space-y-5">
                    {/* Device Bar Chart */}
                    <div onClick={() => setActiveStatModal('device')} className="h-72 w-full flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity" title="Click to view/download/share chart">
                      {devices.some(d => d.value > 0) ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={devices} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0, 50, 45, 0.05)" />
                            <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={10} stroke="#00322d" style={{ fontFamily: 'Inter, sans-serif', fill: 'rgba(0, 50, 45, 0.6)' }} />
                            <YAxis tickLine={false} axisLine={false} fontSize={10} stroke="#00322d" style={{ fontFamily: 'Inter, sans-serif', fill: 'rgba(0, 50, 45, 0.6)' }} />
                            <Tooltip
                              cursor={{ fill: 'rgba(44, 105, 86, 0.05)' }}
                              contentStyle={tooltipStyle}
                            />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={28}>
                              {devices.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={CHART_COLORS[(index + 1) % CHART_COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex flex-col items-center justify-center w-full h-full py-16 text-center space-y-3 border border-dashed border-primary/20 bg-surface-container-low/20 rounded-lg">
                          <img src={analyticsNoDataImg} alt="" className="h-12 w-auto object-contain shadow-none" />
                          <p className="label-meta select-none">No device clicks recorded</p>
                        </div>
                      )}
                    </div>

                    {devices.length > 0 && devices.some(d => d.value > 0) && (
                      <table className="w-full text-sm text-left border-collapse">
                        <thead>
                          <tr className="border-b border-primary/10 text-xs font-semibold uppercase tracking-wider text-primary">
                            <th className="py-2 font-semibold">Device</th>
                            <th className="py-2 font-semibold text-right">Clicks</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/15">
                          {devices.map((d, idx) => (
                            <tr key={d.name} className={idx % 2 === 0 ? '' : 'bg-surface-container-low/40'}>
                              <td className="py-2 font-semibold text-primary">{d.name}</td>
                              <td className="py-2 text-right font-semibold text-primary font-mono">{d.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </Card>
            </motion.div>

            {/* 5. Daily Trends */}
            <motion.div variants={itemVariants}>
              <Card className="space-y-5 h-full" shadowSize="sm">
                <h2 className="heading-section flex items-center gap-2 border-b-2 border-primary pb-3">
                  <TrendingUp size={18} className="text-primary" />
                  Daily Trends Log
                </h2>
                {trendsLoading ? (
                  <div className="h-72 flex items-center justify-center label-meta">Loading trends history...</div>
                ) : (
                  <div className="space-y-5">
                    {/* Daily Trends Line Chart */}
                    <div onClick={() => setActiveStatModal('clicks')} className="h-72 w-full flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity" title="Click to view/download/share chart">
                      {trends.some(t => t.clicks > 0) ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={trends} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0, 50, 45, 0.05)" />
                            <XAxis dataKey="formattedDate" tickLine={false} axisLine={false} fontSize={10} stroke="#00322d" style={{ fontFamily: 'Inter, sans-serif', fill: 'rgba(0, 50, 45, 0.6)' }} />
                            <YAxis tickLine={false} axisLine={false} fontSize={10} stroke="#00322d" style={{ fontFamily: 'Inter, sans-serif', fill: 'rgba(0, 50, 45, 0.6)' }} />
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
                        <div className="flex flex-col items-center justify-center w-full h-full py-16 text-center space-y-3 border border-dashed border-primary/20 bg-surface-container-low/20 rounded-lg">
                          <img src={analyticsNoDataImg} alt="" className="h-12 w-auto object-contain shadow-none" />
                          <p className="label-meta select-none">No click history logged</p>
                        </div>
                      )}
                    </div>

                    {trends.length > 0 && trends.some(t => t.clicks > 0) && (
                      <table className="w-full text-sm text-left border-collapse">
                        <thead>
                          <tr className="border-b border-primary/10 text-xs font-semibold uppercase tracking-wider text-primary">
                            <th className="py-2 font-semibold">Date</th>
                            <th className="py-2 font-semibold text-right">Clicks</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/15">
                          {trends.map((t, idx) => (
                            <tr key={t.date} className={idx % 2 === 0 ? '' : 'bg-surface-container-low/40'}>
                              <td className="py-2 font-semibold text-primary">{t.formattedDate || t.date}</td>
                              <td className="py-2 text-right font-semibold text-primary font-mono">{t.clicks}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </Card>
            </motion.div>
          </motion.div>

          {/* 2. Recent Visitor Logs Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <Card className="space-y-5">
              <div className="flex items-center justify-between border-b border-primary/10 pb-3">
                <h2 className="heading-section flex items-center gap-2">
                  <Globe size={18} className="text-primary" />
                  Recent Visitor Logs
                </h2>
                <span className="text-xs font-semibold uppercase bg-surface-container-low border border-primary/20 rounded-md px-2.5 py-1 text-primary">
                  Total Rows: {visitsPagination.totalDocs}
                </span>
              </div>

              {visitsLoading ? (
                <SkeletonTable variant="visits" rowsCount={5} />
              ) : visits.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-3 border border-dashed border-primary/20 bg-surface-container-low/20 rounded-lg">
                  <img src={analyticsNoDataImg} alt="" className="h-12 w-auto object-contain shadow-none" />
                  <p className="label-meta">
                    No redirection activity logs recorded for this link yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="space-y-4">
                    {/* Desktop/Tablet Table */}
                    <div className="hidden md:block overflow-x-auto border border-primary/15 rounded-lg overflow-hidden bg-white">
                      <table className="w-full text-sm text-left border-collapse">
                        <thead>
                          <tr className="bg-surface-container-low text-primary border-b border-primary/10 text-xs font-semibold uppercase tracking-wider">
                            <th className="p-3.5 border-r border-primary/10">Timestamp</th>
                            <th className="p-3.5 border-r border-primary/10">IP Address</th>
                            <th className="p-3.5 border-r border-primary/10">Browser</th>
                            <th className="p-3.5 border-r border-primary/10">Device</th>
                            <th className="p-3.5 border-r border-primary/10">Country</th>
                            <th className="p-3.5">Quality</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/15">
                          {visits.map((visit, idx) => (
                            <tr key={visit.id || visit.clickedAt} className={idx % 2 === 0 ? 'bg-white' : 'bg-surface-container-low/30'}>
                              <td className="p-3.5 text-on-surface-variant font-medium border-r border-primary/10 select-none">
                                {new Date(visit.clickedAt).toLocaleString()}
                              </td>
                              <td className="p-3.5 text-primary font-semibold border-r border-primary/10 select-all font-mono text-xs">
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
                                <span className={clsx(
                                  'inline-block rounded-none border px-2.5 py-0.5 text-[10px] font-bold font-space uppercase',
                                  visit.clickQuality === 'human'
                                    ? 'bg-secondary-container/10 text-secondary border-secondary'
                                    : visit.clickQuality === 'bot'
                                      ? 'bg-tertiary-container/10 text-tertiary border-tertiary'
                                      : 'bg-error-container/10 text-error border-error'
                                )}>
                                  {visit.clickQuality.toUpperCase()}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Cards Stack */}
                    <div className="block md:hidden space-y-4">
                      {visits.map((visit, idx) => (
                        <Card key={visit.id || visit.clickedAt || idx} className="p-4 space-y-2.5" shadowSize="sm">
                          <div className="flex items-center justify-between">
                            <span className="code-label select-none">{new Date(visit.clickedAt).toLocaleString()}</span>
                            <span className={clsx(
                              'inline-block rounded-none border px-2 py-0.5 text-[9px] font-bold font-space uppercase',
                              visit.clickQuality === 'human'
                                ? 'bg-secondary-container/10 text-secondary border-secondary'
                                : visit.clickQuality === 'bot'
                                  ? 'bg-tertiary-container/10 text-tertiary border-tertiary'
                                  : 'bg-error-container/10 text-error border-error'
                            )}>
                              {visit.clickQuality.toUpperCase()}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs border-t border-primary/10 pt-2.5">
                            <div>
                              <p className="text-[10px] font-bold uppercase text-on-surface-variant/60 font-space">IP Address</p>
                              <p className="font-semibold text-primary font-mono select-all mt-0.5">{visit.ip}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold uppercase text-on-surface-variant/60 font-space">Country</p>
                              <p className="font-semibold text-on-surface-variant mt-0.5">{visit.country || 'Unknown'}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold uppercase text-on-surface-variant/60 font-space">Browser</p>
                              <p className="font-semibold text-on-surface-variant mt-0.5">{visit.browser}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold uppercase text-on-surface-variant/60 font-space">Device</p>
                              <p className="font-semibold text-on-surface-variant mt-0.5">{visit.device}</p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Pagination Controls */}
                  {visitsPagination.totalPages > 1 && (
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs font-semibold text-on-surface-variant uppercase select-none">
                        Page {visitsPagination.page} of {visitsPagination.totalPages}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => changePage(visitsPagination.page - 1)}
                          disabled={visitsPagination.page <= 1}
                          className="rounded-md border border-primary bg-white text-primary px-4 py-2 text-xs font-semibold uppercase hover:bg-surface-container-low active:scale-95 transition-all duration-fast disabled:opacity-40 disabled:cursor-not-allowed select-none"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => changePage(visitsPagination.page + 1)}
                          disabled={visitsPagination.page >= visitsPagination.totalPages}
                          className="rounded-md border border-primary bg-white text-primary px-4 py-2 text-xs font-semibold uppercase hover:bg-surface-container-low active:scale-95 transition-all duration-fast disabled:opacity-40 disabled:cursor-not-allowed select-none"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </motion.div>
        </>
      )}

      {/* QR Code Viewer, Downloader, & Sharer Modal */}
      {activeQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-[fadeIn_0.2s_ease-out]">
          <Card className="max-w-md w-full !bg-white border-2 border-primary space-y-6 !p-6 relative shadow-brutal-md" dogEar>
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-primary pb-3">
              <h3 className="font-anton text-lg uppercase tracking-wide text-primary flex items-center gap-2">
                <QrCode size={20} className="text-secondary" />
                QR Code: /{activeQrModal.shortCode}
              </h3>
              <button
                onClick={() => setActiveQrModal(null)}
                className="text-primary hover:text-secondary transition-colors"
                title="Close Modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* QR Body */}
            <div className="flex flex-col items-center justify-center py-4 bg-surface-container-low/35 border border-dashed border-primary/25 rounded-md">
              <img
                src={activeQrModal.qrUrl}
                alt={`QR Code for ${activeQrModal.shortCode}`}
                className="h-48 w-48 object-contain bg-white p-2 border-2 border-primary shadow-brutal-xs"
              />
              <p className="mt-4 font-mono text-xs font-semibold text-text-muted break-all text-center max-w-[85%] select-all">
                {activeQrModal.shortUrl}
              </p>
            </div>

            {/* Footer Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={activeQrModal.qrUrl}
                download={`qr_${activeQrModal.shortCode}.png`}
                className="flex-1 text-center py-3 border-2 border-primary bg-secondary text-primary font-space text-xs font-bold uppercase tracking-wider hover:bg-secondary/90 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal-xs active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer block"
              >
                Download PNG
              </a>
              <Button
                onClick={() => handleShareQr(activeQrModal.qrUrl, activeQrModal.shortCode, activeQrModal.shortUrl)}
                variant="primary"
                className="flex-1"
              >
                Share QR Code
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Details Stats Modal viewer */}
      {activeStatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-[fadeIn_0.2s_ease-out] overflow-y-auto">
          <Card className="max-w-2xl w-full !bg-white border-2 border-primary space-y-6 !p-6 relative shadow-brutal-md max-h-[90vh] overflow-y-auto" dogEar>
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b-2 border-primary pb-3">
              <h3 className="font-anton text-lg uppercase tracking-wide text-primary flex items-center gap-2">
                <TrendingUp size={20} className="text-secondary" />
                {activeStatModal === 'clicks' && 'Clicks Traffic Log Detail'}
                {activeStatModal === 'visits' && 'Visitor Log Detail'}
                {activeStatModal === 'browser' && 'Client Browser Profile Detail'}
                {activeStatModal === 'device' && 'Visitor Device Profile Detail'}
              </h3>
              <button
                onClick={() => setActiveStatModal(null)}
                className="text-primary hover:text-secondary transition-colors"
                title="Close stats modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4">
              {activeStatModal === 'clicks' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div id="clicks-chart-container" className="h-64 w-full border border-primary/15 bg-surface-container-low/20 p-2 rounded-lg">
                      {trends.some(t => t.clicks > 0) ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={trends} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0, 50, 45, 0.05)" />
                            <XAxis dataKey="formattedDate" tickLine={false} axisLine={false} fontSize={10} stroke="#00322d" style={{ fontFamily: 'Inter, sans-serif', fill: 'rgba(0, 50, 45, 0.6)' }} />
                            <YAxis tickLine={false} axisLine={false} fontSize={10} stroke="#00322d" style={{ fontFamily: 'Inter, sans-serif', fill: 'rgba(0, 50, 45, 0.6)' }} />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Line type="monotone" dataKey="clicks" stroke="#00322d" strokeWidth={2} dot={{ stroke: '#00322d', strokeWidth: 1, r: 2.5, fill: 'white' }} activeDot={{ r: 4 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-xs font-semibold text-on-surface-variant uppercase">No click history logged</div>
                      )}
                    </div>
                    {trends.some(t => t.clicks > 0) && (
                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => handleDownloadChart('clicks-chart-container', 'Clicks')}
                          className="px-3 py-1 border border-primary bg-white text-xs font-bold uppercase tracking-wider text-primary hover:bg-surface-container-low transition-colors cursor-pointer"
                        >
                          Download Chart
                        </button>
                        <button
                          type="button"
                          onClick={() => handleShareChart('clicks-chart-container', 'Clicks')}
                          className="px-3 py-1 border border-primary bg-primary text-xs font-bold uppercase tracking-wider text-white hover:bg-primary/95 transition-colors cursor-pointer"
                        >
                          Share Chart
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="overflow-x-auto border border-primary/10 rounded-lg">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-b-2 border-primary font-space text-[10px] font-bold uppercase text-primary bg-surface-container-low/40">
                          <th className="p-2 font-bold">Date</th>
                          <th className="p-2 font-bold text-right">Clicks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-primary/20">
                        {trends.map((t, idx) => (
                          <tr key={t.date} className={idx % 2 === 0 ? '' : 'bg-surface-container-low/20'}>
                            <td className="p-2 font-bold text-primary">{t.formattedDate || t.date}</td>
                            <td className="p-2 text-right font-bold text-primary font-mono">{t.clicks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeStatModal === 'browser' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div id="browser-chart-container" className="h-64 w-full border border-primary/15 bg-surface-container-low/20 p-2 rounded-lg flex items-center justify-center">
                      {browsers.some(b => b.value > 0) ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={browsers.filter(b => b.value > 0)} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={3} dataKey="value">
                              {browsers.filter(b => b.value > 0).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % 6]} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={tooltipStyle} />
                            <Legend verticalAlign="bottom" height={36} iconType="square" iconSize={8} wrapperStyle={{ fontSize: '10px', fontFamily: 'Space Mono' }} />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="text-xs font-semibold text-on-surface-variant uppercase">No browser clicks recorded</div>
                      )}
                    </div>
                    {browsers.some(b => b.value > 0) && (
                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => handleDownloadChart('browser-chart-container', 'Browser Breakdown')}
                          className="px-3 py-1 border border-primary bg-white text-xs font-bold uppercase tracking-wider text-primary hover:bg-surface-container-low transition-colors cursor-pointer"
                        >
                          Download Chart
                        </button>
                        <button
                          type="button"
                          onClick={() => handleShareChart('browser-chart-container', 'Browser Breakdown')}
                          className="px-3 py-1 border border-primary bg-primary text-xs font-bold uppercase tracking-wider text-white hover:bg-primary/95 transition-colors cursor-pointer"
                        >
                          Share Chart
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="overflow-x-auto border border-primary/10 rounded-lg">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-b-2 border-primary font-space text-[10px] font-bold uppercase text-primary bg-surface-container-low/40">
                          <th className="p-2 font-bold">Browser</th>
                          <th className="p-2 font-bold text-right">Clicks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-primary/20">
                        {browsers.map((b, idx) => (
                          <tr key={b.name} className={idx % 2 === 0 ? '' : 'bg-surface-container-low/20'}>
                            <td className="p-2 font-bold text-primary">{b.name}</td>
                            <td className="p-2 text-right font-bold text-primary font-mono">{b.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeStatModal === 'device' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div id="device-chart-container" className="h-64 w-full border border-primary/15 bg-surface-container-low/20 p-2 rounded-lg">
                      {devices.some(d => d.value > 0) ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={devices} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d8dbd6" />
                            <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={10} stroke="#00322d" style={{ fontFamily: 'Space Mono', fontWeight: 'bold' }} />
                            <YAxis tickLine={false} axisLine={false} fontSize={10} stroke="#00322d" style={{ fontFamily: 'Space Mono', fontWeight: 'bold' }} />
                            <Tooltip cursor={{ fill: 'rgba(44, 105, 86, 0.05)' }} contentStyle={tooltipStyle} />
                            <Bar dataKey="value" fill="#00322d" radius={[0, 0, 0, 0]} barSize={28}>
                              {devices.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={CHART_COLORS[(index + 1) % CHART_COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-xs font-semibold text-on-surface-variant uppercase">No device clicks recorded</div>
                      )}
                    </div>
                    {devices.some(d => d.value > 0) && (
                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => handleDownloadChart('device-chart-container', 'Device Breakdown')}
                          className="px-3 py-1 border border-primary bg-white text-xs font-bold uppercase tracking-wider text-primary hover:bg-surface-container-low transition-colors cursor-pointer"
                        >
                          Download Chart
                        </button>
                        <button
                          type="button"
                          onClick={() => handleShareChart('device-chart-container', 'Device Breakdown')}
                          className="px-3 py-1 border border-primary bg-primary text-xs font-bold uppercase tracking-wider text-white hover:bg-primary/95 transition-colors cursor-pointer"
                        >
                          Share Chart
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="overflow-x-auto border border-primary/10 rounded-lg">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-b-2 border-primary font-space text-[10px] font-bold uppercase text-primary bg-surface-container-low/40">
                          <th className="p-2 font-bold">Device</th>
                          <th className="p-2 font-bold text-right">Clicks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-primary/20">
                        {devices.map((d, idx) => (
                          <tr key={d.name} className={idx % 2 === 0 ? '' : 'bg-surface-container-low/20'}>
                            <td className="p-2 font-bold text-primary">{d.name}</td>
                            <td className="p-2 text-right font-bold text-primary font-mono">{d.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeStatModal === 'visits' && (
                <div className="space-y-4">
                  <div className="max-h-[50vh] overflow-y-auto border border-primary/15 rounded-lg">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-surface-container-low text-primary border-b border-primary/10 text-[10px] font-bold uppercase tracking-wider">
                          <th className="p-3">Timestamp</th>
                          <th className="p-3">IP Address</th>
                          <th className="p-3">Browser</th>
                          <th className="p-3">Device</th>
                          <th className="p-3">Country</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-primary/15 bg-white">
                        {visits.map((visit, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-surface-container-low/30'}>
                            <td className="p-3 text-on-surface-variant font-medium">{new Date(visit.clickedAt).toLocaleString()}</td>
                            <td className="p-3 text-primary font-semibold font-mono">{visit.ip}</td>
                            <td className="p-3 text-on-surface-variant font-semibold">{visit.browser}</td>
                            <td className="p-3 text-on-surface-variant font-semibold">{visit.device}</td>
                            <td className="p-3 text-on-surface-variant font-semibold">{visit.country || 'Unknown'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-primary/10 pt-4 flex justify-end">
              <Button onClick={() => setActiveStatModal(null)} size="md">
                Close Viewer
              </Button>
            </div>
          </Card>
        </div>
      )}
    </motion.div>
  )
}
export { AnalyticsPage }
