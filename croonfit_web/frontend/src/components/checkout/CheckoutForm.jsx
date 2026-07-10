import React from 'react'

export function CheckoutForm({ address, setAddress, onSubmit }) {
  const handleChange = (e) => {
    setAddress(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h3 className="font-heading font-bold text-lg uppercase tracking-wider mb-4">Shipping Address</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input 
          required type="text" name="full_name" placeholder="Full Name" 
          value={address.full_name || ''} onChange={handleChange} 
          className="input-field md:col-span-2"
        />
        
        <input 
          required type="text" name="line1" placeholder="Address Line 1" 
          value={address.line1 || ''} onChange={handleChange} 
          className="input-field md:col-span-2"
        />
        
        <input 
          type="text" name="line2" placeholder="Apartment, suite, etc. (optional)" 
          value={address.line2 || ''} onChange={handleChange} 
          className="input-field md:col-span-2"
        />
        
        <input 
          required type="text" name="city" placeholder="City" 
          value={address.city || ''} onChange={handleChange} 
          className="input-field"
        />
        
        <input 
          required type="text" name="state" placeholder="State / Province" 
          value={address.state || ''} onChange={handleChange} 
          className="input-field"
        />
        
        <input 
          required type="text" name="pin" placeholder="PIN / Zip Code" 
          value={address.pin || ''} onChange={handleChange} 
          className="input-field"
        />
        
        <input 
          required type="text" name="phone" placeholder="Phone Number" 
          value={address.phone || ''} onChange={handleChange} 
          className="input-field"
        />
      </div>

      <button type="submit" className="btn-primary w-full h-12 mt-8">
        CONTINUE TO PAYMENT
      </button>
    </form>
  )
}
