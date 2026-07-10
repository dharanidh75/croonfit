import React, { useState } from 'react'
import { ShieldAlert, CreditCard } from 'lucide-react'

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

  return (
    <div className="space-y-6">
      {/* Test Mode Banner */}
      <div className="bg-surface border-l-4 border-accent p-4 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-heading font-bold text-sm uppercase">Test Mode Active</h4>
          <p className="text-xs font-body text-muted mt-1">
            This is a dummy payment gateway. No real charges will be made. You can submit the pre-filled test card details below.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 border border-border">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5 text-muted" />
          <h3 className="font-heading font-bold text-sm uppercase tracking-wider">Credit / Debit Card</h3>
        </div>
        
        <input 
          required type="text" placeholder="Card Number" 
          value={card.number} onChange={e => setCard({...card, number: e.target.value})} 
          className="input-field"
        />
        
        <div className="flex gap-4">
          <input 
            required type="text" placeholder="MM/YY" 
            value={card.expiry} onChange={e => setCard({...card, expiry: e.target.value})} 
            className="input-field flex-1"
          />
          <input 
            required type="text" placeholder="CVV" 
            value={card.cvv} onChange={e => setCard({...card, cvv: e.target.value})} 
            className="input-field flex-1"
          />
        </div>
        
        <input 
          required type="text" placeholder="Name on Card" 
          value={card.name} onChange={e => setCard({...card, name: e.target.value})} 
          className="input-field"
        />

        <button 
          type="submit" 
          disabled={isProcessing}
          className="btn-primary w-full h-12 mt-4 relative"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              PROCESSING...
            </span>
          ) : (
            'PAY NOW'
          )}
        </button>
      </form>
    </div>
  )
}
