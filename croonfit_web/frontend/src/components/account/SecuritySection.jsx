import React, { useState } from 'react'
import { ArrowLeft, Shield } from 'lucide-react'
import toast from 'react-hot-toast'
import { useStore } from '../../store'
import api from '../../lib/api'

export function SecuritySection({ onBack }) {
  const { user, updateUser } = useStore()
  
  const [formData, setFormData] = useState({
    full_name: user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    current_password: '',
    new_password: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const parts = formData.full_name.trim().split(' ')
    const first_name = parts[0]
    const last_name = parts.slice(1).join(' ')

    const payload = {
      first_name,
      last_name,
      email: formData.email,
      phone: formData.phone
    }

    if (formData.current_password && formData.new_password) {
      payload.current_password = formData.current_password
      payload.new_password = formData.new_password
    }

    api.patch('/auth/me', payload)
      .then(res => {
        updateUser(res.data)
        toast.success("Profile updated successfully!")
        onBack()
      })
      .catch(err => {
        toast.error(err.response?.data?.detail || "Failed to update profile")
      })
      .finally(() => {
        setIsSubmitting(false)
      })
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
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-xl uppercase tracking-wide">Login & Security</h2>
            <p className="text-sm text-[#888888]">Update your personal information and password</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
          
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#555555]">Personal Information</h3>
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0A0A0A] mb-1.5">Full Name</label>
              <input 
                type="text" 
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0A0A0A] mb-1.5">Email Address</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0A0A0A] mb-1.5">Phone Number</label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
              />
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-[#EBEBEB]">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#555555]">Change Password</h3>
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0A0A0A] mb-1.5">Current Password</label>
              <input 
                type="password" 
                name="current_password"
                value={formData.current_password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                placeholder="Leave blank to keep unchanged"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0A0A0A] mb-1.5">New Password</label>
              <input 
                type="password" 
                name="new_password"
                value={formData.new_password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                placeholder="Leave blank to keep unchanged"
              />
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-black text-white px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#111111] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
