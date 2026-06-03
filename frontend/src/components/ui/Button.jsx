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
          'inline-flex items-center justify-center gap-2 rounded-none font-semibold transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:translate-x-0 disabled:translate-y-0',
          // Sizes
          size === 'sm' && 'h-9 px-3.5 text-xs',
          size === 'md' && 'h-12 px-5 text-sm',
          size === 'lg' && 'h-[52px] px-6 text-sm',
          size === 'xl' && 'h-14 px-8 text-base font-anton uppercase tracking-wider',
          // Variants
          variant === 'primary' && 'border-2 border-primary bg-primary text-white shadow-brutal hover:bg-primary-container active:translate-x-[4px] active:translate-y-[4px] active:shadow-none',
          variant === 'secondary' &&
          'border-2 border-primary bg-white text-primary shadow-brutal hover:bg-surface-container-low active:translate-x-[4px] active:translate-y-[4px] active:shadow-none',
          variant === 'ghost' && 'bg-transparent text-primary hover:bg-surface-container-low border border-transparent',
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
