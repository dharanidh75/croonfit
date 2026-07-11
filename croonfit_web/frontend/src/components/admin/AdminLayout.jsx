import React, { useState } from 'react'
import { AdminSidebar } from './AdminSidebar'
import { AdminHeader } from './AdminHeader'
import { Menu, X } from 'lucide-react'

export function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex font-sans text-[#111111]">
      
      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
      )}
      
      {/* Mobile Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:hidden bg-white ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <AdminSidebar />
      </div>

      {/* Desktop Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Mobile Header Topbar (Only visible on small screens) */}
        <div className="md:hidden h-14 bg-white border-b border-[#E5E5E5] flex items-center px-4 shrink-0 justify-between">
          <div className="font-bold text-sm tracking-tight text-[#111111]">
            CROONFIT<span className="text-[#888888] font-normal ml-1">Admin</span>
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 -mr-2">
            {mobileOpen ? <X className="w-5 h-5 text-[#111111]" /> : <Menu className="w-5 h-5 text-[#111111]" />}
          </button>
        </div>

        {/* Desktop Header */}
        <AdminHeader />
        
        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative">
          <div className="max-w-[1200px] mx-auto animate-fade-in-up">
            {children}
          </div>
        </main>
      </div>
      
    </div>
  )
}
