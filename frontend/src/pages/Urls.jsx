import React from 'react'
import { Copy, Link2, QrCode } from 'lucide-react'
import AppShell from '../components/layout/AppShell.jsx'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import Input from '../components/ui/Input.jsx'

const Urls = () => {
  return (
    <AppShell
      title="Create short link"
      subtitle="Generate branded URLs, QR codes, and campaign-ready links."
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface">
              <Link2 size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text">Shorten a URL</p>
              <p className="text-xs text-text-muted">Share links with branded domains and analytics.</p>
            </div>
          </div>
          <div className="grid gap-4">
            <Input label="Long URL" placeholder="https://example.com/landing" />
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Custom alias" placeholder="summer-launch" />
              <Input label="Domain" placeholder="ln.ky" />
            </div>
            <Input label="Expiration date" placeholder="Optional" type="date" />
          </div>
          <Button className="w-full">Create short link</Button>
        </Card>

        <Card className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface">
              <QrCode size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text">Generated link</p>
              <p className="text-xs text-text-muted">Share instantly or download the QR code.</p>
            </div>
          </div>
          <div className="rounded-lg border border-border/70 bg-surface p-4">
            <p className="text-xs text-text-muted">Short URL</p>
            <p className="mt-2 text-lg font-semibold text-text">lynko.io/summer</p>
            <p className="mt-1 text-xs text-text-muted">Created seconds ago</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button size="md">
                <Copy size={16} />
                Copy link
              </Button>
              <Button variant="secondary" size="md">
                View analytics
              </Button>
            </div>
          </div>
          <div className="rounded-lg border border-border/70 bg-white p-6">
            <div className="flex items-center justify-between text-xs text-text-muted">
              <span>QR code</span>
              <span>PNG</span>
            </div>
            <div className="mt-4 flex h-40 items-center justify-center rounded-lg border border-dashed border-border bg-surface text-sm text-text-muted">
              QR preview
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  )
}

export default Urls
