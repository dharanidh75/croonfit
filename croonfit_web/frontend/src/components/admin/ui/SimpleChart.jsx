import React from 'react'
import { Card, CardHeader, CardContent } from './Card'

export function SimpleChart({ title, data, height = "h-48" }) {
  // Find max value for scaling
  const max = Math.max(...data.map(d => d.value), 1)

  return (
    <Card>
      {title && <CardHeader title={title} />}
      <CardContent className="pt-8">
        <div className={`w-full ${height} flex items-end gap-2`}>
          {data.map((item, i) => {
            const percentage = (item.value / max) * 100
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                {/* Tooltip on hover */}
                <div className="absolute -top-8 bg-[#111111] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                  {item.label}: {item.value}
                </div>
                
                {/* Bar */}
                <div 
                  className="w-full bg-[#E5E5E5] group-hover:bg-[#111111] rounded-t-sm transition-colors duration-300"
                  style={{ height: `${percentage}%`, minHeight: '4px' }}
                />
                
                {/* Label */}
                <span className="text-[10px] text-[#888888] font-medium">{item.label}</span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
