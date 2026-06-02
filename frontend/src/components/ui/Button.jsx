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
          'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60',
          size === 'md' && 'h-11 px-5',
          size === 'lg' && 'h-12 px-6',
          variant === 'primary' && 'bg-primary text-white shadow-subtle hover:bg-primary/90',
          variant === 'secondary' &&
            'border border-border bg-white text-text hover:border-primary/40 hover:text-primary',
          variant === 'ghost' && 'bg-transparent text-text hover:bg-surface',
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
