import React, { useState, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-hot-toast'
import { useSearchParams } from 'react-router-dom'
import { 
  Copy, 
  Edit, 
  Trash2, 
  Calendar, 
  QrCode, 
  Search, 
  Plus, 
  X, 
  ExternalLink,
  Loader2,
  MousePointerClick,
  Sparkles
} from 'lucide-react'
import { useUrls } from '../hooks/useUrls.js'
import { createUrlSchema, updateUrlSchema } from '../schemas/urlSchemas.js'
import { ENV } from '../constants/env.js'
import Card from '../components/ui/Card.jsx'
import Input from '../components/ui/Input.jsx'
import Button from '../components/ui/Button.jsx'
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx'

const SUPPORTED_PLATFORMS = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'twitter', label: 'Twitter' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'telegram', label: 'Telegram' },
]

export default function UrlsPage() {
  const {
    urls,
    isLoading,
    error,
    createLoading,
    updateLoading,
    deleteLoading,
    fetchUrls,
    addUrl,
    modifyUrl,
    removeUrl,
  } = useUrls()

  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get('q') || ''
  const setSearchQuery = (val) => {
    if (val) {
      setSearchParams({ q: val })
    } else {
      setSearchParams({})
    }
  }
  const [editingId, setEditingId] = useState(null)
  const [confirmState, setConfirmState] = useState({ open: false, action: null })
  const [createdUrlResult, setCreatedUrlResult] = useState(null)
  const [expandedPlatformLinks, setExpandedPlatformLinks] = useState({})

  const editingLink = useMemo(
    () => urls.find((link) => link._id === editingId) || null,
    [editingId, urls]
  )

  // Fetch URLs on mount
  useEffect(() => {
    fetchUrls()
  }, [fetchUrls])

  // Form for URL Creation
  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreate,
    formState: { errors: createErrors },
  } = useForm({
    resolver: zodResolver(createUrlSchema),
    defaultValues: {
      originalUrl: '',
      customAlias: '',
      expiresAt: '',
      platforms: [],
    },
  })

  // Form for URL Updates
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: editErrors },
  } = useForm({
    resolver: zodResolver(updateUrlSchema),
    defaultValues: {
      originalUrl: '',
      expiresAt: '',
      platforms: [],
    },
  })

  // Handle URL Creation Submission
  const onCreateSubmit = async (data) => {
    // Strip empty strings for customAlias and expiresAt
    const payload = {
      originalUrl: data.originalUrl.trim(),
      customAlias: data.customAlias?.trim() === '' ? undefined : data.customAlias.trim(),
      expiresAt: data.expiresAt === '' ? undefined : new Date(data.expiresAt).toISOString(),
      platforms: data.platforms || [],
    }

    try {
      const result = await addUrl(payload)
      if (result) {
        setCreatedUrlResult(result)
        resetCreate()
      }
    } catch (_err) {
      // Errors are handled inside hook via toast
    }
  }

  // Handle URL Editing Submission
  const onEditSubmit = async (data) => {
    const payload = {
      originalUrl: data.originalUrl?.trim() === '' ? undefined : data.originalUrl.trim(),
      expiresAt: data.expiresAt === '' ? undefined : new Date(data.expiresAt).toISOString(),
      platforms: data.platforms || [],
    }

    setConfirmState({
      open: true,
      action: {
        type: 'update',
        id: editingId,
        payload,
        link: editingLink,
      },
    })
  }

  // Set URL into Edit Mode
  const startEdit = (link) => {
    setEditingId(link._id)
    // Pre-fill edit form
    resetEdit({
      originalUrl: link.originalUrl,
      expiresAt: link.expiresAt ? new Date(link.expiresAt).toISOString().split('T')[0] : '',
      platforms: link.platforms || [],
    })
  }

  const closeConfirm = () => {
    if (updateLoading || deleteLoading) return
    setConfirmState({ open: false, action: null })
  }

  const handleConfirmAction = async () => {
    if (!confirmState.action) return

    if (confirmState.action.type === 'update') {
      try {
        await modifyUrl(confirmState.action.id, confirmState.action.payload)
        setEditingId(null)
        resetEdit()
        setConfirmState({ open: false, action: null })
      } catch (_err) {
        // Errors are handled inside hook
      }
      return
    }

    try {
      await removeUrl(confirmState.action.id)
      if (editingId === confirmState.action.id) {
        setEditingId(null)
        resetEdit()
      }
      setConfirmState({ open: false, action: null })
    } catch (_err) {
      // Errors are handled inside hook
    }
  }

  // Copy Short URL to Clipboard
  const handleCopy = (shortCode) => {
    const shortUrl = `${ENV.VITE_API_URL}/r/${shortCode}`
    navigator.clipboard.writeText(shortUrl)
    toast.success('URL copied to clipboard!')
  }

  // Filter URLs based on Search Input (highly effective search logic)
  const filteredUrls = urls.filter((link) => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return true

    const originalUrl = link.originalUrl?.toLowerCase() || ''
    const shortCode = link.shortCode?.toLowerCase() || ''
    const customAlias = link.customAlias?.toLowerCase() || ''
    const fullShortUrl = `${ENV.VITE_API_URL}/r/${shortCode}`.toLowerCase()

    // 1. Exact match on code/alias or contained in query (handles pasted links like "http://.../r/code")
    if (query.includes(shortCode) || (customAlias && query.includes(customAlias))) {
      return true
    }

    // 2. Query matches part of the destination URL, shortCode, customAlias, or full short URL
    return (
      originalUrl.includes(query) ||
      shortCode.includes(query) ||
      customAlias.includes(query) ||
      fullShortUrl.includes(query)
    )
  })

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-3">
        <p className="label-overline">Manage</p>
        <h1 className="heading-page">Link Management</h1>
        <p className="text-base font-medium text-on-surface-variant">Shorten, update, delete, or analyze link details.</p>
      </div>

      {error && (
        <div className="rounded-none border-2 border-error bg-white p-5 text-sm text-error font-space font-bold shadow-brutal-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
        {/* Left Column: Create Form OR Edit Form OR Success View */}
        <div className="space-y-8">
          {createdUrlResult ? (
            <Card className="space-y-5" dogEar>
              <div className="border-b-2 border-primary pb-3 flex items-center justify-between">
                <h2 className="heading-section flex items-center gap-2 text-secondary">
                  <Sparkles size={20} className="text-secondary" />
                  Link Shortened!
                </h2>
                <button
                  onClick={() => setCreatedUrlResult(null)}
                  className="font-space text-xs font-bold uppercase text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
                >
                  <X size={14} /> Close
                </button>
              </div>

              <div className="space-y-4 font-space">
                <div>
                  <p className="text-[10px] font-bold uppercase text-on-surface-variant">Original Short URL</p>
                  <div className="flex items-center gap-2 mt-1 border-2 border-primary bg-surface-container-low p-2">
                    <span className="flex-1 text-sm font-semibold truncate">
                      {`${ENV.VITE_API_URL}/r/${createdUrlResult.shortCode}`}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${ENV.VITE_API_URL}/r/${createdUrlResult.shortCode}`)
                        toast.success('Short URL copied!')
                      }}
                      className="p-1.5 border border-primary bg-white hover:bg-surface-container-low transition-colors"
                      title="Copy short URL"
                    >
                      <Copy size={13} />
                    </button>
                  </div>
                </div>

                {createdUrlResult.platformLinks && createdUrlResult.platformLinks.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase text-on-surface-variant">Platform Tracking Links</p>
                    <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                      {createdUrlResult.platformLinks.map((pLink) => {
                        const colors = {
                          instagram: 'text-pink-500',
                          linkedin: 'text-blue-600',
                          twitter: 'text-sky-500',
                          facebook: 'text-blue-800',
                          whatsapp: 'text-green-500',
                          youtube: 'text-red-600',
                          telegram: 'text-cyan-500',
                        }
                        const pColor = colors[pLink.platform.toLowerCase()] || 'text-secondary'
                        const qrUrl = createdUrlResult.qrCodeDataUrl || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(pLink.shortUrl)}`

                        return (
                          <div key={pLink.platform} className="border-2 border-primary bg-white p-3 space-y-2 shadow-brutal-xs">
                            <div className="flex items-center justify-between">
                              <span className={`text-xs font-anton uppercase tracking-wide ${pColor}`}>{pLink.platform}</span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(pLink.shortUrl)
                                    toast.success(`${pLink.platform} link copied!`)
                                  }}
                                  className="p-1 border border-primary bg-white hover:bg-surface-container-low"
                                  title="Copy link"
                                >
                                  <Copy size={11} />
                                </button>
                                <a
                                  href={pLink.shortUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1 border border-primary bg-white hover:bg-surface-container-low text-primary"
                                  title="Open link"
                                >
                                  <ExternalLink size={11} />
                                </a>
                                <a
                                  href={qrUrl}
                                  download={`qr_${createdUrlResult.shortCode}_${pLink.platform}.png`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1 border border-primary bg-white hover:bg-surface-container-low text-primary"
                                  title="QR Code"
                                >
                                  <QrCode size={11} />
                                </a>
                              </div>
                            </div>
                            <p className="text-[11px] font-medium text-on-surface-variant break-all select-all font-sans leading-normal">
                              {pLink.shortUrl}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => setCreatedUrlResult(null)}
                  variant="primary"
                  className="w-full text-center mt-2"
                >
                  Shorten Another URL
                </Button>
              </div>
            </Card>
          ) : !editingId ? (
            <Card className="space-y-5">
              <h2 className="heading-section flex items-center gap-2 border-b-2 border-primary pb-3">
                <Plus size={20} className="text-primary" />
                Shorten a URL
              </h2>
              <form onSubmit={handleSubmitCreate(onCreateSubmit)} className="space-y-5">
                <Input
                  label="Long URL"
                  type="text"
                  placeholder="https://example.com/long-landing-page"
                  error={createErrors.originalUrl?.message}
                  {...registerCreate('originalUrl')}
                />

                <Input
                  label="Custom Alias (Optional)"
                  type="text"
                  placeholder="summer-promo"
                  error={createErrors.customAlias?.message}
                  {...registerCreate('customAlias')}
                />

                <Input
                  label="Expiration Date (Optional)"
                  type="date"
                  error={createErrors.expiresAt?.message}
                  {...registerCreate('expiresAt')}
                />

                <div className="space-y-2">
                  <label className="font-space text-xs font-bold uppercase tracking-wider text-primary">
                    Platform Tracking (Optional)
                  </label>
                  <div className="grid grid-cols-2 gap-2 border-2 border-primary bg-surface-container-low p-4">
                    {SUPPORTED_PLATFORMS.map((platform) => (
                      <label key={platform.id} className="flex items-center gap-2 font-space text-xs font-semibold text-primary cursor-pointer select-none">
                        <input
                          type="checkbox"
                          value={platform.id}
                          className="rounded-none border-2 border-primary text-secondary focus:ring-0 focus:ring-offset-0 h-4.5 w-4.5 cursor-pointer"
                          {...registerCreate('platforms')}
                        />
                        {platform.label}
                      </label>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  loading={createLoading}
                  size="xl"
                  className="w-full"
                >
                  Shorten URL
                </Button>
              </form>
            </Card>
          ) : (
            <Card className="space-y-5">
              <div className="flex items-center justify-between border-b-2 border-primary pb-3">
                <h2 className="heading-section flex items-center gap-2">
                  <Edit size={20} className="text-primary" />
                  Edit Link
                </h2>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="font-space text-xs font-bold uppercase text-on-surface-variant hover:text-primary flex items-center gap-1 transition-colors"
                >
                  <X size={14} /> Cancel
                </button>
              </div>
              <form onSubmit={handleSubmitEdit(onEditSubmit)} className="space-y-5">
                <Input
                  label="Long URL"
                  type="text"
                  error={editErrors.originalUrl?.message}
                  {...registerEdit('originalUrl')}
                />

                <Input
                  label="Expiration Date (Optional)"
                  type="date"
                  error={editErrors.expiresAt?.message}
                  {...registerEdit('expiresAt')}
                />

                <div className="space-y-2">
                  <label className="font-space text-xs font-bold uppercase tracking-wider text-primary">
                    Platform Tracking (Optional)
                  </label>
                  <div className="grid grid-cols-2 gap-2 border-2 border-primary bg-surface-container-low p-4">
                    {SUPPORTED_PLATFORMS.map((platform) => (
                      <label key={platform.id} className="flex items-center gap-2 font-space text-xs font-semibold text-primary cursor-pointer select-none">
                        <input
                          type="checkbox"
                          value={platform.id}
                          className="rounded-none border-2 border-primary text-secondary focus:ring-0 focus:ring-offset-0 h-4.5 w-4.5 cursor-pointer"
                          {...registerEdit('platforms')}
                        />
                        {platform.label}
                      </label>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  loading={updateLoading}
                  size="xl"
                  className="w-full"
                >
                  Save Updates
                </Button>
              </form>
            </Card>
          )}
        </div>

        {/* Right Column: Search + URLs list */}
        <div className="space-y-5">
          {/* Search bar */}
          <div className="relative w-full">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50" />
            <input
              type="text"
              placeholder="Search by long URL, code or custom alias..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-none border-2 border-primary bg-surface-container-lowest pl-12 pr-4 py-3 text-sm text-primary placeholder:text-on-surface-variant/40 focus:border-secondary focus:outline-none focus:ring-0 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-secondary transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {isLoading && urls.length === 0 ? (
            <div className="flex h-60 items-center justify-center text-primary text-sm border-2 border-primary rounded-none bg-surface-container-low font-space font-bold uppercase">
              <div className="flex items-center gap-2">
                <Loader2 size={18} className="animate-spin" />
                <span>Loading link database...</span>
              </div>
            </div>
          ) : filteredUrls.length === 0 ? (
            <div className="flex h-60 flex-col items-center justify-center text-center p-8 border-2 border-dashed border-primary rounded-none bg-surface-container-low space-y-3 font-space">
              <p className="text-sm font-bold text-primary uppercase">No shortened URLs found</p>
              <p className="text-xs text-on-surface-variant max-w-xs font-medium">
                {searchQuery
                  ? "We couldn't find any links matching your search filters."
                  : 'Start by inputting a destination URL in the creator panel to shorten your first link.'}
              </p>
            </div>
          ) : (
            <div className="space-y-5 max-h-[75vh] overflow-y-auto pr-1">
              {filteredUrls.map((link) => {
                const shortUrl = `${ENV.VITE_API_URL}/r/${link.shortCode}`
                const isLinkExpired = link.expiresAt && new Date(link.expiresAt) < new Date()
                const qrUrl = link.qrCodeDataUrl || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(shortUrl)}`

                return (
                  <Card key={link._id || link.shortCode} className="space-y-0 !p-0 overflow-hidden" shadowSize="sm" hover>
                    {/* Main content area */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6">
                      {/* Left: URLs info */}
                      <div className="space-y-2 flex-1 min-w-0">
                        {/* Status + time overline */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`inline-block rounded-none border-2 px-2.5 py-1 text-[10px] font-bold font-space uppercase ${
                            isLinkExpired
                              ? 'border-error bg-error/10 text-error'
                              : 'border-secondary bg-secondary-container/30 text-secondary'
                          }`}>
                            {isLinkExpired ? 'EXPIRED' : 'ACTIVE'}
                          </span>
                          <span className="font-space text-[11px] font-semibold text-on-surface-variant">
                            Created {new Date(link.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Short URL — hero text */}
                        <a
                          href={shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-2xl font-anton tracking-wide text-primary hover:text-secondary block truncate transition-colors"
                        >
                          /{link.shortCode}
                        </a>

                        {/* Original URL */}
                        <p className="text-sm text-on-surface-variant font-medium truncate select-all" title={link.originalUrl}>
                          {link.originalUrl}
                        </p>

                        {/* Platform Tracking Badges */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1.5 pb-0.5">
                          <span className="font-space text-[10px] font-bold uppercase text-on-surface-variant mr-1">
                            Platform Links:
                          </span>
                          {link.platforms && link.platforms.length > 0 ? (
                            link.platforms.map((p) => {
                              const colors = {
                                instagram: 'border-pink-500 text-pink-500 bg-pink-50 hover:bg-pink-100',
                                linkedin: 'border-blue-600 text-blue-600 bg-blue-50 hover:bg-blue-100',
                                twitter: 'border-sky-500 text-sky-500 bg-sky-50 hover:bg-sky-100',
                                facebook: 'border-blue-800 text-blue-800 bg-blue-50 hover:bg-blue-100',
                                whatsapp: 'border-green-500 text-green-500 bg-green-50 hover:bg-green-100',
                                youtube: 'border-red-600 text-red-600 bg-red-50 hover:bg-red-100',
                                telegram: 'border-cyan-500 text-cyan-500 bg-cyan-50 hover:bg-cyan-100',
                              }
                              const style = colors[p.toLowerCase()] || 'border-primary text-primary bg-surface-container-low hover:bg-primary/5'
                              const platformUrl = `${shortUrl}?src=${p.toLowerCase()}`
                              
                              const handleCopyPlatform = (e) => {
                                e.stopPropagation()
                                navigator.clipboard.writeText(platformUrl)
                                toast.success(`${p} tracking URL copied!`)
                              }

                              return (
                                <button
                                  key={p}
                                  type="button"
                                  onClick={handleCopyPlatform}
                                  title={`Copy ${p} link: ${platformUrl}`}
                                  className={`inline-block rounded-none border px-2 py-0.5 text-[9px] font-bold font-space uppercase tracking-wider transition-colors duration-fast active:translate-y-[0.5px] ${style}`}
                                >
                                  {p}
                                </button>
                              )
                            })
                          ) : (
                            <span className="font-space text-[10px] text-on-surface-variant/60 font-semibold italic select-none">None configured</span>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setExpandedPlatformLinks(prev => ({ ...prev, [link._id]: !prev[link._id] }))
                            }}
                            className="font-space text-[10px] font-bold uppercase text-secondary hover:text-primary underline ml-2 cursor-pointer"
                          >
                            {expandedPlatformLinks[link._id] ? '[Hide Manager]' : '[Manage]'}
                          </button>
                        </div>

                        {link.expiresAt && (
                          <span className="flex items-center gap-1.5 font-space text-[11px] font-semibold text-on-surface-variant">
                            <Calendar size={12} className="text-tertiary" />
                            Expires: {new Date(link.expiresAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      {/* Right: Click count + QR */}
                      <div className="flex items-center gap-5 flex-shrink-0">
                        {/* Click metric */}
                        <div className="text-right">
                          <p className="font-space text-[10px] font-bold uppercase text-on-surface-variant">Total Clicks</p>
                          <p className="text-3xl font-anton text-primary leading-none">{link.clickCount || 0}</p>
                        </div>

                        {/* QR Preview */}
                        <div className="relative group rounded-none border-2 border-primary bg-white p-1.5 shadow-brutal-sm" title="QR Code Preview">
                          <img 
                            src={qrUrl} 
                            alt="QR Code" 
                            className="h-14 w-14 object-contain"
                          />
                          <a 
                            href={qrUrl} 
                            download={`qr_${link.shortCode}.png`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-none font-space text-[10px] text-white font-bold uppercase"
                          >
                            Get
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Platform Manager Drawer */}
                    {expandedPlatformLinks[link._id] && (
                      <div className="border-t-2 border-primary bg-surface-container-low/30 p-5 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <h3 className="font-anton text-xs uppercase tracking-wider text-primary">Manage Platform Tracking Links</h3>
                          
                          {/* Add Platform Dropdown */}
                          {link.platforms.length < SUPPORTED_PLATFORMS.length && (
                            <div className="flex items-center gap-2">
                              <span className="font-space text-[10px] font-bold uppercase text-on-surface-variant">Add Tracking:</span>
                              <select
                                onChange={(e) => {
                                  const platformToAdd = e.target.value
                                  if (platformToAdd) {
                                    const newPlatforms = [...(link.platforms || []), platformToAdd]
                                    modifyUrl(link._id, { platforms: newPlatforms })
                                    e.target.value = '' // Reset select
                                  }
                                }}
                                defaultValue=""
                                className="rounded-none border-2 border-primary bg-white px-2 py-1 text-xs font-semibold text-primary focus:border-secondary focus:outline-none focus:ring-0"
                              >
                                <option value="">-- Choose Platform --</option>
                                {SUPPORTED_PLATFORMS
                                  .filter(p => !(link.platforms || []).includes(p.id))
                                  .map(p => (
                                    <option key={p.id} value={p.id}>{p.label}</option>
                                  ))
                                }
                              </select>
                            </div>
                          )}
                        </div>

                        {/* Platform Links List */}
                        {link.platforms.length === 0 ? (
                          <p className="text-xs font-space font-medium text-on-surface-variant text-center py-4 border border-dashed border-primary/20 bg-white select-none">
                            No platform tracking links configured. Select a platform above to create one.
                          </p>
                        ) : (
                          <div className="grid gap-3 sm:grid-cols-2">
                            {link.platforms.map((p) => {
                              const colors = {
                                instagram: { text: 'text-pink-500', border: 'border-pink-500' },
                                linkedin: { text: 'text-blue-600', border: 'border-blue-600' },
                                twitter: { text: 'text-sky-500', border: 'border-sky-500' },
                                facebook: { text: 'text-blue-800', border: 'border-blue-800' },
                                whatsapp: { text: 'text-green-500', border: 'border-green-500' },
                                youtube: { text: 'text-red-600', border: 'border-red-600' },
                                telegram: { text: 'text-cyan-500', border: 'border-cyan-500' },
                              }
                              const style = colors[p.toLowerCase()] || { text: 'text-primary', border: 'border-primary' }
                              const platformUrl = `${shortUrl}?src=${p.toLowerCase()}`
                              
                              const handleRemovePlatform = () => {
                                const newPlatforms = (link.platforms || []).filter(item => item !== p)
                                modifyUrl(link._id, { platforms: newPlatforms })
                              }

                              const qrUrl = link.qrCodeDataUrl || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(platformUrl)}`

                              return (
                                <div key={p} className="border-2 border-primary bg-white p-3.5 space-y-2 shadow-brutal-xs flex flex-col justify-between">
                                  <div className="flex items-center justify-between">
                                    <span className={`text-xs font-anton uppercase tracking-wide ${style.text}`}>{p}</span>
                                    <div className="flex items-center gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          navigator.clipboard.writeText(platformUrl)
                                          toast.success(`${p} tracking link copied!`)
                                        }}
                                        className="p-1 border border-primary bg-white hover:bg-surface-container-low transition-colors"
                                        title="Copy link"
                                      >
                                        <Copy size={11} />
                                      </button>
                                      <a
                                        href={platformUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1 border border-primary bg-white hover:bg-surface-container-low text-primary"
                                        title="Open link"
                                      >
                                        <ExternalLink size={11} />
                                      </a>
                                      <a
                                        href={qrUrl}
                                        download={`qr_${link.shortCode}_${p}.png`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1 border border-primary bg-white hover:bg-surface-container-low text-primary"
                                        title="QR Code"
                                      >
                                        <QrCode size={11} />
                                      </a>
                                      <button
                                        type="button"
                                        onClick={handleRemovePlatform}
                                        className="p-1 border border-error bg-white hover:bg-error/10 text-error transition-colors"
                                        title="Delete platform link"
                                      >
                                        <Trash2 size={11} />
                                      </button>
                                    </div>
                                  </div>
                                  <p className="text-[11px] font-medium text-on-surface-variant break-all font-sans leading-normal select-all">
                                    {platformUrl}
                                  </p>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions bar — separated at bottom */}
                    <div className="flex items-center justify-between gap-2 px-6 py-3.5 border-t-2 border-primary/15 bg-surface-container-low/50">
                      <a
                        href={shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-space text-[11px] font-bold text-secondary hover:text-primary hover:underline truncate max-w-[300px] transition-colors"
                      >
                        {shortUrl}
                      </a>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopy(link.shortCode)}
                          className="rounded-none p-2 border-2 border-primary bg-white text-primary shadow-brutal-xs hover:bg-surface-container-low active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all duration-fast"
                          title="Copy link"
                        >
                          <Copy size={15} />
                        </button>
                        <a
                          href={shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-none p-2 border-2 border-primary bg-white text-primary shadow-brutal-xs hover:bg-surface-container-low active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all duration-fast"
                          title="Open short link"
                        >
                          <ExternalLink size={15} />
                        </a>
                        <button
                          onClick={() => startEdit(link)}
                          disabled={editingId === link._id}
                          className="rounded-none p-2 border-2 border-primary bg-white text-primary shadow-brutal-xs hover:bg-surface-container-low active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all duration-fast disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Edit details"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() =>
                            setConfirmState({
                              open: true,
                              action: {
                                type: 'delete',
                                id: link._id,
                                link,
                              },
                            })
                          }
                          disabled={deleteLoading}
                          className="rounded-none p-2 border-2 border-error bg-white text-error shadow-brutal-xs hover:bg-error/10 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all duration-fast"
                          title="Delete link"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmState.open}
        title={
          confirmState.action?.type === 'delete'
            ? 'Delete this link?'
            : 'Save link updates?'
        }
        description={
          confirmState.action?.type === 'delete'
            ? 'This link will be removed from your dashboard and can no longer be used.'
            : 'Confirm the changes before saving this link update.'
        }
        details={
          confirmState.action?.link
            ? [
                `Short code: /${confirmState.action.link.shortCode}`,
                `Destination: ${confirmState.action.link.originalUrl}`,
              ]
            : []
        }
        confirmLabel={confirmState.action?.type === 'delete' ? 'Delete Link' : 'Confirm Update'}
        confirmTone={confirmState.action?.type === 'delete' ? 'danger' : 'primary'}
        loading={updateLoading || deleteLoading}
        onConfirm={handleConfirmAction}
        onCancel={closeConfirm}
      />
    </div>
  )
}
export { UrlsPage }
