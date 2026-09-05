import React, { useEffect } from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'

export function ReturnPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-20 px-6 sm:px-12 max-w-[1280px] mx-auto w-full">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-16 uppercase">Return & Refund Policy</h1>

        <div className="space-y-12">
          <p className="text-base md:text-lg leading-relaxed text-gray-900">
            We carefully manufacture and quality-check every product before it is shipped. To maintain product quality and ensure a fair process for all customers, we offer exchanges for eligible products, subject to the conditions mentioned below.
          </p>

          <section>
            <h2 className="text-xl md:text-2xl font-bold tracking-wide mb-4">Exchange Policy</h2>
            <p className="text-base md:text-lg text-gray-900">
              Eligible products can be exchanged within 7 days of delivery. The product must be unused, unwashed, in its original condition, and have all original tags attached. Eligible exchanges are provided without an exchange fee.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold tracking-wide mb-4">Damaged, Defective, or Incorrect Products</h2>
            <p className="text-base md:text-lg text-gray-900">
              If you receive a damaged, defective, or incorrect product, please report the issue within 48 hours of delivery. Once the claim is reviewed and the required conditions are met, we will arrange a replacement at no additional cost.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold tracking-wide mb-4">Proof of Damage or Defect</h2>
            <p className="text-base md:text-lg text-gray-900">
              For damaged or defective product claims, a clear unboxing video is mandatory. Customers must also provide clear photographs or videos showing the issue with the product. These materials are required to verify and process the claim.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold tracking-wide mb-4">Product Condition</h2>
            <p className="text-base md:text-lg text-gray-900">
              Products submitted for exchange must be unused and unwashed and must remain in their original condition with the original tags attached. Products showing signs of use, washing, or damage after delivery may not be eligible for exchange.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold tracking-wide mb-4">Exchange Restrictions</h2>
            <p className="text-base md:text-lg text-gray-900">
              An exchange request may be rejected if it is submitted after the applicable 7-day exchange period, if a damaged or defective item is reported after the 48-hour reporting window, if the required unboxing video is not provided for a damage or defect claim, or if the product is missing its original tags or is not in its original condition.
            </p>
          </section>

          <section className="p-8 bg-[#FAFAFA] border border-[#E5E5E5] rounded-sm">
            <h2 className="text-xl md:text-2xl font-bold tracking-wide mb-4">Clearance Sale Products</h2>
            <p className="text-base md:text-lg text-gray-900">
              All products purchased under a Clearance Sale are final sale. Clearance Sale products are not eligible for returns, exchanges, or refunds under any circumstances.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold tracking-wide mb-4">Refund Policy</h2>
            <p className="text-base md:text-lg text-gray-900">
              Once an order has been delivered, we do not accept returns or provide refunds. Our policy is based on exchanges only for products that meet the applicable eligibility requirements described above.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold tracking-wide mb-4">Cancellation Refunds</h2>
            <p className="text-base md:text-lg text-gray-900">
              Refunds are applicable only to eligible prepaid orders that are successfully cancelled before dispatch, in accordance with our Shipping Policy. Approved cancellation refunds are processed to the original payment method and typically take 5–7 business days.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold tracking-wide mb-4">Contact Us</h2>
            <p className="text-base md:text-lg text-gray-900">
              If you have any questions regarding an exchange, damaged or defective product, cancellation, or refund, please contact our support team through the contact details provided on our website.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
