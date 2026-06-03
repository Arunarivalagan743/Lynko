import React from 'react'

export default function SkeletonCard({ variant = 'dashboard', className = '' }) {
  const shimmerClass = 'animate-pulse bg-primary/10 rounded-md'

  if (variant === 'analytics') {
    return (
      <div className={`rounded-card border border-primary/15 bg-white p-6 space-y-3 shadow-sm ${className}`}>
        <div className={`h-4 w-24 ${shimmerClass}`} />
        <div className={`h-8 w-16 ${shimmerClass}`} />
        <div className={`h-3 w-32 ${shimmerClass}`} />
      </div>
    )
  }

  if (variant === 'qr') {
    return (
      <div className={`rounded-card border border-primary/15 bg-white p-6 flex flex-col items-center justify-center space-y-4 shadow-sm ${className}`}>
        <div className="flex justify-between w-full">
          <div className={`h-3 w-16 ${shimmerClass}`} />
          <div className={`h-3 w-8 ${shimmerClass}`} />
        </div>
        <div className={`h-40 w-40 ${shimmerClass}`} />
        <div className="flex gap-3 w-full justify-center mt-2">
          <div className={`h-9 w-24 ${shimmerClass}`} />
          <div className={`h-9 w-24 ${shimmerClass}`} />
        </div>
      </div>
    )
  }

  // Default: dashboard summary card
  return (
    <div className={`rounded-card border border-primary/15 bg-white p-6 space-y-4 shadow-sm ${className}`}>
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className={`h-5 w-48 ${shimmerClass}`} />
          <div className={`h-3 w-32 ${shimmerClass}`} />
        </div>
        <div className={`h-8 w-8 ${shimmerClass}`} />
      </div>
      <div className="space-y-2 pt-2">
        <div className={`h-4 w-full ${shimmerClass}`} />
        <div className={`h-4 w-2/3 ${shimmerClass}`} />
      </div>
    </div>
  )
}
export { SkeletonCard }
