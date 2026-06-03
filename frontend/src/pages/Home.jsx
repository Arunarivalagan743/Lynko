import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BarChart3,
  Check,
  Globe2,
  Link2,
  QrCode,
  ShieldCheck,
  Sparkles,
  Scissors,
  ExternalLink,
  Copy,
  TrendingUp,
  Users,
  Zap,
  AlertCircle,
} from 'lucide-react'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useUrls } from '../hooks/useUrls.js'
import toast from 'react-hot-toast'
import { ENV } from '../constants/env.js'

// Illustrations
import heroLinkImg from '../assets/hero_link.png'
import qrScanImg from '../assets/qr_scan.png'
import browseUrlImg from '../assets/browse_url.png'

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
}

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
}

const features = [
  {
    icon: Link2,
    title: 'Smart Short Links',
    description: 'Compact branded URLs that load instantly and are easy to share anywhere.',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    description: 'Track clicks, browsers, devices, and geographic data in one dashboard.',
  },
  {
    icon: QrCode,
    title: 'QR Code Generation',
    description: 'Every link includes a scannable QR code — no extra steps needed.',
  },
  {
    icon: ShieldCheck,
    title: 'Click Quality Scoring',
    description: 'Distinguish human visits from bots and suspicious activity automatically.',
  },
  {
    icon: Zap,
    title: 'Bulk Import',
    description: 'Upload thousands of URLs at once via CSV with validation previews.',
  },
  {
    icon: Globe2,
    title: 'Public Stats',
    description: 'Share public stats pages for any link without requiring accounts.',
  },
]

