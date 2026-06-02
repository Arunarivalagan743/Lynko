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
  ArrowRight
} from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import Input from '../components/ui/Input.jsx'
import Button from '../components/ui/Button.jsx'
import { useUrls } from '../hooks/useUrls.js'
import { useAuth } from '../context/AuthContext.jsx'
import { createUrlSchema } from '../schemas/urlSchemas.js'
import { ENV } from '../constants/env.js'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const { urls, isLoading, createLoading, fetchUrls, addUrl } = useUrls()
  const { user } = useAuth()

  useEffect(() => {
    fetchUrls()
  }, [fetchUrls])

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

  // Sort recent URLs to display latest 5
  const recentLinks = [...urls]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  // Quota calculation (mocking a 100 links active limit)
  const quotaPercent = Math.min((activeUrls / 100) * 100, 100)

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-3">
        <p className="label-overline">Workspace</p>
        <h1 className="heading-page">Link Workspace</h1>
        <p className="text-base font-medium text-on-surface-variant">
          Shorten, track, and organize your digital trails with paper-thin precision.
        </p>
      </div>

      {/* Dynamic Colored Stat Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Links Card */}
        <Card className="flex flex-col justify-between !p-6 space-y-4" shadowSize="sm" hover>
          <div className="flex items-center justify-between text-primary">
            <span className="font-space text-xs font-bold uppercase tracking-wider">Total Links</span>
            <Link2 size={20} />
          </div>
          <div className="space-y-1">
            <h3 className="text-4xl font-anton text-primary">{totalUrls}</h3>
            <p className="label-meta">Redirections active</p>
          </div>
        </Card>

        {/* Active Links Card */}
        <Card className="flex flex-col justify-between !p-6 space-y-4 !bg-secondary-container" shadowSize="sm" hover>
          <div className="flex items-center justify-between text-primary">
            <span className="font-space text-xs font-bold uppercase tracking-wider">Active Links</span>
            <Play size={20} />
          </div>
          <div className="space-y-1">
            <h3 className="text-4xl font-anton text-primary">{activeUrls}</h3>
            <p className="font-space text-[10px] font-bold uppercase text-on-secondary-container">Verified active links</p>
          </div>
        </Card>

        {/* Expired Links Card */}
        <Card className="flex flex-col justify-between !p-6 space-y-4 !bg-error-container" shadowSize="sm" hover>
          <div className="flex items-center justify-between text-error">
            <span className="font-space text-xs font-bold uppercase tracking-wider text-error">Expired Links</span>
            <AlertTriangle size={20} />
          </div>
          <div className="space-y-1">
            <h3 className="text-4xl font-anton text-error">{expiredUrls}</h3>
            <p className="font-space text-[10px] font-bold uppercase text-on-error-container">Inactive redirect routes</p>
          </div>
        </Card>

        {/* Total Clicks Card */}
        <Card className="flex flex-col justify-between !p-6 space-y-4 !bg-tertiary-container" shadowSize="sm" hover>
          <div className="flex items-center justify-between">
            <span className="font-space text-xs font-bold uppercase tracking-wider text-tertiary">Total Clicks</span>
            <BarChart3 size={20} className="text-tertiary" />
          </div>
          <div className="space-y-1">
            <h3 className="text-4xl font-anton text-tertiary">{totalClicks}</h3>
            <p className="font-space text-[10px] font-bold uppercase text-on-tertiary-container">Accumulated user visits</p>
          </div>
        </Card>
      </div>

      {/* Main Two-Column Content Grid */}
      <div className="grid gap-8 lg:grid-cols-[2.1fr_0.9fr]">
        {/* Left Column: Quick Shorten + Recent Links */}
        <div className="space-y-8">
          {/* Quick Shorten Card */}
          <Card className="space-y-5" dogEar shadowSize="md">
            <div className="border-b-2 border-primary pb-3 flex items-center gap-2">
              <Zap size={20} className="text-primary" />
              <h2 className="heading-section">Quick Shorten</h2>
            </div>
            
            <form onSubmit={handleSubmit(onQuickShortenSubmit)} className="space-y-5">
              <div className="grid gap-5 md:grid-cols-[2fr_1fr]">
                <Input
                  label="Destination URL"
                  placeholder="https://your-long-boring-link.com/really-long-path"
                  error={errors.originalUrl?.message}
                  {...register('originalUrl')}
                />
                <Input
                  label="Custom Alias (Optional)"
                  placeholder="alias"
                  error={errors.customAlias?.message}
                  {...register('customAlias')}
                />
              </div>

              <div className="flex items-center justify-between gap-4 pt-2">
                <span className="label-meta">
                  * Custom back-halves increase click trust
                </span>
                <Button
                  type="submit"
                  loading={createLoading}
                  size="xl"
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
                className="flex items-center gap-1.5 font-space text-xs font-bold uppercase text-secondary hover:text-primary transition-colors"
              >
                View All <ArrowRight size={14} />
              </Link>
            </div>

            {isLoading && urls.length === 0 ? (
              <div className="py-16 text-center label-meta">
                Loading links list...
              </div>
            ) : recentLinks.length === 0 ? (
              <div className="py-16 text-center border-2 border-dashed border-primary bg-surface-container-low label-meta">
                No shortened links found. Shorten your first link above!
              </div>
            ) : (
              <div className="overflow-x-auto border-2 border-primary bg-white rounded-none">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2 border-primary font-space text-[11px] font-bold uppercase text-primary bg-surface-container-low">
                      <th className="p-3.5 font-bold">Short Link</th>
                      <th className="p-3.5 font-bold">Original URL</th>
                      <th className="p-3.5 font-bold text-center">Clicks</th>
                      <th className="p-3.5 font-bold">Status</th>
                      <th className="p-3.5 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/15">
                    {recentLinks.map((link, idx) => {
                      const isExpired = link.expiresAt && new Date(link.expiresAt) < now;
                      const displayShortUrl = `${ENV.VITE_API_URL}/r/${link.shortCode}`;
                      return (
                        <tr key={link._id} className={idx % 2 === 0 ? 'bg-white' : 'bg-surface-container-low/40'}>
                          <td className="p-3.5 font-bold text-primary max-w-[150px] truncate">
                            <a href={displayShortUrl} target="_blank" rel="noopener noreferrer" className="hover:underline text-secondary">
                              /{link.shortCode}
                            </a>
                          </td>
                          <td className="p-3.5 text-on-surface-variant truncate max-w-[220px]" title={link.originalUrl}>
                            {link.originalUrl}
                          </td>
                          <td className="p-3.5 text-center font-bold text-primary font-space text-base">
                            {link.clickCount ?? 0}
                          </td>
                          <td className="p-3.5">
                            <span className={`inline-block rounded-none border-2 px-2 py-0.5 text-[10px] font-bold font-space uppercase ${
                              isExpired
                                ? 'border-error bg-error/10 text-error'
                                : 'border-secondary bg-secondary-container/30 text-secondary'
                            }`}>
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
                              >
                                <Copy size={14} />
                              </Button>
                              <Button
                                as={Link}
                                to={`/analytics/${link._id}`}
                                variant="primary"
                                size="sm"
                                className="!h-8 !px-3 text-[10px] font-space uppercase"
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
            )}
          </Card>
        </div>

        {/* Right Column: Widgets / Side Info */}
        <div className="space-y-8">
          {/* Lynko's Wisdom Card */}
          <Card className="space-y-5 !bg-surface-container border-2 border-primary" shadowSize="sm">
            <div className="flex items-center gap-2 font-space text-xs font-bold uppercase text-primary border-b-2 border-primary pb-2">
              <HelpCircle size={16} />
              <span>Lynko's Wisdom</span>
            </div>
            
            {/* Visual Mascot character block */}
            <div className="flex items-center gap-4 bg-white p-4 border-2 border-primary rounded-none">
              <pre className="font-mono text-xs font-bold text-primary leading-none select-none">
{`   /\\_/\\
  ( o.o )
   > ^ <`}
              </pre>
              <div className="text-[11px] font-space font-bold uppercase text-on-surface-variant">
                Master Scribe Mascot
              </div>
            </div>

            <p className="text-sm font-medium text-primary italic leading-relaxed">
              "Did you know? Short links with custom back-halves get up to 40% more clicks. Your brand is your ink, make it permanent!"
            </p>
            
            <Link 
              to="/urls" 
              className="inline-flex items-center gap-1.5 font-space text-[11px] font-bold uppercase text-secondary hover:text-primary hover:underline transition-colors"
            >
              Learn More <ArrowRight size={12} />
            </Link>
          </Card>

          {/* Global Stats / Quota progress */}
          <Card className="space-y-4" shadowSize="sm">
            <div className="flex justify-between items-center">
              <span className="font-space text-xs font-bold uppercase text-primary">Global Stats</span>
              <span className="font-space text-[11px] font-bold text-on-surface-variant uppercase">
                {activeUrls} / 100 Quota
              </span>
            </div>

            {/* Mini stat grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="border-2 border-primary p-3 bg-surface-container-low">
                <p className="font-space text-[10px] font-bold uppercase text-on-surface-variant">Active Links</p>
                <p className="text-2xl font-anton text-primary">{activeUrls}</p>
              </div>
              <div className="border-2 border-primary p-3 bg-surface-container-low">
                <p className="font-space text-[10px] font-bold uppercase text-on-surface-variant">Total Clicks</p>
                <p className="text-2xl font-anton text-primary">{totalClicks}</p>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="font-space text-[10px] font-bold uppercase text-on-surface-variant">Monthly Quota</span>
                <span className="font-space text-[10px] font-bold text-primary">{activeUrls} / 100</span>
              </div>
              <div className="w-full bg-surface-container-low border-2 border-primary rounded-none h-3.5 overflow-hidden">
                <div 
                  className="bg-secondary h-full transition-all duration-300"
                  style={{ width: `${quotaPercent}%` }}
                />
              </div>
            </div>
          </Card>

          {/* Upgrade Call to Action */}
          <Card className="!bg-primary text-white space-y-5 border-2 border-primary" shadowSize="md">
            <div className="space-y-2">
              <h3 className="text-xl font-anton uppercase tracking-wide leading-none text-white">
                Run Out Of Paper?
              </h3>
              <p className="text-sm text-surface-container-low font-medium leading-relaxed">
                Get unlimited short links, team permission controls, and API access with the Master Scribe plan.
              </p>
            </div>
            
            <Button
              as="a"
              href="#pricing"
              variant="secondary"
              size="xl"
              className="w-full !bg-white !text-primary !border-primary text-center"
            >
              Upgrade Now
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
