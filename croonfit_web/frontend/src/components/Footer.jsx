import React from 'react'
import { Link } from 'react-router-dom'
import { Logo, CroonIcon } from './Logo'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#000000] text-white">
      {/* Main grid */}
      <div className="max-w-[1280px] mx-auto px-6 pt-16 pb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand column */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <CroonIcon className="h-8 text-white" />
            <div>
              <Logo className="h-5 text-white" />
              <p className="text-[9px] font-bold tracking-[0.25em] uppercase text-[#888888] mt-0.5">APPAREL STUDIO</p>
            </div>
          </div>
          <p className="font-body text-sm text-[#888888] leading-relaxed max-w-[220px]">
            Gen Z-coded sportswear for Indian streets. Wear the Grind.
          </p>
          <div className="flex gap-4 mt-6">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-[#888888] hover:text-white transition-colors duration-150">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter / X" className="text-[#888888] hover:text-white transition-colors duration-150">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
                <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
              </svg>
            </a>
          </div>
        </div>

        {/* Shop links */}
        <div>
          <h4 className="font-heading font-bold text-xs uppercase tracking-[0.12em] mb-5 text-white">Shop</h4>
          <ul className="space-y-3 font-body text-sm text-[#888888]">
            {[
              { to: '/category/mens',   label: "Men's" },
              { to: '/category/womens', label: "Women's" },
              { to: '/category/kids',   label: "Kids'" },
              { to: '/retail',          label: 'Shop All' },
              { to: '/about',           label: 'About Us' },
            ].map(l => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-white transition-colors duration-150">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support links */}
        <div>
          <h4 className="font-heading font-bold text-xs uppercase tracking-[0.12em] mb-5 text-white">Support</h4>
          <ul className="space-y-3 font-body text-sm text-[#888888]">
            {['Contact Us', 'FAQ'].map(l => (
              <li key={l}><a href="#" className="hover:text-white transition-colors duration-150">{l}</a></li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-heading font-bold text-xs uppercase tracking-[0.12em] mb-5 text-white">Stay Updated</h4>
          <p className="font-body text-sm text-[#888888] mb-4">Get 10% off your first order.</p>
          <form onSubmit={(e) => e.preventDefault()} className="flex border border-[#333333] focus-within:border-[#888888] transition-colors duration-150">
            <input
              type="email"
              placeholder="Your email"
              className="bg-transparent px-3 py-2.5 w-full outline-none font-body text-sm text-white placeholder:text-[#888888]"
            />
            <button type="submit" className="px-4 font-heading font-bold text-xs uppercase tracking-wider whitespace-nowrap text-[#888888] hover:text-white transition-colors duration-150">
              JOIN
            </button>
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#1A1A1A]">
        <div className="max-w-[1280px] mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-body text-[#888888]">
          <p>© {year} Croonfit. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors duration-150">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors duration-150">Terms of Service</a>
            <Link to="/admin/login" className="hover:text-white transition-colors duration-150">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
