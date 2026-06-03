import React from 'react'

export default function SkeletonTable({ variant = 'urls', rowsCount = 5, className = '' }) {
  const shimmerClass = 'animate-pulse bg-primary/10 rounded-md'
  const rows = Array.from({ length: rowsCount })

  if (variant === 'visits') {
    return (
      <div className={`w-full overflow-hidden rounded-lg border border-primary/15 bg-white shadow-sm ${className}`}>
        <div className="border-b border-primary/15 bg-surface-container-low p-4 flex gap-4">
          <div className={`h-4 w-28 ${shimmerClass}`} />
          <div className={`h-4 w-20 ${shimmerClass}`} />
          <div className={`h-4 w-24 ${shimmerClass}`} />
          <div className={`h-4 w-32 ${shimmerClass}`} />
        </div>
        <div className="divide-y divide-primary/10">
          {rows.map((_, i) => (
            <div key={i} className="p-4 flex gap-4 items-center">
              <div className={`h-4 w-28 ${shimmerClass}`} />
              <div className={`h-4 w-20 ${shimmerClass}`} />
              <div className={`h-4 w-24 ${shimmerClass}`} />
              <div className={`h-4 w-32 ${shimmerClass}`} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (variant === 'bulk') {
    return (
      <div className={`w-full overflow-hidden rounded-lg border border-primary/15 bg-white shadow-sm ${className}`}>
        <div className="border-b border-primary/15 bg-surface-container-low p-4 flex justify-between">
          <div className={`h-4 w-12 ${shimmerClass}`} />
          <div className={`h-4 w-40 ${shimmerClass}`} />
          <div className={`h-4 w-28 ${shimmerClass}`} />
          <div className={`h-4 w-16 ${shimmerClass}`} />
        </div>
        <div className="divide-y divide-primary/10">
          {rows.map((_, i) => (
            <div key={i} className="p-4 flex justify-between items-center">
              <div className={`h-4 w-12 ${shimmerClass}`} />
              <div className={`h-4 w-40 ${shimmerClass}`} />
              <div className={`h-4 w-28 ${shimmerClass}`} />
              <div className={`h-4 w-16 ${shimmerClass}`} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Default: URLs lists table
  return (
    <div className={`w-full overflow-hidden rounded-lg border border-primary/15 bg-white shadow-sm ${className}`}>
      <div className="border-b border-primary/15 bg-surface-container-low p-4 flex justify-between items-center">
        <div className={`h-4 w-60 ${shimmerClass}`} />
        <div className="flex gap-4">
          <div className={`h-4 w-16 ${shimmerClass}`} />
          <div className={`h-4 w-16 ${shimmerClass}`} />
        </div>
      </div>
      <div className="divide-y divide-primary/10">
        {rows.map((_, i) => (
          <div key={i} className="p-5 flex justify-between items-center">
            <div className="space-y-2">
              <div className={`h-4 w-48 ${shimmerClass}`} />
              <div className={`h-3 w-64 ${shimmerClass}`} />
            </div>
            <div className="flex gap-3 items-center">
              <div className={`h-4 w-12 ${shimmerClass}`} />
              <div className={`h-8 w-8 ${shimmerClass}`} />
              <div className={`h-8 w-8 ${shimmerClass}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
export { SkeletonTable }
