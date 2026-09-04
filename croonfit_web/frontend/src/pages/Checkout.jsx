import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { OrderSummary } from '../components/checkout/OrderSummary'
import { CheckoutForm } from '../components/checkout/CheckoutForm'
import { PaymentForm } from '../components/checkout/PaymentForm'
import { Check } from 'lucide-react'
import { useStore } from '../store'
import api from '../lib/api'
import toast from 'react-hot-toast'

export function Checkout() {
  const navigate = useNavigate()
  const { cart, clearCart, setLastOrder, buyNowItem, clearBuyNowItem } = useStore()
  const [step, setStep] = useState(1)

  const checkoutItems = buyNowItem ? [buyNowItem] : cart

  const [address, setAddress] = useState({})
  const [stockIssues, setStockIssues] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [localLastOrder, setLocalLastOrder] = useState(null)

  const [discountCode, setDiscountCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState(null)
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    // Load Razorpay script
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  useEffect(() => {
    if (checkoutItems.length === 0 && !isProcessing && !localLastOrder) {
      navigate('/cart')
    }
  }, [checkoutItems, navigate, isProcessing, localLastOrder])

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return
    setIsApplyingDiscount(true)
    try {
      const subtotal = checkoutItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0)
      const res = await api.post('/discounts/validate', { code: discountCode, subtotal })
      setAppliedDiscount(res.data)
      toast.success(`Discount applied: ${res.data.type === 'FREE_SHIPPING' ? 'Free Shipping' : `₹${res.data.discount_amount.toFixed(2)} off`}`)
    } catch (err) {
      const errorDetail = err.response?.data?.detail
      const errorMessage = Array.isArray(errorDetail) ? errorDetail[0]?.msg : (errorDetail || "Invalid discount code")
      toast.error(errorMessage)
      setAppliedDiscount(null)
      setDiscountCode('')
    } finally {
      setIsApplyingDiscount(false)
    }
  }

  const handleShippingSubmit = (addr) => {
    setAddress(addr)
    setStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePaymentConfirm = async (paymentDetails) => {
    setIsProcessing(true)
    setStockIssues([])

    try {
      const items = checkoutItems.map(item => ({ variant_id: item.variant.id, quantity: item.quantity }))

      // 1. Create Order
      const orderPayload = { items, shipping_address: address }
      if (appliedDiscount) {
        orderPayload.discount_code = appliedDiscount.code
      }
      const orderRes = await api.post('/orders', orderPayload)
      const order = orderRes.data

      // 2. Create Payment Intent
      const intentRes = await api.post('/payments/intent', { order_id: order.id })
      const razorpayOrderId = intentRes.data.payment_id // Backend sends razorpay order id here

      // 3. Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY',
        amount: intentRes.data.amount * 100,
        currency: intentRes.data.currency,
        name: 'Croon Fit',
        description: `Order #${order.order_number}`,
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            // 4. Confirm Payment on Backend
            const confirmRes = await api.post('/payments/confirm', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            })

            if (confirmRes.data.success) {
              const orderData = {
                order_number: confirmRes.data.order_number,
                total: order.total,
                email: address.full_name
              }
              setLastOrder(orderData)
              setLocalLastOrder(orderData) // Prevent cart redirect race condition
              
              if (buyNowItem) {
                clearBuyNowItem()
              } else {
                clearCart()
              }
              
              toast.success("Payment successful! Your order has been placed.")
              navigate('/order-success')
            }
          } catch (err) {
            toast.error(err.response?.data?.detail || "Payment verification failed. Please contact support.")
            setIsProcessing(false)
          }
        },
        prefill: {
          name: address.full_name,
          email: `${address.full_name.replace(' ', '').toLowerCase()}@example.com`,
          contact: address.phone
        },
        theme: {
          color: '#0A0A0A'
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false)
            toast.error("Payment was cancelled. You can try again.")
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function (response) {
        setIsProcessing(false)
        toast.error(response.error.description || "Payment failed. Please try again.")
      })
      rzp.open()

    } catch (err) {
      if (err.response?.status === 409) {
        setStep(1)
        setStockIssues(err.response.data.issues || [])
        toast.error("Inventory changed during checkout! Please review your cart.")
      } else {
        toast.error(err.response?.data?.detail || "Failed to initialize payment. Please try again.")
      }
      setIsProcessing(false)
    }
  }

  if (checkoutItems.length === 0 && !isProcessing) return null

  return (
    <div className="min-h-screen bg-white font-sans text-[#0A0A0A] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-32">
        <div className="max-w-[1440px] mx-auto px-6 mb-12">
          <h1 className="text-4xl md:text-5xl font-light uppercase tracking-tight mb-2">
            Checkout
          </h1>
          <p className="text-sm font-light text-[#555555]">Almost there. Complete your details below.</p>
        </div>

        <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="flex gap-4 mb-10">
              <div
                className={`flex items-center gap-2 pb-2 border-b-2 text-sm font-bold uppercase tracking-widest transition-colors ${step === 1 ? 'border-black text-black' : 'border-transparent text-[#888888]'}`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 1 ? 'bg-black text-white' : 'bg-[#E5E5E5] text-[#555555]'}`}>1</span>
                Shipping
              </div>
              <div className="flex items-center text-[#E5E5E5] pb-2">
                <Check className="w-4 h-4" />
              </div>
              <div
                className={`flex items-center gap-2 pb-2 border-b-2 text-sm font-bold uppercase tracking-widest transition-colors ${step === 2 ? 'border-black text-black' : 'border-transparent text-[#888888]'}`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 2 ? 'bg-black text-white' : 'bg-[#E5E5E5] text-[#555555]'}`}>2</span>
                Payment
              </div>
            </div>

            {step === 1 ? (
              <CheckoutForm
                address={address}
                setAddress={setAddress}
                onSubmit={(e) => { e.preventDefault(); handleShippingSubmit(address); }}
              />
            ) : (
              <PaymentForm
                onConfirm={handlePaymentConfirm}
                isProcessing={isProcessing}
              />
            )}
          </div>

          <div className="lg:col-span-5 xl:col-span-4">
            <OrderSummary
              cart={checkoutItems}
              outOfStockIssues={stockIssues}
              discountCode={discountCode}
              setDiscountCode={setDiscountCode}
              appliedDiscount={appliedDiscount}
              setAppliedDiscount={setAppliedDiscount}
              onApplyDiscount={handleApplyDiscount}
              isApplyingDiscount={isApplyingDiscount}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
