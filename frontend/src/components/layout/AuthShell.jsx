import Card from '../ui/Card.jsx'
import Logo from '../ui/Logo.jsx'
import { motion } from 'framer-motion'
import { Link2, BarChart3, QrCode, TrendingUp } from 'lucide-react'

const features = [
  {
    icon: Link2,
    text: 'Create branded short links instantly',
  },
  {
    icon: BarChart3,
    text: 'Track clicks with detailed analytics',
  },
  {
    icon: QrCode,
    text: 'Generate QR codes for every URL',
  },
  {
    icon: TrendingUp,
    text: 'Monitor engagement and growth',
  },
]

const AuthShell = ({ title, subtitle, children, footer, illustration }) => {
  return (
    <motion.main
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="min-h-[calc(100vh-64px)] bg-background flex items-center justify-center"
    >
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-12 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr]">

        {/* Auth Form */}
        <div className="flex flex-col justify-center">
          <Card className="space-y-6" dogEar shadowSize="lg">
            <div className="flex items-center gap-3">
              <Logo size="md" variant="full" />
            </div>

            <div className="space-y-2 border-b border-outline-variant pb-4">
              <h1 className="font-anton text-page uppercase text-primary leading-none">
                {title}
              </h1>

              <p className="font-inter text-sm text-on-surface-variant">
                {subtitle}
              </p>
            </div>

            <div className="pt-2">
              {children}
            </div>

            {footer && (
              <div className="border-t border-outline-variant pt-4">
                <div className="font-inter text-sm text-on-surface-variant">
                  {footer}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Panel */}
        <div className="hidden items-center justify-center lg:flex">
          {illustration ? (
            <div className="w-full flex justify-center items-center">
              <img
                src={illustration}
                alt=""
                className="w-full max-w-lg h-auto object-contain shadow-none"
              />
            </div>
          ) : (
            <div className="w-full rounded-card border border-outline-variant bg-surface-container-low p-10 shadow-subtle">
              <div className="space-y-8">

                <div className="space-y-4">
                  <Logo size="lg" variant="full" />

                  <h2 className="font-anton text-section uppercase text-primary">
                    Grow Your Power.
                  </h2>

                  <p className="font-inter text-sm leading-relaxed text-on-surface-variant">
                    Shorten links, track performance, generate QR codes,
                    and gain valuable insights from every click.
                  </p>
                </div>

                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.text}
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.15 + index * 0.1,
                        duration: 0.3,
                      }}
                      className="flex items-center gap-4"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-md border border-outline-variant bg-white">
                        <feature.icon
                          size={18}
                          className="text-primary"
                        />
                      </div>

                      <span className="font-inter text-sm font-medium text-on-surface">
                        {feature.text}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <div className="border-t border-outline-variant pt-5">
                  <p className="font-space text-[10px] uppercase tracking-[0.25em] text-primary/60">
                    URL SHORTENING • ANALYTICS • QR CODES • ENGAGEMENT
                  </p>
                </div>

              </div>
            </div>
          )}
        </div>

      </div>
    </motion.main>
  )
}

export default AuthShell