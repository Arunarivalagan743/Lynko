import {
  ArrowRight,
  BarChart3,
  Check,
  Code2,
  Globe2,
  LayoutGrid,
  Link2,
  QrCode,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const stats = [
  { label: 'Total links', value: '128,940' },
  { label: 'Total clicks', value: '9.2M' },
  { label: 'Active domains', value: '240' },
  { label: 'QR codes', value: '18,430' },
]

const features = [
  {
    icon: Link2,
    title: 'Custom domains',
    description: 'Launch branded short links with enterprise DNS and SSL management.',
  },
  {
    icon: BarChart3,
    title: 'Link analytics',
    description: 'Track clicks, conversions, and channels with real-time reporting.',
  },
  {
    icon: QrCode,
    title: 'QR codes',
    description: 'Generate scannable QR codes with tracking baked in.',
  },
  {
    icon: Users,
    title: 'Team collaboration',
    description: 'Assign roles, approvals, and shared workspaces across teams.',
  },
  {
    icon: Code2,
    title: 'API access',
    description: 'Integrate link creation into your product and workflows.',
  },
  {
    icon: LayoutGrid,
    title: 'Smart routing',
    description: 'Route by location, device, or campaign in a single link.',
  },
  {
    icon: Sparkles,
    title: 'Link expiration',
    description: 'Automate cleanup and compliance with expiry controls.',
  },
  {
    icon: Globe2,
    title: 'UTM builder',
    description: 'Create consistent tracking parameters across every campaign.',
  },
]

const plans = [
  {
    name: 'Starter',
    price: '$19',
    description: 'Best for early-stage teams testing branded links.',
    features: ['5 custom domains', 'Analytics dashboard', 'Unlimited QR codes', 'Community support'],
  },
  {
    name: 'Growth',
    price: '$79',
    description: 'Ideal for growing teams scaling campaigns and conversions.',
    features: ['25 custom domains', 'Advanced analytics', 'Team permissions', 'Priority support'],
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Security, SLAs, and custom workflows for large orgs.',
    features: ['Unlimited domains', 'SSO + SCIM', 'Dedicated success', 'Custom SLAs'],
  },
]

const faqs = [
  {
    question: 'What is a URL shortener?',
    answer:
      'A URL shortener creates compact branded links that are easier to share and track.',
  },
  {
    question: 'How do I know Lynko is reliable and scalable?',
    answer:
      'We run on enterprise-grade infrastructure with SLA-backed uptime and secure token rotation.',
  },
  {
    question: 'How can I create a short link?',
    answer: 'Paste any URL into Lynko, add a custom alias, and publish instantly.',
  },
  {
    question: 'Can I manage multiple domains?',
    answer: 'Yes. Manage multiple branded domains and teams in a single workspace.',
  },
]

const Home = () => {
  const { isAuthenticated } = useAuth()

  return (
    <div className="bg-white">
      <section className="border-b border-border/70 bg-white">
        <div className="mx-auto grid w-full max-w-[1200px] gap-12 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col justify-center gap-6">
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-text-muted">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Trusted link management for modern teams
            </p>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-text md:text-5xl">
                Branded links that drive more clicks.
              </h1>
              <p className="text-base text-text-muted md:text-lg">
                Create, manage, and track short links with powerful analytics, custom domains,
                QR codes, and enterprise-grade reliability.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button as={Link} to={isAuthenticated ? '/dashboard' : '/signup'} size="lg">
                Start Free
              </Button>
              <Button variant="secondary" size="lg">
                Book demo
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-xs text-text-muted">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-primary" />
                SOC 2 aligned security
              </div>
              <div className="flex items-center gap-2">
                <Check size={16} className="text-primary" />
                99.99% uptime SLA
              </div>
              <div className="flex items-center gap-2">
                <Check size={16} className="text-primary" />
                GDPR compliant
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-full rounded-card border border-border/70 bg-surface p-6 shadow-medium">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-text">Campaign dashboard</p>
                <span className="rounded-full border border-border bg-white px-3 py-1 text-xs text-text-muted">
                  Live
                </span>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {stats.slice(0, 2).map((stat) => (
                  <div key={stat.label} className="rounded-lg border border-border/70 bg-white p-4">
                    <p className="text-xs text-text-muted">{stat.label}</p>
                    <p className="mt-2 text-xl font-semibold text-text">{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg border border-dashed border-border bg-white/70 p-4">
                <div className="flex items-center justify-between text-xs text-text-muted">
                  <span>Clicks by channel</span>
                  <span>Last 7 days</span>
                </div>
                <div className="mt-4 h-24 rounded-md bg-surface" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border/70 bg-white" id="solutions">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-6 py-12">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
            Trusted by modern teams worldwide
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm text-text-muted sm:grid-cols-3 lg:grid-cols-6">
            {['Nova', 'Skyline', 'Vector', 'Beacon', 'Vertex', 'Aurora'].map((name) => (
              <div
                key={name}
                className="flex items-center justify-center rounded-lg border border-border/70 bg-surface py-3"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border/70 bg-white" id="features">
        <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
              Product showcase
            </p>
            <h2 className="text-3xl font-semibold text-text">
              Everything your team needs to manage links at scale.
            </h2>
            <p className="text-sm text-text-muted">
              Centralize links, track conversions, and share performance insights across every
              team. Lynko unifies branded links, QR codes, and routing into a single workspace.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-lg border border-border/70 bg-surface p-4">
                  <p className="text-xs text-text-muted">{stat.label}</p>
                  <p className="mt-2 text-lg font-semibold text-text">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-card border border-border/70 bg-surface p-6 shadow-subtle">
            <div className="space-y-4">
              <div className="rounded-lg border border-border/70 bg-white p-4">
                <p className="text-xs text-text-muted">Top performing link</p>
                <p className="mt-2 text-sm font-semibold text-text">lynko.io/launch</p>
                <p className="mt-1 text-xs text-text-muted">+24% week over week</p>
              </div>
              <div className="rounded-lg border border-border/70 bg-white p-4">
                <p className="text-xs text-text-muted">Audience split</p>
                <div className="mt-4 h-24 rounded-md bg-surface" />
              </div>
              <div className="rounded-lg border border-border/70 bg-white p-4">
                <p className="text-xs text-text-muted">Click trends</p>
                <div className="mt-4 h-24 rounded-md bg-surface" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border/70 bg-white" id="analytics">
        <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
              Analytics
            </p>
            <h2 className="text-3xl font-semibold text-text">
              See every click and conversion in real time.
            </h2>
            <p className="text-sm text-text-muted">
              Measure performance across campaigns, channels, and teams with a single unified
              dashboard.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: 'Top campaigns', value: '54' },
                { label: 'Conversions', value: '18.6K' },
                { label: 'Avg. CTR', value: '4.8%' },
                { label: 'Active regions', value: '42' },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-border/70 bg-surface p-4">
                  <p className="text-xs text-text-muted">{item.label}</p>
                  <p className="mt-2 text-lg font-semibold text-text">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-card border border-border/70 bg-surface p-6 shadow-subtle">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-text">Conversion funnel</p>
                <span className="text-xs text-text-muted">This quarter</span>
              </div>
              <div className="h-48 rounded-lg border border-dashed border-border bg-white" />
              <div className="grid gap-3 text-sm text-text-muted">
                {['Email campaigns', 'Paid social', 'Partner links'].map((item) => (
                  <div key={item} className="flex items-center justify-between">
                    <span>{item}</span>
                    <span className="text-text">{Math.floor(Math.random() * 30 + 20)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border/70 bg-white">
        <div className="mx-auto w-full max-w-[1200px] px-6 py-16">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: 'Enterprise-grade security',
                description: 'JWT rotation, audit trails, and secure link governance.',
              },
              {
                icon: BarChart3,
                title: 'Analytics you can trust',
                description: 'See every click, referrer, and conversion in real time.',
              },
              {
                icon: Sparkles,
                title: 'Automation ready',
                description: 'Workflow-friendly APIs, webhooks, and export tooling.',
              },
            ].map((item) => (
              <Card key={item.title} className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface">
                  <item.icon size={18} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-text">{item.title}</h3>
                <p className="text-sm text-text-muted">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border/70 bg-white">
        <div className="mx-auto w-full max-w-[1200px] px-6 py-16">
          <div className="flex flex-col gap-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
              Features
            </p>
            <h2 className="text-3xl font-semibold text-text">
              Built for performance, flexibility, and growth.
            </h2>
            <p className="text-sm text-text-muted">
              Everything you need to launch branded links faster and measure what matters.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface">
                  <feature.icon size={18} className="text-primary" />
                </div>
                <h3 className="text-base font-semibold text-text">{feature.title}</h3>
                <p className="text-sm text-text-muted">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border/70 bg-white" id="developers">
        <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-card border border-border/70 bg-surface p-6 shadow-subtle">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                Developer platform
              </p>
              <h2 className="text-2xl font-semibold text-text">Build on Lynko APIs.</h2>
              <p className="text-sm text-text-muted">
                Create and manage links programmatically. Use secure tokens, webhooks, and
                enterprise-ready docs.
              </p>
              <div className="rounded-lg border border-border/70 bg-white p-4 text-xs text-text-muted">
                <div className="flex items-center justify-between">
                  <span>POST /v1/links</span>
                  <span className="text-primary">201</span>
                </div>
                <pre className="mt-3 whitespace-pre-wrap font-mono text-[11px] text-text">
{`{
  "url": "https://lynko.io",
  "alias": "launch",
  "domain": "ln.ky"
}`}
                </pre>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-text">Ship reliable link flows.</h2>
            <p className="text-sm text-text-muted">
              Lynko integrates with your marketing stack, product surfaces, and internal tooling.
              Launch faster with SDKs, webhooks, and analytics exports.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {['SDKs in JS, Python, and Go', 'Structured analytics exports', 'Webhook events', 'Role-based access'].map(
                (item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-lg border border-border/70 bg-surface p-4 text-sm text-text"
                  >
                    <Check size={16} className="text-primary" />
                    {item}
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border/70 bg-white" id="pricing">
        <div className="mx-auto w-full max-w-[1200px] px-6 py-16">
          <div className="flex flex-col gap-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
              Pricing
            </p>
            <h2 className="text-3xl font-semibold text-text">Plans that scale with you.</h2>
            <p className="text-sm text-text-muted">
              Transparent pricing for startups, agencies, and enterprise teams.
            </p>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`space-y-5 ${plan.highlight ? 'border-primary/50 shadow-medium' : ''}`}
              >
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-text">{plan.name}</p>
                  <p className="text-3xl font-semibold text-text">{plan.price}</p>
                  <p className="text-sm text-text-muted">{plan.description}</p>
                </div>
                <ul className="space-y-2 text-sm text-text-muted">
                  {plan.features.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <Check size={16} className="text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button variant={plan.highlight ? 'primary' : 'secondary'} className="w-full">
                  {plan.highlight ? 'Start Growth' : 'Choose plan'}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border/70 bg-white" id="faq">
        <div className="mx-auto w-full max-w-[1200px] px-6 py-16">
          <div className="flex flex-col gap-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
              FAQ
            </p>
            <h2 className="text-3xl font-semibold text-text">Answers for teams evaluating Lynko.</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-card border border-border/70 bg-white p-5"
              >
                <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-text">
                  {faq.question}
                  <ArrowRight size={16} className="transition-transform group-open:rotate-90" />
                </summary>
                <p className="mt-3 text-sm text-text-muted">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto w-full max-w-[1200px] px-6 py-16">
          <div className="rounded-card border border-border/70 bg-surface p-10 text-center">
            <h2 className="text-3xl font-semibold text-text">
              Ready to launch links that perform?
            </h2>
            <p className="mt-3 text-sm text-text-muted">
              Join teams already using Lynko to manage campaigns and track performance.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button as={Link} to={isAuthenticated ? '/dashboard' : '/signup'} size="lg">
                Start Free
              </Button>
              <Button variant="secondary" size="lg">
                Talk to sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/70 bg-white">
        <div className="mx-auto grid w-full max-w-[1200px] gap-8 px-6 py-10 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white">
                <div className="h-3.5 w-3.5 rounded-sm bg-primary" />
              </div>
              <p className="text-base font-semibold text-text">Lynko</p>
            </div>
            <p className="text-sm text-text-muted">
              The premium link management platform for modern teams.
            </p>
          </div>
          {[
            {
              title: 'Product',
              links: ['Features', 'Pricing', 'Security', 'Status'],
            },
            {
              title: 'Company',
              links: ['About', 'Careers', 'Partners', 'Contact'],
            },
            {
              title: 'Resources',
              links: ['Docs', 'API', 'Guides', 'Support'],
            },
          ].map((group) => (
            <div key={group.title} className="space-y-2 text-sm text-text-muted">
              <p className="text-sm font-semibold text-text">{group.title}</p>
              {group.links.map((item) => (
                <p key={item} className="hover:text-text">
                  {item}
                </p>
              ))}
            </div>
          ))}
        </div>
      </footer>
    </div>
  )
}

export default Home
