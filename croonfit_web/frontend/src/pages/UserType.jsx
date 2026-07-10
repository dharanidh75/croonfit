import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'

function ImageCard({ image, alt, eyebrow, headline, sub, cta, onClick }) {
  return (
    <div
      onClick={onClick}
      className="group relative h-[280px] md:h-[480px] overflow-hidden cursor-pointer bg-[#0A0A0A] flex-1"
    >
      <img
        src={image}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-700 ease-out group-hover:scale-[1.02]"
      />
      {/* Dark gradient overlay — bottom 40% */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 p-8 w-full">
        <p className="text-[11px] font-heading font-bold uppercase tracking-[0.1em] text-white/70 mb-2">{eyebrow}</p>
        <h2 className="text-white font-heading font-bold text-3xl md:text-[28px] uppercase leading-tight mb-2">{headline}</h2>
        {sub && <p className="font-body text-sm text-white/70 max-w-[260px] mb-5">{sub}</p>}
        <div className="flex items-center gap-2 text-sm font-heading font-bold text-white uppercase tracking-wider border-b border-transparent hover:border-white/60 w-fit transition-all duration-150">
          <span>{cta}</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  )
}

export function UserType() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] flex flex-col">
      <Navbar />

      <main className="flex-1" style={{ paddingTop: '104px' }}>

        {/* ── Hero Section ─────────────────────────────────────────────── */}
        <section className="text-center px-6 py-16 md:py-20">
          <h1 className="font-heading font-bold text-[40px] md:text-5xl uppercase tracking-tight leading-none mb-4">
            Who are you<br />shopping for?
          </h1>
          <p className="font-body text-base text-[#888888]">
            Select your experience below.
          </p>
        </section>

        {/* ── Two large image cards ─────────────────────────────────────── */}
        <section className="px-6 max-w-[1280px] mx-auto mb-20">
          <div className="flex flex-col md:flex-row gap-6">
            <ImageCard
              image="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1200&auto=format&fit=crop"
              alt="Retailer — shop for yourself"
              eyebrow="PERSONAL"
              headline="Shop for Yourself"
              sub="Discover curated drops, limited editions, and street-ready fits."
              cta="→ Get Started"
              onClick={() => navigate('/')}
            />
            <ImageCard
              image="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1200&auto=format&fit=crop"
              alt="Wholesaler — buy in bulk"
              eyebrow="BUSINESS"
              headline="Buy in Bulk"
              sub="Tiered pricing, bulk orders, and catalogue access for retailers."
              cta="→ View Catalogue"
              onClick={() => navigate('/wholesale')}
            />
          </div>
        </section>

        {/* ── About Section ─────────────────────────────────────────────── */}
        <section className="bg-white py-[120px] px-6 border-t border-[#F5F5F5]">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-start">

            {/* Left */}
            <div>
              <p className="text-[11px] font-heading font-bold uppercase tracking-[0.15em] text-[#0A0A0A] mb-4">
                ABOUT CROONFIT
              </p>
              <h2 className="font-heading font-black text-5xl md:text-6xl uppercase leading-none tracking-tighter mb-8">
                Built<br />Different.
              </h2>
              <p className="font-heading font-black text-2xl text-[#CCCCCC] uppercase tracking-tight">
                500+ Styles — One Brand
              </p>
            </div>

            {/* Right */}
            <div className="space-y-6 font-body text-base text-[#444444] leading-[1.7]">
              <p>
                Croonfit is the brand for the ones who move — on the street, in the gym, through the city. We blend performance engineering with fashion-forward design to create pieces that don't choose between function and style.
              </p>
              <p>
                Born from Indian street culture and shaped by global youth aesthetics, every drop is designed with precision. We don't follow trends. We help you set them.
              </p>
              <p>
                From our debut collection to where we are now — 500+ styles, tens of thousands of customers, and a community that actually wears what we make.
              </p>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
