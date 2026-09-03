import React from 'react'
import { ShieldCheck, Lock } from 'lucide-react'

export function PaymentForm({ onConfirm, isProcessing }) {

  const handleSubmit = (e) => {
    e.preventDefault()
    onConfirm({})
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Razorpay Info Card */}
      <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl p-6 text-center">
        <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-7 h-7 text-white" />
        </div>
        <p className="text-sm font-bold tracking-wide text-[#0A0A0A] mb-2">Razorpay Secure Checkout</p>
        <p className="text-xs font-light text-[#555555] leading-relaxed max-w-sm mx-auto mb-6">
          After clicking "Pay Securely" below, a secure Razorpay window will open where you can pay using UPI, Credit/Debit Card, NetBanking, or Wallet.
        </p>

        {/* Payment badges */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {['UPI', 'Cards', 'NetBanking', 'Wallets'].map(method => (
            <span key={method} className="px-3 py-1.5 bg-white border border-[#E5E5E5] rounded-lg shadow-sm text-[10px] font-bold uppercase tracking-wider text-[#555555]">
              {method}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-center gap-6 pt-5 border-t border-[#E5E5E5]">
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

      <form onSubmit={handleSubmit}>
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
      </form>

      <div className="flex items-center justify-center gap-2">
        <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" alt="Razorpay" className="h-4 object-contain opacity-60" />
      </div>
    </div>
  )
}
