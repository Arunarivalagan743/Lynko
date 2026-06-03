import { forwardRef } from 'react'
import clsx from 'clsx'
import { AlertCircle, CheckCircle2, Info } from 'lucide-react'

const Input = forwardRef(
  (
    {
      label,
      hint,
      error,
      success,
      required,
      className,
      inputClassName,
      type = 'text',
      ...props
    },
    ref,
  ) => {
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
        <input
          ref={ref}
          type={type}
          className={clsx(
            'h-11 w-full rounded-md border-2 bg-white px-4 text-sm text-on-surface placeholder:text-on-surface-variant/40 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1',
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

Input.displayName = 'Input'

export default Input
