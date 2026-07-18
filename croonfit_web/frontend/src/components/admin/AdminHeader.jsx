import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Building2, 
  Archive, 
  Tag, 
  LayoutTemplate, 
  LineChart, 
  Settings,
  Bell,
  Search
} from 'lucide-react'

export function AdminHeader() {
  return (
    <header className="h-16 border-b border-[#E5E5E5] bg-white flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4 w-96 hidden md:flex">
        {/* Search removed as requested */}
      </div>
      
      <div className="flex items-center gap-4 ml-auto">
        <button className="relative p-2 text-[#666666] hover:text-[#111111] transition-colors rounded-full hover:bg-[#F9F9F9]">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-8 bg-[#111111] text-white rounded-full flex items-center justify-center text-sm font-medium cursor-pointer">
          A
        </div>
      </div>
    </header>
  )
}
