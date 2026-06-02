import { Check } from 'lucide-react'
import Card from '../ui/Card.jsx'
import Logo from '../ui/Logo.jsx'

const highlights = [
  'Custom domains with enterprise DNS',
  'Real-time analytics and conversions',
  'SOC 2 aligned security practices',
]

const AuthShell = ({ title, subtitle, children, footer }) => {
  return (
    <main className="min-h-[calc(100vh-64px)] bg-white">
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-12 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col justify-center">
          <Card className="space-y-6">
            <div className="flex items-center gap-3">
              <Logo />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-text-muted">
                  Lynko Cloud
                </p>
                <p className="text-sm font-medium text-text">Link management platform</p>
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold leading-tight tracking-tight text-text">
                {title}
              </h1>
              <p className="text-sm text-text-muted">{subtitle}</p>
            </div>
            {children}
            {footer && <div className="text-sm text-text-muted">{footer}</div>}
          </Card>
        </div>

        <div className="hidden items-center justify-center lg:flex">
          <div className="w-full rounded-card border border-border/70 bg-surface p-8 shadow-subtle">
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-text-muted">
                  Enterprise ready
                </p>
                <h2 className="text-2xl font-semibold text-text">
                  Keep teams aligned with branded, trackable links.
                </h2>
                <p className="text-sm text-text-muted">
                  Centralize every link, monitor performance, and ship campaigns faster.
                </p>
              </div>
              <div className="space-y-3">
                {highlights.map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-text-muted">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-primary shadow-subtle">
                      <Check size={16} />
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-card border border-border/70 bg-white p-5">
                <div className="flex items-center justify-between text-xs text-text-muted">
                  <span>Active campaigns</span>
                  <span>Last 30 days</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-text-muted">Clicks</p>
                    <p className="text-xl font-semibold text-text">142,880</p>
                  </div>
                  <div>
                    <p className="text-text-muted">CTR</p>
                    <p className="text-xl font-semibold text-text">4.8%</p>
                  </div>
                </div>
                <div className="mt-5 h-24 rounded-lg border border-dashed border-border bg-surface" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default AuthShell
