import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { ProductCard } from '../components/product/ProductCard'
import { useStore } from '../store'
import { Minus, Plus, X, ArrowRight } from 'lucide-react'
import { ImageWithFallback } from '../components/ui/ImageWithFallback'
import api from '../lib/api'

export function Cart() {
  const { cart, updateCartQty, removeFromCart, isAuthenticated, clearBuyNowItem } = useStore()
  const navigate = useNavigate()
  const [crossSell, setCrossSell] = useState([])

  const cartSubtotal = cart.reduce((acc, item) => {
    const price = Number(item.variant?.price || item.product?.price || 0)
    return acc + (price * Number(item.quantity || 1))
  }, 0)
  const shipping = cartSubtotal >= 999 ? 0 : 99 // Free shipping over ₹999
  const total = cartSubtotal > 0 ? cartSubtotal + shipping : 0

  useEffect(() => {
    // Fetch some recommended products for the bottom section
    api.get('/products?sort=popular&per_page=4')
      .then(res => setCrossSell(res.data?.slice(0, 4) || []))
      .catch(console.error)
  }, [])

  const handleCheckout = () => {
    if (clearBuyNowItem) clearBuyNowItem()
    if (isAuthenticated) {
      navigate('/checkout')
    } else {
      navigate('/login?redirect=/checkout')
    }
  }

  return (
    <div className="min-h-screen bg-white font-sans text-[#0A0A0A] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-32">
        <div className="max-w-[1440px] mx-auto px-6 mb-12">
          <h1 className="text-4xl md:text-5xl font-light uppercase tracking-tight mb-2">
            Shopping Cart
          </h1>
          <p className="text-sm font-medium uppercase tracking-widest text-[#888888]">
            {cart.length} {cart.length === 1 ? 'Item' : 'Items'}
          </p>
        </div>

        <div className="max-w-[1440px] mx-auto px-6">
          {cart.length === 0 ? (
            <div className="py-24 text-center border-y border-[#F5F5F5]">
              <h2 className="text-2xl font-light mb-6">Your cart is empty.</h2>
              <Link
                to="/retail"
                className="inline-flex h-14 px-10 items-center justify-center bg-black text-white text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-colors"
              >
                Return to Shop
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-12 xl:gap-24">

              {/* Left: Cart Items */}
              <div className="w-full lg:w-[60%] xl:w-[65%]">
                <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-[#F5F5F5] text-xs font-bold uppercase tracking-widest text-[#888888]">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-3 text-center">Quantity</div>
                  <div className="col-span-3 text-right">Total</div>
                </div>

                <div className="flex flex-col">
                  {cart.map((item, index) => (
                    <div key={`${item.product.id}-${item.variant.id}`} className="grid grid-cols-1 md:grid-cols-12 gap-6 py-8 border-b border-[#F5F5F5] animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>

                      {/* Product Info */}
                      <div className="col-span-1 md:col-span-6 flex gap-6">
                        <Link to={`/product/${item.product.slug}`} className="w-24 md:w-32 flex-shrink-0 bg-[#F5F5F5] rounded-xl overflow-hidden aspect-[3/4]">
                          <ImageWithFallback 
                            src={item.product.thumbnail_url || item.variant?.images?.find(i => i.is_primary)?.url || item.variant?.images?.[0]?.url || item.product.primary_image || item.product.images?.[0]?.url} 
                            alt={item.product.name} 
                            className="w-full h-full object-cover mix-blend-multiply" 
                          />
                        </Link>
                        <div className="flex flex-col py-2">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#888888] mb-1">Croonfit</p>
                          <Link to={`/product/${item.product?.slug}`} className="text-base font-medium hover:text-gray-600 transition-colors">
                            {item.product?.name || 'Croonfit Item'}
                          </Link>
                          <p className="text-xs font-light text-[#555555] mt-2">Size: {item.variant.size}</p>
                          <p className="text-xs font-medium mt-2 md:hidden">₹{Number(item.variant?.price || item.product?.price || 0)}</p>

                          <button
                            onClick={() => {
                              removeFromCart(item.product.id, item.variant.id)
                              toast('Item removed from cart', { icon: '🗑️' })
                            }}
                            className="mt-auto text-xs font-bold uppercase tracking-widest text-[#888888] hover:text-[#E53E3E] transition-colors flex items-center gap-1 w-fit"
                          >
                            <X className="w-3 h-3" /> Remove
                          </button>
                        </div>
                      </div>

                      {/* Quantity Selector */}
                      <div className="col-span-1 md:col-span-3 flex items-center md:justify-center">
                        <div className="flex items-center border border-[#E5E5E5] rounded-lg overflow-hidden h-10 w-28">
                          <button
                            onClick={() => updateCartQty(item.product.id, item.variant.id, Math.max(1, item.quantity - 1))}
                            className="w-8 h-full flex items-center justify-center text-[#888888] hover:bg-[#F5F5F5] transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <div className="flex-1 h-full flex items-center justify-center text-sm font-medium">
                            {item.quantity}
                          </div>
                          <button
                            onClick={() => updateCartQty(item.product.id, item.variant.id, item.quantity + 1)}
                            className="w-8 h-full flex items-center justify-center text-[#888888] hover:bg-[#F5F5F5] transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Total Price */}
                      <div className="hidden md:flex col-span-3 items-center justify-end">
                        <span className="text-lg font-bold text-[#0A0A0A]">
                          {`₹${(parseFloat(item.variant?.price || item.product?.price || 0) * Number(item.quantity || 1)).toFixed(2)}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Order Summary */}
              <div className="w-full lg:w-[40%] xl:w-[35%]">
                <div className="bg-[#F9F9F9] rounded-2xl p-8 lg:sticky lg:top-28">
                  <h2 className="text-lg font-medium uppercase tracking-widest mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6 text-sm">
                    <div className="flex justify-between text-[#555555]">
                      <span>Subtotal</span>
                      <span className="font-medium text-[#0A0A0A]">₹{cartSubtotal}</span>
                    </div>
                    <div className="flex justify-between text-[#555555]">
                      <span>Shipping</span>
                      <span className="font-medium text-[#0A0A0A]">
                        {shipping === 0 ? 'Free' : `₹${shipping}`}
                      </span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-[10px] text-[#888888] uppercase tracking-widest mt-1">
                        Free shipping on orders over ₹999
                      </p>
                    )}
                  </div>

                  <div className="border-t border-[#E5E5E5] pt-6 flex justify-between items-end mb-8">
                    <span className="text-sm font-bold uppercase tracking-widest">Total</span>
                    <span className="text-2xl font-medium">₹{total}</span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full h-14 bg-black text-white text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Cross-Sell Section */}
        {crossSell.length > 0 && (
          <div className="max-w-[1440px] mx-auto px-6 mt-32">
            <h2 className="text-2xl md:text-3xl font-light uppercase tracking-tight text-center mb-12">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 gap-y-12">
              {crossSell.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
