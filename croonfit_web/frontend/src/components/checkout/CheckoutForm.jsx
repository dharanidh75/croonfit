import React from 'react'
import { ArrowRight } from 'lucide-react'

export function CheckoutForm({ address, setAddress, onSubmit }) {
  const handleChange = (e) => {
    setAddress(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const inputClass = "w-full h-14 border border-[#E5E5E5] rounded-xl px-4 text-sm font-light text-[#0A0A0A] placeholder-[#888888] focus:border-black focus:ring-1 focus:ring-black outline-none transition-all duration-300 bg-white"

  return (
    <form onSubmit={onSubmit} className="space-y-8 animate-fade-in-up">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Contact &amp; Shipping</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            required type="text" name="full_name" placeholder="Full Name" 
            value={address.full_name || ''} onChange={handleChange} 
            className={`${inputClass} md:col-span-2`}
          />
          
          <input 
            required type="email" name="email" placeholder="Email Address" 
            value={address.email || ''} onChange={handleChange} 
            className={`${inputClass} md:col-span-2`}
          />
          
          <input 
            required type="text" name="line1" placeholder="Address Line 1" 
            value={address.line1 || ''} onChange={handleChange} 
            className={`${inputClass} md:col-span-2`}
          />
          
          <input 
            type="text" name="line2" placeholder="Apartment, suite, etc. (optional)" 
            value={address.line2 || ''} onChange={handleChange} 
            className={`${inputClass} md:col-span-2`}
          />
          
          <input 
            required type="text" name="city" placeholder="City" 
            value={address.city || ''} onChange={handleChange} 
            className={inputClass}
          />
          
          <input 
            required type="text" name="state" placeholder="State / Province" 
            value={address.state || ''} onChange={handleChange} 
            className={inputClass}
          />
          
          <input 
            required type="text" name="pin" placeholder="PIN / Zip Code" 
            value={address.pin || ''} onChange={handleChange} 
            className={inputClass}
          />
          
          <input 
            required type="tel" name="phone" placeholder="Phone Number" 
            value={address.phone || ''} onChange={handleChange} 
            className={inputClass}
          />
        </div>
      </div>

      <button type="submit" className="w-full h-14 bg-black text-white text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-gray-900 transition-all duration-300 flex items-center justify-center gap-2">
        Continue to Payment <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  )
}
