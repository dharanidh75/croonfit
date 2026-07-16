import React, { useEffect } from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { useStore } from '../store'
import { useNavigate, Link } from 'react-router-dom'
import { LogOut, Package, ChevronRight, Mail, User as UserIcon, Phone } from 'lucide-react'

export function Account() {
  const { user, logout, isAuthenticated } = useStore()
  const navigate = useNavigate()

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
                  {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              {/* Details */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2.5">
                  <UserIcon className="w-4 h-4 text-[#888888] flex-shrink-0" />
                  <span className="font-semibold text-[#0A0A0A] text-base">{user?.full_name || '—'}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#888888] flex-shrink-0" />
                  <span className="text-sm text-[#555555]">{user?.email || '—'}</span>
                </div>
                {user?.phone && (
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#888888] flex-shrink-0" />
                    <span className="text-sm text-[#555555]">{user.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* My Orders — prominent link card */}
          <Link
            to="/orders"
            className="group flex items-center justify-between p-6 border border-[#E5E5E5] rounded-2xl hover:border-black hover:shadow-md transition-all duration-200 bg-white"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#F5F5F5] rounded-xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors duration-200">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg uppercase tracking-wide mb-0.5">My Orders</h3>
                <p className="text-sm text-[#888888]">Track, return, or buy things again</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#888888] group-hover:text-black transition-colors duration-200" />
          </Link>

        </div>
      </main>
      <Footer />
    </div>
  )
}
