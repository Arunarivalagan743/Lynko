import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import {
  ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'
import {
  TrendingUp,
  Globe,
  Activity,
  ShieldCheck,
  Lightbulb,
  Users,
  Bot,
  AlertTriangle,
  MousePointerClick,
  MapPin,
  Shuffle,
  RefreshCw,
  BarChart3,
  X,
  BarChart2
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import Card from '../components/ui/Card.jsx'
import engageImg from '../assets/engagejsx.png'
import noDataImg from '../assets/nodata.png'
import Button from '../components/ui/Button.jsx'
import { useEngagementAnalytics } from '../hooks/useEngagementAnalytics.js'
import { useUrls } from '../hooks/useUrls.js'
import { ENV } from '../constants/env.js'
import PlatformAnalyticsCard from '../components/PlatformAnalyticsCard.jsx'

// ─────────────────────────────────────────────────────────────────────────────
// Chart constants – Paper Tech palette
// ─────────────────────────────────────────────────────────────────────────────
const COLORS = ['#00322d', '#b2ad7d', '#2c6956', '#ba1a1a', '#7ebab0', '#d97706', '#4f46e5']
const TOOLTIP_STYLE = {
  background: '#f8faf5',
  border: '2px solid #00322d',
  borderRadius: '0px',
  fontSize: '11px',
  fontFamily: 'Space Mono, monospace',
  color: '#00322d',
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

/** SectionHeading for consistent header styling in cards */
const SectionHeading = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 border-b-2 border-primary pb-3 mb-5">
    {Icon && <Icon size={18} className="text-primary flex-shrink-0" />}
    <h2 className="heading-section">{title}</h2>
  </div>
)

/** SkeletonBar for loading states */
const SkeletonBar = ({ w = 'w-full', h = 'h-4' }) => (
  <div className={`${w} ${h} rounded-none bg-surface-container-high animate-pulse`} />
)

/** Empty state placeholder with optional icon support */
const EmptyState = ({ icon: Icon, message = 'No data available yet.' }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 border-2 border-dashed border-primary/20 bg-surface-container-low/20 w-full h-full p-6">
    <img src={noDataImg} alt="" className="h-16 w-auto object-contain shadow-none" />
    <p className="label-meta max-w-xs font-semibold">{message}</p>
  </div>
)

// ─────────────────────────────────────────────────────────────────────────────
// Main Page Component
// ─────────────────────────────────────────────────────────────────────────────
export default function EngagementDashboard() {
  const navigate = useNavigate()
  const { urls, fetchUrls } = useUrls()

  // Selected URL for urlId-scoped features (2, 3, 6)
  const [selectedUrlId, setSelectedUrlId] = useState('')
  const [activeStatModal, setActiveStatModal] = useState(null)

  const {
    topLinks, topLinksLoading,
    referrers, referrersLoading,
    geography, geographyLoading,
    activity, activityLoading,
    trafficQuality, trafficQualityLoading,
    insights, insightsLoading,
    platformStats, platformStatsLoading,
    fetchUserScopedData,
    fetchUrlScopedData,
    fetchActivity,
  } = useEngagementAnalytics(selectedUrlId)

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
            text: `Engagement traffic analytics data report for short code /${selectedUrl?.shortCode || ''}`,
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

  // ── Initial load ──
  useEffect(() => {
    fetchUrls()
    fetchUserScopedData()
  }, [fetchUrls, fetchUserScopedData])

  // ── Auto-select #1 Top Performing Link on load ──
  useEffect(() => {
    if (!selectedUrlId && topLinks.length > 0) {
      setSelectedUrlId(topLinks[0].urlId)
    }
  }, [topLinks, selectedUrlId])

  // ── Re-fetch url-scoped data when selection changes ──
  useEffect(() => {
    if (selectedUrlId) {
      fetchUrlScopedData(selectedUrlId)
    }
  }, [selectedUrlId, fetchUrlScopedData])

  const selectedUrl = urls.find((u) => u._id === selectedUrlId)
  const shortUrl = selectedUrl ? `${ENV.VITE_API_URL}/r/${selectedUrl.shortCode}` : ''

  // Traffic quality donut data
  const qualityData = trafficQuality
    ? [
      { name: 'Human', value: trafficQuality.human },
      { name: 'Bot', value: trafficQuality.bot },
      { name: 'Suspicious', value: trafficQuality.suspicious },
    ].filter((d) => d.value > 0)
    : []

  const isAllLocalhostTraffic = geography.length > 0 && geography.every(g => g.name === 'Development' || g.name === 'Localhost')

  const renderTrafficQualityCard = () => (
    <Card className="space-y-0" shadowSize="md">
      <SectionHeading icon={ShieldCheck} title="Traffic Quality" />

      {trafficQualityLoading ? (
        <div className="space-y-3 py-4">
          {[...Array(3)].map((_, i) => <SkeletonBar key={i} h="h-5" />)}
        </div>
      ) : trafficQuality ? (
        <div className="space-y-5">
          {/* Donut chart */}
          <div onClick={() => setActiveStatModal('quality')} className="h-52 w-full cursor-pointer hover:opacity-90 transition-opacity" title="Click to view details">
            {qualityData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={qualityData}
                    cx="50%" cy="50%"
                    innerRadius={52} outerRadius={72}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {qualityData.map((_, i) => (
                      <Cell key={i} fill={['#2c6956', '#636037', '#ba1a1a'][i % 3]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: '10px', fontFamily: 'Space Mono' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState icon={ShieldCheck} message="No visit data recorded yet." />
            )}
          </div>

          {/* Stat rows */}
          <div className="space-y-2.5">
            {[
              { label: 'Human', value: trafficQuality.human, pct: trafficQuality.humanPercentage, color: 'bg-secondary', textColor: 'text-secondary', icon: Users },
              { label: 'Bot', value: trafficQuality.bot, pct: trafficQuality.botPercentage, color: 'bg-tertiary', textColor: 'text-tertiary', icon: Bot },
              { label: 'Suspicious', value: trafficQuality.suspicious, pct: trafficQuality.suspiciousPercentage, color: 'bg-error', textColor: 'text-error', icon: AlertTriangle },
            ].map((row) => (
              <div key={row.label} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <row.icon size={13} className={row.textColor} />
                    <span className="font-space text-xs font-bold uppercase text-primary">{row.label}</span>
                  </div>
                  <span className="font-space text-xs font-bold text-primary">
                    {row.value.toLocaleString()} ({row.pct}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-surface-container-low border border-primary/20 rounded-none overflow-hidden">
                  <div className={`h-full ${row.color} transition-all duration-500`} style={{ width: `${row.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState icon={ShieldCheck} message="Traffic quality data is loading..." />
      )}
    </Card>
  )

  const renderReferrersCard = () => (
    <Card className="space-y-0" shadowSize="md">
      <SectionHeading icon={Shuffle} title="Traffic Sources (Referrers)" />

      {!selectedUrlId ? (
        <EmptyState icon={Shuffle} message="Select a link above to see its referrer breakdown." />
      ) : referrersLoading ? (
        <div className="space-y-3 py-4">
          {[...Array(5)].map((_, i) => <SkeletonBar key={i} />)}
        </div>
      ) : referrers.length === 0 ? (
        <EmptyState icon={Shuffle} message="No referrer data recorded for this link yet." />
      ) : (
        <div className="space-y-5">
          <div onClick={() => setActiveStatModal('referrers')} className="h-60 w-full cursor-pointer hover:opacity-90 transition-opacity" title="Click to view/download/share chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={referrers}
                layout="vertical"
                margin={{ top: 0, right: 16, left: 8, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#d8dbd6" />
                <XAxis type="number" tickLine={false} axisLine={false} fontSize={10} stroke="#00322d" style={{ fontFamily: 'Space Mono', fontWeight: 'bold' }} />
                <YAxis type="category" dataKey="source" tickLine={false} axisLine={false} fontSize={10} stroke="#00322d" style={{ fontFamily: 'Space Mono', fontWeight: 'bold' }} width={72} />
                <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(44,105,86,0.05)' }} />
                <Bar dataKey="clicks" radius={[0, 0, 0, 0]} barSize={16}>
                  {referrers.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-primary">
                <th className="py-2 font-space text-[11px] font-bold uppercase text-primary">Source</th>
                <th className="py-2 font-space text-[11px] font-bold uppercase text-primary text-right">Clicks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/10">
              {referrers.map((r, idx) => (
                <tr key={r.source} className={idx % 2 === 0 ? '' : 'bg-surface-container-low/30'}>
                  <td className="py-2 font-semibold text-primary">{r.source}</td>
                  <td className="py-2 text-right font-bold font-space text-primary">{r.clicks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )

  const renderGeographyCard = () => (
    <Card className="space-y-0" shadowSize="md">
      <SectionHeading icon={Globe} title="Geographic Distribution" />

      {!selectedUrlId ? (
        <EmptyState icon={Globe} message="Select a link above to see its country breakdown." />
      ) : geographyLoading ? (
        <div className="space-y-3 py-4">
          {[...Array(5)].map((_, i) => <SkeletonBar key={i} />)}
        </div>
      ) : geography.length === 0 ? (
        <EmptyState icon={Globe} message="No geographic data recorded for this link yet." />
      ) : isAllLocalhostTraffic ? (
        <EmptyState icon={Globe} message="Development Traffic" />
      ) : (
        <div className="space-y-5">
          <div onClick={() => setActiveStatModal('geography')} className="h-60 w-full cursor-pointer hover:opacity-90 transition-opacity" title="Click to view/download/share chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={geography.slice(0, 8)} margin={{ top: 0, right: 8, left: -28, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d8dbd6" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={9} stroke="#00322d" style={{ fontFamily: 'Space Mono', fontWeight: 'bold' }} />
                <YAxis tickLine={false} axisLine={false} fontSize={10} stroke="#00322d" style={{ fontFamily: 'Space Mono', fontWeight: 'bold' }} />
                <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(44,105,86,0.05)' }} />
                <Bar dataKey="value" name="Clicks" radius={[0, 0, 0, 0]} barSize={22}>
                  {geography.slice(0, 8).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-primary">
                <th className="py-2 font-space text-[11px] font-bold uppercase text-primary">Country</th>
                <th className="py-2 font-space text-[11px] font-bold uppercase text-primary text-right">Clicks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/10">
              {geography.slice(0, 8).map((g, idx) => (
                <tr key={g.name} className={idx % 2 === 0 ? '' : 'bg-surface-container-low/30'}>
                  <td className="py-2 font-semibold text-primary flex items-center gap-2">
                    <MapPin size={12} className="text-secondary flex-shrink-0" />
                    {g.name}
                  </td>
                  <td className="py-2 text-right font-bold font-space text-primary">{g.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )

  const renderSmartInsightsCard = () => (
    <Card className="space-y-0" shadowSize="md">
      <SectionHeading icon={Lightbulb} title="Smart Insights" />

      {!selectedUrlId ? (
        <EmptyState icon={Lightbulb} message="Select a link above to generate deterministic AI-free insights for it." />
      ) : insightsLoading ? (
        <div className="space-y-4 py-4">
          {[...Array(4)].map((_, i) => <SkeletonBar key={i} h="h-12" />)}
        </div>
      ) : insights.length === 0 ? (
        <EmptyState icon={Lightbulb} message="No insight data available for this link yet." />
      ) : (
        <div className="space-y-3">
          {insights.map((insight, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 rounded-none border-2 border-primary bg-surface-container-low p-4 shadow-brutal-xs"
            >
              <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-none border-2 border-primary bg-secondary-container text-primary font-anton text-xs">
                {idx + 1}
              </span>
              <p className="text-sm font-semibold text-primary leading-snug">{insight}</p>
            </div>
          ))}
          {selectedUrl && (
            <Button
              as={Link}
              to={`/analytics/${selectedUrl._id}`}
              variant="secondary"
              size="sm"
              className="w-full flex items-center justify-center gap-2 mt-2"
            >
              <BarChart3 size={14} />
              Full Analytics
            </Button>
          )}
        </div>
      )}
    </Card>
  )

  const renderPlatformAnalyticsCard = () => {
    if (!selectedUrlId) {
      return (
        <Card className="space-y-0" shadowSize="md">
          <SectionHeading icon={MousePointerClick} title="Platform Link Clicks" />
          <EmptyState icon={MousePointerClick} message="Select a link above to see platform clicks." />
        </Card>
      )
    }
    return (
      <PlatformAnalyticsCard
        platformStats={platformStats}
        loading={platformStatsLoading}
      />
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="space-y-8"
    >
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-outline-variant pb-6">
        <div className="space-y-3">
          <p className="label-overline">Engagement</p>
          <h1 className="heading-page">Analytics Hub</h1>
          <p className="text-base font-medium text-on-surface-variant max-w-2xl">
            Deep engagement metrics across all your links.
          </p>
        </div>
        <div className="flex-shrink-0">
          <img src={engageImg} alt="" className="h-20 w-auto object-contain shadow-none" />
        </div>
      </div>

      {/* ── ROW 1: Traffic Quality + Top Links ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
        className="grid gap-8 lg:grid-cols-[1fr_1.8fr]"
      >
        {renderTrafficQualityCard()}

        {/* FEATURE 1 – Top Performing Links */}
        <Card className="space-y-0" shadowSize="md">
          <SectionHeading icon={TrendingUp} title="Top Performing Links" />

          {topLinksLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => <SkeletonBar key={i} />)}
            </div>
          ) : topLinks.length === 0 ? (
            <EmptyState icon={TrendingUp} message="No links found. Create your first short link to see it here." />
          ) : (
            <div className="space-y-4">
              {/* Desktop/Tablet Table */}
              <div className="hidden md:block overflow-x-auto border-2 border-primary rounded-none bg-white">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b-2 border-primary">
                      <th className="p-3.5 font-space text-[11px] font-bold uppercase text-primary">#</th>
                      <th className="p-3.5 font-space text-[11px] font-bold uppercase text-primary">Short Link</th>
                      <th className="p-3.5 font-space text-[11px] font-bold uppercase text-primary">Original URL</th>
                      <th className="p-3.5 font-space text-[11px] font-bold uppercase text-primary text-right">Clicks</th>
                      <th className="p-3.5 font-space text-[11px] font-bold uppercase text-primary text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/10">
                    {topLinks.map((link, idx) => {
                      const isSelected = selectedUrlId === link.urlId
                      return (
                        <tr key={link.urlId} className={isSelected ? 'bg-secondary-container/20' : idx % 2 === 0 ? 'bg-white' : 'bg-surface-container-low/30'}>
                          <td className="p-3.5 font-space text-xs font-bold text-on-surface-variant">{idx + 1}</td>
                          <td className="p-3.5">
                            <a
                              href={`${ENV.VITE_API_URL}/r/${link.shortCode}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-anton text-base text-secondary hover:underline"
                            >
                              /{link.shortCode}
                            </a>
                          </td>
                          <td className="p-3.5 text-on-surface-variant font-medium truncate max-w-[220px]" title={link.originalUrl}>
                            {link.originalUrl}
                          </td>
                          <td className="p-3.5 text-right font-anton text-xl text-primary">{link.clickCount.toLocaleString()}</td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => setSelectedUrlId(link.urlId)}
                              className={`rounded-none border-2 border-primary px-3 py-1 font-space text-[10px] font-bold uppercase transition-all duration-fast ${isSelected
                                ? 'bg-primary text-white shadow-none translate-x-[1px] translate-y-[1px]'
                                : 'bg-white text-primary shadow-brutal-xs hover:bg-surface-container-low active:translate-x-[1px] active:translate-y-[1px] active:shadow-none'
                                }`}
                            >
                              {isSelected ? 'Selected' : 'Select'}
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards Stack */}
              <div className="block md:hidden space-y-4">
                {topLinks.map((link, idx) => {
                  const isSelected = selectedUrlId === link.urlId
                  return (
                    <Card key={link.urlId} className={clsx("p-4 space-y-3", isSelected ? "!bg-secondary-container/10 border-secondary" : "")} shadowSize="sm">
                      <div className="flex items-center justify-between">
                        <span className="code-label">Rank #{idx + 1}</span>
                        <button
                          onClick={() => setSelectedUrlId(link.urlId)}
                          className={clsx(
                            "rounded-none border-2 border-primary px-3 py-1 font-space text-[10px] font-bold uppercase transition-all duration-fast",
                            isSelected
                              ? "bg-primary text-white shadow-none translate-x-[1px] translate-y-[1px]"
                              : "bg-white text-primary shadow-brutal-xs hover:bg-surface-container-low active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                          )}
                        >
                          {isSelected ? 'Selected' : 'Select'}
                        </button>
                      </div>
                      <div className="flex items-center justify-between border-t border-primary/10 pt-2.5">
                        <a
                          href={`${ENV.VITE_API_URL}/r/${link.shortCode}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-anton text-base text-secondary hover:underline"
                        >
                          /{link.shortCode}
                        </a>
                        <div className="text-right">
                          <p className="text-[10px] font-bold uppercase text-on-surface-variant/60 font-space">Clicks</p>
                          <p className="font-anton text-lg text-primary">{link.clickCount.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="space-y-1 border-t border-primary/10 pt-2.5">
                        <p className="text-[10px] font-bold uppercase text-on-surface-variant/60 font-space">Original URL</p>
                        <p className="text-xs text-on-surface-variant font-medium break-all select-all">{link.originalUrl}</p>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}
        </Card>
      </motion.div>

      {/* ── ROW 2: Recent Activity Feed ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="space-y-0" shadowSize="md">
          <div className="flex items-center justify-between border-b-2 border-primary pb-3 mb-5">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-primary" />
              <h2 className="heading-section">Live Activity Feed</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
              <span className="font-space text-[10px] font-bold uppercase text-secondary">Live</span>
              <button
                onClick={() => fetchActivity()}
                className="ml-2 rounded-none border-2 border-primary bg-white p-1.5 text-primary shadow-brutal-xs hover:bg-surface-container-low active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all duration-fast"
                title="Refresh activity"
              >
                <RefreshCw size={13} />
              </button>
            </div>
          </div>

          {activityLoading ? (
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => <SkeletonBar key={i} h="h-12" />)}
            </div>
          ) : activity.length === 0 ? (
            <EmptyState icon={Activity} message="No recent activity recorded across your links." />
          ) : (
            <div className="space-y-4">
              {/* Desktop/Tablet Table */}
              <div className="hidden md:block overflow-x-auto border-2 border-primary rounded-none bg-white">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b-2 border-primary">
                      {['Link', 'Browser', 'Device', 'Country', 'Time'].map((h) => (
                        <th key={h} className="p-3.5 font-space text-[11px] font-bold uppercase text-primary">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/10">
                    {activity.map((a, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-surface-container-low/30'}>
                        <td className="p-3.5 font-anton text-sm text-secondary">
                          /{a.shortCode}
                        </td>
                        <td className="p-3.5 text-primary font-semibold capitalize">{a.browser}</td>
                        <td className="p-3.5 text-on-surface-variant font-semibold capitalize">{a.device}</td>
                        <td className="p-3.5 text-on-surface-variant font-semibold">
                          <div className="flex items-center gap-1.5">
                            <MapPin size={11} className="text-secondary flex-shrink-0" />
                            {a.country}
                          </div>
                        </td>
                        <td className="p-3.5 text-on-surface-variant font-space text-[11px]">
                          {new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          <br />
                          <span className="text-[10px]">{new Date(a.timestamp).toLocaleDateString()}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards Stack */}
              <div className="block md:hidden space-y-4">
                {activity.map((a, idx) => (
                  <Card key={idx} className="p-4 space-y-2.5" shadowSize="sm">
                    <div className="flex items-center justify-between">
                      <span className="font-anton text-sm text-secondary">/{a.shortCode}</span>
                      <span className="font-space text-[10px] text-on-surface-variant/80">
                        {new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{' '}
                        {new Date(a.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs border-t border-primary/10 pt-2.5">
                      <div>
                        <p className="text-[10px] font-bold uppercase text-on-surface-variant/60 font-space">Browser</p>
                        <p className="font-semibold text-primary capitalize mt-0.5">{a.browser}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase text-on-surface-variant/60 font-space">Device</p>
                        <p className="font-semibold text-on-surface-variant capitalize mt-0.5">{a.device}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase text-on-surface-variant/60 font-space">Country</p>
                        <p className="font-semibold text-on-surface-variant mt-0.5 truncate flex items-center gap-1">
                          <MapPin size={11} className="text-secondary flex-shrink-0" />
                          {a.country}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </Card>
      </motion.div>

      {/* ── Link analyzer details breakdown (scoped to active selection) ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
        className="pt-6 border-t-2 border-primary/20 space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-anton uppercase text-primary tracking-wide">
              Link Analyzer {selectedUrl ? `(/${selectedUrl.shortCode})` : ''}
            </h2>
            <p className="text-sm font-medium text-on-surface-variant">
              {selectedUrl
                ? `Specific details for the selected link. Target: ${selectedUrl.originalUrl}`
                : 'Select any link from the Top Performing Links list to inspect its details.'}
            </p>
          </div>
          {selectedUrlId && (
            <Button
              onClick={() => setSelectedUrlId('')}
              variant="secondary"
              size="sm"
            >
              Clear Scoped Link Selection
            </Button>
          )}
        </div>

        {/* ── ROW 3: Platform Analytics + Smart Insights ── */}
        <div className="grid gap-8 md:grid-cols-2">
          {renderPlatformAnalyticsCard()}
          {renderSmartInsightsCard()}
        </div>
      </motion.div>

      {/* Details Stats Modal viewer */}
      {activeStatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-[fadeIn_0.2s_ease-out] overflow-y-auto">
          <Card className="max-w-2xl w-full !bg-white border-2 border-primary space-y-6 !p-6 relative shadow-brutal-md max-h-[90vh] overflow-y-auto" dogEar>
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b-2 border-primary pb-3">
              <h3 className="font-anton text-lg uppercase tracking-wide text-primary flex items-center gap-2">
                <BarChart2 size={20} className="text-secondary" />
                {activeStatModal === 'quality' && 'Traffic Health & Quality Detail'}
                {activeStatModal === 'referrers' && 'Traffic Sources breakdown'}
                {activeStatModal === 'geography' && 'Country breakdown'}
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
              {activeStatModal === 'quality' && trafficQuality && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div id="quality-chart-container" className="h-64 w-full border border-primary/15 bg-surface-container-low/20 p-2 rounded-lg flex items-center justify-center">
                      {qualityData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={qualityData}
                              cx="50%"
                              cy="50%"
                              innerRadius={52}
                              outerRadius={72}
                              paddingAngle={3}
                              dataKey="value"
                            >
                              {qualityData.map((_, i) => (
                                <Cell key={i} fill={['#2c6956', '#636037', '#ba1a1a'][i % 3]} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={TOOLTIP_STYLE} />
                            <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: '10px', fontFamily: 'Space Mono' }} />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-xs font-semibold text-on-surface-variant uppercase">No visit data recorded yet</div>
                      )}
                    </div>
                    {qualityData.length > 0 && (
                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => handleDownloadChart('quality-chart-container', 'Traffic Quality')}
                          className="px-3 py-1 border border-primary bg-white text-xs font-bold uppercase tracking-wider text-primary hover:bg-surface-container-low transition-colors cursor-pointer"
                        >
                          Download Chart
                        </button>
                        <button
                          type="button"
                          onClick={() => handleShareChart('quality-chart-container', 'Traffic Quality')}
                          className="px-3 py-1 border border-primary bg-primary text-xs font-bold uppercase tracking-wider text-white hover:bg-primary/95 transition-colors cursor-pointer"
                        >
                          Share Chart
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="border border-primary/20 p-4 bg-surface-container-low rounded-md">
                      <p className="text-[10px] font-semibold uppercase text-on-surface-variant tracking-wider">Human Clicks</p>
                      <p className="text-2xl font-anton text-primary">{trafficQuality.human || 0}</p>
                    </div>
                    <div className="border border-primary/20 p-4 bg-surface-container-low rounded-md">
                      <p className="text-[10px] font-semibold uppercase text-on-surface-variant tracking-wider">Bot Clicks</p>
                      <p className="text-2xl font-anton text-error">{trafficQuality.bot || 0}</p>
                    </div>
                    <div className="border border-primary/20 p-4 bg-surface-container-low rounded-md">
                      <p className="text-[10px] font-semibold uppercase text-on-surface-variant tracking-wider">Suspicious Clicks</p>
                      <p className="text-2xl font-anton text-tertiary">{trafficQuality.suspicious || 0}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-surface-container-low border border-primary border-t-4">
                    <ShieldCheck size={20} className="text-secondary mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold font-space uppercase text-primary">Traffic Verification health</h4>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        Verified human traffic ratio is {trafficQuality.humanPercentage}%. {trafficQuality.botPercentage}% of actions are automated hits, and {trafficQuality.suspiciousPercentage}% are suspicious requests.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeStatModal === 'referrers' && referrers.length > 0 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div id="referrers-chart-container" className="h-64 w-full border border-primary/15 bg-surface-container-low/20 p-2 rounded-lg flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={referrers} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#d8dbd6" />
                          <XAxis type="number" tickLine={false} axisLine={false} fontSize={10} stroke="#00322d" style={{ fontFamily: 'Space Mono', fontWeight: 'bold' }} />
                          <YAxis type="category" dataKey="source" tickLine={false} axisLine={false} fontSize={10} stroke="#00322d" style={{ fontFamily: 'Space Mono', fontWeight: 'bold' }} width={72} />
                          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(44,105,86,0.05)' }} />
                          <Bar dataKey="clicks" radius={[0, 0, 0, 0]} barSize={16}>
                            {referrers.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => handleDownloadChart('referrers-chart-container', 'Traffic Sources')}
                        className="px-3 py-1 border border-primary bg-white text-xs font-bold uppercase tracking-wider text-primary hover:bg-surface-container-low transition-colors cursor-pointer"
                      >
                        Download Chart
                      </button>
                      <button
                        type="button"
                        onClick={() => handleShareChart('referrers-chart-container', 'Traffic Sources')}
                        className="px-3 py-1 border border-primary bg-primary text-xs font-bold uppercase tracking-wider text-white hover:bg-primary/95 transition-colors cursor-pointer"
                      >
                        Share Chart
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto border border-primary/10 rounded-lg">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-b-2 border-primary font-space text-[10px] font-bold uppercase text-primary bg-surface-container-low/40">
                          <th className="p-2 font-bold">Source</th>
                          <th className="p-2 font-bold text-right">Clicks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-primary/20">
                        {referrers.map((r, idx) => (
                          <tr key={r.source} className={idx % 2 === 0 ? '' : 'bg-surface-container-low/20'}>
                            <td className="p-2 font-bold text-primary">{r.source}</td>
                            <td className="p-2 text-right font-bold text-primary font-mono">{r.clicks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeStatModal === 'geography' && geography.length > 0 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div id="geography-chart-container" className="h-64 w-full border border-primary/15 bg-surface-container-low/20 p-2 rounded-lg flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={geography.slice(0, 8)} margin={{ top: 0, right: 8, left: -28, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d8dbd6" />
                          <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={9} stroke="#00322d" style={{ fontFamily: 'Space Mono', fontWeight: 'bold' }} />
                          <YAxis tickLine={false} axisLine={false} fontSize={10} stroke="#00322d" style={{ fontFamily: 'Space Mono', fontWeight: 'bold' }} />
                          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(44,105,86,0.05)' }} />
                          <Bar dataKey="value" name="Clicks" radius={[0, 0, 0, 0]} barSize={22}>
                            {geography.slice(0, 8).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        onClick={() => handleDownloadChart('geography-chart-container', 'Geographic Distribution')}
                        className="px-3 py-1 border border-primary bg-white text-xs font-bold uppercase tracking-wider text-primary hover:bg-surface-container-low transition-colors cursor-pointer"
                      >
                        Download Chart
                      </button>
                      <button
                        type="button"
                        onClick={() => handleShareChart('geography-chart-container', 'Geographic Distribution')}
                        className="px-3 py-1 border border-primary bg-primary text-xs font-bold uppercase tracking-wider text-white hover:bg-primary/95 transition-colors cursor-pointer"
                      >
                        Share Chart
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto border border-primary/10 rounded-lg">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-b-2 border-primary font-space text-[10px] font-bold uppercase text-primary bg-surface-container-low/40">
                          <th className="p-2 font-bold">Country</th>
                          <th className="p-2 font-bold text-right">Clicks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-primary/20">
                        {geography.slice(0, 8).map((g, idx) => (
                          <tr key={g.name} className={idx % 2 === 0 ? '' : 'bg-surface-container-low/20'}>
                            <td className="p-2 font-bold text-primary">{g.name}</td>
                            <td className="p-2 text-right font-bold text-primary font-mono">{g.value}</td>
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
