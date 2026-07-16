import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'

import oversizedImg from '../images/oversizd.jpg'
import poloImg from '../images/Polo.jpg'
import roundNeckImg from '../images/round neck.jpg'
import shirtsImg from '../images/shirt.jpg'
import joggersImg from '../images/joggers.jpg'
import cargoImg from '../images/cargo.jpg'
import hoodiesImg from '../images/hoodies.jpg'

export function Category() {
  const { category } = useParams()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [category])

  // Hardcoded subcategories based on requirements. 
  // In a real app, this might come from an API based on the category.
  const menSubcategories = [
    { id: 'oversized', title: 'Oversized', img: oversizedImg },
    { id: 'polo', title: 'Polo', img: poloImg },
    { id: 'round-neck', title: 'Round Neck', img: roundNeckImg },
    { id: 'shirts', title: 'Shirts', img: shirtsImg },
    { id: 'joggers', title: 'Joggers', img: joggersImg },
    { id: 'cargo', title: 'Cargo', img: cargoImg },
    { id: 'hoodies', title: 'Hoodies', img: hoodiesImg },
  ]

  const womenSubcategories = [
    { id: 'oversized', title: 'Oversized', img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ce3?w=600&q=80&auto=format&fit=crop' },
    { id: 'polo', title: 'Polo', img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80&auto=format&fit=crop' },
    { id: 'round-neck', title: 'Round Neck', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80&auto=format&fit=crop' },
    { id: 'shirts', title: 'Shirts', img: 'https://images.unsplash.com/photo-1599508704512-2f19efd1eede?w=600&q=80&auto=format&fit=crop' },
    { id: 'joggers', title: 'Joggers', img: 'https://images.unsplash.com/photo-1551854838-212c9a5c0a2c?w=600&q=80&auto=format&fit=crop' },
    { id: 'cargo', title: 'Cargo', img: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80&auto=format&fit=crop' },
    { id: 'hoodies', title: 'Hoodies', img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80&auto=format&fit=crop' },
  ]

  const kidsSubcategories = [
    { id: 'oversized', title: 'Oversized', img: 'https://images.unsplash.com/photo-1519238381283-e18e3810f545?w=600&q=80&auto=format&fit=crop' },
    { id: 'polo', title: 'Polo', img: 'https://images.unsplash.com/photo-1622290291165-80a8daf8bfd2?w=600&q=80&auto=format&fit=crop' },
    { id: 'round-neck', title: 'Round Neck', img: 'https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?w=600&q=80&auto=format&fit=crop' },
    { id: 'shirts', title: 'Shirts', img: 'https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?w=600&q=80&auto=format&fit=crop' },
    { id: 'joggers', title: 'Joggers', img: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600&q=80&auto=format&fit=crop' },
    { id: 'cargo', title: 'Cargo', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80&auto=format&fit=crop' },
    { id: 'hoodies', title: 'Hoodies', img: 'https://images.unsplash.com/photo-1558227499-4e7cb803ba90?w=600&q=80&auto=format&fit=crop' },
  ]

  let subcategories = menSubcategories
  const catLower = category?.toLowerCase()
  if (catLower === 'womens' || catLower === 'women') {
    subcategories = womenSubcategories
  } else if (catLower === 'kids') {
    subcategories = kidsSubcategories
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  }

  // Formatting title
  const formattedTitle = category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Collection'

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#0A0A0A] font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20">

        {/* Header */}
        <section className="py-20 px-6 max-w-[1440px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-[#888888] mb-4">Select Category</p>
            <h1 className="text-5xl md:text-7xl font-light uppercase tracking-tight mb-8">
              {formattedTitle}
            </h1>
            <p className="text-lg text-[#555555] font-light max-w-xl mx-auto">
              Explore our curated collections. Engineered for the modern {category}.
            </p>
          </motion.div>
        </section>

        {/* Subcategories Grid */}
        <section className="py-12 px-6 md:px-12 max-w-[1440px] mx-auto pb-32">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10"
          >
            {subcategories.map((sub) => (
              <motion.div key={sub.id} variants={itemVariants}>
                <Link
                  to={`/category/${category}/${sub.id}`}
                  className="group block relative overflow-hidden rounded-2xl aspect-[4/5] bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <img
                    src={sub.img}
                    alt={sub.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />

                  {/* Subtle hover overlay for the label */}
                  <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-end">
                    <h3 className="text-2xl font-light text-white uppercase tracking-wider">{sub.title}</h3>
                    <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
