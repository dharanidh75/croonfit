import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'

const CATEGORIES = [
  {
    label: "MEN'S",
    headline: "Men's",
    sub: "Street-ready fits. Performance fabric. Zero compromise.",
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1200&auto=format&fit=crop',
    to: '/shop?gender=MENS',
  },
  {
    label: "WOMEN'S",
    headline: "Women's",
    sub: "Studio-to-street. Form meets function. Built to express.",
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop',
    to: '/shop?gender=WOMENS',
  },
  {
    label: "KIDS'",
    headline: "Kids'",
    sub: "Playful, comfortable, and built for the next generation.",
    image: 'https://images.unsplash.com/photo-1622290291165-80a8daf8bfd2?q=80&w=1200&auto=format&fit=crop',
    to: '/shop?gender=KIDS',
  },
]

export function CategoryHub() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1" style={{ paddingTop: '104px' }}>

        {/* Section heading */}
        <div className="px-6 pt-14 pb-10 max-w-[1280px] mx-auto">
          <nav className="text-xs font-body text-[#888888] mb-6" aria-label="Breadcrumb">
            <span>Home</span>
            <span className="mx-2">/</span>
            <span className="text-[#0A0A0A]">Shop</span>
          </nav>
          <h1 className="font-heading font-bold text-4xl uppercase tracking-tight">
            What are you looking for?
          </h1>
        </div>

        {/* Three category cards */}
        <div className="px-6 max-w-[1280px] mx-auto mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.to}
                onClick={() => navigate(cat.to)}
                className="group relative h-[240px] md:h-[360px] overflow-hidden cursor-pointer bg-[#0A0A0A]"
              >
                <img
                  src={cat.image}
                  alt={cat.headline}
                  className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <p className="text-[11px] font-heading font-bold uppercase tracking-[0.12em] text-white/70 mb-1">{cat.label}</p>
                  <h2 className="text-white font-heading font-bold text-2xl uppercase leading-tight mb-2">{cat.headline}</h2>
                  <p className="font-body text-xs text-white/70 mb-4">{cat.sub}</p>
                  <div className="flex items-center gap-2 text-xs font-heading font-bold text-white uppercase tracking-wider w-fit">
                    <span>Shop Now</span>
                    <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  )
}
