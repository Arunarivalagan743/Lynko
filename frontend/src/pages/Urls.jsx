import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-hot-toast'
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
  MousePointerClick
} from 'lucide-react'
import { useUrls } from '../hooks/useUrls.js'
import { createUrlSchema, updateUrlSchema } from '../schemas/urlSchemas.js'
import { ENV } from '../constants/env.js'
import Card from '../components/ui/Card.jsx'
import Input from '../components/ui/Input.jsx'
import Button from '../components/ui/Button.jsx'

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

  const [searchQuery, setSearchQuery] = useState('')
  const [editingId, setEditingId] = useState(null)

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
  })

  // Handle URL Creation Submission
  const onCreateSubmit = async (data) => {
    // Strip empty strings for customAlias and expiresAt
    const payload = {
      originalUrl: data.originalUrl.trim(),
      customAlias: data.customAlias?.trim() === '' ? undefined : data.customAlias.trim(),
      expiresAt: data.expiresAt === '' ? undefined : new Date(data.expiresAt).toISOString(),
    }

    try {
      await addUrl(payload)
      resetCreate()
    } catch (_err) {
      // Errors are handled inside hook via toast
    }
  }

  // Handle URL Editing Submission
  const onEditSubmit = async (data) => {
    const payload = {
      originalUrl: data.originalUrl?.trim() === '' ? undefined : data.originalUrl.trim(),
      expiresAt: data.expiresAt === '' ? undefined : new Date(data.expiresAt).toISOString(),
    }

    try {
      await modifyUrl(editingId, payload)
      setEditingId(null)
      resetEdit()
    } catch (_err) {
      // Errors are handled inside hook
    }
  }

  // Set URL into Edit Mode
  const startEdit = (link) => {
    setEditingId(link._id)
    // Pre-fill edit form
    resetEdit({
      originalUrl: link.originalUrl,
      expiresAt: link.expiresAt ? new Date(link.expiresAt).toISOString().split('T')[0] : '',
    })
  }

  // Copy Short URL to Clipboard
  const handleCopy = (shortCode) => {
    const shortUrl = `${ENV.VITE_API_URL}/r/${shortCode}`
    navigator.clipboard.writeText(shortUrl)
    toast.success('URL copied to clipboard!')
  }

  // Filter URLs based on Search Input
  const filteredUrls = urls.filter((link) => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return true

    const originalUrl = link.originalUrl?.toLowerCase() || ''
    const shortCode = link.shortCode?.toLowerCase() || ''
    const customAlias = link.customAlias?.toLowerCase() || ''

    return originalUrl.includes(query) || shortCode.includes(query) || customAlias.includes(query)
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
        {/* Left Column: Create Form OR Edit Form */}
        <div className="space-y-8">
          {!editingId ? (
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
                          onClick={() => removeUrl(link._id)}
                          disabled={deleteLoading}
                          className="rounded-none p-2 border-2 border-primary bg-white text-error shadow-brutal-xs hover:bg-error-container active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all duration-fast"
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
    </div>
  )
}
export { UrlsPage }
