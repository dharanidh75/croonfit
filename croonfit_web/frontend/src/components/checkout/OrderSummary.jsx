import React from 'react'
import { ImageWithFallback } from '../ui/ImageWithFallback'
export function OrderSummary({ 
  cart, 
  outOfStockIssues = [],
  discountCode = '',
  setDiscountCode = () => {},
  appliedDiscount = null,
  setAppliedDiscount = () => {},
  onApplyDiscount = () => {},
  isApplyingDiscount = false
}) {
  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0)
  const isFreeShipping = appliedDiscount?.type === 'FREE_SHIPPING'
  const shipping = (subtotal >= 999 || isFreeShipping) ? 0 : 99
  const discountAmount = appliedDiscount?.discount_amount || 0
  const total = Math.max(0, subtotal + shipping - discountAmount)

  return (
    <div className="bg-[#F9F9F9] rounded-2xl p-8 lg:sticky lg:top-28">
      <h3 className="text-lg font-medium uppercase tracking-widest mb-6">Order Summary</h3>
      
      <div className="space-y-6 mb-8 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
        {cart.map(item => {
          const issue = outOfStockIssues.find(i => i.variant_id === item.variant.id)
          
          return (
            <div key={item.variant.id} className="flex gap-4">
              <div className="relative flex-shrink-0">
                <div className="w-16 md:w-20 aspect-[3/4] bg-[#F5F5F5] rounded-xl overflow-hidden">
                  <ImageWithFallback 
                    src={item.product.thumbnail_url || item.variant?.images?.find(i => i.is_primary)?.url || item.variant?.images?.[0]?.url || item.product.primary_image || item.product.images?.[0]?.url} 
                    alt={item.product.name} 
                    className={`w-full h-full object-cover mix-blend-multiply ${issue ? 'grayscale opacity-50' : ''}`}
                  />
                </div>
                <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm z-10">
                  {item.quantity}
                </span>
              </div>
              
              <div className="flex-1 flex flex-col py-1">
                <div className="flex justify-between items-start gap-4">
                  <span className={`text-sm font-medium ${issue ? 'text-[#888888] line-through' : 'text-[#0A0A0A]'}`}>
                    {item.product.name}
                  </span>
                  <span className={`text-sm font-medium ${issue ? 'text-[#888888]' : 'text-[#0A0A0A]'}`}>
                    ₹{item.product.price * item.quantity}
                  </span>
                </div>
                <div className="text-xs font-light text-[#555555] mt-1">
                  Size: {item.variant.size}
                </div>
                
                {issue && (
                  <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-[#E53E3E]">
                    No Longer Available
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="border-t border-[#E5E5E5] pt-6 space-y-4 text-sm mb-6">
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Discount code" 
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
            disabled={appliedDiscount !== null || isApplyingDiscount}
            className="flex-1 h-10 px-3 border border-[#E5E5E5] rounded-lg text-sm outline-none focus:border-black uppercase disabled:bg-[#F5F5F5] disabled:text-[#888888]"
          />
          <button 
            onClick={appliedDiscount ? () => { setDiscountCode(''); setAppliedDiscount(null); } : onApplyDiscount}
            disabled={(!discountCode && !appliedDiscount) || isApplyingDiscount}
            className={`px-4 h-10 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors ${
              appliedDiscount 
                ? 'bg-[#E5E5E5] text-black hover:bg-[#D5D5D5]' 
                : 'bg-black text-white hover:bg-[#333333]'
            } disabled:opacity-50`}
          >
            {isApplyingDiscount ? '...' : appliedDiscount ? 'Clear' : 'Apply'}
          </button>
        </div>

        <div className="flex justify-between text-[#555555] pt-2">
          <span>Subtotal</span>
          <span className="font-medium text-[#0A0A0A]">₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[#555555]">
          <span>Shipping</span>
          <span className="font-medium text-[#0A0A0A]">{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
        </div>
        {appliedDiscount && (
          <div className="flex justify-between text-[#111111] font-medium">
            <span>Discount ({appliedDiscount.code})</span>
            <span className="text-[#E53E3E]">-₹{(appliedDiscount.discount_amount || 0).toFixed(2)}</span>
          </div>
        )}
      </div>
      
      <div className="border-t border-[#E5E5E5] pt-6 flex justify-between items-end">
        <span className="text-sm font-bold uppercase tracking-widest">Total</span>
        <span className="text-2xl font-medium">₹{total.toFixed(2)}</span>
      </div>
    </div>
  )
}
