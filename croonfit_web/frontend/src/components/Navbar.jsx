import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Heart, ShoppingBag, User, Menu, X, Search } from 'lucide-react'
import { Logo, CroonIcon } from './Logo'
import { useStore } from '../store'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const { cart, wishlist, isAuthenticated } = useStore()
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0)
  const wishlistCount = wishlist.length

  const isHome = location.pathname === '/'
  const isTransparent = isHome && !scrolled

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    // Initialize state on mount
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => setMobileOpen(false), [location.pathname])



  const navLinks = [
    { to: '/category/mens', label: 'Mens' },
    { to: '/category/womens', label: 'Womens' },
    { to: '/category/kids', label: 'Kids' },
  ]

  // Text colors based on scroll state and transparent state
  const isDarkGlass = false // Set to true if you want a dark pill instead
  const textColor = isTransparent ? 'text-white' : 'text-[#0A0A0A]'
  const hoverColor = isTransparent ? 'hover:text-gray-300' : 'hover:text-gray-500'

  // The full-width glassmorphism effect
  const navClasses = scrolled
    ? 'fixed top-0 left-0 w-full z-50 transition-all duration-500 bg-white/40 backdrop-blur-2xl border-b border-[#E5E5E5]/50 shadow-sm'
    : 'fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b border-transparent bg-transparent'

  return (
    <>
      <header className={navClasses}>
        <div className="mx-auto px-6 max-w-[1440px] h-20 flex items-center justify-between">

          {/* LEFT — Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 flex-1">
            {navLinks.map(({ to, label }) => {
              const isActive = location.pathname.startsWith(to)
              return (
                <Link
                  key={to}
                  to={to}
                  className={`relative group text-sm font-medium uppercase tracking-widest transition-colors duration-200 ${textColor} ${hoverColor} ${isActive ? 'opacity-100' : 'opacity-80'
                    }`}
                >
                  {label}
                  {/* Animated underline */}
                  <span
                    className={`absolute -bottom-1 left-0 h-[2px] transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      } ${isTransparent ? 'bg-white' : 'bg-[#0A0A0A]'}`}
                  />
                </Link>
              )
            })}
          </nav>

          {/* CENTER — Logo */}
          <div className="flex-shrink-0 flex-1 md:flex-none flex justify-start md:justify-center">
            <Link to="/" aria-label="Croon Home" className="flex flex-col items-center">
              <img
                src="/logo-word.png?v=6"
                alt="Croon"
                className={`h-5 transition-all duration-300 ${isTransparent ? 'invert brightness-200' : 'invert-0'}`}
              />
              {!isTransparent && (
                <span className={`text-[8px] font-bold tracking-[0.3em] uppercase mt-0.5 opacity-60 transition-colors duration-300 ${textColor}`}>
                  APPAREL STUDIO
                </span>
              )}
            </Link>
          </div>

          {/* RIGHT — Actions */}
          <div className="flex items-center justify-end gap-6 flex-1">

            {/* Profile */}
            <Link
              to={isAuthenticated ? '/account' : '/login'}
              className={`hidden sm:block ${textColor} opacity-80 hover:opacity-100 transition-opacity`}
              aria-label="Profile"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className={`relative hidden sm:block ${textColor} opacity-80 hover:opacity-100 transition-opacity`}
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className={`absolute -top-2 -right-2 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center ${isTransparent ? 'bg-white text-black' : 'bg-black text-white'
                  }`}>
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart - Navigates to /cart instead of opening drawer */}
            <Link
              to="/cart"
              className={`relative ${textColor} opacity-80 hover:opacity-100 transition-opacity`}
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className={`absolute -top-2 -right-2 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center ${isTransparent ? 'bg-white text-black' : 'bg-black text-white'
                  }`}>
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile hamburger */}
            <button
              className={`md:hidden ${textColor} opacity-80 hover:opacity-100 transition-opacity`}
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-white/80 backdrop-blur-2xl pt-24" role="dialog">
          {/* Mobile search removed */}

          <nav className="flex flex-col px-6">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="py-4 text-2xl font-light uppercase tracking-wide border-b border-[#F5F5F5] text-[#0A0A0A]"
              >
                {label}
              </Link>
            ))}
            <Link to={isAuthenticated ? '/account' : '/login'} className="py-4 text-2xl font-light uppercase tracking-wide border-b border-[#F5F5F5] text-[#0A0A0A]">
              {isAuthenticated ? 'Profile' : 'Login / Sign Up'}
            </Link>
            <Link to="/wishlist" className="py-4 text-2xl font-light uppercase tracking-wide border-b border-[#F5F5F5] text-[#0A0A0A]">
              Wishlist
            </Link>
          </nav>
        </div>
      )}
    </>
  )
}
