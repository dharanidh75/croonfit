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
  Settings
} from 'lucide-react'

export function AdminSidebar() {
  const location = useLocation()

  const navGroups = [
    {
      title: 'Main',
      items: [
        { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
        { to: '/admin/products', icon: Package, label: 'Products' },
        { to: '/admin/customers', icon: Users, label: 'Customers' },
      ]
    },
    {
      title: 'Operations',
      items: [
        { to: '/admin/dealers', icon: Building2, label: 'Wholesale & Dealers' },
        { to: '/admin/inventory', icon: Archive, label: 'Inventory' },
        { to: '/admin/discounts', icon: Tag, label: 'Discounts' },
      ]
    },
    {
      title: 'System',
      items: [
        { to: '/admin/cms', icon: LayoutTemplate, label: 'Content (CMS)' },
        { to: '/admin/analytics', icon: LineChart, label: 'Analytics' },
        { to: '/admin/settings', icon: Settings, label: 'Settings' },
      ]
    }
  ]

  return (
    <aside className="w-64 bg-[#F9F9F9] border-r border-[#E5E5E5] flex-shrink-0 h-screen sticky top-0 z-20 flex flex-col hidden md:flex">
      <div className="h-16 px-6 border-b border-[#E5E5E5] flex items-center shrink-0">
        <div className="font-bold text-lg tracking-tight text-[#111111]">
          CROONFIT<span className="text-[#888888] font-normal ml-1">Admin</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-8 custom-scrollbar">
        {navGroups.map((group, idx) => (
          <div key={idx}>
            <h4 className="px-3 text-[10px] font-bold uppercase tracking-widest text-[#888888] mb-3">
              {group.title}
            </h4>
            <div className="space-y-1">
              {group.items.map(item => {
                const Icon = item.icon
                // Exact match for dashboard, partial match for others so nested routes stay active
                const isActive = item.to === '/admin' 
                  ? location.pathname === '/admin'
                  : location.pathname.startsWith(item.to)
                  
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-[#EFEFEF] text-[#111111]' 
                        : 'text-[#666666] hover:bg-[#F0F0F0] hover:text-[#111111]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#111111]' : 'text-[#888888]'}`} />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
      
      <div className="p-4 border-t border-[#E5E5E5] shrink-0">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-[#E5E5E5] flex items-center justify-center text-xs font-bold text-[#666666]">
            CF
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[#111111] truncate">Croonfit India</p>
            <p className="text-[10px] text-[#888888] truncate">Production Store</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
