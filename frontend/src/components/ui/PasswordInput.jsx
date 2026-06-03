import { forwardRef, useState } from 'react'
import { Eye, EyeOff, AlertCircle, CheckCircle2, Info } from 'lucide-react'
import clsx from 'clsx'

const PasswordInput = forwardRef(
  ({ label, hint, error, success, required, className, inputClassName, ...props }, ref) => {
    const [visible, setVisible] = useState(false)

    const hasError = Boolean(error)
    const hasSuccess = Boolean(success) && !hasError

    return (
      <div className={clsx('flex w-full flex-col gap-1.5', className)}>
        {label && (
          <label className="flex items-center gap-1 text-sm font-semibold text-primary">
            {label}
            {required && <span className="text-error ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={visible ? 'text' : 'password'}
            className={clsx(
              'h-11 w-full rounded-md border-2 bg-white px-4 pr-11 text-sm text-on-surface placeholder:text-on-surface-variant/40 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1',
              hasError
                ? 'border-error focus:border-error focus:ring-error/20'
                : hasSuccess
                  ? 'border-secondary focus:border-secondary focus:ring-secondary/20'
                  : 'border-primary/50 focus:border-primary focus:ring-primary/15',
              inputClassName,
            )}
            aria-invalid={hasError}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-on-surface-variant transition-colors hover:text-primary"
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            {visible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* Hint */}
        {hint && !hasError && !hasSuccess && (
          <span className="flex items-center gap-1.5 text-xs text-on-surface-variant">
            <Info size={11} className="shrink-0 opacity-60" />
            {hint}
          </span>
        )}

        {/* Error */}
        {hasError && (
          <span
            role="alert"
            className="flex items-start gap-1.5 animate-[fadeSlideIn_0.15s_ease-out] text-xs font-medium text-error"
          >
            <AlertCircle size={12} className="mt-0.5 shrink-0" />
            {error}
          </span>
        )}

        {/* Success */}
        {hasSuccess && (
          <span className="flex items-start gap-1.5 animate-[fadeSlideIn_0.15s_ease-out] text-xs font-medium text-secondary">
            <CheckCircle2 size={12} className="mt-0.5 shrink-0" />
            {success}
          </span>
        )}
      </div>
    )
  },
)

PasswordInput.displayName = 'PasswordInput'

export default PasswordInput
