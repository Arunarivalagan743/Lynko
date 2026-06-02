import React from 'react'

export default function SkeletonCard({ variant = 'dashboard', className = '' }) {
  const shimmerClass = 'animate-pulse bg-border/60 rounded'

  if (variant === 'analytics') {
    return (
      <div className={`rounded-lg border border-border bg-surface p-4 space-y-3 ${className}`}>
        <div className={`h-4 w-24 ${shimmerClass}`} />
        <div className={`h-8 w-16 ${shimmerClass}`} />
        <div className={`h-3 w-32 ${shimmerClass}`} />
      </div>
    )
  }

  if (variant === 'qr') {
    return (
      <div className={`rounded-lg border border-border bg-surface p-6 flex flex-col items-center justify-center space-y-4 ${className}`}>
        <div className="flex justify-between w-full">
          <div className={`h-3 w-16 ${shimmerClass}`} />
          <div className={`h-3 w-8 ${shimmerClass}`} />
        </div>
        <div className={`h-40 w-40 ${shimmerClass} rounded-lg`} />
        <div className="flex gap-3 w-full justify-center mt-2">
          <div className={`h-9 w-24 ${shimmerClass}`} />
          <div className={`h-9 w-24 ${shimmerClass}`} />
        </div>
      </div>
    )
  }

  // Default: dashboard summary card
  return (
    <div className={`rounded-lg border border-border bg-surface p-5 space-y-4 ${className}`}>
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className={`h-5 w-48 ${shimmerClass}`} />
          <div className={`h-3 w-32 ${shimmerClass}`} />
        </div>
        <div className={`h-8 w-8 ${shimmerClass} rounded-full`} />
      </div>
      <div className="space-y-2 pt-2">
        <div className={`h-4 w-full ${shimmerClass}`} />
        <div className={`h-4 w-2/3 ${shimmerClass}`} />
      </div>
    </div>
  )
}
export { SkeletonCard }
