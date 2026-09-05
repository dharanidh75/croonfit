import React from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { Mail, MapPin, Phone } from 'lucide-react'

export function Contact() {
  return (
    <div className="min-h-screen bg-white font-sans text-[#0A0A0A] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-32">
        {/* Header */}
        <div className="max-w-[1440px] mx-auto px-6 mb-16">
          <h1 className="text-4xl md:text-5xl font-light uppercase tracking-tight mb-2">
            Contact Us
          </h1>
          <p className="text-sm font-medium uppercase tracking-widest text-[#888888]">
            We're here to help
          </p>
        </div>

        <div className="max-w-[1440px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            
            {/* Left Column: Form */}
            <div>
              <h2 className="font-heading font-black text-2xl uppercase tracking-tighter mb-8">Send a Message</h2>
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Thanks for contacting us! Since this is a frontend-only demo, the message wasn't sent to a database.") }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#888888] mb-2">Full Name</label>
                    <input 
                      type="text" 
                      required
                      pattern="^[a-zA-Z\s]+$" title="Only letters and spaces are allowed"
                      className="w-full h-14 border border-[#E5E5E5] rounded-xl px-4 text-sm font-light text-[#0A0A0A] placeholder-[#888888] focus:border-black focus:ring-1 focus:ring-black outline-none transition-all duration-300"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#888888] mb-2">Email Address</label>
                    <input 
                      type="email" 
                      required
                      className="w-full h-14 border border-[#E5E5E5] rounded-xl px-4 text-sm font-light text-[#0A0A0A] placeholder-[#888888] focus:border-black focus:ring-1 focus:ring-black outline-none transition-all duration-300"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#888888] mb-2">Subject</label>
                  <input 
                    type="text" 
                    required
                    className="w-full h-14 border border-[#E5E5E5] rounded-xl px-4 text-sm font-light text-[#0A0A0A] placeholder-[#888888] focus:border-black focus:ring-1 focus:ring-black outline-none transition-all duration-300"
                    placeholder="Order Inquiry, Returns, etc."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#888888] mb-2">Message</label>
                  <textarea 
                    required
                    className="w-full h-40 border border-[#E5E5E5] rounded-xl p-4 text-sm font-light text-[#0A0A0A] placeholder-[#888888] focus:border-black focus:ring-1 focus:ring-black outline-none transition-all duration-300 resize-none"
                    placeholder="How can we help you today?"
                  ></textarea>
                </div>

                <button type="submit" className="w-full sm:w-auto px-10 h-14 bg-black text-white text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-gray-900 transition-all duration-300">
                  Send Message
                </button>
              </form>
            </div>

            {/* Right Column: Info */}
            <div className="bg-[#F9F9F9] p-8 md:p-12 rounded-3xl h-fit">
              <h2 className="font-heading font-black text-2xl uppercase tracking-tighter mb-8">Get in Touch</h2>
              
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Mail className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm uppercase tracking-wider mb-1">Email Us</h3>
                    <p className="text-[#555555] text-sm">support@croonfit.com</p>
                    <p className="text-[#888888] text-xs mt-1">We aim to reply within 24 hours.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Phone className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm uppercase tracking-wider mb-1">Call Us</h3>
                    <p className="text-[#555555] text-sm">+91 1800 123 4567</p>
                    <p className="text-[#888888] text-xs mt-1">Mon-Fri, 9am to 6pm IST</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <MapPin className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm uppercase tracking-wider mb-1">HQ Address</h3>
                    <p className="text-[#555555] text-sm leading-relaxed">
                      Croonfit Apparel Studio<br />
                      123 Fashion Street, Cyber City<br />
                      New Delhi, 110001, India
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
