import React, { useState } from 'react'
import { Heart, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useStore } from '../../store'

/**
 * Ajio-style Product Card
 * - 3:4 image ratio, portrait fashion standard
 * - Brand label 12px / Product name 15px / Price row
 * - Size chips below
 * - Wishlist heart top-right overlay
 * - Hover: box-shadow + image scale(1.04) + heart fades in
 */
export function ProductCard({ product, mode = 'default' }) {
  const [hovered, setHovered] = useState(false)
  const { isWishlisted, toggleWishlist, isAuthenticated } = useStore()
  const wishlisted = isWishlisted(product.id)

  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : null

  const sizes = product.available_sizes || []

  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (isAuthenticated) toggleWishlist(product)
  }

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image wrapper */}
      <div
        className="relative overflow-hidden bg-[#F5F5F5] rounded-[8px] transition-shadow duration-200"
        style={{
          aspectRatio: '3/4',
          boxShadow: hovered ? '0 4px 24px rgba(0,0,0,0.08)' : 'none',
          transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
          transition: 'box-shadow 200ms ease, transform 200ms ease',
        }}
      >
        {/* Primary image */}
        <img
          src={product.primary_image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out"
          style={{ transform: hovered ? 'scale(1.04)' : 'scale(1)' }}
        />

        {/* NEW / TRENDING badge — top left */}
        {product.tags?.includes('new') && (
          <span className="absolute top-3 left-3 bg-[#000000] text-white text-[11px] font-heading font-bold uppercase tracking-wider px-2 py-0.5">
            NEW
          </span>
        )}
        {product.tags?.includes('bestseller') && !product.tags?.includes('new') && (
          <span className="absolute top-3 left-3 bg-[#000000] text-white text-[11px] font-heading font-bold uppercase tracking-wider px-2 py-0.5">
            TRENDING
          </span>
        )}

        {/* Action Icon — top right, fades in on hover */}
        <button
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 transition-opacity duration-300 bg-white/80 backdrop-blur-sm w-8 h-8 rounded-full flex items-center justify-center hover:bg-white"
          style={{ opacity: hovered || wishlisted ? 1 : 0 }}
        >
          {mode === 'wishlist' ? (
            <Trash2 className="w-4 h-4 text-[#E53E3E] transition-transform hover:scale-110" />
          ) : (
            <Heart
              className="w-4 h-4 transition-all duration-300"
              style={{
                fill: wishlisted ? '#E53E3E' : 'none',
                color: wishlisted ? '#E53E3E' : '#0A0A0A',
                transform: wishlisted ? 'scale(1.1)' : 'scale(1)',
              }}
            />
          )}
        </button>
      </div>

      {/* Card info */}
      <div className="pt-3 px-0.5">
        {/* Brand */}
        <p className="text-[12px] font-body font-bold uppercase tracking-wider text-[#888888]">Croonfit</p>

        {/* Product name */}
        <p className="text-[15px] font-body text-[#0A0A0A] font-medium mt-0.5 truncate">{product.name}</p>

        {/* Price row */}
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className="font-heading font-bold text-[18px] text-[#0A0A0A]">₹{product.price}</span>
          {product.compare_price && (
            <>
              <span className="font-body text-[14px] text-[#888888] line-through">₹{product.compare_price}</span>
              <span className="font-heading font-bold text-[11px] text-[#E53E3E]">{discount}% OFF</span>
            </>
          )}
        </div>

        {/* Size chips */}
        {sizes.length > 0 && (
          <div className="flex gap-1.5 mt-3 flex-wrap">
            {sizes.slice(0, 5).map(size => (
              <span
                key={size}
                className="h-7 px-2 flex items-center justify-center border border-[#CCCCCC] text-[11px] font-body font-bold text-[#444444] hover:border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-all duration-150 cursor-pointer"
              >
                {size}
              </span>
            ))}
            {sizes.length > 5 && (
              <span className="h-7 px-2 flex items-center text-[11px] font-body text-[#888888]">+{sizes.length - 5}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
