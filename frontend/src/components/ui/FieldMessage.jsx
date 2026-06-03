import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react'
import clsx from 'clsx'

const TONE_CONFIG = {
  error: {
    icon: AlertCircle,
    classes: 'border-error bg-error/5 text-error',
  },
  success: {
    icon: CheckCircle2,
    classes: 'border-secondary bg-secondary/5 text-secondary',
  },
  warning: {
    icon: AlertTriangle,
    classes: 'border-[#b45309] bg-[#b45309]/5 text-[#b45309]',
  },
  info: {
    icon: Info,
    classes: 'border-primary bg-primary/5 text-primary',
  },
  muted: {
    icon: Info,
    classes: 'border-primary/30 bg-surface-container-low text-on-surface-variant',
  },
}

/**
 * FieldMessage — a neo-brutalist inline feedback banner for forms.
 * tone: 'error' | 'success' | 'warning' | 'info' | 'muted'
 */
const FieldMessage = ({ children, tone = 'muted', className }) => {
  if (!children) return null

  const config = TONE_CONFIG[tone] ?? TONE_CONFIG.muted
  const Icon = config.icon

  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={clsx(
        'flex items-start gap-2.5 rounded-md border px-4 py-3 animate-[fadeSlideIn_0.15s_ease-out]',
        config.classes,
        className,
      )}
    >
      <Icon size={14} className="mt-0.5 shrink-0" />
      <p className="text-xs font-medium leading-snug">{children}</p>
    </div>
  )
}

export default FieldMessage
