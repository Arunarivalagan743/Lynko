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
    <main className="min-h-[calc(100vh-64px)] bg-background flex items-center justify-center">
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-12 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col justify-center">
          <Card className="space-y-6" dogEar shadowSize="lg">
            <div className="flex items-center gap-3">
              <Logo />
              <div>
                <p className="font-space text-xs font-bold uppercase tracking-[0.24em] text-primary">
                  Lynko Cloud
                </p>
                <p className="font-space text-[11px] font-semibold text-on-surface-variant">Link management platform</p>
              </div>
            </div>
            <div className="space-y-2 border-b-2 border-primary pb-4">
              <h1 className="text-3xl font-anton uppercase tracking-wide text-primary leading-none">
                {title}
              </h1>
              <p className="text-sm text-on-surface-variant font-medium">{subtitle}</p>
            </div>
            <div className="pt-2">
              {children}
            </div>
            {footer && (
              <div className="text-sm font-semibold text-primary pt-4 border-t-2 border-primary font-space">
                {footer}
              </div>
            )}
          </Card>
        </div>

        <div className="hidden items-center justify-center lg:flex">
          <div className="w-full rounded-none border-2 border-primary bg-surface-container-low p-8 shadow-brutal">
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="font-space text-xs font-bold uppercase tracking-[0.24em] text-primary">
                  Enterprise ready
                </p>
                <h2 className="text-2xl font-anton uppercase text-primary leading-tight">
                  Keep teams aligned with branded, trackable links.
                </h2>
                <p className="text-sm text-on-surface-variant font-medium">
                  Centralize every link, monitor performance, and ship campaigns faster.
                </p>
              </div>
              <div className="space-y-3">
                {highlights.map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-primary font-semibold">
                    <span className="flex h-7 w-7 items-center justify-center rounded-none bg-white border border-primary text-primary shadow-brutal-sm">
                      <Check size={16} />
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-none border-2 border-primary bg-white p-5">
                <div className="flex items-center justify-between text-xs font-space font-bold uppercase text-primary">
                  <span>Active campaigns</span>
                  <span>Last 30 days</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-space text-xs text-on-surface-variant font-semibold">Clicks</p>
                    <p className="text-2xl font-anton text-primary">142,880</p>
                  </div>
                  <div>
                    <p className="font-space text-xs text-on-surface-variant font-semibold">CTR</p>
                    <p className="text-2xl font-anton text-primary">4.8%</p>
                  </div>
                </div>
                <div className="mt-5 h-20 rounded-none border-2 border-dashed border-primary bg-surface-container-low flex items-center justify-center">
                  <span className="font-space text-xs text-primary/50 font-bold uppercase">Analytics visualizer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default AuthShell
