import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { ProductGallery } from '../components/product/ProductGallery'
import { SizeSelector } from '../components/product/SizeSelector'
import { SizeGuideModal } from '../components/product/SizeGuideModal'
import { Skeleton } from '../components/ui/Skeleton'
import { Heart, Ruler, ChevronDown, ChevronUp, ShoppingBag, Truck } from 'lucide-react'
import { useStore } from '../store'
import api from '../lib/api'

export function ProductDetail() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false)
  const [adding, setAdding] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [shippingOpen, setShippingOpen] = useState(false)

  const { addToCart, openCart, isWishlisted, toggleWishlist, isAuthenticated } = useStore()

  useEffect(() => {
    setLoading(true)
    api.get(`/products/${slug}`)
      .then(res => {
        setProduct(res.data)
        const firstAvail = res.data.variants?.find(v => v.stock_qty > 0)
        if (firstAvail) {
          setSelectedSize(firstAvail.size)
        }
        
        // Mock colors if not present in API
        if (res.data.colors && res.data.colors.length > 0) {
          setSelectedColor(res.data.colors[0])
        } else {
          setSelectedColor({ name: 'Black', hex: '#000000' })
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 py-24 flex flex-col md:flex-row gap-12">
          <div className="w-full md:w-[60%]"><Skeleton className="w-full aspect-[3/4] rounded-2xl" /></div>
          <div className="w-full md:w-[40%] space-y-6 pt-10">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-32 w-full mt-12" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-32 text-center text-[#888888]">
          <h2 className="text-2xl font-light">Product not found.</h2>
        </main>
        <Footer />
      </div>
    )
  }

  const wishlisted = isWishlisted(product.id)

  const handleAddToCart = () => {
    if (!selectedSize) return
    setAdding(true)
    const variant = product.variants?.find(v => v.size === selectedSize)
    if (variant) {
      setTimeout(() => {
        addToCart(product, variant, 1)
        setAdding(false)
        openCart()
      }, 350)
    } else {
      setAdding(false)
    }
  }

  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : null

  // Mock colors for the UI since backend may not have them yet
  const colors = product.colors || [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Navy', hex: '#1E293B' },
  ]

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-32">
        {/* Breadcrumb */}
        <div className="max-w-[1440px] mx-auto px-6 mb-8">
          <nav className="text-xs font-medium uppercase tracking-widest text-[#888888] flex items-center gap-2">
            <span>Home</span>
            <span>/</span>
            <span>{product.category?.name || 'Shop'}</span>
            <span>/</span>
            <span className="text-[#0A0A0A] truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>

        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">

            {/* Left: Gallery */}
            <div className="w-full lg:w-[60%] xl:w-[65%]">
              <ProductGallery images={product.images} />
            </div>

            {/* Right: Info panel (Sticky) */}
            <div className="w-full lg:w-[40%] xl:w-[35%] flex flex-col">
              <div className="lg:sticky lg:top-28">
                
                {/* Brand + Name */}
                <p className="text-xs font-bold uppercase tracking-widest text-[#888888] mb-3">Croonfit</p>
                <h1 className="text-4xl md:text-5xl font-light uppercase tracking-tight leading-none mb-6">
                  {product.name}
                </h1>

                {/* Price */}
                <div className="flex items-end gap-4 mb-8 pb-8 border-b border-[#F5F5F5]">
                  <span className="text-3xl font-medium text-[#0A0A0A]">₹{product.price}</span>
                  {product.compare_price && (
                    <div className="flex flex-col">
                      <span className="text-sm font-light text-[#888888] line-through mb-1">₹{product.compare_price}</span>
                      <span className="text-xs font-bold uppercase tracking-widest text-[#E53E3E]">{discount}% OFF</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="font-light text-base text-[#555555] leading-relaxed mb-10">
                  {product.description || "Engineered for optimal comfort and minimal distraction. A versatile addition to your modern wardrobe."}
                </p>

                {/* Colors */}
                <div className="mb-10">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest">Color: {selectedColor?.name}</span>
                  </div>
                  <div className="flex gap-4">
                    {colors.map(color => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color)}
                        className={`w-10 h-10 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                          selectedColor?.name === color.name ? 'border-black' : 'border-transparent hover:border-gray-300'
                        }`}
                      >
                        <span 
                          className="w-8 h-8 rounded-full border border-gray-200" 
                          style={{ backgroundColor: color.hex }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selector */}
                <div className="mb-10">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest">Select Size</span>
                    <button
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="flex items-center gap-2 text-xs font-medium text-[#888888] hover:text-[#0A0A0A] transition-colors duration-300"
                    >
                      <Ruler className="w-3.5 h-3.5" /> Size Guide
                    </button>
                  </div>
                  <SizeSelector
                    variants={product.variants || []}
                    selectedSize={selectedSize}
                    onSelect={setSelectedSize}
                    sizeChart={product.category?.size_chart}
                  />
                </div>

                {/* CTA Row */}
                <div className="flex gap-4 mb-12">
                  <button
                    onClick={handleAddToCart}
                    disabled={!selectedSize || adding}
                    className="flex-1 h-14 bg-black text-white text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    {adding ? 'Adding...' : 'Add to Cart'}
                  </button>
                  <button
                    onClick={() => isAuthenticated && toggleWishlist(product)}
                    aria-label="Wishlist"
                    className={`w-14 h-14 rounded-xl border flex items-center justify-center transition-all duration-300 ${
                      wishlisted ? 'border-[#E53E3E] bg-red-50' : 'border-[#E5E5E5] hover:border-black'
                    }`}
                  >
                    <Heart
                      className="w-6 h-6"
                      style={{ fill: wishlisted ? '#E53E3E' : 'none', color: wishlisted ? '#E53E3E' : '#0A0A0A' }}
                    />
                  </button>
                </div>

                {/* Accordions */}
                <div className="border-t border-[#F5F5F5]">
                  <button
                    onClick={() => setDetailsOpen(v => !v)}
                    className="flex justify-between items-center w-full py-6 text-xs font-bold uppercase tracking-widest hover:text-gray-500 transition-colors"
                  >
                    Details &amp; Care
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${detailsOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {detailsOpen && (
                    <div className="pb-6 font-light text-sm text-[#555555] leading-relaxed space-y-3 animate-fade-in-up">
                      <p>• 100% premium heavyweight cotton.</p>
                      <p>• Machine wash cold. Tumble dry low. Do not bleach.</p>
                      <p>• Model is 6'1" wearing size M.</p>
                    </div>
                  )}
                </div>

                <div className="border-t border-[#F5F5F5]">
                  <button
                    onClick={() => setShippingOpen(v => !v)}
                    className="flex justify-between items-center w-full py-6 text-xs font-bold uppercase tracking-widest hover:text-gray-500 transition-colors"
                  >
                    <span className="flex items-center gap-2"><Truck className="w-4 h-4" /> Shipping &amp; Returns</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${shippingOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {shippingOpen && (
                    <div className="pb-6 font-light text-sm text-[#555555] leading-relaxed space-y-3 animate-fade-in-up">
                      <p>• Free express shipping on orders above ₹999.</p>
                      <p>• Standard delivery: 3–5 business days.</p>
                      <p>• Easy 7-day returns on unworn items with tags attached.</p>
                    </div>
                  )}
                </div>
                <div className="border-t border-[#F5F5F5]" />

              </div>
            </div>

          </div>
        </div>
      </main>

      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        sizeChart={product.category?.size_chart}
      />
      <Footer />
    </div>
  )
}
