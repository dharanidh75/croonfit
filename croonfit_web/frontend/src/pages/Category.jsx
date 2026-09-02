import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import api from '../lib/api'

export function Category() {
  const { category } = useParams()
  
  const [subcategories, setSubcategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
    
    setLoading(true)
    api.get('/products/categories')
      .then(res => {
        // Filter by gender based on the URL param
        const catLower = category?.toLowerCase()
        let targetGender = 'MENS'
        if (catLower === 'womens' || catLower === 'women') {
          targetGender = 'WOMENS'
        } else if (catLower === 'kids') {
          targetGender = 'KIDS'
        }
        
        const filtered = res.data.filter(c => c.gender === targetGender)
        setSubcategories(filtered)
      })
      .catch(err => {
        console.error("Failed to load categories", err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [category])

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

  const formattedTitle = category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Collection'

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#0A0A0A] font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20">
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

        <section className="py-12 px-6 md:px-12 max-w-[1440px] mx-auto pb-32">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
            </div>
          ) : subcategories.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-2xl mx-auto"
            >
              <h2 className="text-2xl font-semibold mb-3">No categories found</h2>
              <p className="text-[#666666] mb-8">We haven't added any {category} collections yet. Check back soon!</p>
              <Link to="/retail" className="inline-block px-8 py-3 bg-black text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition-colors">
                Shop All Arrivals
              </Link>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10"
            >
              {subcategories.map((sub) => (
                <motion.div key={sub.id} variants={itemVariants}>
                  <Link
                    to={`/category/${category}/${sub.slug}`}
                    className="group block relative overflow-hidden rounded-2xl aspect-[4/5] bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <img
                      src={sub.cover_image_url || 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ce3?w=600&q=80&auto=format&fit=crop'}
                      alt={sub.name}
                      className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />

                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-end">
                      <h3 className="text-2xl font-light text-white uppercase tracking-wider">{sub.name}</h3>
                      <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
