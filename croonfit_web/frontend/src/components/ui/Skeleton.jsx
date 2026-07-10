import React from 'react'

export function Skeleton({ className = '', variant = 'rectangular' }) {
  const baseClass = "skeleton"
  
  if (variant === 'circular') {
    return <div className={`${baseClass} rounded-full ${className}`} />
  }
  
  if (variant === 'text') {
    return <div className={`${baseClass} rounded-sm h-4 ${className}`} />
  }

  return <div className={`${baseClass} ${className}`} />
}

export function ProductSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="aspect-[3/4] w-full" />
      <div className="flex justify-between items-start">
        <div className="w-2/3 space-y-2">
          <Skeleton variant="text" className="w-full" />
          <Skeleton variant="text" className="w-1/2" />
        </div>
        <Skeleton variant="text" className="w-1/4" />
      </div>
    </div>
  )
}
