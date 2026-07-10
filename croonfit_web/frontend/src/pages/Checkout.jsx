import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { CheckoutForm } from '../components/checkout/CheckoutForm'
import { PaymentForm } from '../components/checkout/PaymentForm'
import { OrderSummary } from '../components/checkout/OrderSummary'
import { useStore } from '../store'
import toast from 'react-hot-toast'
import api from '../lib/api'

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
      navigate('/shop?gender=MENS')
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
        window.scrollTo(0, 0)
      } else {
        // Theoretically shouldn't hit here if 200 OK and valid=false in my backend setup,
        // but just in case
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
          email: address.full_name // close enough for dummy display
        })
        clearCart()
        navigate('/order-success')
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
    <Layout noFooter>
      <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row min-h-screen">
        
        {/* Left: Forms */}
        <div className="w-full lg:w-3/5 p-6 lg:p-16 xl:p-24 lg:border-r border-border bg-base order-2 lg:order-1">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 font-heading font-bold uppercase tracking-wider text-xs mb-12">
            <button 
              onClick={() => { if (!isProcessing) setStep(1) }} 
              className={step === 1 ? 'text-text' : 'text-muted hover:text-text transition-colors duration-[150ms] linear'}
            >
              Shipping
            </button>
            <span className="text-muted">/</span>
            <span className={step === 2 ? 'text-text' : 'text-muted'}>Payment</span>
          </div>

          {step === 1 ? (
            <CheckoutForm address={address} setAddress={setAddress} onSubmit={handleAddressSubmit} />
          ) : (
            <PaymentForm onConfirm={handlePaymentConfirm} isProcessing={isProcessing} />
          )}
        </div>

        {/* Right: Summary */}
        <div className="w-full lg:w-2/5 p-6 lg:p-16 xl:p-24 bg-surface-2 order-1 lg:order-2 lg:min-h-screen">
          <OrderSummary cart={cart} outOfStockIssues={stockIssues} />
        </div>

      </div>
    </Layout>
  )
}
