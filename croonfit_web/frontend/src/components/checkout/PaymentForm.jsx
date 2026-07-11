import React, { useState } from 'react'
import { ShieldCheck, CreditCard, Lock } from 'lucide-react'

export function PaymentForm({ onConfirm, isProcessing }) {
  // Pre-filled with dummy data for test mode
  const [card, setCard] = useState({
    number: '4242 4242 4242 4242',
    expiry: '12/28',
    cvv: '123',
    name: 'Test User'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onConfirm(card)
  }

  const inputClass = "w-full h-14 border border-[#E5E5E5] rounded-xl px-4 text-sm font-light text-[#0A0A0A] placeholder-[#888888] focus:border-black focus:ring-1 focus:ring-black outline-none transition-all duration-300 bg-white"

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Test Mode Banner */}
      <div className="bg-[#F5F5F5] rounded-xl p-5 flex items-start gap-4">
        <ShieldCheck className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#0A0A0A] mb-1">Test Mode Active</h4>
          <p className="text-xs font-light text-[#555555] leading-relaxed">
            This is a dummy payment gateway for demonstration. No real charges will be made. You can submit the pre-filled test card details below.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-5 h-5 text-[#888888]" />
          <h3 className="text-sm font-bold uppercase tracking-widest">Credit / Debit Card</h3>
        </div>
        
        <input 
          required type="text" placeholder="Card Number" 
          value={card.number} onChange={e => setCard({...card, number: e.target.value})} 
          className={inputClass}
        />
        
        <div className="flex gap-4">
          <input 
            required type="text" placeholder="MM/YY" 
            value={card.expiry} onChange={e => setCard({...card, expiry: e.target.value})} 
            className={`${inputClass} flex-1`}
          />
          <input 
            required type="text" placeholder="CVV" 
            value={card.cvv} onChange={e => setCard({...card, cvv: e.target.value})} 
            className={`${inputClass} flex-1`}
          />
        </div>
        
        <input 
          required type="text" placeholder="Name on Card" 
          value={card.name} onChange={e => setCard({...card, name: e.target.value})} 
          className={inputClass}
        />

        <div className="pt-4">
          <button 
            type="submit" 
            disabled={isProcessing}
            className="w-full h-14 bg-black text-white text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-gray-900 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                PROCESSING...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" /> PAY SECURELY
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
