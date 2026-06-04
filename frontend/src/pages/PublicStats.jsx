import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePublicStats } from '../hooks/usePublicStats.js'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import PageLoader from '../components/loading/PageLoader.jsx'
import toast from 'react-hot-toast'
import publicImg from '../assets/illustrations/publicjsx.png'
import publicNoDataImg from '../assets/illustrations/nodata.png'
import { 
  TrendingUp, 
  BarChart2, 
  Monitor, 
  Globe, 
  RefreshCw, 
  AlertCircle, 
  ArrowLeft, 
  Search, 
  Users,
  Share2,
  CheckCircle2,
  Lightbulb,
  X
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

export default function PublicStatsPage() {
  const { shortCode } = useParams()
  const navigate = useNavigate()

  // Custom hook for public stats
  const { stats, loading, error, refetch } = usePublicStats(shortCode)

  // Local lookup search input
  const [searchInput, setSearchInput] = useState('')
  const [activeStatModal, setActiveStatModal] = useState(null)

  // Fetch stats when shortCode changes
  useEffect(() => {
    if (shortCode) {
      refetch()
    }
  }, [shortCode, refetch])

  const handleLookupSubmit = (e) => {
    e.preventDefault()
    const code = searchInput.trim()
    if (code) {
      navigate(`/stats/${code}`)
      setSearchInput('')
    }
  }

  const handleShareReport = () => {
    const statsUrl = `${window.location.origin}/stats/${shortCode}`
    navigator.clipboard.writeText(statsUrl)
    toast.success('Stats report link copied to clipboard!')
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
            text: `Traffic analytics data report for short code /${shortCode}`,
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

  // Render search lookup card if no short code is specified in the route
  if (!shortCode) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="max-w-md mx-auto py-12 px-4 space-y-6"
      >
        <div className="flex justify-center">
          <img src={publicImg} alt="" className="h-32 w-auto object-contain shadow-none" />
        </div>
        <Card className="space-y-6 text-center" shadowSize="md">
          <div className="space-y-2">
            <div className="mx-auto h-12 w-12 rounded-none border-2 border-primary bg-surface-container-low flex items-center justify-center text-primary">
              <BarChart2 size={24} />
            </div>
            <h1 className="text-2xl font-anton tracking-wider text-primary uppercase">Public Link Statistics</h1>
            <p className="text-sm font-medium text-on-surface-variant">
              Enter any shortened URL code below to inspect its redirection traffic statistics.
            </p>
          </div>

          <form onSubmit={handleLookupSubmit} className="space-y-4">
            <div className="relative flex flex-col gap-1.5 text-sm">
              <Search size={18} className="absolute left-3 top-[13px] text-primary" />
              <input
                type="text"
                required
                placeholder="Enter short code (e.g. summer-promo)"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="h-11 rounded-none border-2 border-primary bg-white pl-10 pr-3 font-sans text-sm text-on-background placeholder:text-on-surface-variant/50 transition-colors focus:border-secondary focus:outline-none focus:ring-0 w-full"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
            >
              View Link Statistics
            </Button>
          </form>
        </Card>
      </motion.div>
    )
  }

  // Calculate dynamic stats metrics
  const topBrowser = stats?.browsers?.length > 0 && stats.browsers[0].value > 0 ? stats.browsers[0].name : 'None'
  const topDevice = stats?.devices?.length > 0 && stats.devices[0].value > 0 ? stats.devices[0].name : 'None'
  
  const total = stats?.totalClicks || 0
  const human = stats?.humanClicks || 0
  const qualityScore = total > 0 ? Math.round((human / total) * 100) : 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="space-y-6"
    >
      {/* Top Header Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-outline-variant pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate('/stats')}
              variant="secondary"
              className="h-10 w-10 p-0"
              title="Search another code"
            >
              <ArrowLeft size={16} />
            </Button>
            <div className="space-y-0.5">
              <h1 className="text-xl font-anton tracking-wider text-primary uppercase">Link Public Statistics</h1>
              <p className="text-sm text-on-surface-variant font-medium">
                Viewing traffic data for short code: <strong className="text-secondary font-bold font-space">/{shortCode}</strong>
              </p>
            </div>
          </div>
          <div className="flex-shrink-0 hidden md:block">
            <img src={publicImg} alt="" className="h-16 w-auto object-contain shadow-none" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto sm:justify-end">
          <Button
            onClick={handleShareReport}
            variant="secondary"
            className="w-full sm:w-auto h-10 flex items-center justify-center gap-2 px-4 whitespace-nowrap font-space text-xs font-bold uppercase"
          >
            <Share2 size={15} /> Share Report
          </Button>

          {/* Quick Search Header Bar */}
          <form onSubmit={handleLookupSubmit} className="flex items-center gap-2 w-full sm:max-w-[200px]">
            <input
              type="text"
              required
              placeholder="Search code..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="h-10 rounded-none border-2 border-primary bg-white px-3 font-sans text-sm text-on-background placeholder:text-on-surface-variant/50 transition-colors focus:border-secondary focus:outline-none focus:ring-0 w-full"
            />
            <Button
              type="submit"
              className="h-10 py-0 px-3 flex-shrink-0"
            >
              Go
            </Button>
          </form>
        </div>
      </div>

      {loading && !stats ? (
        <PageLoader message={`Retrieving statistics for short code /${shortCode}...`} />
      ) : error ? (
        /* Error and Invalid short code state */
        <div className="space-y-6 max-w-lg mx-auto py-6">
          <Card className="space-y-4 text-center border-error" shadowSize="md">
            <div className="mx-auto h-12 w-12 rounded-none border-2 border-error bg-error/10 flex items-center justify-center text-error">
              <AlertCircle size={24} />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-anton uppercase tracking-wider text-error">Invalid Code or Retrieval Error</h2>
              <p className="text-sm font-medium text-on-surface-variant max-w-xs mx-auto">
                We were unable to load public statistics for <strong>/{shortCode}</strong>. 
                Please verify that the short code is correct, exists, and hasn't expired.
              </p>
              <p className="font-space text-xs text-error bg-white border-2 border-error p-3 rounded-none max-w-xs mx-auto overflow-hidden text-ellipsis select-all">
                Error details: {error}
              </p>
            </div>
            <div className="flex justify-center gap-3">
              <Button
                onClick={refetch}
                variant="secondary"
                className="flex items-center gap-1.5"
              >
                <RefreshCw size={14} /> Retry
              </Button>
              <Button
                onClick={() => navigate('/stats')}
              >
                Back to Search
              </Button>
            </div>
          </Card>
        </div>
      ) : stats ? (
        /* Display loaded stats */
        <>
          {/* 1. Public Analytics Summary Cards Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {/* Total Clicks */}
            <motion.div variants={itemVariants} whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Card onClick={() => setActiveStatModal('clicks')} className="flex flex-col justify-between p-4 space-y-2 bg-white h-full cursor-pointer hover:border-primary transition-colors" shadowSize="sm">
                <div className="flex items-center justify-between text-primary">
                  <span className="font-space text-xs font-bold uppercase tracking-wider">Total Clicks</span>
                  <TrendingUp size={16} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-anton text-primary">{stats.totalClicks}</h3>
                  <p className="font-space text-[9px] font-bold uppercase text-on-surface-variant">Accumulated redirections</p>
                </div>
              </Card>
            </motion.div>

            {/* Top Browser */}
            <motion.div variants={itemVariants} whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Card onClick={() => setActiveStatModal('browser')} className="flex flex-col justify-between p-4 space-y-2 bg-secondary-container h-full cursor-pointer hover:border-primary transition-colors" shadowSize="sm">
                <div className="flex items-center justify-between text-primary">
                  <span className="font-space text-xs font-bold uppercase tracking-wider">Top Browser</span>
                  <Monitor size={16} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-anton text-primary truncate">{topBrowser}</h3>
                  <p className="font-space text-[9px] font-bold uppercase text-on-secondary-container">Most active client browser</p>
                </div>
              </Card>
            </motion.div>

            {/* Top Device */}
            <motion.div variants={itemVariants} whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Card onClick={() => setActiveStatModal('device')} className="flex flex-col justify-between p-4 space-y-2 bg-tertiary-container h-full cursor-pointer hover:border-primary transition-colors" shadowSize="sm">
                <div className="flex items-center justify-between text-tertiary">
                  <span className="font-space text-xs font-bold uppercase tracking-wider text-tertiary">Top Device</span>
                  <Monitor size={16} className="text-tertiary" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-anton text-tertiary truncate">{topDevice}</h3>
                  <p className="font-space text-[9px] font-bold uppercase text-on-tertiary-container">Primary visitor device</p>
                </div>
              </Card>
            </motion.div>

            {/* Traffic Quality */}
            <motion.div variants={itemVariants} whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Card onClick={() => setActiveStatModal('quality')} className="flex flex-col justify-between p-4 space-y-2 bg-error-container h-full cursor-pointer hover:border-primary transition-colors" shadowSize="sm">
                <div className="flex items-center justify-between text-error">
                  <span className="font-space text-xs font-bold uppercase tracking-wider text-error">Traffic Quality</span>
                  <Users size={16} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-anton text-error">{qualityScore}%</h3>
                  <p className="font-space text-[9px] font-bold uppercase text-on-error-container">Verified human traffic ratio</p>
                </div>
              </Card>
            </motion.div>
          </motion.div>

          {/* Traffic Quality Insights Summary */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4 }}
          >
            <Card className="space-y-4 !p-5 border-2 border-primary" shadowSize="sm">
              <h2 className="text-sm font-anton uppercase tracking-wider text-primary flex items-center gap-2 border-b-2 border-primary pb-2">
                <Lightbulb size={16} className="text-primary animate-pulse" />
                Performance Insights Report
              </h2>
              
              {total > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3 p-3 bg-surface-container-low border border-primary/10">
                    <CheckCircle2 size={18} className="text-secondary mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold font-space uppercase text-primary">Traffic Verification</h4>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        {qualityScore >= 80 
                          ? `Exceptional traffic health! ${qualityScore}% of redirection visits are verified human interactions with minimal automated crawlers.` 
                          : `Noticeable non-human traffic detected. ${100 - qualityScore}% of actions originate from spiders, crawlers, or headless scrapers.`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-surface-container-low border border-primary/10">
                    <Monitor size={18} className="text-secondary mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold font-space uppercase text-primary">Audience Platform</h4>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        {topDevice !== 'None' 
                          ? `Visitors predominantly engage using ${topDevice.toLowerCase()} clients. Tailoring target content to this layout is highly advised.` 
                          : `Awaiting device profiling metrics to determine visitor viewport preferences.`}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="font-space text-xs font-semibold text-on-surface-variant">
                    No redirection traffic insights logged yet. Share your short link to gather statistics!
                  </p>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Breakdown Grids */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {/* 2. Browser Breakdown */}
            <motion.div variants={itemVariants}>
              <Card className="space-y-4 h-full" shadowSize="sm">
                <h2 className="text-sm font-anton uppercase tracking-wider text-primary flex items-center gap-2 border-b-2 border-primary pb-2">
                  <Monitor size={16} className="text-primary" />
                  Browser Breakdown
                </h2>
                <div className="space-y-4">
                  {/* Browser Pie Chart */}
                  <div onClick={() => setActiveStatModal('browser')} className="h-60 w-full flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity" title="Click to view/download/share chart">
                    {stats.browsers.some(b => b.value > 0) ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={stats.browsers.filter(b => b.value > 0)}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {stats.browsers.filter(b => b.value > 0).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={['#00322d', '#2c6956', '#636037', '#ba1a1a', '#004b44', '#bfc9c6'][index % 6]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ background: '#f8faf5', borderRadius: '0px', border: '2px solid #00322d', fontSize: '11px', fontFamily: 'Space Mono', color: '#00322d' }}
                          />
                          <Legend verticalAlign="bottom" height={36} iconType="square" iconSize={8} wrapperStyle={{ fontSize: '10px', fontFamily: 'Space Mono' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="font-space text-xs font-semibold text-on-surface-variant text-center py-8 select-none border-2 border-dashed border-primary/10 bg-surface-container-low/20 flex flex-col items-center justify-center space-y-2 w-full h-full">
                        <img src={publicImg} alt="" className="h-10 w-auto object-contain shadow-none" />
                        <span>No browser clicks recorded</span>
                      </div>
                    )}
                  </div>

                  {stats.browsers.length > 0 && stats.browsers.some(b => b.value > 0) && (
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-b-2 border-primary font-space text-[10px] font-bold uppercase text-primary">
                          <th className="py-1.5 font-bold">Browser</th>
                          <th className="py-1.5 font-bold text-right">Clicks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-primary/20">
                        {stats.browsers.map((b) => (
                          <tr key={b.name} className="hover:bg-surface-container-low/40">
                            <td className="py-1.5 font-bold text-primary">{b.name}</td>
                            <td className="py-1.5 text-right font-bold text-primary">{b.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* 3. Device Breakdown */}
            <motion.div variants={itemVariants}>
              <Card className="space-y-4 h-full" shadowSize="sm">
                <h2 className="text-sm font-anton uppercase tracking-wider text-primary flex items-center gap-2 border-b-2 border-primary pb-2">
                  <Monitor size={16} className="text-primary" />
                  Device Breakdown
                </h2>
                <div className="space-y-4">
                  {/* Device Bar Chart */}
                  <div onClick={() => setActiveStatModal('device')} className="h-60 w-full flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity" title="Click to view/download/share chart">
                    {stats.devices.some(d => d.value > 0) ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.devices} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d8dbd6" />
                          <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={10} stroke="#00322d" style={{ fontFamily: 'Space Mono', fontWeight: 'bold' }} />
                          <YAxis tickLine={false} axisLine={false} fontSize={10} stroke="#00322d" style={{ fontFamily: 'Space Mono', fontWeight: 'bold' }} />
                          <Tooltip 
                            cursor={{ fill: 'rgba(44, 105, 86, 0.05)' }}
                            contentStyle={{ background: '#f8faf5', borderRadius: '0px', border: '2px solid #00322d', fontSize: '11px', fontFamily: 'Space Mono', color: '#00322d' }}
                          />
                          <Bar dataKey="value" fill="#00322d" radius={[0, 0, 0, 0]} barSize={28} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="font-space text-xs font-semibold text-on-surface-variant text-center py-8 select-none border-2 border-dashed border-primary/10 bg-surface-container-low/20 flex flex-col items-center justify-center space-y-2 w-full h-full">
                        <img src={publicImg} alt="" className="h-10 w-auto object-contain shadow-none" />
                        <span>No device clicks recorded</span>
                      </div>
                    )}
                  </div>

                  {stats.devices.length > 0 && stats.devices.some(d => d.value > 0) && (
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-b-2 border-primary font-space text-[10px] font-bold uppercase text-primary">
                          <th className="py-1.5 font-bold">Device</th>
                          <th className="py-1.5 font-bold text-right">Clicks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-primary/20">
                        {stats.devices.map((d) => (
                          <tr key={d.name} className="hover:bg-surface-container-low/40">
                            <td className="py-1.5 font-bold text-primary">{d.name}</td>
                            <td className="py-1.5 text-right font-bold text-primary">{d.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* 4. Daily Trends */}
            <motion.div variants={itemVariants}>
              <Card className="space-y-4 h-full" shadowSize="sm">
                <h2 className="text-sm font-anton uppercase tracking-wider text-primary flex items-center gap-2 border-b-2 border-primary pb-2">
                  <TrendingUp size={16} className="text-primary" />
                  Daily Trends Log
                </h2>
                <div className="space-y-4">
                  {/* Daily Trends Line Chart */}
                  <div onClick={() => setActiveStatModal('clicks')} className="h-60 w-full flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity" title="Click to view/download/share chart">
                    {stats.trends.some(t => t.clicks > 0) ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={stats.trends} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d8dbd6" />
                          <XAxis dataKey="formattedDate" tickLine={false} axisLine={false} fontSize={10} stroke="#00322d" style={{ fontFamily: 'Space Mono', fontWeight: 'bold' }} />
                          <YAxis tickLine={false} axisLine={false} fontSize={10} stroke="#00322d" style={{ fontFamily: 'Space Mono', fontWeight: 'bold' }} />
                          <Tooltip 
                            contentStyle={{ background: '#f8faf5', borderRadius: '0px', border: '2px solid #00322d', fontSize: '11px', fontFamily: 'Space Mono', color: '#00322d' }}
                          />
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
                      <div className="font-space text-xs font-semibold text-on-surface-variant text-center py-8 select-none border-2 border-dashed border-primary/10 bg-surface-container-low/20 flex flex-col items-center justify-center space-y-2 w-full h-full">
                        <img src={publicImg} alt="" className="h-10 w-auto object-contain shadow-none" />
                        <span>No click history logged</span>
                      </div>
                    )}
                  </div>

                  {stats.trends.length > 0 && stats.trends.some(t => t.clicks > 0) && (
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-b-2 border-primary font-space text-[10px] font-bold uppercase text-primary">
                          <th className="py-1.5 font-bold">Date</th>
                          <th className="py-1.5 font-bold text-right">Clicks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-primary/20 max-h-[150px] overflow-y-auto">
                        {stats.trends.map((t) => (
                          <tr key={t.date} className="hover:bg-surface-container-low/40">
                            <td className="py-1.5 font-bold text-primary">{t.formattedDate || t.date}</td>
                            <td className="py-1.5 text-right font-bold text-primary">{t.clicks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </>
      ) : null}

      {/* Details Stats Modal viewer */}
      {activeStatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-[fadeIn_0.2s_ease-out] overflow-y-auto">
          <Card className="max-w-2xl w-full !bg-white border-2 border-primary space-y-6 !p-6 relative shadow-brutal-md max-h-[90vh] overflow-y-auto" dogEar>
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b-2 border-primary pb-3">
              <h3 className="font-anton text-lg uppercase tracking-wide text-primary flex items-center gap-2">
                <BarChart2 size={20} className="text-secondary" />
                {activeStatModal === 'clicks' && 'Clicks Traffic Log Detail'}
                {activeStatModal === 'browser' && 'Client Browser Profile Detail'}
                {activeStatModal === 'device' && 'Visitor Device Profile Detail'}
                {activeStatModal === 'quality' && 'Traffic Health & Quality Detail'}
              </h3>
              <button
                onClick={() => setActiveStatModal(null)}
                className="text-primary hover:text-secondary transition-colors"
                title="Close stats modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body depending on mode */}
            <div className="space-y-4">
              {activeStatModal === 'clicks' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div id="clicks-chart-container" className="h-64 w-full border border-primary/15 bg-surface-container-low/20 p-2 rounded-lg">
                      {stats.trends.some(t => t.clicks > 0) ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={stats.trends} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d8dbd6" />
                            <XAxis dataKey="formattedDate" tickLine={false} axisLine={false} fontSize={10} stroke="#00322d" style={{ fontFamily: 'Space Mono', fontWeight: 'bold' }} />
                            <YAxis tickLine={false} axisLine={false} fontSize={10} stroke="#00322d" style={{ fontFamily: 'Space Mono', fontWeight: 'bold' }} />
                            <Tooltip contentStyle={{ background: '#f8faf5', border: '2px solid #00322d', fontSize: '11px', fontFamily: 'Space Mono', color: '#00322d' }} />
                            <Line type="monotone" dataKey="clicks" stroke="#00322d" strokeWidth={2} dot={{ stroke: '#00322d', strokeWidth: 1, r: 2.5, fill: 'white' }} activeDot={{ r: 4 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-xs font-semibold text-on-surface-variant uppercase">No click history logged</div>
                      )}
                    </div>
                    {stats.trends.some(t => t.clicks > 0) && (
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
                        {stats.trends.map((t, idx) => (
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
                      {stats.browsers.some(b => b.value > 0) ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={stats.browsers.filter(b => b.value > 0)} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={3} dataKey="value">
                              {stats.browsers.filter(b => b.value > 0).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={['#00322d', '#2c6956', '#636037', '#ba1a1a', '#004b44', '#bfc9c6'][index % 6]} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={{ background: '#f8faf5', border: '2px solid #00322d', fontSize: '11px', fontFamily: 'Space Mono', color: '#00322d' }} />
                            <Legend verticalAlign="bottom" height={36} iconType="square" iconSize={8} wrapperStyle={{ fontSize: '10px', fontFamily: 'Space Mono' }} />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="text-xs font-semibold text-on-surface-variant uppercase">No browser clicks recorded</div>
                      )}
                    </div>
                    {stats.browsers.some(b => b.value > 0) && (
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
                        {stats.browsers.map((b, idx) => (
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
                      {stats.devices.some(d => d.value > 0) ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={stats.devices} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d8dbd6" />
                            <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={10} stroke="#00322d" style={{ fontFamily: 'Space Mono', fontWeight: 'bold' }} />
                            <YAxis tickLine={false} axisLine={false} fontSize={10} stroke="#00322d" style={{ fontFamily: 'Space Mono', fontWeight: 'bold' }} />
                            <Tooltip cursor={{ fill: 'rgba(44, 105, 86, 0.05)' }} contentStyle={{ background: '#f8faf5', border: '2px solid #00322d', fontSize: '11px', fontFamily: 'Space Mono', color: '#00322d' }} />
                            <Bar dataKey="value" fill="#00322d" radius={[0, 0, 0, 0]} barSize={28} />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-xs font-semibold text-on-surface-variant uppercase">No device clicks recorded</div>
                      )}
                    </div>
                    {stats.devices.some(d => d.value > 0) && (
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
                        {stats.devices.map((d, idx) => (
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

              {activeStatModal === 'quality' && (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="border border-primary/20 p-4 bg-surface-container-low rounded-md">
                      <p className="text-[10px] font-semibold uppercase text-on-surface-variant tracking-wider">Human Clicks</p>
                      <p className="text-3xl font-anton text-primary">{stats.humanClicks || 0}</p>
                    </div>
                    <div className="border border-primary/20 p-4 bg-surface-container-low rounded-md">
                      <p className="text-[10px] font-semibold uppercase text-on-surface-variant tracking-wider">Bot Clicks</p>
                      <p className="text-3xl font-anton text-error">{stats.botClicks || 0}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-surface-container-low border border-primary border-t-4">
                    <CheckCircle2 size={20} className="text-secondary mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold font-space uppercase text-primary">Traffic Verification health</h4>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        {qualityScore >= 80 
                          ? `Excellent health! ${qualityScore}% of redirection visits are verified human interactions with minimal automated crawlers.` 
                          : `Warning: Heavy crawler crawler activity detected. ${100 - qualityScore}% of actions originate from spiders, crawlers, or automated requests.`}
                      </p>
                    </div>
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
export { PublicStatsPage }
