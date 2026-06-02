import { forwardRef } from 'react'
import clsx from 'clsx'

const Input = forwardRef(
  (
    { label, hint, error, className, inputClassName, type = 'text', ...props },
    ref,
  ) => {
    return (
      <label className="flex w-full flex-col gap-2 text-sm">
        {label && (
          <span className="font-space text-[13px] font-bold uppercase tracking-wider text-primary">
            {label}
          </span>
        )}
        <input
          ref={ref}
          type={type}
          className={clsx(
            'h-12 rounded-none border-2 border-primary bg-white px-4 font-sans text-sm text-on-surface placeholder:text-on-surface-variant/45 transition-colors focus:border-secondary focus:outline-none focus:ring-0',
            error && 'border-error focus:border-error',
            inputClassName,
          )}
          {...props}
        />
        {hint && !error && <span className="font-space text-[11px] text-text-muted">{hint}</span>}
        {error && <span className="font-space text-[11px] text-error font-semibold">{error}</span>}
      </label>
    )
  },
)

Input.displayName = 'Input'

export default Input
