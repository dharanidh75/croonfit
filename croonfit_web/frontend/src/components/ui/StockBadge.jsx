import React from 'react'
import { AlertCircle } from 'lucide-react'

export function StockBadge({ message, className = "" }) {
  return (
    <div className={`stock-badge-warn flex items-center gap-1.5 ${className}`}>
      <AlertCircle className="w-3 h-3" />
      <span>{message}</span>
    </div>
  )
}
