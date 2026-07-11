import React from 'react'

export function OrderSummary({ cart, outOfStockIssues = [] }) {
  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0)
  const shipping = subtotal >= 999 ? 0 : 99
  const total = subtotal + shipping

  return (
    <div className="bg-[#F9F9F9] rounded-2xl p-8 lg:sticky lg:top-28">
      <h3 className="text-lg font-medium uppercase tracking-widest mb-6">Order Summary</h3>
      
      <div className="space-y-6 mb-8 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
        {cart.map(item => {
          const issue = outOfStockIssues.find(i => i.variant_id === item.variant.id)
          
          return (
            <div key={item.variant.id} className="flex gap-4">
              <div className="w-16 md:w-20 aspect-[3/4] bg-[#F5F5F5] rounded-xl relative overflow-hidden flex-shrink-0">
                <img 
                  src={item.product.primary_image || item.product.images?.[0]?.url} 
                  alt={item.product.name} 
                  className={`w-full h-full object-cover mix-blend-multiply ${issue ? 'grayscale opacity-50' : ''}`}
                />
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
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
        <div className="flex justify-between text-[#555555]">
          <span>Subtotal</span>
          <span className="font-medium text-[#0A0A0A]">₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[#555555]">
          <span>Shipping</span>
          <span className="font-medium text-[#0A0A0A]">{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
        </div>
      </div>
      
      <div className="border-t border-[#E5E5E5] pt-6 flex justify-between items-end">
        <span className="text-sm font-bold uppercase tracking-widest">Total</span>
        <span className="text-2xl font-medium">₹{total.toFixed(2)}</span>
      </div>
    </div>
  )
}
