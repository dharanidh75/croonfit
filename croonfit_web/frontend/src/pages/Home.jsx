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
                <Link
                  to="/wholesale"
                  className="w-full sm:w-auto h-14 px-10 bg-transparent border border-white text-white flex items-center justify-center text-sm font-medium uppercase tracking-wider rounded-2xl hover:bg-white/10 transition-colors duration-300"
                >
                  Become a Partner
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

        {/* ── Hub Cards Section ────────────────────────────────────────────────── */}
        <section className="py-24 px-6 md:px-12 max-w-[1440px] mx-auto bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">

            {/* Retailer Card */}
            <Link to="/retail" className="group block w-full relative overflow-hidden rounded-2xl md:rounded-[2rem] aspect-[4/5] md:aspect-square bg-gray-100">
              <motion.img
                initial={{ scale: 1.1 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 1.2 }}
                viewport={{ once: true }}
                src={retailImg}
                alt="Retail Collection"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

              <div className="absolute inset-0 p-10 flex flex-col justify-end text-white">
                <ShoppingBag className="w-8 h-8 mb-6 opacity-80" />
                <h2 className="text-4xl md:text-5xl font-semibold uppercase tracking-tight mb-4">Retailer</h2>
                <p className="text-lg text-white/80 font-light mb-8 max-w-sm">
                  Shop premium products individually. Discover our latest seasonal collections crafted for the modern individual.
                </p>
                <div className="inline-flex items-center gap-3 font-medium uppercase tracking-widest text-sm w-fit border-b border-white pb-1 group-hover:gap-5 transition-all duration-300">
                  Explore Retail <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>

            {/* Wholesaler Card */}
            <Link to="/wholesale" className="group block w-full relative overflow-hidden rounded-2xl md:rounded-[2rem] aspect-[4/5] md:aspect-square bg-gray-100">
              <motion.img
                initial={{ scale: 1.1 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 1.2 }}
                viewport={{ once: true }}
                src={wholesaleImg}
                alt="Wholesale Partners"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

              <div className="absolute inset-0 p-10 flex flex-col justify-end text-white">
                <Building2 className="w-8 h-8 mb-6 opacity-80" />
                <h2 className="text-4xl md:text-5xl font-semibold uppercase tracking-tight mb-4">Wholesaler</h2>
                <p className="text-lg text-white/80 font-light mb-8 max-w-sm">
                  Bulk orders for businesses. Partner with us to bring premium quality apparel to your customer base.
                </p>
                <div className="inline-flex items-center gap-3 font-medium uppercase tracking-widest text-sm w-fit border-b border-white pb-1 group-hover:gap-5 transition-all duration-300">
                  Explore Wholesale <ArrowRight className="w-4 h-4" />
                </div>
              </div>
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
