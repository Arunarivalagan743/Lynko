import React from 'react'
import Button from '../ui/Button.jsx'

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
  return (
    <Button
      type={type}
      disabled={disabled}
      loading={loading}
      variant={variant}
      className={className}
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  )
}
export { LoadingButton }
