import React, { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

export function ProductGallery({ images }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  if (!images || images.length === 0) return <div className="aspect-[3/4] bg-surface" />

  const activeImage = images[activeIndex]

  const nextImage = (e) => {
    e.stopPropagation()
    setActiveIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = (e) => {
    e.stopPropagation()
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 h-full">
        {/* Thumbnails (Desktop side, Mobile bottom) */}
        <div className="flex md:flex-col gap-4 order-2 md:order-1 overflow-x-auto md:overflow-y-auto hide-scrollbar w-full md:w-24 flex-shrink-0">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(idx)}
              className={`relative aspect-[3/4] w-20 md:w-full flex-shrink-0 overflow-hidden border transition-colors duration-[150ms] linear ${
                activeIndex === idx ? 'border-accent' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img.url} alt={img.alt || 'Thumbnail'} className="w-full h-full object-cover mix-blend-multiply" />
            </button>
          ))}
        </div>

        {/* Main Image */}
        <div 
          className="relative flex-1 aspect-[3/4] md:aspect-auto bg-surface cursor-zoom-in order-1 md:order-2 overflow-hidden"
          onClick={() => setLightboxOpen(true)}
        >
          <img 
            src={activeImage.url} 
            alt={activeImage.alt || 'Product view'} 
            className="w-full h-full object-cover mix-blend-multiply"
          />
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-base flex flex-col">
          <div className="flex justify-end p-6">
            <button 
              onClick={() => setLightboxOpen(false)}
              className="text-text hover:text-muted transition-colors duration-[150ms] linear"
            >
              <X className="w-8 h-8" />
            </button>
          </div>
          
          <div className="flex-1 relative flex items-center justify-center p-4">
            <button 
              onClick={prevImage}
              className="absolute left-4 md:left-12 p-4 text-text hover:text-muted transition-colors duration-[150ms] linear"
            >
              <ChevronLeft className="w-8 h-8 md:w-12 md:h-12" />
            </button>

            <img 
              src={activeImage.url} 
              alt={activeImage.alt || 'Product view'} 
              className="max-w-full max-h-full object-contain"
            />

            <button 
              onClick={nextImage}
              className="absolute right-4 md:right-12 p-4 text-text hover:text-muted transition-colors duration-[150ms] linear"
            >
              <ChevronRight className="w-8 h-8 md:w-12 md:h-12" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
