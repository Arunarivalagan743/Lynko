import { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import clsx from 'clsx'

const PasswordInput = forwardRef(
  ({ label, hint, error, className, inputClassName, ...props }, ref) => {
    const [visible, setVisible] = useState(false)

    return (
      <label className="flex w-full flex-col gap-1.5 text-sm className">
        {label && (
          <span className="font-space text-xs font-bold uppercase tracking-wider text-primary">
            {label}
          </span>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={visible ? 'text' : 'password'}
            className={clsx(
              'h-11 w-full rounded-none border-2 border-primary bg-white px-3 pr-11 font-sans text-sm text-on-background placeholder:text-on-surface-variant/50 transition-colors focus:border-secondary focus:outline-none focus:ring-0',
              error && 'border-error focus:border-error',
              inputClassName,
            )}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-on-surface-variant transition-colors hover:text-primary"
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            {visible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {hint && !error && <span className="font-space text-[10px] text-text-muted">{hint}</span>}
        {error && <span className="font-space text-[10px] text-error font-semibold">{error}</span>}
      </label>
    )
  },
)

PasswordInput.displayName = 'PasswordInput'

export default PasswordInput
