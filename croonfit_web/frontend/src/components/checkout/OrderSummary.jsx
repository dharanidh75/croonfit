import React from 'react'
import { StockBadge } from '../ui/StockBadge'

export function OrderSummary({ cart, outOfStockIssues = [] }) {
  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0)
  const shipping = subtotal >= 999 ? 0 : 99
  const total = subtotal + shipping

  return (
    <div className="bg-surface p-6 sticky top-24">
      <h3 className="font-heading font-bold text-lg uppercase tracking-wider mb-6">Order Summary</h3>
      
      <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
        {cart.map(item => {
          // Check if this item has a stock issue
          const issue = outOfStockIssues.find(i => i.variant_id === item.variant.id)
          
          return (
            <div key={item.variant.id} className="flex gap-4">
              <div className="w-16 h-20 bg-base flex-shrink-0 relative">
                <img 
                  src={item.product.primary_image || item.product.images?.[0]?.url} 
                  alt={item.product.name} 
                  className={`w-full h-full object-cover mix-blend-multiply ${issue ? 'grayscale opacity-50' : ''}`}
                />
                <span className="absolute -top-2 -right-2 bg-text text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {item.quantity}
                </span>
              </div>
              
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex justify-between">
                  <span className={`font-heading font-bold uppercase text-sm ${issue ? 'text-muted line-through' : ''}`}>
                    {item.product.name}
                  </span>
                  <span className={`font-body text-sm font-bold ${issue ? 'text-muted' : ''}`}>
                    ₹{item.product.price * item.quantity}
                  </span>
                </div>
                <div className="text-xs font-body text-muted mt-1">
                  {item.variant.size} / {item.variant.color}
                </div>
                
                {/* Stock Issue Badge */}
                {issue && (
                  <div className="mt-2">
                    <StockBadge message="NO LONGER AVAILABLE" />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="border-t border-border pt-4 space-y-2 text-sm font-body">
        <div className="flex justify-between text-muted">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>Shipping</span>
          <span>{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
        </div>
      </div>
      
      <div className="border-t border-accent mt-4 pt-4 flex justify-between font-heading font-bold text-lg uppercase">
        <span>Total</span>
        <span>₹{total.toFixed(2)}</span>
      </div>
    </div>
  )
}
