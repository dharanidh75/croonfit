import React from 'react'
import { Plus, Minus, X } from 'lucide-react'
import { Link } from 'react-router-dom'

export function CartItem({ item, updateQty, remove }) {
  const { product, variant, quantity } = item

  return (
    <div className="flex gap-4 py-4 border-b border-border">
      {/* Image */}
      <Link to={`/products/${product.slug}`} className="w-20 h-24 flex-shrink-0 bg-surface">
        <img 
          src={product.images?.[0]?.url || product.primary_image} 
          alt={product.name} 
          className="w-full h-full object-cover mix-blend-multiply"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start">
          <Link to={`/products/${product.slug}`} className="font-heading font-bold uppercase tracking-wider text-sm hover:text-muted transition-colors duration-[150ms] linear">
            {product.name}
          </Link>
          <button 
            onClick={() => remove(product.id, variant.id)}
            className="text-muted hover:text-text transition-colors duration-[150ms] linear"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="text-xs font-body text-muted mt-1">
          {variant.size} / {variant.color}
        </div>

        <div className="mt-auto flex justify-between items-end">
          {/* Quantity */}
          <div className="flex items-center border border-border">
            <button 
              onClick={() => updateQty(product.id, variant.id, Math.max(1, quantity - 1))}
              className="p-1 hover:bg-surface transition-colors duration-[150ms] linear text-muted"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-6 text-center text-xs font-body font-bold">{quantity}</span>
            <button 
              onClick={() => updateQty(product.id, variant.id, Math.min(variant.stock_qty, quantity + 1))}
              className="p-1 hover:bg-surface transition-colors duration-[150ms] linear text-muted"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          
          {/* Price */}
          <div className="font-body text-sm font-bold">
            ₹{product.price * quantity}
          </div>
        </div>
      </div>
    </div>
  )
}
