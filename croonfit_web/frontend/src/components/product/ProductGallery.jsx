import React, { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { ImageWithFallback } from '../ui/ImageWithFallback'

export function ProductGallery({ images }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  if (!images || images.length === 0) {
    return <div className="aspect-[3/4] bg-[#F5F5F5] rounded-2xl" />
  }

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
      <div className="flex flex-col md:flex-row gap-6 h-full">
        {/* Thumbnails */}
        <div className="flex md:flex-col gap-4 order-2 md:order-1 overflow-x-auto md:overflow-y-auto hide-scrollbar w-full md:w-24 flex-shrink-0">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(idx)}
              className={`relative aspect-[3/4] w-20 md:w-full flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                activeIndex === idx 
                  ? 'border-black opacity-100' 
                  : 'border-transparent opacity-50 hover:opacity-100'
              }`}
            >
              <ImageWithFallback src={img.url} alt={img.alt || 'Thumbnail'} className="w-full h-full object-cover bg-[#F5F5F5]" />
            </button>
          ))}
        </div>

        {/* Main Image */}
        <div 
          className="relative flex-1 aspect-[3/4] md:aspect-auto bg-[#F5F5F5] rounded-2xl cursor-zoom-in order-1 md:order-2 overflow-hidden group"
          onClick={() => setLightboxOpen(true)}
        >
          <ImageWithFallback 
            src={activeImage.url} 
            alt={activeImage.alt || 'Product view'} 
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Click to expand
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-md flex flex-col animate-fade-in-up">
          <div className="flex justify-end p-6 md:p-8">
            <button 
              onClick={() => setLightboxOpen(false)}
              className="text-black hover:text-gray-500 transition-colors duration-300 bg-gray-100 rounded-full p-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex-1 relative flex items-center justify-center p-4">
            <button 
              onClick={prevImage}
              className="absolute left-4 md:left-12 p-4 text-black hover:text-gray-500 hover:-translate-x-1 transition-all duration-300"
            >
              <ChevronLeft className="w-8 h-8 md:w-12 md:h-12" />
            </button>

            <ImageWithFallback 
              src={activeImage.url} 
              alt={activeImage.alt || 'Product view'} 
              className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-sm"
            />

            <button 
              onClick={nextImage}
              className="absolute right-4 md:right-12 p-4 text-black hover:text-gray-500 hover:translate-x-1 transition-all duration-300"
            >
              <ChevronRight className="w-8 h-8 md:w-12 md:h-12" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
