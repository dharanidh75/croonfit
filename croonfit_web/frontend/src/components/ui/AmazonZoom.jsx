import React, { useState, useRef } from 'react'
import { ImageWithFallback } from './ImageWithFallback'

export function AmazonZoom({ src, alt, className = "" }) {
  const containerRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 })
  const [bgPos, setBgPos] = useState({ x: '0%', y: '0%' })
  const [bgSize, setBgSize] = useState({ width: 0, height: 0 })

  // Size of the translucent lens box
  const LENS_SIZE = 160 
  const ZOOM_FACTOR = 2.5 // How much larger the zoomed image is

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect()
      // Calculate what the background size should be to match the zoom factor
      setBgSize({
        width: width * ZOOM_FACTOR,
        height: height * ZOOM_FACTOR
      })
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  const handleMouseMove = (e) => {
    if (!containerRef.current) return
    const { left, top, width, height } = containerRef.current.getBoundingClientRect()

    // Mouse coordinates relative to the container
    const x = e.clientX - left
    const y = e.clientY - top

    // Lens constraints
    const maxLensX = width - LENS_SIZE
    const maxLensY = height - LENS_SIZE

    // Center lens on mouse
    let lensX = x - LENS_SIZE / 2
    let lensY = y - LENS_SIZE / 2

    // Bound the lens within the container
    lensX = Math.max(0, Math.min(lensX, maxLensX))
    lensY = Math.max(0, Math.min(lensY, maxLensY))

    setLensPos({ x: lensX, y: lensY })

    // Calculate background position percentages
    // When lens is at 0, bg is at 0%. When lens is at max, bg is at 100%.
    const percX = maxLensX === 0 ? 0 : (lensX / maxLensX) * 100
    const percY = maxLensY === 0 ? 0 : (lensY / maxLensY) * 100

    setBgPos({ x: `${percX}%`, y: `${percY}%` })
  }

  return (
    <div 
      className={`relative cursor-crosshair ${className} ${isHovered ? 'z-40' : 'z-10'}`}
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <ImageWithFallback src={src} alt={alt} className="w-full h-full object-cover rounded-[inherit]" />

      {/* Lens Overlay */}
      {isHovered && (
        <div 
          className="absolute bg-white/30 border border-gray-400 pointer-events-none hidden md:block"
          style={{
            width: LENS_SIZE,
            height: LENS_SIZE,
            left: lensPos.x,
            top: lensPos.y,
            boxShadow: '0 0 10px rgba(0,0,0,0.1)'
          }}
        />
      )}

      {/* Zoom Box (Appears to the right, exactly like Amazon) */}
      {isHovered && (
        <div 
          className="absolute z-[100] bg-white border border-gray-200 shadow-2xl pointer-events-none hidden md:block overflow-hidden rounded-xl"
          style={{
            // Positioned to the right of the main image, covering the info panel space
            left: 'calc(100% + 24px)',
            top: 0,
            width: '100%', 
            minWidth: '500px', // Ensure it's large enough for a good view
            height: '100%', // Match height of the main image
            backgroundImage: `url(${src})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${bgSize.width}px ${bgSize.height}px`,
            backgroundPosition: `${bgPos.x} ${bgPos.y}`
          }}
        />
      )}
    </div>
  )
}
