import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Box } from 'lucide-react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import mensImg from '../images/mens.jpg'
import womenImg from '../images/women.jpg'
import kidsImg from '../images/kids.jpg'

export function Hub({ type }) {
  const isWholesale = type === 'wholesale'

  const categories = [
    {
      id: 'men',
      title: 'Men',
      image: mensImg,
      link: '/category/men'
    },
    {
      id: 'women',
      title: 'Women',
      image: womenImg,
      link: '/category/women'
    },
    {
      id: 'kids',
      title: 'Kids',
      image: kidsImg,
      link: '/category/kids'
    }
  ]

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20">

        {/* Hub Header */}
        <section className="bg-[#F5F5F5] py-20 px-6">
          <div className="max-w-[1440px] mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-light uppercase tracking-tight mb-4">
                {isWholesale ? 'Wholesale Partner Hub' : 'Retail Collection'}
              </h1>
              <p className="text-[#555555] max-w-2xl mx-auto text-lg font-light mb-8">
                {isWholesale
                  ? 'Access exclusive bulk pricing, manage minimum order quantities (MOQ), and supply your business with premium apparel.'
                  : 'Shop our latest seasonal drops, crafted with uncompromising quality and minimal design for the modern individual.'}
              </p>

              {isWholesale && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button className="h-12 px-8 bg-[#0A0A0A] text-white flex items-center justify-center text-sm font-medium uppercase tracking-wider rounded-xl hover:bg-gray-800 transition-colors duration-300">
                    Register as Dealer
                  </button>
                  <div className="flex items-center gap-2 text-sm text-[#555555] font-medium px-4">
                    <Box className="w-5 h-5" /> Minimum Order: 50 Units
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-24 px-6 md:px-12 max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((cat, index) => (
              <Link
                key={cat.id}
                to={cat.link}
                className="group block relative overflow-hidden rounded-2xl aspect-[3/4] bg-gray-100"
              >
                <motion.img
                  initial={{ scale: 1.1 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 1.2, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  src={cat.image}
                  alt={cat.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

                <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                  <h3 className="text-4xl font-light uppercase tracking-tight mb-2">{cat.title}</h3>
                  <div className="inline-flex items-center gap-2 font-medium uppercase tracking-widest text-xs w-fit border-b border-white/50 pb-1 group-hover:border-white transition-all duration-300">
                    Shop {cat.title} <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