const Home = () => {
  const { isAuthenticated } = useAuth()
  const { addUrl, createLoading } = useUrls()
  const navigate = useNavigate()

  // URL shortener widget state
  const [longUrl, setLongUrl] = useState('')
  const [customAlias, setCustomAlias] = useState('')
  const [createdLink, setCreatedLink] = useState(null)
  const [urlError, setUrlError] = useState('')

  const validateUrl = (raw) => {
    if (!raw.trim()) return 'Please paste a URL to shorten'
    try {
      const parsed = new URL(raw.trim())
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return `"${parsed.protocol}//" is not allowed — use http:// or https://`
      }
      if (!parsed.hostname.includes('.')) {
        return 'URL must include a valid domain (e.g. https://example.com)'
      }
    } catch {
      return 'Invalid URL — include the full address (e.g. https://example.com)'
    }
    return ''
  }

  const handleShorten = async (e) => {
    e.preventDefault()

    const trimmedUrl = longUrl.trim()
    const validationError = validateUrl(trimmedUrl)
    if (validationError) {
      setUrlError(validationError)
      return
    }
    setUrlError('')

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    try {
      const payload = {
        originalUrl: trimmedUrl,
        customAlias: customAlias.trim() || undefined,
      }
      const newUrl = await addUrl(payload)
      if (newUrl) {
        setCreatedLink(newUrl)
        setLongUrl('')
        setCustomAlias('')
        setUrlError('')
      }
    } catch (_err) {
      // Errors handled in hook
    }
  }

  const handleCopy = (shortCode) => {
    const url = `${ENV.VITE_API_URL}/r/${shortCode}`
    navigator.clipboard.writeText(url)
    toast.success('Short URL copied!')
  }

  const shortUrl = createdLink ? `${ENV.VITE_API_URL}/r/${createdLink.shortCode}` : ''

  return (
    <div className="bg-background min-h-screen">

      {/* ── Hero Section ── */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="border-b-2 border-primary bg-white"
      >
        <div className="mx-auto w-full max-w-[1200px] px-6 py-20">
          {/* Hero: Image left + Content right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left — Hero Illustration */}
            <motion.div
              variants={staggerItem}
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="flex justify-center lg:justify-start order-2 lg:order-1"
            >
              <img
                src={heroLinkImg}
                alt="Shorten and manage your links with Lynko"
                className="w-full max-w-sm h-auto"
              />
            </motion.div>

            {/* Right — Headline + Shortener */}
            <div className="space-y-6 order-1 lg:order-2">
              <motion.div variants={staggerItem} className="space-y-4">
                <h1 className="text-4xl sm:text-5xl font-anton uppercase tracking-wider text-primary leading-tight md:text-6xl">
                  Shorten Your Links,<br />
                  <span className="text-secondary">Grow Your Power.</span>
                </h1>
                <p className="text-lg font-medium text-on-surface-variant max-w-xl leading-relaxed">
                  The URL shortener built for speed, transparency, and quirky high-performance tracking.
                  Turn long messy strings into elegant, powerful links.
                </p>
              </motion.div>

              {/* URL Shortener Widget */}
              <motion.div variants={staggerItem}>
                <Card className="space-y-5 !p-7" shadowSize="lg" dogEar>
                  <form onSubmit={handleShorten} className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <Link2 size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/40 pointer-events-none" />
                        <input
                          type="text"
                          placeholder="Paste your long URL here..."
                          value={longUrl}
                          onChange={(e) => { setLongUrl(e.target.value); if (urlError) setUrlError('') }}
                          className={`w-full h-12 rounded-none border-2 bg-white pl-11 pr-4 font-sans text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none transition-colors ${urlError ? 'border-error focus:border-error' : 'border-primary focus:border-secondary'
                            }`}
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Custom alias (optional)"
                        value={customAlias}
                        onChange={(e) => setCustomAlias(e.target.value)}
                        maxLength={30}
                        className="h-12 w-full sm:w-48 rounded-none border-2 border-primary bg-white px-4 font-sans text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:border-secondary focus:outline-none transition-colors"
                      />
                    </div>

                    {urlError && (
                      <div
                        role="alert"
                        className="flex items-start gap-2 animate-[fadeSlideIn_0.15s_ease-out] border-2 border-error bg-error/5 px-4 py-2.5"
                      >
                        <AlertCircle size={14} className="mt-0.5 shrink-0 text-error" />
                        <p className="font-space text-[12px] font-semibold leading-snug text-error">{urlError}</p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      size="xl"
                      loading={createLoading}
                      className="w-full"
                    >
                      <Scissors size={18} />
                      {createLoading ? 'Shortening…' : isAuthenticated ? 'Shorten Now' : 'Sign In to Shorten'}
                    </Button>
                  </form>

                  {createdLink && (
                    <div className="border-t-2 border-primary pt-5 space-y-3">
                      <p className="label-overline text-secondary">Your link is ready!</p>
                      <div className="flex items-center gap-3 bg-surface-container-low border-2 border-primary p-3">
                        <a
                          href={shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-base font-anton text-secondary hover:underline truncate"
                        >
                          {shortUrl}
                        </a>
                        <button
                          onClick={() => handleCopy(createdLink.shortCode)}
                          className="flex-shrink-0 rounded-none border-2 border-primary bg-white p-2 text-primary shadow-brutal-xs hover:bg-surface-container-low active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all duration-fast"
                          title="Copy URL"
                        >
                          <Copy size={16} />
                        </button>
                        <a
                          href={shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 rounded-none border-2 border-primary bg-white p-2 text-primary shadow-brutal-xs hover:bg-surface-container-low active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all duration-fast"
                          title="Open link"
                        >
                          <ExternalLink size={16} />
                        </a>
                      </div>
                      <p className="font-space text-[11px] text-on-surface-variant font-semibold truncate">
                        → {createdLink.originalUrl}
                      </p>
                      <div className="flex gap-2 pt-1">
                        <Button
                          as={Link}
                          to={`/analytics/${createdLink._id}`}
                          variant="secondary"
                          size="sm"
                          className="flex items-center gap-1.5"
                        >
                          <BarChart3 size={14} />
                          View Analytics
                        </Button>
                        <Button
                          as={Link}
                          to="/urls"
                          variant="ghost"
                          size="sm"
                        >
                          Manage All Links →
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>

                {!isAuthenticated && (
                  <p className="mt-3 font-space text-xs font-bold text-on-surface-variant">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary hover:underline">
                      Sign in
                    </Link>{' '}
                    to start shortening.
                  </p>
                )}
              </motion.div>
            </div>
          </div>

          {/* Trust chips */}
          <motion.div
            variants={staggerItem}
            className="flex flex-wrap items-center justify-center gap-6 font-space text-xs font-bold uppercase text-primary pt-6"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-secondary" />
              SOC 2 aligned security
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} className="text-secondary" />
              99.99% uptime SLA
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} className="text-secondary" />
              GDPR compliant
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ── Features Grid ── */}
      <section className="border-b-2 border-primary bg-white" id="features">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20px" }}
          variants={staggerContainer}
          className="mx-auto w-full max-w-[1200px] px-6 py-16"
        >
          <motion.div variants={staggerItem} className="flex flex-col gap-3 text-center max-w-xl mx-auto mb-12">
            <p className="label-overline">Features</p>
            <h2 className="text-3xl font-anton uppercase text-primary leading-tight">
              Quirky Features, Serious Results.
            </h2>
            <p className="text-sm font-medium text-on-surface-variant">
              Everything you need to launch branded links faster and measure what matters.
            </p>
          </motion.div>

          {/* QR Scan Illustration + Features Grid */}
          <div className="grid gap-10 lg:grid-cols-[1fr_auto_1fr] items-center mb-12">
            {/* Left features */}
            <motion.div variants={staggerContainer} className="space-y-6">
              {features.slice(0, 3).map((feature) => (
                <motion.div key={feature.title} variants={staggerItem}>
                  <Card className="space-y-3 h-full" shadowSize="sm" hover>
                    <div className="flex h-11 w-11 items-center justify-center rounded-none border-2 border-primary bg-secondary-container text-primary">
                      <feature.icon size={20} />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-base font-anton uppercase text-primary tracking-wide">{feature.title}</h3>
                      <p className="text-sm font-medium text-on-surface-variant leading-relaxed">{feature.description}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Center QR illustration */}
            <motion.div
              variants={staggerItem}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="hidden lg:flex justify-center"
            >
              <img
                src={qrScanImg}
                alt="Scan QR codes generated by Lynko"
                className="w-64 h-auto"
              />
            </motion.div>

            {/* Right features */}
            <motion.div variants={staggerContainer} className="space-y-6">
              {features.slice(3).map((feature) => (
                <motion.div key={feature.title} variants={staggerItem}>
                  <Card className="space-y-3 h-full" shadowSize="sm" hover>
                    <div className="flex h-11 w-11 items-center justify-center rounded-none border-2 border-primary bg-secondary-container text-primary">
                      <feature.icon size={20} />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-base font-anton uppercase text-primary tracking-wide">{feature.title}</h3>
                      <p className="text-sm font-medium text-on-surface-variant leading-relaxed">{feature.description}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Mobile QR illustration (visible on small screens) */}
          <motion.div
            variants={staggerItem}
            className="flex justify-center lg:hidden mb-8"
          >
            <img
              src={qrScanImg}
              alt="Scan QR codes generated by Lynko"
              className="w-48 h-auto"
            />
          </motion.div>

          {/* Mobile features grid fallback */}
          <motion.div
            variants={staggerContainer}
            className="grid gap-6 sm:grid-cols-2 lg:hidden"
          >
            {features.map((feature) => (
              <motion.div key={feature.title} variants={staggerItem}>
                <Card className="space-y-4 h-full" shadowSize="sm" hover>
                  <div className="flex h-11 w-11 items-center justify-center rounded-none border-2 border-primary bg-secondary-container text-primary">
                    <feature.icon size={20} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-anton uppercase text-primary tracking-wide">{feature.title}</h3>
                    <p className="text-sm font-medium text-on-surface-variant leading-relaxed">{feature.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Why Choose Lynko (3-up) ── */}
      <section className="border-b-2 border-primary bg-surface-container-low">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20px" }}
          variants={staggerContainer}
          className="mx-auto w-full max-w-[1200px] px-6 py-16"
        >
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: TrendingUp,
                title: 'Performance Tracking',
                description: 'See every click, browser, device, and country broken down in real time.',
              },
              {
                icon: Users,
                title: 'Team Workspaces',
                description: 'Role-based access, shared link libraries, and bulk operations for teams.',
              },
              {
                icon: Sparkles,
                title: 'Automation Ready',
                description: 'Bulk CSV import, public stats pages, and structured analytics exports.',
              },
            ].map((item) => (
              <motion.div key={item.title} variants={staggerItem}>
                <Card className="space-y-4 !bg-white h-full" shadowSize="sm" hover>
                  <div className="flex h-11 w-11 items-center justify-center rounded-none border-2 border-primary bg-surface-container-low">
                    <item.icon size={20} className="text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-anton uppercase text-primary">{item.title}</h3>
                    <p className="text-sm font-medium text-on-surface-variant leading-relaxed">{item.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="bg-white">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20px" }}
          variants={staggerContainer}
          className="mx-auto w-full max-w-[1200px] px-6 py-16"
        >
          <div className="rounded-none border-2 border-primary bg-primary p-10 shadow-brutal">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center">
              <div className="text-center md:text-left">
                <motion.h2 variants={staggerItem} className="text-3xl font-anton uppercase text-white leading-tight">
                  Ready to launch links that perform?
                </motion.h2>
                <motion.p variants={staggerItem} className="mt-3 text-sm font-medium text-surface-container-low max-w-md leading-relaxed">
                  Join teams already using Lynko to manage campaigns and track performance at scale.
                </motion.p>
                <motion.div variants={staggerItem} className="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
                  <Button
                    as={Link}
                    to={isAuthenticated ? '/dashboard' : '/signup'}
                    size="xl"
                    className="!bg-white !text-primary !border-white hover:!bg-surface-container-low"
                  >
                    {isAuthenticated ? 'Go to Dashboard' : 'Start Free — No Credit Card'}
                  </Button>
                  {!isAuthenticated && (
                    <Button
                      as={Link}
                      to="/login"
                      variant="secondary"
                      size="xl"
                      className="!border-white !text-white !bg-transparent hover:!bg-white/10"
                    >
                      Sign In
                    </Button>
                  )}
                </motion.div>
              </div>
              <motion.div
                variants={staggerItem}
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="hidden md:block"
              >
                <img
                  src={browseUrlImg}
                  alt="Manage your URLs effortlessly"
                  className="w-72 h-auto"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t-2 border-primary bg-white">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariants}
          className="mx-auto flex w-full max-w-[1200px] flex-col sm:flex-row items-center justify-between gap-4 px-6 py-8"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-none border-2 border-primary bg-white shadow-brutal-sm">
              <div className="h-3.5 w-3.5 rounded-none bg-primary" />
            </div>
            <p className="text-lg font-anton uppercase tracking-wider text-primary">Lynko</p>
          </div>
          <p className="font-space text-xs font-bold uppercase text-on-surface-variant">
            © {new Date().getFullYear()} Lynko. The premium link management platform.
          </p>
          <div className="flex gap-4 font-space text-xs font-bold uppercase text-primary">
            <Link to="/stats" className="hover:text-secondary transition-colors">Public Stats</Link>
            <Link to={isAuthenticated ? '/dashboard' : '/login'} className="hover:text-secondary transition-colors">
              {isAuthenticated ? 'Dashboard' : 'Login'}
            </Link>
          </div>
        </motion.div>
      </footer>
    </div>
  )
}

export default Home
