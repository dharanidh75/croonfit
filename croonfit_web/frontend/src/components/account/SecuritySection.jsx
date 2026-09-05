import React, { useState, useEffect } from 'react'
import { ArrowLeft, Shield, Info, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { useStore } from '../../store'
import api from '../../lib/api'
import { auth } from '../../lib/firebase'

export function SecuritySection({ onBack }) {
  const { user, updateUser } = useStore()
  
  // Detect if user signed in with Google (no password)
  const isGoogleUser = auth?.currentUser?.providerData?.some(p => p.providerId === 'google.com') ?? false

  const [formData, setFormData] = useState({
    full_name: user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    current_password: '',
    new_password: '',
    confirm_password: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPw, setShowPw] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!isGoogleUser && formData.new_password && formData.new_password !== formData.confirm_password) {
      toast.error('New passwords do not match')
      return
    }

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

    if (!isGoogleUser && formData.current_password && formData.new_password) {
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

  const inputClass = "w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-xl text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"

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
            <h2 className="font-heading font-bold text-xl uppercase tracking-wide">Login &amp; Security</h2>
            <p className="text-sm text-[#888888]">Update your personal information and password</p>
          </div>
        </div>

        {isGoogleUser && (
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 leading-relaxed">
              You signed in with <strong>Google</strong>. Your email and password are managed by Google — you can update your name and phone number here.
            </p>
          </div>
        )}

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
                pattern="^[a-zA-Z\s]+$" title="Only letters and spaces are allowed"
                className={inputClass}
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
                className={`${inputClass} ${isGoogleUser ? 'bg-[#F5F5F5] text-[#888888] cursor-not-allowed' : ''}`}
                disabled={isGoogleUser}
                required
              />
              {isGoogleUser && (
                <p className="text-[10px] text-[#888888] mt-1.5 ml-1">Email is managed by Google and cannot be changed here.</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0A0A0A] mb-1.5">Phone Number</label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                pattern="^(\+91[\-\s]?)?[0-9]{10}$" title="Enter a valid 10-digit phone number, optionally starting with +91"
                className={inputClass}
              />
            </div>
          </div>

          {/* Only show password section for non-Google users */}
          {!isGoogleUser && (
            <div className="space-y-4 pt-6 border-t border-[#EBEBEB]">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#555555]">Change Password</h3>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0A0A0A] mb-1.5">Current Password</label>
                <div className="relative">
                  <input 
                    type={showPw ? 'text' : 'password'} 
                    name="current_password"
                    value={formData.current_password}
                    onChange={handleChange}
                    className={`${inputClass} pr-10`}
                    placeholder="Leave blank to keep unchanged"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-black transition-colors">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0A0A0A] mb-1.5">New Password</label>
                <div className="relative">
                  <input 
                    type={showPw ? 'text' : 'password'} 
                    name="new_password"
                    value={formData.new_password}
                    onChange={handleChange}
                    pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$"
                    title="Password must be at least 8 characters long and include a letter, a number, and a special character."
                    className={`${inputClass} pr-10`}
                    placeholder="Leave blank to keep unchanged"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0A0A0A] mb-1.5">Confirm New Password</label>
                <div className="relative">
                  <input 
                    type={showPw ? 'text' : 'password'} 
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    className={`${inputClass} pr-10`}
                    placeholder="Re-enter new password"
                  />
                </div>
              </div>
            </div>
          )}

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
