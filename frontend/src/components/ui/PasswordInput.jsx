import { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import clsx from 'clsx'

const PasswordInput = forwardRef(
  ({ label, hint, error, className, inputClassName, ...props }, ref) => {
    const [visible, setVisible] = useState(false)

    return (
      <label className="flex w-full flex-col gap-2 text-sm">
        <span className="text-sm font-medium text-text">{label}</span>
        <div className="relative">
          <input
            ref={ref}
            type={visible ? 'text' : 'password'}
            className={clsx(
              'h-11 w-full rounded-lg border border-border bg-white px-3 pr-11 text-sm text-text transition-colors placeholder:text-text-muted/70 focus:border-primary/70 focus:outline-none focus:ring-2 focus:ring-primary/20',
              error && 'border-error/70 focus:border-error/70 focus:ring-error/20',
              inputClassName,
            )}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-text-muted transition-colors hover:text-text"
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            {visible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {hint && !error && <span className="text-xs text-text-muted">{hint}</span>}
        {error && <span className="text-xs text-error">{error}</span>}
      </label>
    )
  },
)

PasswordInput.displayName = 'PasswordInput'

export default PasswordInput
