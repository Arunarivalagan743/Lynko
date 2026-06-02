import React from 'react'

export default function PageLoader({ message = 'Loading application assets...' }) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background text-primary">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-secondary" />
        {message && <p className="font-space text-sm font-bold uppercase text-on-surface-variant">{message}</p>}
      </div>
    </div>
  )
}
export { PageLoader }
