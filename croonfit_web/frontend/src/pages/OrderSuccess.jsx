import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { useStore } from '../store'

export function OrderSuccess() {
  const { lastOrder } = useStore()
  const navigate = useNavigate()

  useEffect(() => {
    // If landed here without an order, bounce to home
    if (!lastOrder) {
      navigate('/')
    }
  }, [lastOrder, navigate])

  if (!lastOrder) return null

  return (
    <div className="min-h-screen bg-white font-sans text-[#0A0A0A] flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-32">
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-accent text-white rounded-full flex items-center justify-center mb-8 animate-in zoom-in duration-[300ms] ease-ui">
          <Check className="w-10 h-10" />
        </div>
        
        <h1 className="font-heading font-black text-4xl uppercase tracking-tighter mb-4">
          Order Confirmed
        </h1>
        
        <p className="font-body text-muted mb-8">
          Thank you for shopping with Croonfit. We've received your order and are getting it ready to ship.
        </p>
        
        <div className="w-full bg-surface p-6 border border-border text-left mb-8 space-y-4">
          <div className="flex justify-between font-body text-sm">
            <span className="text-muted">Order Number</span>
            <span className="font-bold text-text font-heading uppercase tracking-wider">{lastOrder.order_number}</span>
          </div>
          <div className="flex justify-between font-body text-sm">
            <span className="text-muted">Total Paid</span>
            <span className="font-bold text-text">₹{lastOrder.total.toFixed(2)}</span>
          </div>
        </div>
        
        <Link to="/products" className="btn-primary w-full h-12 mb-4">
          CONTINUE SHOPPING
        </Link>
        
        <Link to="/orders" className="w-full h-12 flex items-center justify-center border border-black text-black font-heading font-bold uppercase tracking-wider text-sm hover:bg-[#F5F5F5] transition-colors duration-200">
          VIEW MY ORDERS
        </Link>
      </div>
      </main>
      <Footer />
    </div>
  )
}
