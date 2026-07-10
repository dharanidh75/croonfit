import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingBag, CreditCard, LogOut } from 'lucide-react'

export function AdminLayout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    localStorage.removeItem('croonfit-admin-token')
    navigate('/admin/login')
  }

  const nav = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/products', icon: Package, label: 'Products' },
    { to: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
    { to: '/admin/billing', icon: CreditCard, label: 'Billing' },
  ]

  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-base border-r border-border flex flex-col flex-shrink-0 md:h-screen sticky top-0 z-20">
        <div className="p-6 border-b border-border flex items-center justify-between md:justify-start">
          <div className="font-heading font-black text-xl uppercase tracking-tighter">
            CROONFIT<span className="text-muted text-sm ml-2">ADMIN</span>
          </div>
        </div>

        <nav className="flex-1 p-4 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible hide-scrollbar">
          {nav.map(item => {
            const Icon = item.icon
            const isActive = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-none font-heading font-bold uppercase tracking-wider text-sm transition-colors duration-[150ms] linear flex-shrink-0 ${
                  isActive ? 'bg-accent text-white' : 'text-muted hover:bg-surface hover:text-text'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden md:block">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border hidden md:block">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left font-heading font-bold uppercase tracking-wider text-sm text-danger hover:bg-surface transition-colors duration-[150ms] linear"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}
