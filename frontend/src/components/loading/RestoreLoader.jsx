import React from 'react'

export default function RestoreLoader({ label = 'Restoring your session' }) {
  return (
    <div className="flex min-h-[calc(100vh-64px)] w-full items-center justify-center bg-background px-6 text-text">
      <div className="flex items-center gap-3 rounded-full border border-border/70 bg-surface px-4 py-2 text-sm text-text-muted shadow-subtle">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-border/60 border-t-primary" />
        <span>{label}</span>
      </div>
    </div>
  )
}
export { RestoreLoader }
