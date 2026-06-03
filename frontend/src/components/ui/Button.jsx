import { forwardRef } from 'react'
import clsx from 'clsx'
import Spinner from './Spinner.jsx'

const Button = forwardRef(
  (
    {
      as: Comp = 'button',
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading

    return (
      <Comp
        ref={ref}
        className={clsx(
          // Base
          'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55 disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-none',
          // Border radius — md (8px) for soft brutalism
          'rounded-md',
          // Sizes
          size === 'sm' && 'h-8 px-3 text-xs',
          size === 'md' && 'h-10 px-4 text-sm',
          size === 'lg' && 'h-11 px-5 text-sm',
          size === 'xl' && 'h-12 px-7 text-sm font-bold uppercase tracking-wide',
          // Variants
          variant === 'primary' &&
          'border-2 border-primary bg-primary text-white shadow-brutal hover:bg-primary/90 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none',
          variant === 'secondary' &&
          'border-2 border-primary bg-white text-primary shadow-brutal hover:bg-surface-container-low active:translate-x-[3px] active:translate-y-[3px] active:shadow-none',
          variant === 'danger' &&
          'border-2 border-error bg-error text-white shadow-brutal hover:bg-error/90 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none',
          variant === 'ghost' &&
          'bg-transparent text-primary hover:bg-surface-container-low border border-transparent hover:border-primary/20',
          variant === 'outline' &&
          'border-2 border-primary bg-transparent text-primary hover:bg-surface-container-low',
          className,
        )}
        disabled={Comp === 'button' ? isDisabled : undefined}
        aria-disabled={Comp !== 'button' && isDisabled ? true : undefined}
        {...props}
      >
        {loading && <Spinner className="h-4 w-4" />}
        {props.children}
      </Comp>
    )
  },
)

Button.displayName = 'Button'

export default Button
