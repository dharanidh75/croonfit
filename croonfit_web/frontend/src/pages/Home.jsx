import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { CartDrawer } from '../components/cart/CartDrawer'
import { SearchOverlay } from '../components/ui/SearchOverlay'
import { ProductCard } from '../components/product/ProductCard'
import { ProductSkeleton } from '../components/ui/Skeleton'
import { useStore } from '../store'
import api from '../lib/api'

export function Home() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)
  const { isCartOpen, isSearchOpen } = useStore()

  useEffect(() => {
    api.get('/products/featured?limit=4')
      .then(res => setFeatured(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    document.body.style.overflow = isCartOpen || isSearchOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isCartOpen, isSearchOpen])

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] flex flex-col">
      <Navbar />
      <CartDrawer />
      <SearchOverlay />

      <main className="flex-1" style={{ paddingTop: '104px' }}>

        {/* ── Video Hero ─────────────────────────────────────────────────────── */}
        <section className="relative w-full overflow-hidden bg-[#0A0A0A]" style={{ height: 'calc(100vh - 104px)' }}>
          <video
            autoPlay loop muted playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            src="https://videos.pexels.com/video-files/8538356/8538356-hd_1920_1080_25fps.mp4"
          />
          <div className="absolute inset-0 bg-black/30" />

          {/* Negative space in upper half — scroll invite */}
          <div className="absolute inset-0 flex flex-col justify-end pb-20 px-8 md:px-16">
            <p className="text-[11px] font-heading font-bold uppercase tracking-[0.15em] text-white/60 mb-4">
              FW26 Collection
            </p>
            <h1
              className="text-white font-heading font-black uppercase leading-none tracking-tighter mb-8"
              style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)' }}
            >
              WEAR THE<br />GRIND.
            </h1>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/shop?gender=MENS"
                className="h-12 px-10 bg-white text-[#0A0A0A] flex items-center font-heading font-bold text-sm uppercase tracking-wider hover:bg-[#F5F5F5] transition-colors duration-150"
              >
                SHOP MEN
              </Link>
              <Link
                to="/shop?gender=WOMENS"
                className="h-12 px-10 border border-white text-white flex items-center font-heading font-bold text-sm uppercase tracking-wider hover:bg-white hover:text-[#0A0A0A] transition-colors duration-150"
              >
                SHOP WOMEN
              </Link>
            </div>
          </div>
        </section>

        {/* ── New Arrivals ───────────────────────────────────────────────────── */}
        <section className="px-6 max-w-[1280px] mx-auto py-20 md:py-[80px]">
          <div className="flex justify-between items-end mb-10">
            <h2 className="font-heading font-bold text-4xl md:text-5xl uppercase tracking-tight leading-none">
              New<br />Arrivals
            </h2>
            <Link
              to="/shop?tags=new"
              className="font-heading font-bold text-sm uppercase tracking-wider text-[#888888] hover:text-[#0A0A0A] transition-colors duration-150 flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
              : featured.map(p => <ProductCard key={p.id} product={p} />)
            }
          </div>
        </section>

        {/* ── Category Split — full bleed, breaks grid ───────────────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-2" style={{ height: 'clamp(400px, 70vh, 700px)' }}>
          {[
            {
              to: '/shop?gender=MENS',
              img: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1400&auto=format&fit=crop',
              label: "Men's",
            },
            {
              to: '/shop?gender=WOMENS',
              img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1400&auto=format&fit=crop',
              label: "Women's",
            },
          ].map(cat => (
            <Link
              key={cat.to}
              to={cat.to}
              className="group relative block overflow-hidden bg-[#0A0A0A] h-full"
            >
              <img
                src={cat.img}
                alt={cat.label}
                className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10">
                <h3 className="text-white font-heading font-black text-5xl md:text-6xl uppercase tracking-tighter leading-none mb-3">
                  {cat.label}
                </h3>
                <div className="flex items-center gap-2 text-sm font-heading font-bold text-white uppercase tracking-wider">
                  <span className="border-b border-white/60 pb-0.5 group-hover:border-white transition-colors duration-150">Shop Collection</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </section>

        {/* ── Lookbook Teaser ────────────────────────────────────────────────── */}
        <section className="px-6 max-w-[1280px] mx-auto py-20 md:py-[80px]">
          <div className="mb-12">
            <p className="text-[11px] font-heading font-bold uppercase tracking-[0.15em] text-[#888888] mb-3">
              LOOKBOOK — FW26
            </p>
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <h2 className="font-heading font-bold text-4xl md:text-5xl uppercase tracking-tight leading-none">
                Born to move.
              </h2>
              <p className="font-body text-[#888888] text-base max-w-sm leading-relaxed self-end">
                Stripped-down essentials built for maximum performance and uncompromising style.
              </p>
            </div>
          </div>

          {/* 3-col staggered grid — one breaks vertical */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <img
              src="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop"
              alt="Look 1"
              className="w-full aspect-[4/5] object-cover bg-[#F5F5F5]"
            />
            <img
              src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop"
              alt="Look 2"
              className="w-full aspect-[4/5] object-cover bg-[#F5F5F5] md:-mt-10"
            />
            <img
              src="https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?q=80&w=800&auto=format&fit=crop"
              alt="Look 3"
              className="w-full aspect-[4/5] object-cover bg-[#F5F5F5]"
            />
          </div>

          <Link
            to="/lookbook"
            className="inline-flex h-12 px-12 border border-[#0A0A0A] items-center font-heading font-bold text-sm uppercase tracking-wider hover:bg-[#0A0A0A] hover:text-white transition-colors duration-150"
          >
            VIEW LOOKBOOK
          </Link>
        </section>

        {/* ── Kids CTA Banner ────────────────────────────────────────────────── */}
        <section className="relative h-[40vh] overflow-hidden bg-[#0A0A0A]">
          <img
            src="https://images.unsplash.com/photo-1622290291165-80a8daf8bfd2?q=80&w=1400&auto=format&fit=crop"
            alt="Kids' Collection"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-10 md:px-16">
            <p className="text-[11px] font-heading font-bold uppercase tracking-[0.15em] text-white/60 mb-2">Kids' Collection</p>
            <h2 className="text-white font-heading font-black text-4xl md:text-5xl uppercase tracking-tighter leading-none mb-6">
              For the<br />Next Gen.
            </h2>
            <Link
              to="/shop?gender=KIDS"
              className="inline-flex h-11 px-8 bg-white text-[#0A0A0A] items-center font-heading font-bold text-sm uppercase tracking-wider hover:bg-[#F5F5F5] transition-colors duration-150 w-fit"
            >
              SHOP KIDS <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
