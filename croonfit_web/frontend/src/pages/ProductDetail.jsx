import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { ProductGallery } from '../components/product/ProductGallery'
import { SizeSelector } from '../components/product/SizeSelector'
import { SizeGuideModal } from '../components/product/SizeGuideModal'
import { Skeleton } from '../components/ui/Skeleton'
import { Heart, Ruler, ChevronDown, ChevronUp } from 'lucide-react'
import { useStore } from '../store'
import api from '../lib/api'

export function ProductDetail() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState(null)
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
        if (firstAvail) setSelectedSize(firstAvail.size)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <Layout>
        <div className="max-w-[1280px] mx-auto px-6 py-12 flex flex-col md:flex-row gap-10">
          <div className="w-full md:w-[55%]"><Skeleton className="w-full aspect-[3/4]" /></div>
          <div className="flex-1 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full mt-8" />
          </div>
        </div>
      </Layout>
    )
  }

  if (!product) {
    return <Layout><div className="py-32 text-center font-body text-[#888888]">Product not found.</div></Layout>
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

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="px-6 max-w-[1280px] mx-auto pt-6 pb-0">
        <nav className="text-xs font-body text-[#888888]" aria-label="Breadcrumb">
          <span>Home</span>
          <span className="mx-2">/</span>
          <span>{product.category?.name}</span>
          <span className="mx-2">/</span>
          <span className="text-[#0A0A0A]">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-16">

          {/* Gallery */}
          <div className="w-full md:w-[55%] lg:w-[60%]">
            <ProductGallery images={product.images} />
          </div>

          {/* Info panel — sticky */}
          <div className="flex-1 flex flex-col md:sticky md:top-[120px] md:self-start">

            {/* Brand + Name */}
            <p className="text-[12px] font-body font-bold uppercase tracking-wider text-[#888888] mb-1">Croonfit</p>
            <h1 className="font-heading font-bold text-3xl uppercase tracking-tight leading-tight mb-4">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[#EEEEEE]">
              <span className="font-heading font-bold text-2xl text-[#0A0A0A]">₹{product.price}</span>
              {product.compare_price && (
                <>
                  <span className="font-body text-base text-[#888888] line-through">₹{product.compare_price}</span>
                  <span className="font-heading font-bold text-sm text-[#E53E3E]">{discount}% OFF</span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="font-body text-sm text-[#444444] leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="font-heading font-bold text-xs uppercase tracking-wider">Select Size</span>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="flex items-center gap-1 text-xs font-body font-bold text-[#888888] hover:text-[#0A0A0A] transition-colors duration-150 underline underline-offset-2"
                >
                  <Ruler className="w-3 h-3" /> Size Guide
                </button>
              </div>
              <SizeSelector
                variants={product.variants || []}
                selectedSize={selectedSize}
                onSelect={setSelectedSize}
                sizeChart={product.category?.size_chart}
              />
            </div>

            {/* CTA row */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize || adding}
                className="flex-1 h-12 bg-[#000000] text-white font-heading font-bold text-sm uppercase tracking-wider hover:bg-[#222222] transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {adding ? 'Adding...' : 'Add to Cart'}
              </button>
              <button
                onClick={() => isAuthenticated && toggleWishlist(product)}
                aria-label="Wishlist"
                className={`w-12 h-12 border flex items-center justify-center transition-colors duration-150 ${
                  wishlisted ? 'border-[#E53E3E] bg-red-50' : 'border-[#CCCCCC] hover:border-[#0A0A0A]'
                }`}
              >
                <Heart
                  className="w-5 h-5"
                  style={{ fill: wishlisted ? '#E53E3E' : 'none', color: wishlisted ? '#E53E3E' : '#0A0A0A' }}
                />
              </button>
            </div>

            {/* Accordion: Details & Care */}
            <div className="border-t border-[#EEEEEE]">
              <button
                onClick={() => setDetailsOpen(v => !v)}
                className="flex justify-between items-center w-full py-4 font-heading font-bold text-xs uppercase tracking-wider text-[#0A0A0A]"
              >
                Details &amp; Care
                {detailsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {detailsOpen && (
                <div className="pb-4 font-body text-sm text-[#444444] leading-relaxed space-y-2">
                  <p>100% premium performance fabric.</p>
                  <p>Machine wash cold. Tumble dry low. Do not bleach.</p>
                  <p>Model is 6'1" wearing size M.</p>
                </div>
              )}
            </div>

            {/* Accordion: Shipping */}
            <div className="border-t border-[#EEEEEE]">
              <button
                onClick={() => setShippingOpen(v => !v)}
                className="flex justify-between items-center w-full py-4 font-heading font-bold text-xs uppercase tracking-wider text-[#0A0A0A]"
              >
                Shipping &amp; Returns
                {shippingOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {shippingOpen && (
                <div className="pb-4 font-body text-sm text-[#444444] leading-relaxed space-y-2">
                  <p>Free shipping on orders above ₹999.</p>
                  <p>Standard delivery: 3–5 business days.</p>
                  <p>Easy 7-day returns on unworn items with tags attached.</p>
                </div>
              )}
            </div>
            <div className="border-t border-[#EEEEEE]" />

          </div>
        </div>
      </div>

      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        sizeChart={product.category?.size_chart}
      />
    </Layout>
  )
}
