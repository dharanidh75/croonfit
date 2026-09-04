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

      <main className="flex-1 pt-24 pb-20 px-6 sm:px-12 max-w-4xl mx-auto w-full">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 uppercase">Returns &middot; Exchange &middot; Refund</h1>
        <p className="text-sm md:text-base font-bold tracking-widest text-[#666666] mb-16 uppercase">Easy exchanges, honest rules.</p>

        <div className="space-y-16">
          <p className="text-base md:text-xl leading-relaxed text-[#333333]">
            Every product is made and quality-checked with care. Here's exactly how exchanges and refunds work — at a glance.
          </p>

          <section>
            <h2 className="text-xl md:text-2xl font-bold tracking-wide mb-6 uppercase">01 — When You Can Exchange</h2>
            <div className="space-y-4">
              <h3 className="text-lg md:text-xl font-bold text-[#111111] uppercase">No Exchange Fee*</h3>
              <p className="text-base md:text-lg text-[#444444]">There is no exchange fee for eligible exchanges.</p>
              <p className="text-base md:text-lg text-[#444444]">Exchange requests should be placed within 7 days of delivery, provided the product is in good condition and the original tag is attached.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold tracking-wide mb-6 uppercase">02 — Free Exchange for Damaged or Defective Items</h2>
            <p className="text-base md:text-lg text-[#444444] mb-8 font-medium">Received something damaged, defective, or incorrect?</p>
            <p className="text-base md:text-lg text-[#444444] mb-10">We'll arrange a free replacement at no extra cost, once the required conditions are met.</p>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-lg md:text-xl font-bold text-[#111111] mb-2 uppercase">01 — Report within 48 Hrs</h3>
                <p className="text-base md:text-lg text-[#444444]">Raise your claim within 48 hours of delivery.</p>
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold text-[#111111] mb-2 uppercase">02 — Unboxing Video</h3>
                <p className="text-base md:text-lg text-[#444444]">A clear unboxing video is mandatory for every damage or defect claim.</p>
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold text-[#111111] mb-2 uppercase">03 — Photos for Proof</h3>
                <p className="text-base md:text-lg text-[#444444]">Share clear photos or videos showing the issue.</p>
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold text-[#111111] mb-2 uppercase">04 — Original Condition</h3>
                <p className="text-base md:text-lg text-[#444444]">The item must be unused, unwashed, and have its tags intact.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold tracking-wide mb-6 uppercase text-[#D32F2F]">Exchange Not Applicable If</h2>
            <p className="text-base md:text-lg text-[#444444] mb-6">An exchange cannot be processed in the following cases:</p>
            <ul className="list-disc list-inside space-y-3 text-base md:text-lg text-[#444444]">
              <li>There are signs of use, washing, or damage after delivery.</li>
              <li>The issue is reported after the 48-hour reporting window.</li>
              <li>There is no unboxing video for a damage or defect claim.</li>
              <li>Tags are missing or the item is not in its original condition.</li>
              <li>The item was purchased under a Clearance Sale.</li>
            </ul>
          </section>

          <section className="p-8 bg-[#FAFAFA] border border-[#E5E5E5] rounded-sm">
            <h2 className="text-xl md:text-2xl font-bold tracking-wide mb-6 uppercase">Clearance Sale</h2>
            <p className="text-base md:text-lg font-bold text-[#111111] mb-4 uppercase">All clearance items are final sale.</p>
            <p className="text-base md:text-lg text-[#444444] mb-3">All items purchased under a Clearance Sale are considered final sale.</p>
            <p className="text-base md:text-lg text-[#444444]">No exchanges, returns, or refunds are accepted under any circumstances.</p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold tracking-wide mb-6 uppercase">No Refunds or Returns</h2>
            <div className="space-y-6 text-base md:text-lg text-[#444444]">
              <p>Once an order has been placed and delivered, it cannot be returned or refunded.</p>
              <p>We offer exchanges only, as described in this policy.</p>
              <p>For eligible damaged, defective, or incorrect items, a replacement may be arranged after the claim is reviewed and the required conditions are met.</p>
            </div>
          </section>

          <section className="border-t border-[#E5E5E5] pt-10">
            <h2 className="text-xl md:text-2xl font-bold tracking-wide mb-8 uppercase">Important Note</h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg md:text-xl font-bold text-[#111111] mb-4 uppercase">Exchange Eligibility</h3>
                <p className="text-base md:text-lg text-[#444444] mb-4">To be eligible for an exchange:</p>
                <ul className="list-disc list-inside space-y-2 text-base md:text-lg text-[#444444]">
                  <li>The request must be made within 7 days of delivery.</li>
                  <li>The product must be in original condition.</li>
                  <li>The product must be unused and unwashed.</li>
                  <li>Original tags must be attached.</li>
                </ul>
              </div>
              <p className="text-base md:text-lg text-[#444444] italic">
                For damaged or defective products, the issue must be reported within 48 hours of delivery, along with the required unboxing video and supporting photos/videos.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
