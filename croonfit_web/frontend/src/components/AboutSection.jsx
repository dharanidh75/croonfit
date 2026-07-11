import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import factoryImg from '../images/cargo.jpg'
import qualityImg from '../images/Polo.jpg'

export function AboutSection() {
  const stats = [
    { label: 'Years Experience', value: '10+' },
    { label: 'Global Retailers', value: '500+' },
    { label: 'Garments Produced', value: '1M+' },
    { label: 'Cities Reached', value: '50+' },
  ]

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  }

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
  }

  return (
    <section className="bg-[#F5F5F5] py-24 md:py-32 overflow-hidden text-[#0A0A0A]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">

        {/* Header / Brand Story */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-24 md:mb-32"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#888888] mb-6">Our Heritage</p>
            <h2 className="text-4xl md:text-6xl font-light tracking-tight leading-[1.1] mb-8">
              Redefining premium apparel through uncompromising quality.
            </h2>
          </div>
          <div className="flex flex-col justify-end">
            <p className="text-lg md:text-xl text-[#555555] font-light leading-relaxed max-w-lg mb-8">
              Founded on the belief that clothing should be both a statement and a sanctuary, Croonfit blends editorial fashion with everyday wearability. We design for the modern individual who refuses to compromise on quality.
            </p>
            <Link to="/about" className="inline-flex items-center gap-2 font-medium uppercase tracking-widest text-sm w-fit border-b border-[#0A0A0A] pb-1 hover:gap-4 transition-all duration-300">
              Read Our Story <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* Factory / Quality Images */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-24 md:mb-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="md:col-span-8 h-[50vh] md:h-[70vh] rounded-2xl overflow-hidden relative"
          >
            <img
              src={factoryImg}
              alt="Our Factory"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute bottom-8 left-8 text-white">
              <p className="text-xs font-bold uppercase tracking-widest mb-2">The Factory</p>
              <h3 className="text-2xl font-light">Where craft meets precision.</h3>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="md:col-span-4 h-[50vh] md:h-[70vh] rounded-2xl overflow-hidden relative"
          >
            <img
              src={qualityImg}
              alt="Quality Control"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute bottom-8 left-8 text-white">
              <p className="text-xs font-bold uppercase tracking-widest mb-2">Quality</p>
              <h3 className="text-2xl font-light">Obsessive detail.</h3>
            </div>
          </motion.div>
        </div>

        {/* Mission, Vision, Stats */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 mb-24 md:mb-32"
        >
          <motion.div variants={fadeInUp} className="max-w-sm">
            <h4 className="text-xl font-medium mb-4">Our Mission</h4>
            <p className="text-[#555555] font-light leading-relaxed">
              To engineer apparel that empowers individuals, setting a new global standard for how premium clothing is manufactured, sourced, and worn.
            </p>
          </motion.div>
          <motion.div variants={fadeInUp} className="max-w-sm">
            <h4 className="text-xl font-medium mb-4">Our Vision</h4>
            <p className="text-[#555555] font-light leading-relaxed">
              A world where high-end fashion is accessible, sustainable, and built to endure the rigors of every lifestyle and generation.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="lg:pl-12 grid grid-cols-2 gap-8">
            {stats.map((stat, i) => (
              <div key={i}>
                <h5 className="text-3xl md:text-4xl font-light mb-2">{stat.value}</h5>
                <p className="text-xs font-bold uppercase tracking-widest text-[#888888]">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-5xl font-light mb-8">Ready to elevate your wardrobe?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/retail" className="h-14 px-10 bg-[#0A0A0A] text-white flex items-center justify-center text-sm font-medium uppercase tracking-wider rounded-2xl hover:bg-gray-800 transition-colors duration-300">
              Explore Collection
            </Link>
            <Link to="/wholesale" className="h-14 px-10 bg-transparent border border-[#0A0A0A] text-[#0A0A0A] flex items-center justify-center text-sm font-medium uppercase tracking-wider rounded-2xl hover:bg-gray-100 transition-colors duration-300">
              Become a Partner
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
