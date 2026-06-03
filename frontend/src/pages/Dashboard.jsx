import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import {
  BarChart3,
  AlertTriangle,
  Link2,
  Play,
  HelpCircle,
  Zap,
  TrendingUp,
  Users,
  Copy,
  ArrowRight,
  Calendar
} from 'lucide-react'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import Card from '../components/ui/Card.jsx'
import Input from '../components/ui/Input.jsx'
import Button from '../components/ui/Button.jsx'
import { useUrls } from '../hooks/useUrls.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useSocket } from '../context/SocketContext.jsx'
import { createUrlSchema } from '../schemas/urlSchemas.js'
import { ENV } from '../constants/env.js'
import toast from 'react-hot-toast'
import dashboardImg from '../assets/dashboardjsx.png'
import dashboardNoDataImg from '../assets/dashbardnodata.png'

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

const Dashboard = () => {
  const { urls, setUrls, isLoading, createLoading, fetchUrls, addUrl } = useUrls()
  const { user } = useAuth()
  const socket = useSocket()

  useEffect(() => {
    fetchUrls()
  }, [fetchUrls])

  useEffect(() => {
    if (!socket) return

    const handleRealTimeClick = (data) => {
      setUrls((prevUrls) =>
        prevUrls.map((item) =>
          item._id === data.urlId ? { ...item, clickCount: data.totalClicks } : item
        )
      )
    }

    socket.on('click', handleRealTimeClick)
    return () => {
      socket.off('click', handleRealTimeClick)
    }
  }, [socket, setUrls])

  // Setup Quick Shorten Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createUrlSchema),
    defaultValues: {
      originalUrl: '',
      customAlias: '',
      expiresAt: '',
    },
  })

  const onQuickShortenSubmit = async (data) => {
    const payload = {
      originalUrl: data.originalUrl.trim(),
      customAlias: data.customAlias?.trim() === '' ? undefined : data.customAlias.trim(),
      expiresAt: data.expiresAt === '' ? undefined : new Date(data.expiresAt).toISOString(),
    }

    try {
      await addUrl(payload)
      reset()
    } catch (_err) {
      // Errors handled in hook
    }
  }

  const handleCopy = (shortCode) => {
    const shortUrl = `${ENV.VITE_API_URL}/r/${shortCode}`
    navigator.clipboard.writeText(shortUrl)
    toast.success('URL copied to clipboard!')
  }

  const now = new Date()

  // Calculate dynamic dashboard stats
  const totalUrls = urls.length
  const activeUrls = urls.filter((u) => !u.expiresAt || new Date(u.expiresAt) > now).length
  const expiredUrls = urls.filter((u) => u.expiresAt && new Date(u.expiresAt) < now).length
  const totalClicks = urls.reduce((sum, u) => sum + (u.clickCount || 0), 0)

  // Calculate dynamic weekly growth rate based on created links clicks
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

  const linksCreatedThisWeek = urls.filter(u => new Date(u.createdAt) > oneWeekAgo).length

  const clicksThisWeek = urls
    .filter(u => new Date(u.createdAt) > oneWeekAgo)
    .reduce((sum, u) => sum + (u.clickCount || 0), 0)
  const clicksLastWeek = urls
    .filter(u => new Date(u.createdAt) > twoWeeksAgo && new Date(u.createdAt) <= oneWeekAgo)
    .reduce((sum, u) => sum + (u.clickCount || 0), 0)

  let clickGrowth = 0
  if (clicksLastWeek > 0) {
    clickGrowth = Math.round(((clicksThisWeek - clicksLastWeek) / clicksLastWeek) * 100)
  } else if (clicksThisWeek > 0) {
    clickGrowth = 100
  }

  // Sort recent URLs to display latest 5
  const recentLinks = [...urls]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  // Quota calculation (mocking a 100 links active limit)
  const quotaPercent = Math.min((activeUrls / 100) * 100, 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="space-y-8"
    >
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-outline-variant pb-6">
        <div className="space-y-3">
          <p className="label-overline">Workspace</p>
          <h1 className="heading-page">Link Workspace</h1>
          <p className="text-base font-medium text-on-surface-variant max-w-2xl">
            Shorten, track, and organize your digital trails with paper-thin precision.
          </p>
        </div>
        <div className="flex-shrink-0">
          <img src={dashboardImg} alt="" className="h-20 w-auto object-contain shadow-none" />
        </div>
      </div>

      {/* Dynamic Colored Stat Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {/* Total Links Card */}
        <motion.div variants={itemVariants} whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Card className="flex flex-col justify-between h-36 !p-6 border-t-4 border-t-primary" shadowSize="sm">
            <div className="flex items-center justify-between text-primary">
              <span className="text-sm font-semibold uppercase tracking-wider text-on-surface-variant/80">Total Links</span>
              <Link2 size={20} />
            </div>
            <div className="space-y-1">
              <h3 className="text-4xl font-anton text-primary leading-none tracking-tight">{totalUrls}</h3>
              <p className="code-label">{linksCreatedThisWeek} created this week</p>
            </div>
          </Card>
        </motion.div>

        {/* Total Clicks Card */}
        <motion.div variants={itemVariants} whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Card className="flex flex-col justify-between h-36 !p-6 !bg-secondary-container/20 border-t-4 border-t-secondary" shadowSize="sm">
            <div className="flex items-center justify-between text-on-secondary-container">
              <span className="text-sm font-semibold uppercase tracking-wider text-on-secondary-container/80">Total Clicks</span>
              <BarChart3 size={20} className="text-on-secondary-container" />
            </div>
            <div className="space-y-1">
              <h3 className="text-4xl font-anton text-on-secondary-container leading-none tracking-tight">{totalClicks}</h3>
              <p className="code-label !text-on-secondary-container/80">Accumulated user visits</p>
            </div>
          </Card>
        </motion.div>

        {/* Active Links Card */}
        <motion.div variants={itemVariants} whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Card className="flex flex-col justify-between h-36 !p-6 !bg-tertiary-container/20 border-t-4 border-t-tertiary" shadowSize="sm">
            <div className="flex items-center justify-between text-tertiary">
              <span className="text-sm font-semibold uppercase tracking-wider text-on-tertiary-container/80">Active Links</span>
              <Play size={20} className="text-on-tertiary-container" />
            </div>
            <div className="space-y-1">
              <h3 className="text-4xl font-anton text-on-tertiary-container leading-none tracking-tight">{activeUrls}</h3>
              <p className="code-label !text-on-tertiary-container/80">Verified active routes</p>
            </div>
          </Card>
        </motion.div>

        {/* Click Growth % Card */}
        <motion.div variants={itemVariants} whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Card className={clsx(
            "flex flex-col justify-between h-36 !p-6 border-t-4",
            clickGrowth >= 0 ? "!bg-secondary-container/20 border-t-secondary" : "!bg-error-container/20 border-t-error"
          )} shadowSize="sm">
            <div className={clsx(
              "flex items-center justify-between",
              clickGrowth >= 0 ? "text-on-secondary-container" : "text-on-error-container"
            )}>
              <span className={clsx(
                "text-sm font-semibold uppercase tracking-wider",
                clickGrowth >= 0 ? "text-on-secondary-container/80" : "text-on-error-container/80"
              )}>Click Growth</span>
              <TrendingUp size={20} />
            </div>
            <div className="space-y-1">
              <h3 className={clsx(
                "text-4xl font-anton leading-none tracking-tight",
                clickGrowth >= 0 ? "text-on-secondary-container" : "text-on-error-container"
              )}>
                {clickGrowth >= 0 ? '+' : ''}{clickGrowth}%
              </h3>
              <p className={clsx(
                "code-label",
                clickGrowth >= 0 ? "!text-on-secondary-container/85" : "!text-on-error-container/85"
              )}>
                {clickGrowth >= 0 ? 'Increase' : 'Decrease'} in weekly click momentum
              </p>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Main Two-Column Content Grid */}
      <div className="grid gap-8 lg:grid-cols-[2.1fr_0.9fr]">
        {/* Left Column: Quick Shorten + Recent Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Quick Shorten Card */}
          <Card className="space-y-5" dogEar shadowSize="md">
            <div className="border-b-2 border-primary pb-3 flex items-center gap-2">
              <Zap size={20} className="text-primary" />
              <h2 className="heading-section">Quick Shorten</h2>
            </div>

            <form onSubmit={handleSubmit(onQuickShortenSubmit)} className="space-y-5">
              <div className="grid gap-5 grid-cols-1 sm:grid-cols-6 lg:grid-cols-12">
                <div className="sm:col-span-6 lg:col-span-6">
                  <Input
                    label="Destination URL"
                    placeholder="https://your-long-link.com/really-long-path"
                    error={errors.originalUrl?.message}
                    {...register('originalUrl')}
                  />
                </div>
                <div className="sm:col-span-3 lg:col-span-3">
                  <Input
                    label="Custom Alias (Optional)"
                    placeholder="alias"
                    error={errors.customAlias?.message}
                    {...register('customAlias')}
                  />
                </div>
                <div className="sm:col-span-3 lg:col-span-3">
                  <Input
                    label="Expiration Date (Optional)"
                    type="date"
                    error={errors.expiresAt?.message}
                    {...register('expiresAt')}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pt-2">
                <span className="code-label">
                  * Custom back-halves increase click trust
                </span>
                <Button
                  type="submit"
                  loading={createLoading}
                  size="lg"
                  className="w-full md:w-auto"
                >
                  Snip It
                </Button>
              </div>
            </form>
          </Card>

          {/* Recent Links Table Card */}
          <Card className="space-y-5" shadowSize="md">
            <div className="border-b-2 border-primary pb-3 flex items-center justify-between">
              <h2 className="heading-section">Latest Trails</h2>
              <Link
                to="/urls"
                className="flex items-center gap-1.5 text-xs font-semibold uppercase text-secondary hover:text-primary transition-colors"
              >
                View All <ArrowRight size={14} />
              </Link>
            </div>

            {isLoading && urls.length === 0 ? (
              <div className="py-16 text-center code-label">
                Loading links list...
              </div>
            ) : recentLinks.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center border border-dashed border-primary bg-surface-container-low rounded-lg space-y-4">
                <img src={dashboardNoDataImg} alt="" className="h-16 w-auto object-contain shadow-none" />
                <p className="code-label">No shortened links found. Shorten your first link above!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Desktop/Tablet Table */}
                <div className="hidden md:block overflow-x-auto border-2 border-primary bg-white rounded-lg overflow-hidden">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b-2 border-primary text-[11px] font-semibold uppercase text-primary bg-surface-container-low tracking-wider">
                        <th className="p-3.5 font-semibold">Short Link</th>
                        <th className="p-3.5 font-semibold">Original URL</th>
                        <th className="p-3.5 font-semibold text-center">Clicks</th>
                        <th className="p-3.5 font-semibold">Status</th>
                        <th className="p-3.5 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-primary/15">
                      {recentLinks.map((link, idx) => {
                        const isExpired = link.expiresAt && new Date(link.expiresAt) < now;
                        const displayShortUrl = `${ENV.VITE_API_URL}/r/${link.shortCode}`;
                        return (
                          <tr key={link._id} className={clsx(
                            'transition-colors hover:bg-surface-container-low/60',
                            idx % 2 === 0 ? 'bg-white' : 'bg-surface-container-low/40'
                          )}>
                            <td className="p-3.5 font-semibold text-primary max-w-[150px] truncate">
                              <a href={displayShortUrl} target="_blank" rel="noopener noreferrer" className="hover:underline text-secondary font-mono">
                                /{link.shortCode}
                              </a>
                            </td>
                            <td className="p-3.5 text-on-surface-variant truncate max-w-[220px]" title={link.originalUrl}>
                              {link.originalUrl}
                            </td>
                            <td className="p-3.5 text-center font-semibold text-primary font-mono text-base">
                              {link.clickCount ?? 0}
                            </td>
                            <td className="p-3.5">
                              <span className={clsx(
                                'inline-block rounded-none border-2 px-2 py-0.5 text-[10px] font-bold font-space uppercase',
                                isExpired
                                  ? 'border-error bg-error/10 text-error'
                                  : 'border-secondary bg-secondary-container/30 text-secondary'
                              )}>
                                {isExpired ? 'EXPIRED' : 'ACTIVE'}
                              </span>
                            </td>
                            <td className="p-3.5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  onClick={() => handleCopy(link.shortCode)}
                                  variant="secondary"
                                  size="sm"
                                  className="!h-8 !w-8 !p-0"
                                  title="Copy Short URL"
                                  aria-label="Copy Short URL"
                                >
                                  <Copy size={14} />
                                </Button>
                                <Button
                                  as={Link}
                                  to={`/analytics/${link._id}`}
                                  variant="primary"
                                  size="sm"
                                  className="!h-8 !px-3 text-[10px] uppercase font-semibold"
                                >
                                  Analytics
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards Stack */}
                <div className="block md:hidden space-y-4">
                  {recentLinks.map((link) => {
                    const isExpired = link.expiresAt && new Date(link.expiresAt) < now;
                    const displayShortUrl = `${ENV.VITE_API_URL}/r/${link.shortCode}`;
                    return (
                      <Card key={link._id} className="p-4 space-y-3" shadowSize="sm">
                        <div className="flex items-center justify-between">
                          <a href={displayShortUrl} target="_blank" rel="noopener noreferrer" className="hover:underline text-secondary font-anton text-base">
                            /{link.shortCode}
                          </a>
                          <span className={clsx(
                            'inline-block rounded-none border-2 px-2 py-0.5 text-[9px] font-bold font-space uppercase',
                            isExpired
                              ? 'border-error bg-error/10 text-error'
                              : 'border-secondary bg-secondary-container/30 text-secondary'
                          )}>
                            {isExpired ? 'EXPIRED' : 'ACTIVE'}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold uppercase text-on-surface-variant/60 font-space">Original URL</p>
                          <p className="text-xs text-on-surface-variant font-medium break-all select-all">{link.originalUrl}</p>
                        </div>
                        <div className="flex items-center justify-between border-t border-primary/10 pt-3">
                          <div className="space-y-0.5">
                            <p className="text-[10px] font-bold uppercase text-on-surface-variant/60 font-space">Clicks</p>
                            <p className="font-anton text-lg text-primary">{link.clickCount ?? 0}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleCopy(link.shortCode)}
                              variant="secondary"
                              size="sm"
                              className="!h-9 !px-3 text-xs"
                              title="Copy Short URL"
                              aria-label="Copy Short URL"
                            >
                              <Copy size={13} />
                            </Button>
                            <Button
                              as={Link}
                              to={`/analytics/${link._id}`}
                              variant="primary"
                              size="sm"
                              className="!h-9 !px-4 text-[10px] uppercase font-semibold"
                            >
                              Analytics
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Right Column: Widgets / Side Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-8"
        >
          {/* Lynko's Wisdom Card */}
          <Card className="space-y-5 !bg-surface-container border-2 border-primary" shadowSize="sm">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-primary border-b-2 border-primary pb-2 tracking-wider">
              <HelpCircle size={16} />
              <span>Lynko's Wisdom</span>
            </div>

            {/* Visual Mascot character block */}
            <div className="flex items-center gap-4 bg-white p-4 border border-primary rounded-md">
              <pre className="font-mono text-xs font-bold text-primary leading-none select-none">
                {`   /\\_/\\
  ( o.o )
   > ^ <`}
              </pre>
              <div className="text-[11px] font-semibold uppercase text-on-surface-variant">
                Master Scribe Mascot
              </div>
            </div>

            <p className="text-sm font-medium text-primary italic leading-relaxed">
              "Did you know? Short links with custom back-halves get up to 40% more clicks. Your brand is your ink, make it permanent!"
            </p>

            <Link
              to="/urls"
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase text-secondary hover:text-primary hover:underline transition-colors"
            >
              Learn More <ArrowRight size={12} />
            </Link>
          </Card>

          {/* Global Stats / Quota progress */}
          <Card className="space-y-4" shadowSize="sm">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold uppercase text-primary tracking-wider">Global Stats</span>
              <span className="font-mono text-[10px] font-semibold text-on-surface-variant uppercase">
                {activeUrls} / 100 Quota
              </span>
            </div>

            {/* Mini stat grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-primary p-3 bg-surface-container-low rounded-md">
                <p className="text-[10px] font-semibold uppercase text-on-surface-variant tracking-wider">Active Links</p>
                <p className="text-2xl font-anton text-primary">{activeUrls}</p>
              </div>
              <div className="border border-primary p-3 bg-surface-container-low rounded-md">
                <p className="text-[10px] font-semibold uppercase text-on-surface-variant tracking-wider">Total Clicks</p>
                <p className="text-2xl font-anton text-primary">{totalClicks}</p>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-[10px] font-semibold uppercase text-on-surface-variant tracking-wider">Monthly Quota</span>
                <span className="font-mono text-[10px] font-semibold text-primary">{activeUrls} / 100</span>
              </div>
              <div className="w-full bg-surface-container-low border border-primary rounded-pill h-3.5 overflow-hidden">
                <div
                  className="bg-secondary h-full transition-all duration-300 rounded-pill"
                  style={{ width: `${quotaPercent}%` }}
                />
              </div>
            </div>
          </Card>

        </motion.div>
      </div>
    </motion.div>
  )
}

export default Dashboard
