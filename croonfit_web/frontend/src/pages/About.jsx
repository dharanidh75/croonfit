import React, { useEffect } from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { AboutSection } from '../components/AboutSection'

export function About() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] font-sans flex flex-col">
      {/* 
        The Navbar is absolute/sticky depending on scroll, but on standalone pages 
        we usually want it to be visible immediately. 
        Since the AboutSection has a gray background, we ensure the Navbar renders correctly above it.
      */}
      <Navbar />

      <main className="flex-1 pt-20">
        <AboutSection />
      </main>

      <Footer />
    </div>
  )
}
