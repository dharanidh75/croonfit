import React, { useState } from 'react'
import { ShieldCheck, CreditCard, Lock, Wallet } from 'lucide-react'

export function PaymentForm({ onConfirm, isProcessing }) {
  const [card, setCard] = useState({
    number: '4242 4242 4242 4242',
    expiry: '12/28',
    cvv: '123',
    name: 'Test User'
  })
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true)
  const [billingAddress, setBillingAddress] = useState({})
  const [paymentMethod, setPaymentMethod] = useState('card') // 'card', 'razorpay', 'gpay'

  const handleSubmit = (e) => {
    e.preventDefault()
    // For now we just pass card, but we could pass billingAddress and paymentMethod too
    onConfirm(card)
  }

  const inputClass = "w-full h-14 border border-[#E5E5E5] rounded-xl px-4 text-sm font-light text-[#0A0A0A] placeholder-[#888888] focus:border-black focus:ring-1 focus:ring-black outline-none transition-all duration-300 bg-white"
  
  const handleBillingChange = (e) => {
    setBillingAddress(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

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
        {/* Billing Address Toggle */}
        <div className="border-b border-[#F5F5F5] pb-6 mb-6">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Billing Address</h3>
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${billingSameAsShipping ? 'bg-black border-black' : 'border-[#E5E5E5] group-hover:border-black'}`}>
              {billingSameAsShipping && <ShieldCheck className="w-3 h-3 text-white" />}
            </div>
            <input 
              type="checkbox" 
              className="hidden" 
              checked={billingSameAsShipping}
              onChange={() => setBillingSameAsShipping(!billingSameAsShipping)}
            />
            <span className="text-sm font-light">My billing and shipping address are the same</span>
          </label>

          {!billingSameAsShipping && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up">
              <input required type="text" name="full_name" placeholder="Full Name" onChange={handleBillingChange} className={`${inputClass} md:col-span-2`} />
              <input required type="text" name="line1" placeholder="Address Line 1" onChange={handleBillingChange} className={`${inputClass} md:col-span-2`} />
              <input type="text" name="line2" placeholder="Apartment, suite, etc. (optional)" onChange={handleBillingChange} className={`${inputClass} md:col-span-2`} />
              <input required type="text" name="city" placeholder="City" onChange={handleBillingChange} className={inputClass} />
              <input required type="text" name="state" placeholder="State / Province" onChange={handleBillingChange} className={inputClass} />
              <input required type="text" name="pin" placeholder="PIN / Zip Code" onChange={handleBillingChange} className={`${inputClass} md:col-span-2`} />
            </div>
          )}
        </div>

        {/* Payment Options */}
        <div className="space-y-4 mb-6">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Payment Method</h3>
          
          <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-black bg-gray-50' : 'border-[#E5E5E5] hover:border-black'}`}>
            <input type="radio" name="payment_method" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="w-4 h-4 accent-black" />
            <CreditCard className="w-5 h-5 text-black" />
            <span className="text-sm font-bold tracking-wide">Credit / Debit Card</span>
          </label>

          <label className={`flex items-start gap-4 p-5 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'razorpay' ? 'border-black bg-[#FAFAFA] shadow-[0_0_0_1px_rgba(0,0,0,1)]' : 'border-[#E5E5E5] hover:border-black'}`}>
            <div className="pt-0.5">
              <input type="radio" name="payment_method" checked={paymentMethod === 'razorpay'} onChange={() => setPaymentMethod('razorpay')} className="w-4 h-4 accent-black" />
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                <span className="text-sm font-bold tracking-wide text-[#0A0A0A]">Razorpay Secure</span>
                <div className="flex items-center gap-2">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" alt="Razorpay" className="h-3.5 object-contain" />
                </div>
              </div>
              <p className="text-xs font-light text-[#555555]">Pay securely using UPI, Credit/Debit Cards, NetBanking, and Wallets.</p>
              
              {paymentMethod === 'razorpay' && (
                <div className="mt-4 flex flex-wrap gap-2 animate-fade-in-up">
                  <span className="px-2 py-1 bg-white border border-[#E5E5E5] rounded shadow-sm text-[10px] font-bold uppercase tracking-wider text-[#555555]">UPI</span>
                  <span className="px-2 py-1 bg-white border border-[#E5E5E5] rounded shadow-sm text-[10px] font-bold uppercase tracking-wider text-[#555555]">Cards</span>
                  <span className="px-2 py-1 bg-white border border-[#E5E5E5] rounded shadow-sm text-[10px] font-bold uppercase tracking-wider text-[#555555]">NetBanking</span>
                  <span className="px-2 py-1 bg-white border border-[#E5E5E5] rounded shadow-sm text-[10px] font-bold uppercase tracking-wider text-[#555555]">Wallets</span>
                </div>
              )}
            </div>
          </label>

          <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'gpay' ? 'border-black bg-gray-50' : 'border-[#E5E5E5] hover:border-black'}`}>
            <input type="radio" name="payment_method" checked={paymentMethod === 'gpay'} onChange={() => setPaymentMethod('gpay')} className="w-4 h-4 accent-black" />
            <div className="w-8 flex justify-center">
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="Google Pay" className="h-3.5 object-contain" />
            </div>
            <span className="text-sm font-bold tracking-wide">Google Pay</span>
          </label>
        </div>
        
        {paymentMethod === 'card' && (
          <div className="space-y-4 animate-fade-in-up">
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
          </div>
        )}

        {paymentMethod === 'razorpay' && (
          <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl p-6 text-center animate-fade-in-up">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-bold tracking-wide text-[#0A0A0A] mb-2">Secure Payment Gateway</p>
            <p className="text-xs font-light text-[#555555] leading-relaxed max-w-sm mx-auto mb-5">
              After clicking "Pay Securely" below, a secure Razorpay window will open where you can complete your purchase using your preferred UPI app, Credit/Debit card, NetBanking, or Wallet.
            </p>
            <div className="flex items-center justify-center gap-4 pt-4 border-t border-[#E5E5E5]">
               <div className="flex items-center gap-1.5 text-[#888888]">
                 <Lock className="w-3 h-3" />
                 <span className="text-[10px] font-bold uppercase tracking-widest">256-Bit SSL</span>
               </div>
               <div className="w-1 h-1 bg-[#D1D5DB] rounded-full" />
               <div className="flex items-center gap-1.5 text-[#888888]">
                 <ShieldCheck className="w-3 h-3" />
                 <span className="text-[10px] font-bold uppercase tracking-widest">PCI DSS Compliant</span>
               </div>
            </div>
          </div>
        )}

        {paymentMethod === 'gpay' && (
          <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl p-6 text-center animate-fade-in-up">
            <div className="w-12 h-12 bg-white border border-[#E5E5E5] shadow-sm rounded-full flex items-center justify-center mx-auto mb-4">
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="Google Pay" className="h-4 object-contain" />
            </div>
            <p className="text-sm font-bold tracking-wide text-[#0A0A0A] mb-2">Express Checkout</p>
            <p className="text-xs font-light text-[#555555] leading-relaxed max-w-sm mx-auto">
              After clicking "Pay Securely" below, you will be prompted to quickly and securely complete your purchase using your Google Pay account.
            </p>
          </div>
        )}

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
