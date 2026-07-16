import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { CheckoutForm } from '../components/checkout/CheckoutForm'
import { PaymentForm } from '../components/checkout/PaymentForm'
import { OrderSummary } from '../components/checkout/OrderSummary'
import { useStore } from '../store'
import api from '../lib/api'
import toast from 'react-hot-toast'


export function Checkout() {
  const { cart, clearCart, setLastOrder } = useStore()
  const navigate = useNavigate()

  const [step, setStep] = useState(1) // 1 = Address, 2 = Payment
  const [address, setAddress] = useState({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [stockIssues, setStockIssues] = useState([])

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0 && !isProcessing) {
      navigate('/retail')
    }
  }, [cart, navigate, isProcessing])

  const handleAddressSubmit = async (e) => {
    e.preventDefault()

    // Rev 2: Validate stock before proceeding to payment
    setIsProcessing(true)
    setStockIssues([])

    try {
      const items = cart.map(item => ({ variant_id: item.variant.id, quantity: item.quantity }))
      const res = await api.post('/orders/validate-stock', { items })

      if (res.data.valid) {
        setStep(2)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        setStockIssues(res.data.issues)
        toast.error("Some items are no longer available.")
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setStockIssues(err.response.data.issues)
        toast.error("Some items are no longer available in the requested quantity.")
      } else {
        toast.error("Failed to validate stock. Please try again.")
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePaymentConfirm = async (cardDetails) => {
    setIsProcessing(true)
    setStockIssues([])

    try {
      const items = cart.map(item => ({ variant_id: item.variant.id, quantity: item.quantity }))

      // 1. Create Order
      const orderRes = await api.post('/orders', { items, shipping_address: address })
      const order = orderRes.data

      // 2. Create Payment Intent
      const intentRes = await api.post('/payments/intent', { order_id: order.id })
      const paymentId = intentRes.data.payment_id

      // 3. Confirm Payment (simulate network delay)
      await new Promise(resolve => setTimeout(resolve, 2000))
      const confirmRes = await api.post('/payments/confirm', {
        payment_id: paymentId,
        card_number: cardDetails.number,
        card_expiry: cardDetails.expiry,
        card_cvv: cardDetails.cvv
      })

      if (confirmRes.data.success) {
        setLastOrder({
          order_number: confirmRes.data.order_number,
          total: order.total,
          email: address.full_name
        })
        clearCart()
        toast.success("Payment successful! Your order has been placed.")
        navigate('/orders')
      }

    } catch (err) {
      if (err.response?.status === 409) {
        // Race condition caught at checkout confirm!
        setStep(1)
        setStockIssues(err.response.data.issues)
        toast.error("Inventory changed during checkout! Please review your cart.")
      } else {
        toast.error(err.response?.data?.detail || "Payment failed. Please try again.")
      }
      setIsProcessing(false)
    }
  }

  if (cart.length === 0 && !isProcessing) return null

  return (
    <div className="min-h-screen bg-white font-sans text-[#0A0A0A] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-32">
        <div className="max-w-[1440px] mx-auto px-6 mb-12">
          <h1 className="text-4xl md:text-5xl font-light uppercase tracking-tight mb-2">
            Checkout
          </h1>
          <p className="text-sm font-medium uppercase tracking-widest text-[#888888]">
            Secure Payment
          </p>
        </div>

        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 xl:gap-24">

            {/* Left: Forms */}
            <div className="w-full lg:w-[60%] xl:w-[65%]">

              {/* Wizard Nav */}
              <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest mb-12 pb-6 border-b border-[#F5F5F5]">
                <button
                  onClick={() => { if (!isProcessing) setStep(1) }}
                  className={`transition-colors duration-300 ${step === 1 ? 'text-[#0A0A0A]' : 'text-[#888888] hover:text-[#0A0A0A]'}`}
                >
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full mr-2 ${step === 1 ? 'bg-black text-white' : 'bg-[#F5F5F5] text-[#888888]'}`}>1</span>
                  Shipping
                </button>
                <div className="w-8 h-px bg-[#E5E5E5]"></div>
                <span className={`transition-colors duration-300 ${step === 2 ? 'text-[#0A0A0A]' : 'text-[#888888]'}`}>
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full mr-2 ${step === 2 ? 'bg-black text-white' : 'bg-[#F5F5F5] text-[#888888]'}`}>2</span>
                  Payment
                </span>
              </div>

              {step === 1 ? (
                <CheckoutForm address={address} setAddress={setAddress} onSubmit={handleAddressSubmit} />
              ) : (
                <PaymentForm onConfirm={handlePaymentConfirm} isProcessing={isProcessing} />
              )}

            </div>

            {/* Right: Summary */}
            <div className="w-full lg:w-[40%] xl:w-[35%]">
              <OrderSummary cart={cart} outOfStockIssues={stockIssues} />
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
