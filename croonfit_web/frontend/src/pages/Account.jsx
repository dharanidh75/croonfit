import React, { useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { useStore } from '../store'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { LogOut, Package, ChevronRight, Mail, User as UserIcon, Phone, Shield, MapPin, CreditCard, Heart, Headphones, Settings } from 'lucide-react'

// Sub-components
import { SecuritySection } from '../components/account/SecuritySection'
import { AddressSection } from '../components/account/AddressSection'
import { PaymentSection } from '../components/account/PaymentSection'
import { SupportSection } from '../components/account/SupportSection'
import { OrdersSection } from '../components/account/OrdersSection'

export function Account() {
  const { user, logout, isAuthenticated } = useStore()
  const navigate = useNavigate()
  const { tab } = useParams()
  
  const activeView = tab || 'dashboard'

  const isAdmin = user?.role === 'ADMIN'

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-white font-sans text-[#0A0A0A] flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-32">
        <div className="max-w-[900px] mx-auto px-6">

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 pb-6 border-b border-[#F0F0F0]">
            <div>
              <h1 className="font-heading font-black text-4xl uppercase tracking-tighter mb-1">My Account</h1>
              <p className="text-sm text-[#888888]">Manage your profile and view your orders.</p>
            </div>
            <button
              onClick={handleLogout}
              className="mt-5 sm:mt-0 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E53E3E] border-2 border-[#E53E3E] rounded-xl px-4 py-2 hover:bg-[#E53E3E] hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>

          {/* Profile Card — always visible, inline */}
          <div className="bg-[#F9F9F9] border border-[#EBEBEB] rounded-2xl p-8 mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#888888] mb-5">Profile</h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Avatar */}
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white flex-shrink-0">
                <span className="text-2xl font-bold leading-none">
                  {user?.first_name?.charAt(0)?.toUpperCase() || user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              {/* Details */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2.5">
                  <UserIcon className="w-4 h-4 text-[#888888] flex-shrink-0" />
                  <span className="font-semibold text-base" style={{ color: '#555555' }}>
                    {user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user?.full_name || '—'}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#888888] flex-shrink-0" />
                  <span className="text-sm" style={{ color: '#555555' }}>{user?.email || '—'}</span>
                </div>
                {user?.phone && (
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#888888] flex-shrink-0" />
                    <span className="text-sm" style={{ color: '#555555' }}>{user.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* View Switcher */}
          {activeView === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up">
              
              {/* My Orders */}
              <Link to="/account/orders" className="group flex items-center justify-between p-6 border border-[#E5E5E5] rounded-2xl hover:border-black hover:shadow-md transition-all duration-200 bg-white cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#F5F5F5] rounded-xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-200">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg uppercase tracking-wide mb-0.5">My Orders</h3>
                    <p className="text-sm text-[#888888]">Track, return, or buy again</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[#888888] group-hover:text-black transition-colors duration-200" />
              </Link>

              {/* Login & Security */}
              <Link to="/account/security" className="group flex items-center justify-between p-6 border border-[#E5E5E5] rounded-2xl hover:border-black hover:shadow-md transition-all duration-200 bg-white cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#F5F5F5] rounded-xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-200">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg uppercase tracking-wide mb-0.5">Login & Security</h3>
                    <p className="text-sm text-[#888888]">Edit login, name, and mobile</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[#888888] group-hover:text-black transition-colors duration-200" />
              </Link>

              {/* Your Addresses */}
              <Link to="/account/addresses" className="group flex items-center justify-between p-6 border border-[#E5E5E5] rounded-2xl hover:border-black hover:shadow-md transition-all duration-200 bg-white cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#F5F5F5] rounded-xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-200">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg uppercase tracking-wide mb-0.5">Your Addresses</h3>
                    <p className="text-sm text-[#888888]">Edit addresses for orders</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[#888888] group-hover:text-black transition-colors duration-200" />
              </Link>

              {/* Wishlist */}
              <Link to="/wishlist" className="group flex items-center justify-between p-6 border border-[#E5E5E5] rounded-2xl hover:border-black hover:shadow-md transition-all duration-200 bg-white">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#F5F5F5] rounded-xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-200">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg uppercase tracking-wide mb-0.5">Your Wishlist</h3>
                    <p className="text-sm text-[#888888]">View your saved items</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[#888888] group-hover:text-black transition-colors duration-200" />
              </Link>

              {/* Customer Support */}
              <Link to="/account/support" className="group flex items-center justify-between p-6 border border-[#E5E5E5] rounded-2xl hover:border-black hover:shadow-md transition-all duration-200 bg-white cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#F5F5F5] rounded-xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-200">
                    <Headphones className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg uppercase tracking-wide mb-0.5">Customer Support</h3>
                    <p className="text-sm text-[#888888]">Help center and contact us</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[#888888] group-hover:text-black transition-colors duration-200" />
              </Link>

              {/* Admin Portal (Only visible if admin claim is present) */}
              {isAdmin && (
                <Link to="/admin" className="group flex items-center justify-between p-6 border border-[#E5E5E5] rounded-2xl hover:border-black hover:shadow-md transition-all duration-200 bg-white cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#F5F5F5] rounded-xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-200">
                      <Settings className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-lg uppercase tracking-wide mb-0.5">Admin Portal</h3>
                      <p className="text-sm text-[#888888]">Manage store and products</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#888888] group-hover:text-black transition-colors duration-200" />
                </Link>
              )}

            </div>
          )}

          {activeView === 'orders' && <OrdersSection onBack={() => navigate('/account')} />}
          {activeView === 'security' && <SecuritySection onBack={() => navigate('/account')} />}
          {activeView === 'addresses' && <AddressSection onBack={() => navigate('/account')} />}
          {activeView === 'payments' && <PaymentSection onBack={() => navigate('/account')} />}
          {activeView === 'support' && <SupportSection onBack={() => navigate('/account')} />}

        </div>
      </main>
      <Footer />
    </div>
  )
}
