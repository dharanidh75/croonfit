import React from 'react'
import { Card, CardContent } from './Card'

export function KPICard({ title, value, trend, trendValue, icon: Icon }) {
  const isPositive = trend === 'up'
  const isNeutral = trend === 'neutral'
  
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs font-medium text-[#666666] uppercase tracking-wider">{title}</span>
          {Icon && <div className="p-2 bg-[#F9F9F9] rounded-lg text-[#111111]"><Icon className="w-4 h-4" /></div>}
        </div>
        
        <div className="flex items-baseline gap-3">
          <h2 className="text-2xl font-bold text-[#111111]">{value}</h2>
          
          {trendValue && (
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              isPositive ? 'bg-green-100 text-green-700' : 
              isNeutral ? 'bg-gray-100 text-gray-700' : 
              'bg-red-100 text-red-700'
            }`}>
              {isPositive ? '+' : isNeutral ? '' : '-'}{trendValue}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
