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
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="border-b-2 border-primary bg-white">
        <div className="mx-auto grid w-full max-w-[1200px] gap-12 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col justify-center gap-6">
            <p className="inline-flex w-fit items-center gap-2 rounded-none border-2 border-primary bg-secondary-container px-3 py-1.5 text-xs font-bold font-space text-primary uppercase select-none">
              <span className="h-2 w-2 rounded-none bg-primary" />
              Trusted link management for modern teams
            </p>
            <div className="space-y-4">
              <h1 className="text-4xl font-anton uppercase tracking-wider text-primary leading-tight md:text-5xl">
                Branded links that drive more clicks.
              </h1>
              <p className="text-base font-medium text-on-surface-variant md:text-lg">
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
            <div className="flex flex-wrap items-center gap-6 font-space text-xs font-bold uppercase text-primary pt-2">
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
            <div className="w-full rounded-none border-2 border-primary bg-white p-6 shadow-brutal">
              <div className="flex items-center justify-between border-b-2 border-primary pb-3 mb-6">
                <p className="font-anton text-sm uppercase tracking-wider text-primary">Campaign dashboard</p>
                <span className="rounded-none border-2 border-primary bg-secondary-container px-3 py-1 text-xs font-bold font-space text-primary uppercase">
                  Live
                </span>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {stats.slice(0, 2).map((stat) => (
                  <div key={stat.label} className="rounded-none border-2 border-primary bg-white p-4 shadow-brutal-sm">
                    <p className="font-space text-[10px] font-bold uppercase text-on-surface-variant">{stat.label}</p>
                    <p className="mt-2 text-2xl font-anton text-primary">{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-none border-2 border-dashed border-primary bg-surface-container-low p-4">
                <div className="flex items-center justify-between font-space text-[10px] font-bold uppercase text-primary">
                  <span>Clicks by channel</span>
                  <span>Last 7 days</span>
                </div>
                <div className="mt-4 h-24 rounded-none border-2 border-primary bg-white flex items-center justify-center">
                  <span className="font-space text-xs text-on-surface-variant/40 font-bold uppercase">Analytics visualizer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust/Logo Cloud */}
      <section className="border-b-2 border-primary bg-white" id="solutions">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-6 py-12">
          <p className="text-center font-space text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Trusted by modern teams worldwide
          </p>
          <div className="grid grid-cols-2 gap-4 text-xs font-space font-bold uppercase text-primary sm:grid-cols-3 lg:grid-cols-6">
            {['Nova', 'Skyline', 'Vector', 'Beacon', 'Vertex', 'Aurora'].map((name) => (
              <div
                key={name}
                className="flex items-center justify-center rounded-none border-2 border-primary bg-white py-3 shadow-brutal-sm"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="border-b-2 border-primary bg-white" id="features">
        <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <p className="font-space text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Product showcase
            </p>
            <h2 className="text-3xl font-anton uppercase tracking-wider text-primary leading-tight">
              Everything your team needs to manage links at scale.
            </h2>
            <p className="text-sm font-medium text-on-surface-variant leading-relaxed">
              Centralize links, track conversions, and share performance insights across every
              team. Lynko unifies branded links, QR codes, and routing into a single workspace.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-none border-2 border-primary bg-surface-container-low p-4 shadow-brutal-sm">
                  <p className="font-space text-[10px] font-bold uppercase text-on-surface-variant">{stat.label}</p>
                  <p className="mt-2 text-xl font-anton text-primary">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-none border-2 border-primary bg-white p-6 shadow-brutal">
            <div className="space-y-4">
              <div className="rounded-none border-2 border-primary bg-white p-4 shadow-brutal-sm">
                <p className="font-space text-[10px] font-bold uppercase text-on-surface-variant">Top performing link</p>
                <p className="mt-2 text-sm font-bold text-secondary">lynko.io/launch</p>
                <p className="mt-1 font-space text-[9px] font-bold uppercase text-secondary">+24% week over week</p>
              </div>
              <div className="rounded-none border-2 border-primary bg-white p-4 shadow-brutal-sm">
                <p className="font-space text-[10px] font-bold uppercase text-on-surface-variant">Audience split</p>
                <div className="mt-4 h-24 rounded-none border-2 border-dashed border-primary bg-surface-container-low flex items-center justify-center">
                  <span className="font-space text-[10px] text-on-surface-variant/40 font-bold uppercase">Chart visualizer</span>
                </div>
              </div>
              <div className="rounded-none border-2 border-primary bg-white p-4 shadow-brutal-sm">
                <p className="font-space text-[10px] font-bold uppercase text-on-surface-variant">Click trends</p>
                <div className="mt-4 h-24 rounded-none border-2 border-dashed border-primary bg-surface-container-low flex items-center justify-center">
                  <span className="font-space text-[10px] text-on-surface-variant/40 font-bold uppercase">Chart visualizer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Section */}
      <section className="border-b-2 border-primary bg-white" id="analytics">
        <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <p className="font-space text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Analytics
            </p>
            <h2 className="text-3xl font-anton uppercase tracking-wider text-primary leading-tight">
              See every click and conversion in real time.
            </h2>
            <p className="text-sm font-medium text-on-surface-variant leading-relaxed">
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
                <div key={item.label} className="rounded-none border-2 border-primary bg-white p-4 shadow-brutal-sm">
                  <p className="font-space text-[10px] font-bold uppercase text-on-surface-variant">{item.label}</p>
                  <p className="mt-2 text-xl font-anton text-primary">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-none border-2 border-primary bg-white p-6 shadow-brutal">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-primary/20 pb-2">
                <p className="font-space text-xs font-bold uppercase text-primary">Conversion funnel</p>
                <span className="font-space text-[10px] font-bold text-on-surface-variant uppercase">This quarter</span>
              </div>
              <div className="h-48 rounded-none border-2 border-dashed border-primary bg-surface-container-low flex items-center justify-center">
                <span className="font-space text-xs text-on-surface-variant/40 font-bold uppercase">Funnel visualizer</span>
              </div>
              <div className="grid gap-3 text-xs font-space font-bold uppercase text-primary">
                {['Email campaigns', 'Paid social', 'Partner links'].map((item) => (
                  <div key={item} className="flex items-center justify-between bg-surface-container-low p-2 border border-primary">
                    <span>{item}</span>
                    <span className="text-secondary">{Math.floor(Math.random() * 30 + 20)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Grid */}
      <section className="border-b-2 border-primary bg-white">
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
              <Card key={item.title} className="space-y-3" shadowSize="sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-none border-2 border-primary bg-surface-container-low">
                  <item.icon size={18} className="text-primary" />
                </div>
                <h3 className="text-lg font-anton uppercase text-primary">{item.title}</h3>
                <p className="text-sm font-medium text-on-surface-variant leading-relaxed">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-b-2 border-primary bg-white">
        <div className="mx-auto w-full max-w-[1200px] px-6 py-16">
          <div className="flex flex-col gap-4 text-center max-w-xl mx-auto mb-12">
            <p className="font-space text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Features
            </p>
            <h2 className="text-3xl font-anton uppercase text-primary">
              Built for performance, flexibility, and growth.
            </h2>
            <p className="text-sm font-medium text-on-surface-variant">
              Everything you need to launch branded links faster and measure what matters.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="space-y-3" shadowSize="sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-none border-2 border-primary bg-surface-container-low">
                  <feature.icon size={18} className="text-primary" />
                </div>
                <h3 className="text-base font-anton uppercase text-primary">{feature.title}</h3>
                <p className="text-sm font-medium text-on-surface-variant leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section className="border-b-2 border-primary bg-white" id="developers">
        <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-none border-2 border-primary bg-white p-6 shadow-brutal">
            <div className="space-y-3">
              <p className="font-space text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Developer platform
              </p>
              <h2 className="text-2xl font-anton uppercase text-primary">Build on Lynko APIs.</h2>
              <p className="text-sm font-medium text-on-surface-variant leading-relaxed">
                Create and manage links programmatically. Use secure tokens, webhooks, and
                enterprise-ready docs.
              </p>
              <div className="rounded-none border-2 border-primary bg-surface-container-low p-4 text-xs font-space text-primary">
                <div className="flex items-center justify-between border-b border-primary/20 pb-2 mb-3">
                  <span>POST /v1/links</span>
                  <span className="text-secondary font-bold">201</span>
                </div>
                <pre className="whitespace-pre-wrap font-mono text-[11px] text-primary">
{`{
  "url": "https://lynko.io",
  "alias": "launch",
  "domain": "ln.ky"
}`}
                </pre>
              </div>
            </div>
          </div>
          <div className="space-y-6 flex flex-col justify-center">
            <h2 className="text-3xl font-anton uppercase text-primary">Ship reliable link flows.</h2>
            <p className="text-sm font-medium text-on-surface-variant leading-relaxed">
              Lynko integrates with your marketing stack, product surfaces, and internal tooling.
              Launch faster with SDKs, webhooks, and analytics exports.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {['SDKs in JS, Python, and Go', 'Structured analytics exports', 'Webhook events', 'Role-based access'].map(
                (item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-none border-2 border-primary bg-white p-4 text-xs font-bold font-space uppercase text-primary shadow-brutal-sm"
                  >
                    <Check size={16} className="text-secondary" />
                    {item}
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="border-b-2 border-primary bg-white" id="pricing">
        <div className="mx-auto w-full max-w-[1200px] px-6 py-16">
          <div className="flex flex-col gap-4 text-center max-w-xl mx-auto mb-12">
            <p className="font-space text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Pricing
            </p>
            <h2 className="text-3xl font-anton uppercase text-primary">Plans that scale with you.</h2>
            <p className="text-sm font-medium text-on-surface-variant">
              Transparent pricing for startups, agencies, and enterprise teams.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`space-y-5 flex flex-col justify-between ${
                  plan.highlight 
                    ? 'border-4 border-primary bg-secondary-container shadow-brutal-lg' 
                    : 'border-2 border-primary bg-white shadow-brutal'
                }`}
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="font-space text-xs font-bold uppercase text-primary">{plan.name}</p>
                    <p className="text-4xl font-anton text-primary">{plan.price}</p>
                    <p className="text-xs font-medium text-on-surface-variant leading-relaxed">{plan.description}</p>
                  </div>
                  <ul className="space-y-2 text-xs font-space font-bold uppercase text-primary border-t border-primary/20 pt-4">
                    {plan.features.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <Check size={14} className="text-secondary shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button variant={plan.highlight ? 'primary' : 'secondary'} className="w-full mt-4">
                  {plan.highlight ? 'Start Growth' : 'Choose plan'}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-b-2 border-primary bg-white" id="faq">
        <div className="mx-auto w-full max-w-[1200px] px-6 py-16">
          <div className="flex flex-col gap-4 text-center max-w-xl mx-auto mb-12">
            <p className="font-space text-xs font-bold uppercase tracking-[0.2em] text-primary">
              FAQ
            </p>
            <h2 className="text-3xl font-anton uppercase text-primary">Answers for teams evaluating Lynko.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-none border-2 border-primary bg-white p-5 shadow-brutal-sm cursor-pointer select-none"
              >
                <summary className="flex items-center justify-between text-sm font-anton uppercase tracking-wider text-primary">
                  {faq.question}
                  <ArrowRight size={16} className="transition-transform group-open:rotate-90 text-primary" />
                </summary>
                <p className="mt-3 text-xs font-space font-semibold text-on-surface-variant leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Call to Action */}
      <section className="bg-white">
        <div className="mx-auto w-full max-w-[1200px] px-6 py-16">
          <div className="rounded-none border-2 border-primary bg-surface-container-low p-10 text-center shadow-brutal">
            <h2 className="text-3xl font-anton uppercase text-primary">
              Ready to launch links that perform?
            </h2>
            <p className="mt-3 text-sm font-medium text-on-surface-variant">
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

      {/* Footer */}
      <footer className="border-t-2 border-primary bg-white">
        <div className="mx-auto grid w-full max-w-[1200px] gap-8 px-6 py-10 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-none border-2 border-primary bg-white">
                <div className="h-3.5 w-3.5 rounded-none bg-primary" />
              </div>
              <p className="text-lg font-anton uppercase tracking-wider text-primary">Lynko</p>
            </div>
            <p className="text-xs font-medium text-on-surface-variant leading-relaxed">
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
            <div key={group.title} className="space-y-2 text-xs font-space font-bold uppercase text-primary">
              <p className="text-sm font-space font-bold uppercase text-primary border-b border-primary/20 pb-1">{group.title}</p>
              {group.links.map((item) => (
                <p key={item} className="hover:text-secondary cursor-pointer transition-colors">
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
