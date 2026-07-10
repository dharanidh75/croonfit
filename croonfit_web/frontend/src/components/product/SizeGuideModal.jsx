import React, { useState } from 'react'
import { X } from 'lucide-react'

export function SizeGuideModal({ isOpen, onClose, sizeChart }) {
  const [unit, setUnit] = useState('cm') // 'cm' or 'in'
  
  if (!isOpen) return null

  // Conversion helper
  const val = (cm) => {
    if (!cm) return '-'
    return unit === 'cm' ? cm : (cm * 0.393701).toFixed(1)
  }

  const rows = sizeChart?.rows || []
  
  // Extract all keys that have "_cm" in them dynamically, to handle different garment types
  const measureKeys = rows.length > 0 
    ? Object.keys(rows[0]).filter(k => k.endsWith('_cm'))
    : []

  const formatKey = (k) => k.replace('_cm', '').charAt(0).toUpperCase() + k.replace('_cm', '').slice(1)

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-[200ms] linear"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-base w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col animate-in fade-in zoom-in-95 duration-[200ms] ease-linear">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-heading font-black text-2xl uppercase tracking-wider">Size Guide</h2>
          <button onClick={onClose} className="text-muted hover:text-text transition-colors duration-[150ms] linear">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <p className="font-body text-sm text-muted">Garment measurements.</p>
            {/* Unit Toggle */}
            <div className="flex bg-surface p-1">
              <button 
                onClick={() => setUnit('cm')}
                className={`px-3 py-1 text-xs font-heading font-bold uppercase transition-colors duration-[150ms] linear ${unit === 'cm' ? 'bg-accent text-white' : 'text-muted hover:text-text'}`}
              >
                CM
              </button>
              <button 
                onClick={() => setUnit('in')}
                className={`px-3 py-1 text-xs font-heading font-bold uppercase transition-colors duration-[150ms] linear ${unit === 'in' ? 'bg-accent text-white' : 'text-muted hover:text-text'}`}
              >
                IN
              </button>
            </div>
          </div>

          {rows.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-accent">
                    <th className="py-3 px-4 font-heading font-bold uppercase tracking-wider text-sm">Size</th>
                    {measureKeys.map(k => (
                      <th key={k} className="py-3 px-4 font-heading font-bold uppercase tracking-wider text-sm">{formatKey(k)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr key={row.size} className={`border-b border-border hover:bg-surface transition-colors duration-[150ms] linear ${idx % 2 === 0 ? '' : 'bg-surface/30'}`}>
                      <td className="py-3 px-4 font-body font-bold text-sm">{row.size}</td>
                      {measureKeys.map(k => (
                        <td key={k} className="py-3 px-4 font-body text-sm text-muted">{val(row[k])}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted font-body">No size chart available for this product.</div>
          )}
          
          <div className="mt-8 bg-surface p-4 text-xs font-body text-muted leading-relaxed">
            <strong className="text-text font-bold">How to measure:</strong><br />
            Chest: Measure around the fullest part of your chest, keeping the measuring tape horizontal.<br />
            Length: Measure from the high point of the shoulder to the bottom hem.<br />
            Measurements are taken with the garment laid flat. Please allow a 1-2 cm variance.
          </div>
        </div>
      </div>
    </div>
  )
}
