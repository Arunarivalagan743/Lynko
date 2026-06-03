import React from 'react'
import { MousePointerClick } from 'lucide-react'
import Card from './ui/Card.jsx'

const SkeletonBar = ({ w = 'w-full', h = 'h-4' }) => (
  <div className={`${w} ${h} rounded-none bg-surface-container-high animate-pulse`} />
)

const EmptyState = ({ message = 'No data available yet.' }) => (
  <div className="flex items-center justify-center py-12 text-center">
    <p className="font-space text-xs font-bold uppercase tracking-wide text-primary/40">{message}</p>
  </div>
)

export default function PlatformAnalyticsCard({ platformStats = [], loading = false }) {
  const totalClicks = platformStats.reduce((sum, item) => sum + (item.clicks || 0), 0)

  return (
    <Card className="space-y-0" shadowSize="md">
      <div className="flex items-center gap-2 border-b-2 border-primary pb-3 mb-5">
        <MousePointerClick size={18} className="text-primary flex-shrink-0" />
        <h2 className="heading-section">Platform Link Clicks</h2>
      </div>

      {loading ? (
        <div className="space-y-3 py-2">
          {[...Array(3)].map((_, i) => <SkeletonBar key={i} h="h-6" />)}
        </div>
      ) : platformStats.length === 0 ? (
        <EmptyState message="No platform links configured for this URL." />
      ) : (
        <div className="space-y-4">
          <div className="space-y-3">
            {platformStats.map((item) => {
              const pct = totalClicks > 0 ? Math.round((item.clicks / totalClicks) * 100) : 0
              
              const platformColors = {
                instagram: { text: 'text-pink-500', bar: 'bg-pink-500' },
                linkedin: { text: 'text-blue-600', bar: 'bg-blue-600' },
                twitter: { text: 'text-sky-500', bar: 'bg-sky-500' },
                facebook: { text: 'text-blue-800', bar: 'bg-blue-800' },
                whatsapp: { text: 'text-green-500', bar: 'bg-green-500' },
                youtube: { text: 'text-red-600', bar: 'bg-red-600' },
                telegram: { text: 'text-cyan-500', bar: 'bg-cyan-500' },
              }

              const style = platformColors[item.platform.toLowerCase()] || { text: 'text-primary', bar: 'bg-primary' }

              return (
                <div key={item.platform} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className={`font-space text-xs font-bold uppercase tracking-wider ${style.text}`}>
                      {item.platform}
                    </span>
                    <span className="font-space text-xs font-bold text-primary">
                      {item.clicks.toLocaleString()} clicks ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-surface-container-low border-2 border-primary rounded-none overflow-hidden">
                    <div
                      className={`h-full ${style.bar} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="border-t border-primary/10 pt-3 flex items-center justify-between font-space text-[10px] font-bold text-on-surface-variant uppercase">
            <span>Total Platform Clicks</span>
            <span>{totalClicks.toLocaleString()}</span>
          </div>
        </div>
      )}
    </Card>
  )
}
