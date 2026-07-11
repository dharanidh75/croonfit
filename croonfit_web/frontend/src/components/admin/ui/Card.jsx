import React from 'react'

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-[#E5E5E5] shadow-sm overflow-hidden ${className}`}>
      {children}
    </div>
  )
}

export function CardHeader({ title, description, action, className = '' }) {
  return (
    <div className={`px-6 py-5 border-b border-[#E5E5E5] flex justify-between items-start ${className}`}>
      <div>
        <h3 className="text-sm font-semibold text-[#111111]">{title}</h3>
        {description && <p className="text-xs text-[#666666] mt-1">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  )
}
