import React, { useEffect } from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'

export function ShippingPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-20 px-6 sm:px-12 max-w-[1280px] mx-auto w-full">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-16 uppercase">Shipping Policy</h1>
        
        <div className="space-y-12">
          <p className="text-base md:text-lg leading-relaxed text-[#111111]">
            We are committed to processing and delivering your order as quickly and smoothly as possible. Orders are processed promptly after they are placed and are handed over to our trusted delivery partners for shipment.
          </p>

          <section>
            <h2 className="text-xl md:text-2xl font-bold tracking-wide mb-4">Order Processing</h2>
            <p className="text-base md:text-lg text-[#111111]">
              Orders are generally dispatched within 24 hours of being placed. Orders placed on weekends or public holidays will be processed and dispatched on the next business day.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold tracking-wide mb-4">Delivery Timeline</h2>
            <p className="text-base md:text-lg text-[#111111]">
              Prepaid orders are usually delivered within 4–5 days from dispatch. Cash on Delivery (COD) orders are generally delivered within 5–7 days, as COD orders require an additional 1–2 days for verification before dispatch.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold tracking-wide mb-4">Tracking Information</h2>
            <p className="text-base md:text-lg text-[#111111]">
              Once your order has been dispatched, tracking details will be shared with you through email and WhatsApp. You can use the tracking information to follow the progress of your shipment until delivery.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold tracking-wide mb-4">Delivery Delays</h2>
            <p className="text-base md:text-lg text-[#111111]">
              We aim to deliver all orders within the estimated timelines. However, delivery may occasionally be affected by weather conditions, carrier delays, holidays, or other unforeseen circumstances. We are not responsible for delays caused by third-party shipping partners, but we will assist you in tracking your order and resolving delivery-related concerns.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold tracking-wide mb-4">Order Cancellation</h2>
            <p className="text-base md:text-lg text-[#111111]">
              Orders can be cancelled within 12 hours of placing the order, provided the order has not already been dispatched. Since orders are generally dispatched within 24 hours, customers are encouraged to contact us as soon as possible if they wish to cancel an order.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold tracking-wide mb-4">Cancellation After Dispatch</h2>
            <p className="text-base md:text-lg text-[#111111]">
              Once an order has been dispatched, it cannot be cancelled. In such cases, customers may use the applicable exchange process described in our Return & Refund Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold tracking-wide mb-4">Refunds for Cancelled Orders</h2>
            <p className="text-base md:text-lg text-[#111111]">
              For successfully cancelled prepaid orders, the full amount will be refunded to the original payment method. Refunds are typically processed within 5–7 business days. COD orders do not require a refund where no payment has been collected.
            </p>
          </section>

          <section className="p-8 bg-[#FAFAFA] border border-[#E5E5E5] rounded-sm">
            <h2 className="text-xl md:text-2xl font-bold tracking-wide mb-4">Clearance Sale Orders</h2>
            <p className="text-base md:text-lg text-[#111111]">
              Products purchased during a Clearance Sale are considered final sale and cannot be cancelled, returned, exchanged, or refunded.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
