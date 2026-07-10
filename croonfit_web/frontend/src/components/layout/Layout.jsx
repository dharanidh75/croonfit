import React, { useEffect } from 'react'
import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { CartDrawer } from '../cart/CartDrawer'
import { SearchOverlay } from '../ui/SearchOverlay'
import { useStore } from '../../store'

// Navbar height: 64px main bar + 40px sub-nav strip = 104px
const NAVBAR_HEIGHT = 104

export function Layout({ children, noFooter = false }) {
  const isCartOpen   = useStore((s) => s.isCartOpen)
  const isSearchOpen = useStore((s) => s.isSearchOpen)

  useEffect(() => {
    if (isCartOpen || isSearchOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isCartOpen, isSearchOpen])

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] flex flex-col">
      <Navbar />
      <main className="flex-1" style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}>
        {children}
      </main>
      {!noFooter && <Footer />}
      <CartDrawer />
      <SearchOverlay />
    </div>
  )
}
