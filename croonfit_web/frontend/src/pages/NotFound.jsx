import React from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'

export function NotFound() {
  return (
    <div className="min-h-screen bg-white font-sans text-[#0A0A0A] flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-32">
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-16 text-center">
        {/* Oversized 404 — breaks grid intentionally */}
        <div
          aria-hidden="true"
          className="font-heading font-black uppercase text-[#F5F5F5] leading-none select-none pointer-events-none"
          style={{ fontSize: 'clamp(8rem, 25vw, 20rem)' }}
        >
          404
        </div>
        <div className="-mt-8 md:-mt-20 relative z-10">
          <h1 className="font-heading font-bold text-2xl md:text-3xl uppercase tracking-tight mb-3">
            Page Not Found
          </h1>
          <p className="font-body text-[#888888] mb-8 max-w-sm">
            Nothing saved here. The page you're looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/"
            className="inline-flex h-12 px-10 bg-[#000000] text-white items-center font-heading font-bold text-sm uppercase tracking-wider hover:bg-[#222222] transition-colors duration-150"
          >
            Return Home
          </Link>
        </div>
      </div>
      </main>
      <Footer />
    </div>
  )
}
