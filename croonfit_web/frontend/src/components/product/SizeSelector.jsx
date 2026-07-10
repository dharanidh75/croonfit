import React, { useState } from 'react'

export function SizeSelector({ variants, selectedSize, onSelect, sizeChart }) {
  const [hoveredSize, setHoveredSize] = useState(null)

  // Group variants by size (assuming variants list is filtered to current color already)
  // For UI simplicity, we just extract sizes from the available variants
  const sizes = Array.from(new Set(variants.map(v => v.size)))

  const getMeasurements = (size) => {
    if (!sizeChart || !sizeChart.rows) return null
    return sizeChart.rows.find(r => r.size === size)
  }

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-3">
        {sizes.map(size => {
          const variant = variants.find(v => v.size === size)
          const isOutOfStock = variant ? variant.stock_qty <= 0 : true
          const isSelected = selectedSize === size

          return (
            <div 
              key={size} 
              className="relative"
              onMouseEnter={() => setHoveredSize(size)}
              onMouseLeave={() => setHoveredSize(null)}
            >
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={() => onSelect(size)}
                className={`w-14 h-12 flex items-center justify-center font-heading font-bold uppercase transition-all duration-[150ms] linear border ${
                  isSelected 
                    ? 'border-accent bg-accent text-white' 
                    : isOutOfStock 
                      ? 'border-border text-border cursor-not-allowed'
                      : 'border-border text-text hover:border-accent'
                }`}
              >
                {size}
                {/* Strike-through for out of stock */}
                {isOutOfStock && (
                  <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                    <div className="w-[150%] h-[1px] bg-border rotate-45" />
                  </div>
                )}
              </button>

              {/* Popover on Hover (Desktop) */}
              {hoveredSize === size && !isOutOfStock && sizeChart && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-accent text-white p-3 z-10 animate-in fade-in zoom-in-95 duration-[150ms] ease-linear pointer-events-none">
                  <div className="text-xs font-heading font-bold mb-2 uppercase border-b border-[#333] pb-1">
                    Size {size} Details
                  </div>
                  {(() => {
                    const m = getMeasurements(size)
                    if (!m) return <div className="text-xs font-body text-gray-300">No data</div>
                    return (
                      <div className="space-y-1 text-[10px] font-body text-gray-300">
                        <div className="flex justify-between"><span>Chest:</span> <span className="text-white">{m.chest_cm} cm</span></div>
                        <div className="flex justify-between"><span>Length:</span> <span className="text-white">{m.length_cm} cm</span></div>
                        {m.sleeve_cm && <div className="flex justify-between"><span>Sleeve:</span> <span className="text-white">{m.sleeve_cm} cm</span></div>}
                        {m.fit_note && <div className="mt-2 text-accent bg-white px-1.5 py-0.5 inline-block uppercase font-bold">{m.fit_note}</div>}
                      </div>
                    )
                  })()}
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-accent" />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
