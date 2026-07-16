import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { ProductCard } from '../components/product/ProductCard'
import { ProductSkeleton } from '../components/ui/Skeleton'
import { useStore } from '../store'
import api from '../lib/api'

export function Wishlist() {
  const { wishlist, isAuthenticated } = useStore()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setProducts(wishlist)
    setLoading(false)
  }, [wishlist])

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans text-[#0A0A0A] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-32">
        <div className="max-w-[1440px] mx-auto px-6 text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-light uppercase tracking-tight mb-4">
            Your Wishlist
          </h1>
          <p className="text-sm font-medium uppercase tracking-widest text-[#888888]">
            {products.length} {products.length === 1 ? 'Item' : 'Items'} Saved
          </p>
        </div>

        <div className="max-w-[1440px] mx-auto px-6">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-12">
              {Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="py-24 text-center">
              <h2 className="text-2xl font-light mb-6">Your wishlist is empty.</h2>
              <Link
                to="/retail"
                className="inline-flex h-14 px-10 items-center justify-center bg-black text-white text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-colors"
              >
                Explore Collection
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-12">
              {products.map((product, i) => (
                <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
                  <ProductCard product={product} mode="wishlist" />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
