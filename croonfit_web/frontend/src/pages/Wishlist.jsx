import React, { useEffect, useState } from 'react'
import { Layout } from '../components/layout/Layout'
import { ProductCard } from '../components/product/ProductCard'
import { ProductSkeleton } from '../components/ui/Skeleton'
import { useStore } from '../store'
import api from '../lib/api'
import { Heart } from 'lucide-react'

export function Wishlist() {
  const { wishlist, setWishlist, isAuthenticated } = useStore() // Assume setWishlist is added or we fetch
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      // Local wishlist just pulls from store
      setProducts(wishlist)
      setLoading(false)
      return
    }

    // Authenticated: fetch from API
    api.get('/wishlist')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [isAuthenticated, wishlist])

  // Simple sync for display if local toggles happen
  useEffect(() => {
    if (!isAuthenticated) {
      setProducts(wishlist)
    }
  }, [wishlist, isAuthenticated])


  return (
    <Layout>
      <div className="bg-surface py-12 px-6">
        <div className="max-w-[1280px] mx-auto">
          <h1 className="font-heading font-black text-4xl md:text-5xl uppercase tracking-tighter mb-4 flex items-center gap-4">
            <Heart className="w-8 h-8 md:w-10 md:h-10 text-accent fill-accent" /> Wishlist
          </h1>
          <p className="font-body text-sm text-muted">
            {products.length} {products.length === 1 ? 'Item' : 'Items'} Saved
          </p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 py-section-mob md:py-section-desk">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {Array.from({length: 4}).map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center text-muted font-body">
            Your wishlist is empty.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 animate-in fade-in duration-[200ms] linear">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
