import { BarChart3, Globe2, Link2, QrCode } from 'lucide-react'
import AppShell from '../components/layout/AppShell.jsx'
import Card from '../components/ui/Card.jsx'

const statCards = [
  { label: 'Total Links', value: '128,940', change: '+12.4%', icon: Link2 },
  { label: 'Total Clicks', value: '9.2M', change: '+8.1%', icon: BarChart3 },
  { label: 'CTR', value: '4.8%', change: '+0.6%', icon: Globe2 },
  { label: 'Active Domains', value: '240', change: '+3', icon: QrCode },
]

const recentLinks = [
  {
    shortUrl: 'lynko.io/launch',
    originalUrl: 'https://lynko.io/product/launch',
    clicks: '18,204',
    createdAt: 'Sep 14, 2026',
    status: 'Active',
  },
  {
    shortUrl: 'ln.ky/spring',
    originalUrl: 'https://lynko.io/campaign/spring',
    clicks: '9,418',
    createdAt: 'Sep 12, 2026',
    status: 'Active',
  },
  {
    shortUrl: 'ln.ky/demo',
    originalUrl: 'https://lynko.io/demo',
    clicks: '6,902',
    createdAt: 'Sep 09, 2026',
    status: 'Paused',
  },
]

const Dashboard = () => {
  return (
    <AppShell
      title="Dashboard"
      subtitle="Monitor link performance across campaigns and teams."
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.label} className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                {card.label}
              </p>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface">
                <card.icon size={16} className="text-primary" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-semibold text-text">{card.value}</p>
              <span className="text-xs font-medium text-success">{card.change}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-text">Click trends</p>
              <p className="text-xs text-text-muted">Last 30 days</p>
            </div>
            <button
              type="button"
              className="rounded-lg border border-border bg-white px-3 py-2 text-xs font-medium text-text-muted"
            >
              Export CSV
            </button>
          </div>
          <div className="h-56 rounded-lg border border-dashed border-border bg-surface" />
        </Card>
        <div className="grid gap-6">
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-text">Top countries</p>
              <span className="text-xs text-text-muted">Last 7 days</span>
            </div>
            <div className="space-y-3 text-sm text-text-muted">
              {['United States', 'United Kingdom', 'Germany', 'Canada'].map((country) => (
                <div key={country} className="flex items-center justify-between">
                  <span>{country}</span>
                  <span className="text-text">{Math.floor(Math.random() * 30 + 20)}%</span>
                </div>
              ))}
            </div>
          </Card>
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-text">Devices</p>
              <span className="text-xs text-text-muted">Last 7 days</span>
            </div>
            <div className="space-y-3 text-sm text-text-muted">
              {['Desktop', 'Mobile', 'Tablet'].map((device) => (
                <div key={device} className="flex items-center justify-between">
                  <span>{device}</span>
                  <span className="text-text">{Math.floor(Math.random() * 30 + 20)}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-text">Recent links</p>
            <p className="text-xs text-text-muted">Latest shortened URLs</p>
          </div>
          <button
            type="button"
            className="rounded-lg border border-border bg-white px-3 py-2 text-xs font-medium text-text-muted"
          >
            View all
          </button>
        </div>
        <div className="overflow-hidden rounded-lg border border-border/70">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-xs uppercase text-text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Short URL</th>
                <th className="px-4 py-3 font-medium">Original URL</th>
                <th className="px-4 py-3 font-medium">Clicks</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70">
              {recentLinks.map((link) => (
                <tr key={link.shortUrl} className="bg-white">
                  <td className="px-4 py-3 font-medium text-text">{link.shortUrl}</td>
                  <td className="px-4 py-3 text-text-muted">{link.originalUrl}</td>
                  <td className="px-4 py-3 text-text">{link.clicks}</td>
                  <td className="px-4 py-3 text-text-muted">{link.createdAt}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        link.status === 'Active'
                          ? 'rounded-full bg-success/10 px-2 py-1 text-xs font-medium text-success'
                          : 'rounded-full bg-warning/10 px-2 py-1 text-xs font-medium text-warning'
                      }
                    >
                      {link.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AppShell>
  )
}

export default Dashboard
