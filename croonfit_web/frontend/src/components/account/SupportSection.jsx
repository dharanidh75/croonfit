import React, { useState } from 'react'
import { ArrowLeft, Headphones, Mail } from 'lucide-react'
import toast from 'react-hot-toast'

export function SupportSection({ onBack }) {
  const [formData, setFormData] = useState({
    subject: 'Order Issue',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Mock save
    setTimeout(() => {
      setIsSubmitting(false)
      toast.success("Message sent! Our team will contact you soon.")
      setFormData({ subject: 'Order Issue', message: '' })
    }, 800)
  }

  return (
    <div className="animate-fade-in-up">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#888888] hover:text-black transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Account
      </button>

      <div className="bg-[#F9F9F9] border border-[#EBEBEB] rounded-2xl p-6 md:p-8">
        
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-[#EBEBEB]">
          <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-xl uppercase tracking-wide">Customer Support</h2>
            <p className="text-sm text-[#888888]">We're here to help with your orders and inquiries</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h3 className="font-heading font-bold uppercase tracking-wider text-[#0A0A0A] mb-4">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0A0A0A] mb-1.5">Subject</label>
                <select 
                  name="subject" 
                  value={formData.subject} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-black transition-all appearance-none"
                >
                  <option value="Order Issue">Order Issue / Tracking</option>
                  <option value="Returns">Returns & Refunds</option>
                  <option value="Product Inquiry">Product Inquiry</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0A0A0A] mb-1.5">Message</label>
                <textarea 
                  required 
                  name="message" 
                  rows="5"
                  placeholder="How can we help you today?"
                  value={formData.message} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-black transition-all resize-none"
                ></textarea>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-black text-white px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#111111] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>

          {/* Contact Info */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-[#E5E5E5] self-start">
            <h3 className="font-heading font-bold uppercase tracking-wider text-[#0A0A0A] mb-6">Contact Information</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#F5F5F5] rounded-full flex items-center justify-center flex-shrink-0 text-black">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#888888] mb-1">Email Support</p>
                  <a href="mailto:support@croonfit.com" className="font-semibold text-black hover:underline">support@croonfit.com</a>
                  <p className="text-sm text-[#555555] mt-1">We aim to reply within 24 hours.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#F5F5F5] rounded-full flex items-center justify-center flex-shrink-0 text-black">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#888888] mb-1">Phone Support</p>
                  <a href="tel:+918001234567" className="font-semibold text-black hover:underline">+91 800 123 4567</a>
                  <p className="text-sm text-[#555555] mt-1">Mon-Fri, 9AM to 6PM IST.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
