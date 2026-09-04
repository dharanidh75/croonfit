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

      <main className="flex-1 pt-24 pb-20 px-6 sm:px-12 max-w-4xl mx-auto w-full">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 uppercase">Shipping Policy</h1>
        <p className="text-sm md:text-base font-bold tracking-widest text-[#666666] mb-12 uppercase">Out the door in 24 hours.</p>

        <div className="space-y-12">
          <p className="text-base md:text-lg leading-relaxed text-[#333333]">
            We're committed to getting your order to you quickly and smoothly. Here's the full journey, from checkout to doorstep.
          </p>

          <section>
            <h2 className="text-lg md:text-xl font-bold tracking-wide mb-6 uppercase">01 — Your Order's Journey</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-[#111111] mb-1">Order Placed</h3>
                <p className="text-xs md:text-sm font-bold tracking-widest text-[#888888] mb-2 uppercase">Day 0</p>
                <p className="text-sm md:text-base text-[#444444]">We receive your order and begin processing it right away.</p>
              </div>
              <div>
                <h3 className="font-bold text-[#111111] mb-1">Dispatched in 24 Hours</h3>
                <p className="text-xs md:text-sm font-bold tracking-widest text-[#888888] mb-2 uppercase">Within 24 Hrs</p>
                <p className="text-sm md:text-base text-[#444444]">Orders are shipped within 24 hours. Orders placed on weekends or holidays will be dispatched on the next business day.</p>
              </div>
              <div>
                <h3 className="font-bold text-[#111111] mb-1">On the Way</h3>
                <p className="text-xs md:text-sm font-bold tracking-widest text-[#888888] mb-2 uppercase">In Transit</p>
                <p className="text-sm md:text-base text-[#444444]">Your order is handed over to our trusted delivery partners and is on its way to your door.</p>
              </div>
              <div>
                <h3 className="font-bold text-[#111111] mb-1">Delivered</h3>
                <p className="text-xs md:text-sm font-bold tracking-widest text-[#888888] mb-2 uppercase">Arrives</p>
                <p className="text-sm md:text-base text-[#444444]">Prepaid orders: 4–5 days<br/>Cash on Delivery orders: 5–7 days after verification.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-bold tracking-wide mb-6 uppercase">02 — Prepaid vs Cash on Delivery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="p-6 bg-[#FAFAFA] border border-[#E5E5E5] rounded-sm">
                <h3 className="font-bold text-[#111111] mb-4 uppercase">Prepaid</h3>
                <p className="text-sm md:text-base text-[#444444] mb-6">Orders are dispatched within 1 day.</p>
                <p className="text-xs md:text-sm text-[#888888] mb-1 uppercase tracking-widest">Delivery usually takes:</p>
                <p className="text-xl font-bold">4–5 DAYS</p>
              </div>
              <div className="p-6 bg-[#FAFAFA] border border-[#E5E5E5] rounded-sm">
                <h3 className="font-bold text-[#111111] mb-4 uppercase">Cash on Delivery</h3>
                <p className="text-sm md:text-base text-[#444444] mb-6">COD orders require verification before dispatch. Verification usually takes 1–2 days, after which the order is shipped.</p>
                <p className="text-xs md:text-sm text-[#888888] mb-1 uppercase tracking-widest">Delivery usually takes:</p>
                <p className="text-xl font-bold">5–7 DAYS</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-bold tracking-wide mb-4 uppercase">Delivery Timelines</h2>
            <p className="text-sm md:text-base text-[#444444] mb-4">We aim for timely delivery, but timelines can occasionally be affected by weather, carrier delays, or unforeseen events.</p>
            <p className="text-sm md:text-base text-[#444444]">We aren't liable for delays caused by shipping partners — we'll always help you track your order down.</p>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-bold tracking-wide mb-4 uppercase">Tracking Information</h2>
            <ul className="list-disc list-inside space-y-2 text-sm text-[#444444]">
              <li>Orders are shipped via trusted delivery partners.</li>
              <li>Tracking information is shared via email and WhatsApp once the order has been dispatched.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-bold tracking-wide mb-6 uppercase">03 — The Cancellation Window</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-[#111111] mb-1 uppercase">Within 12 Hours</h3>
                <p className="text-sm md:text-base text-[#444444]">You can cancel your order within 12 hours of placing it, as long as the order has not already been dispatched.</p>
              </div>
              <div>
                <h3 className="font-bold text-[#111111] mb-1 uppercase">After Dispatch</h3>
                <p className="text-sm md:text-base text-[#444444] mb-2">Once your order has been shipped, it can no longer be cancelled.</p>
                <p className="text-sm md:text-base text-[#444444] font-medium">Please use our exchange process instead.</p>
              </div>
              <p className="text-sm md:text-base italic text-[#666666]">Because we dispatch orders within 24 hours, the sooner you let us know, the better the chance we can stop your order in time.</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-bold tracking-wide mb-6 uppercase">04 — How to Cancel</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-[#111111] mb-1 uppercase">01 — Reach out fast</h3>
                <p className="text-sm md:text-base text-[#444444]">Message us via WhatsApp or email with your order number.</p>
              </div>
              <div>
                <h3 className="font-bold text-[#111111] mb-1 uppercase">02 — We Confirm</h3>
                <p className="text-sm md:text-base text-[#444444]">We'll check your order status and confirm whether cancellation is possible.</p>
              </div>
              <div>
                <h3 className="font-bold text-[#111111] mb-1 uppercase">03 — Refund Initiated</h3>
                <p className="text-sm md:text-base text-[#444444]">For successfully cancelled prepaid orders, the refund will be initiated to the original payment method.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-bold tracking-wide mb-4 uppercase text-[#D32F2F]">Cancellation Not Possible</h2>
            <p className="text-sm md:text-base text-[#444444] mb-2">An order cannot be cancelled:</p>
            <ul className="list-disc list-inside space-y-2 text-sm text-[#444444] mb-8">
              <li>After the 12-hour cancellation window has passed.</li>
              <li>Once the order has been dispatched.</li>
              <li>If the item was purchased under a Clearance Sale / Final Sale.</li>
            </ul>

            <h2 className="text-lg md:text-xl font-bold tracking-wide mb-4 uppercase">Refunds on Cancellation</h2>
            <p className="text-sm md:text-base text-[#444444] mb-2">For successfully cancelled prepaid orders, the full amount will be refunded to the original payment method, typically within 5–7 business days.</p>
            <p className="text-sm md:text-base text-[#444444]">COD orders have nothing to refund.</p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
