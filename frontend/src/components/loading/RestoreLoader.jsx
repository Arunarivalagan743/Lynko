import React from 'react'

export default function RestoreLoader({ label = 'Restoring your session' }) {
  return (
    <div className="flex min-h-[calc(100vh-64px)] w-full items-center justify-center bg-background px-6 text-primary">
      <div className="flex items-center gap-3 rounded-none border-2 border-primary bg-white px-5 py-2.5 text-sm text-primary font-bold shadow-brutal-sm font-space">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-secondary" />
        <span>{label}</span>
      </div>
    </div>
  )
}
export { RestoreLoader }
