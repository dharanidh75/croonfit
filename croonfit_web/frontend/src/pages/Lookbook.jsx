import React from 'react'
import { Layout } from '../components/layout/Layout'
import { Link } from 'react-router-dom'

const LOOKS = [
  { src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=900&auto=format&fit=crop', aspect: 'aspect-[3/4]',  title: 'Urban Core' },
  { src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=900&auto=format&fit=crop',   aspect: 'aspect-square', title: 'Street Movement' },
  { src: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=900&auto=format&fit=crop', aspect: 'aspect-[4/5]',  title: 'Performance Lab' },
  { src: 'https://images.unsplash.com/photo-1620012254842-7f576d0a7a9a?q=80&w=900&auto=format&fit=crop', aspect: 'aspect-[3/4]',  title: 'Night Run' },
  { src: 'https://images.unsplash.com/photo-1551854838-212c9a5c0a2c?q=80&w=900&auto=format&fit=crop',   aspect: 'aspect-video',  title: 'Studio Flow' },
  { src: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=900&auto=format&fit=crop', aspect: 'aspect-[3/4]',  title: 'Rest Day' },
]

export function Lookbook() {
  return (
    <Layout>
      {/* Hero header */}
      <div className="bg-[#0A0A0A] text-white py-24 px-6 text-center">
        <p className="text-[11px] font-heading font-bold uppercase tracking-[0.15em] text-white/50 mb-4">
          FW26 / Editorial
        </p>
        <h1 className="font-heading font-black text-5xl md:text-7xl uppercase tracking-tighter leading-none">
          The Uniform
        </h1>
      </div>

      {/* Intro text — 2 col on desktop */}
      <div className="max-w-[1280px] mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-10 border-b border-[#EEEEEE]">
        <p className="font-heading font-bold text-2xl uppercase tracking-tight leading-tight">
          Function dictates form. Uncomplicated essentials stripped of noise.
        </p>
        <p className="font-body text-base text-[#444444] leading-relaxed self-center">
          Built for the relentless pursuit. Every piece in the FW26 collection is engineered with purpose — performance fabric, precise cuts, and a silhouette that moves with you from the track to the street.
        </p>
      </div>

      {/* Masonry-style photo grid — CSS columns */}
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-5 space-y-5">
          {LOOKS.map((look, i) => (
            <div
              key={i}
              className={`group relative overflow-hidden bg-[#F5F5F5] w-full break-inside-avoid ${look.aspect}`}
            >
              <img
                src={look.src}
                alt={look.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              <div className="absolute bottom-0 left-0 w-full p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200">
                <span className="text-white font-heading font-bold text-sm uppercase tracking-wider">
                  {look.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shop CTA */}
      <div className="text-center py-16 border-t border-[#EEEEEE]">
        <h2 className="font-heading font-bold text-3xl uppercase tracking-tight mb-8">
          Shop the Collection
        </h2>
        <Link
          to="/shop"
          className="inline-flex h-12 px-14 bg-[#000000] text-white items-center font-heading font-bold text-sm uppercase tracking-wider hover:bg-[#222222] transition-colors duration-150"
        >
          SHOP NOW
        </Link>
      </div>
    </Layout>
  )
}
