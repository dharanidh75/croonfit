import React, { useState, useEffect } from 'react'
import { ArrowRight, MapPin, Plus } from 'lucide-react'
import api from '../../lib/api'
import { useStore } from '../../store'
import toast from 'react-hot-toast'

export function CheckoutForm({ address, setAddress, onSubmit }) {
  const { user } = useStore()
  
  const [savedAddresses, setSavedAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [useExisting, setUseExisting] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  useEffect(() => {
    api.get('/auth/me/addresses')
      .then(res => {
        setSavedAddresses(res.data)
        if (res.data.length > 0) {
          setUseExisting(true)
          const defaultAddr = res.data.find(a => a.is_default) || res.data[0]
          setSelectedId(defaultAddr.id)
        }
      })
      .catch(err => {
        console.error("Failed to load addresses", err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleChange = (e) => {
    setAddress(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    
    if (useExisting && selectedId) {
      const selected = savedAddresses.find(a => a.id === selectedId)
      if (!selected) {
        toast.error("Please select an address")
        return
      }
      
      // Auto-fill form state with the selected address + user profile details for email/phone
      setAddress({
        full_name: selected.full_name,
        email: user?.email || '',
        line1: selected.street,
        line2: '', // We don't store line2 explicitly in our DB schema right now
        city: selected.city,
        state: selected.state,
        pin: selected.zip,
        phone: user?.phone || ''
      })
      
      // Delay slightly to let state update before calling parent onSubmit
      setTimeout(() => {
        onSubmit(e)
      }, 0)
    } else {
      // NEW address - silently save it to backend if logged in
      if (user) {
        api.post('/auth/me/addresses', {
          name: 'Saved from Checkout',
          full_name: address.full_name,
          street: address.line1 + (address.line2 ? `, ${address.line2}` : ''),
          city: address.city,
          state: address.state,
          zip: address.pin,
          is_default: savedAddresses.length === 0
        }).catch(err => console.error("Failed to save address", err))
      }
      onSubmit(e)
    }
  }

  const inputClass = "w-full h-14 border border-[#E5E5E5] rounded-xl px-4 text-sm font-light text-[#0A0A0A] placeholder-[#888888] focus:border-black focus:ring-1 focus:ring-black outline-none transition-all duration-300 bg-white"

  return (
    <form onSubmit={handleFormSubmit} className="space-y-8 animate-fade-in-up">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold uppercase tracking-widest">Contact & Shipping</h3>
          {savedAddresses.length > 0 && (
            <button 
              type="button"
              onClick={() => setUseExisting(!useExisting)}
              className="text-xs font-bold uppercase tracking-wider text-[#888888] hover:text-black transition-colors flex items-center gap-1"
            >
              {useExisting ? <Plus className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
              {useExisting ? "Add New Address" : "Use Saved Address"}
            </button>
          )}
        </div>
        
        {loading ? (
          <div className="py-8 text-center text-[#888888] text-sm">Loading addresses...</div>
        ) : useExisting && savedAddresses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {savedAddresses.map(addr => (
              <div 
                key={addr.id}
                onClick={() => setSelectedId(addr.id)}
                className={`cursor-pointer border-2 p-5 rounded-2xl transition-all duration-200 relative ${selectedId === addr.id ? 'border-black bg-[#FAFAFA]' : 'border-[#E5E5E5] bg-white hover:border-[#CCCCCC]'}`}
              >
                {selectedId === addr.id && (
                  <div className="absolute top-4 right-4 w-5 h-5 bg-black rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
                <div className="font-bold text-[#0A0A0A] mb-1 pr-8">{addr.name}</div>
                <div className="text-sm text-[#555555] mb-2">{addr.full_name}</div>
                <div className="text-xs text-[#888888] leading-relaxed">
                  {addr.street}<br/>
                  {addr.city}, {addr.state} {addr.zip}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              required={!useExisting} type="text" name="full_name" placeholder="Full Name" 
              value={address.full_name || ''} onChange={handleChange} 
              className={`${inputClass} md:col-span-2`}
            />
            
            <input 
              required={!useExisting} type="email" name="email" placeholder="Email Address" 
              value={address.email || ''} onChange={handleChange} 
              className={`${inputClass} md:col-span-2`}
            />
            
            <input 
              required={!useExisting} type="text" name="line1" placeholder="Address Line 1" 
              value={address.line1 || ''} onChange={handleChange} 
              className={`${inputClass} md:col-span-2`}
            />
            
            <input 
              type="text" name="line2" placeholder="Apartment, suite, etc. (optional)" 
              value={address.line2 || ''} onChange={handleChange} 
              className={`${inputClass} md:col-span-2`}
            />
            
            <input 
              required={!useExisting} type="text" name="city" placeholder="City" 
              value={address.city || ''} onChange={handleChange} 
              className={inputClass}
            />
            
            <input 
              required={!useExisting} type="text" name="state" placeholder="State / Province" 
              value={address.state || ''} onChange={handleChange} 
              className={inputClass}
            />
            
            <input 
              required={!useExisting} type="text" name="pin" placeholder="PIN / Zip Code" 
              value={address.pin || ''} onChange={handleChange} 
              className={inputClass}
            />
            
            <input 
              required={!useExisting} type="tel" name="phone" placeholder="Phone Number" 
              value={address.phone || ''} onChange={handleChange} 
              className={inputClass}
            />
          </div>
        )}
      </div>

      <button type="submit" className="w-full h-14 bg-black text-white text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-gray-900 transition-all duration-300 flex items-center justify-center gap-2">
        Continue to Payment <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  )
}
