import React from 'react'

export default function LoadingButton({
  children,
  loading = false,
  disabled = false,
  variant = 'primary',
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  const baseStyle =
    'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'

  const variants = {
    primary:
      'bg-primary text-white hover:bg-primary/95 focus:ring-primary/50 disabled:hover:bg-primary',
    secondary:
      'border border-border bg-surface text-text hover:bg-background focus:ring-border/50 disabled:hover:bg-surface',
  }

  const spinnerColors = {
    primary: 'border-white',
    secondary: 'border-text-muted border-t-primary',
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {loading && (
        <div
          className={`h-4 w-4 animate-spin rounded-full border-2 border-t-transparent ${
            spinnerColors[variant] || spinnerColors.primary
          }`}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </button>
  )
}
export { LoadingButton }
