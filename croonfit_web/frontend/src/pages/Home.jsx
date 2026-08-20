import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ShoppingBag, Building2 } from 'lucide-react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { AboutSection } from '../components/AboutSection'
import backgroundVideo from '../video/0711.mp4'
import retailImg from '../images/retail.jpg'
import wholesaleImg from '../images/shirt.jpg'



export function Home() {
  const videoRef = useRef(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1
    }
  }, [])

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] font-sans selection:bg-black selection:text-white flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* ── Hero Section ─────────────────────────────────────────────────────── */}
        <section className="relative w-full h-screen overflow-hidden bg-black">
          {/* Background Video */}
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-50"
            src={backgroundVideo}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

          {/* Hero Content */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 pt-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-4xl"
            >
              <h1 className="text-white font-light uppercase tracking-tight mb-8" style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)', lineHeight: 1.1 }}>
                Crafted For <br />
                <span className="font-semibold">Every Lifestyle.</span>
              </h1>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/retail"
                  className="w-full sm:w-auto h-14 px-10 bg-white text-black flex items-center justify-center text-sm font-medium uppercase tracking-wider rounded-2xl hover:bg-gray-100 transition-colors duration-300"
                >
                  Explore Collection
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-white/60 text-xs uppercase tracking-widest font-medium">Scroll to Discover</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-[1px] h-12 bg-gradient-to-b from-white/60 to-transparent"
            />
          </motion.div>
        </section>

        {/* ── Premium New Arrivals Banner (Single Wide Card Layout) ─────────────── */}
        <section className="py-20 px-6 md:px-12 max-w-[1440px] mx-auto bg-[#F8F9FA]">
          {/* Main Card Container */}
          <div className="bg-white rounded-[2.5rem] p-10 md:p-16 lg:p-20 flex flex-col lg:flex-row items-center justify-between gap-12 shadow-sm border border-gray-100">
            
            {/* Left: Text & CTA */}
            <div className="flex-1 max-w-lg">
              <h2 className="text-[#B95B24] text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 leading-[1.1]">
                The Latest Drop <br /> New Arrivals
              </h2>
              <p className="text-gray-600 text-sm md:text-base font-medium mb-10 leading-relaxed max-w-md">
                Find the Perfect Style that Combines Comfort and Durability, 
                Tailored to Suit Your Unique Essentials.
              </p>
              
              <Link to="/retail" className="inline-block bg-black text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors">
                Shop now
              </Link>
            </div>

            {/* Right: Dual Images */}
            <div className="flex-1 flex gap-4 md:gap-6 justify-center lg:justify-end items-center">
              {/* First Image */}
              <div className="w-48 h-64 md:w-64 md:h-[350px] rounded-[2rem] overflow-hidden shadow-sm shrink-0">
                <img 
                  src={wholesaleImg} 
                  alt="New Arrival 1" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Second Image (slightly offset or same) */}
              <div className="w-48 h-64 md:w-64 md:h-[350px] rounded-[2rem] overflow-hidden shadow-sm shrink-0">
                <img 
                  src={retailImg} 
                  alt="New Arrival 2" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>
        </section>

        {/* ── Hub Cards — Retailer & Wholesaler (Sleek Horizontal) ─────────────── */}
        <section className="py-24 px-6 md:px-12 max-w-[1440px] mx-auto bg-white">
          {/* Section Header */}
          <div className="mb-12 flex flex-col items-center text-center">
            <h2 className="text-3xl md:text-4xl font-light uppercase tracking-tight mb-4">Choose Your Path</h2>
            <div className="w-12 h-px bg-black/20"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Retailer Card - sleek landscape */}
            <Link to="/retail" className="group block relative overflow-hidden rounded-2xl md:rounded-3xl h-[300px] md:h-[400px] bg-black shadow-lg">
              <motion.img
                initial={{ scale: 1.1 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 1.2 }}
                viewport={{ once: true }}
                src={retailImg}
                alt="Retail Collection"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-transparent" />
              
              <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-center text-white w-3/4 z-10">
                <div className="flex items-center gap-3 mb-4 opacity-80">
                  <ShoppingBag className="w-6 h-6" />
                  <span className="text-xs font-bold uppercase tracking-widest text-white">Individual</span>
                </div>
                <h3 className="text-white text-4xl md:text-5xl font-semibold uppercase tracking-tight mb-4">Retailer</h3>
                <p className="text-sm md:text-base text-white/90 font-light mb-8 max-w-sm line-clamp-2 md:line-clamp-none">
                  Shop premium products individually. Discover our latest seasonal collections crafted for the modern individual.
                </p>
                <div className="inline-flex items-center gap-3 font-medium uppercase tracking-widest text-xs border-b border-white pb-1 group-hover:gap-5 group-hover:text-white w-fit transition-all duration-300">
                  Explore Retail <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </div>
              
              {/* Modern Glassmorphism Swipe Effect */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-in-out" />
            </Link>

            {/* Wholesaler Card - sleek landscape */}
            <Link to="/retail" className="group block relative overflow-hidden rounded-2xl md:rounded-3xl h-[300px] md:h-[400px] bg-black shadow-lg">
              <motion.img
                initial={{ scale: 1.1 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 1.2 }}
                viewport={{ once: true }}
                src={wholesaleImg}
                alt="Wholesale Collection"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-transparent" />
              
              <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-center text-white w-3/4 z-10">
                <div className="flex items-center gap-3 mb-4 opacity-80">
                  <Building2 className="w-6 h-6" />
                  <span className="text-xs font-bold uppercase tracking-widest text-white">Business</span>
                </div>
                <h3 className="text-white text-4xl md:text-5xl font-semibold uppercase tracking-tight mb-4">Wholesaler</h3>
                <p className="text-sm md:text-base text-white/90 font-light mb-8 max-w-sm line-clamp-2 md:line-clamp-none">
                  Bulk orders for businesses. Premium quality at wholesale prices with dedicated support.
                </p>
                <div className="inline-flex items-center gap-3 font-medium uppercase tracking-widest text-xs border-b border-white pb-1 group-hover:gap-5 group-hover:text-white w-fit transition-all duration-300">
                  Explore Wholesale <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Modern Glassmorphism Swipe Effect */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-in-out" />
            </Link>
          </div>
        </section>

        {/* ── About Section ────────────────────────────────────────────────────── */}
        <AboutSection />

      </main>

      <Footer />
    </div>
  )
}
