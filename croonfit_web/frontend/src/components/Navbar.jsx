import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Heart, ShoppingBag, User, Menu, X, Search } from 'lucide-react'
import { Logo } from './Logo'
import { useStore } from '../store'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  const { cart, wishlist, isAuthenticated, openCart } = useStore()
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0)
  const wishlistCount = wishlist.length

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handle, { passive: true })
    return () => window.removeEventListener('scroll', handle)
  }, [])

  useEffect(() => setMobileOpen(false), [location.pathname])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setSearchFocused(false)
    }
  }

  const navLinks = [
    { to: '/shop?gender=MENS', label: "Men's" },
    { to: '/shop?gender=WOMENS', label: "Women's" },
    { to: '/shop?gender=KIDS', label: "Kids'" },
    { to: '/lookbook', label: 'Lookbook' },
  ]

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-200 ${
          scrolled ? 'bg-surface border-b border-[#cccccc]' : 'bg-surface border-b border-[#e5e5e5]'
        }`}
        style={{ height: '64px' }}
      >
        <div className="max-w-[1280px] mx-auto px-6 h-full flex items-center gap-6">

          {/* LEFT — Logo */}
          <div className="flex-shrink-0">
            <Link to="/" aria-label="Croonfit Home">
              <Logo className="h-8 text-[#0A0A0A]" />
            </Link>
          </div>

          {/* CENTER — Search bar (desktop) */}
          <form
            onSubmit={handleSearch}
            className={`hidden md:flex flex-1 max-w-[420px] mx-auto items-center border transition-all duration-150 ${
              searchFocused ? 'border-[#0A0A0A]' : 'border-[#CCCCCC]'
            } bg-white`}
          >
            <button type="submit" className="pl-4 pr-2 text-[#888888] flex-shrink-0">
              <Search className="w-4 h-4" />
            </button>
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="What are you looking for?"
              className="w-full py-2.5 pr-4 bg-transparent outline-none font-body text-sm text-[#0A0A0A] placeholder:text-[#888888]"
            />
          </form>

          {/* RIGHT — Actions */}
          <div className="flex items-center gap-5 ml-auto">
            {/* Mobile Search icon */}
            <button
              className="md:hidden text-[#0A0A0A] hover:text-[#888888] transition-colors duration-150"
              onClick={() => navigate('/shop')}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link
              to={isAuthenticated ? '/wishlist' : '/login'}
              className="relative text-[#0A0A0A] hover:text-[#888888] transition-colors duration-150 hidden sm:block"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#0A0A0A] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              id="navbar-cart"
              onClick={openCart}
              className="relative text-[#0A0A0A] hover:text-[#888888] transition-colors duration-150"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#0A0A0A] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account */}
            <Link
              to={isAuthenticated ? '/account' : '/login'}
              className="text-[#0A0A0A] hover:text-[#888888] transition-colors duration-150 hidden sm:block"
              aria-label="Account"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Mobile hamburger */}
            <button
              className="sm:hidden text-[#0A0A0A]"
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop Category Sub-nav */}
        <div className="hidden md:block border-t border-[#E5E5E5] bg-surface">
          <div className="max-w-[1280px] mx-auto px-6 flex items-center gap-8 h-10">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`font-body text-xs font-bold uppercase tracking-widest transition-colors duration-150 pb-0.5 border-b-2 ${
                  location.pathname + location.search === to
                    ? 'text-[#0A0A0A] border-[#0A0A0A]'
                    : 'text-[#888888] border-transparent hover:text-[#0A0A0A] hover:border-[#0A0A0A]'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Mobile overlay menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-16" role="dialog">
          {/* Mobile search */}
          <form onSubmit={handleSearch} className="flex items-center border-b border-[#CCCCCC] px-6 py-3">
            <Search className="w-4 h-4 text-[#888888] mr-3 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What are you looking for?"
              className="w-full outline-none font-body text-sm placeholder:text-[#888888]"
            />
          </form>

          <nav className="flex flex-col divide-y divide-[#F5F5F5]">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="px-6 py-4 font-heading font-bold text-lg uppercase tracking-tight text-[#0A0A0A]"
              >
                {label}
              </Link>
            ))}
            <Link to={isAuthenticated ? '/account' : '/login'} className="px-6 py-4 font-heading font-bold text-lg uppercase tracking-tight text-[#0A0A0A]">
              {isAuthenticated ? 'My Account' : 'Login / Sign Up'}
            </Link>
            <Link to={isAuthenticated ? '/wishlist' : '/login'} className="px-6 py-4 font-heading font-bold text-lg uppercase tracking-tight text-[#0A0A0A]">
              Wishlist
            </Link>
          </nav>
        </div>
      )}
    </>
  )
}
