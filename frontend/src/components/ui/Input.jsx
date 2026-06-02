import { forwardRef } from 'react'
import clsx from 'clsx'

const Input = forwardRef(
  (
    { label, hint, error, className, inputClassName, type = 'text', ...props },
    ref,
  ) => {
    return (
      <label className="flex w-full flex-col gap-2 text-sm">
        <span className="text-sm font-medium text-text">{label}</span>
        <input
          ref={ref}
          type={type}
          className={clsx(
            'h-11 rounded-lg border border-border bg-white px-3 text-sm text-text transition-colors placeholder:text-text-muted/70 focus:border-primary/70 focus:outline-none focus:ring-2 focus:ring-primary/20',
            error && 'border-error/70 focus:border-error/70 focus:ring-error/20',
            inputClassName,
          )}
          {...props}
        />
        {hint && !error && <span className="text-xs text-text-muted">{hint}</span>}
        {error && <span className="text-xs text-error">{error}</span>}
      </label>
    )
  },
)

Input.displayName = 'Input'

export default Input
