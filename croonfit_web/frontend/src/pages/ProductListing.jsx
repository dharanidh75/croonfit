import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { ProductCard } from '../components/product/ProductCard'
import { ProductSkeleton } from '../components/ui/Skeleton'
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react'
import api from '../lib/api'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

const SORT_OPTIONS = [
  { value: 'newest',    label: 'Newest First' },
  { value: 'popular',   label: 'Popularity' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc',label: 'Price: High to Low' },
]

export function ProductListing() {
  const { category, subcategory } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [total, setTotal] = useState(0)
  
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)

  const size   = searchParams.get('size') || ''
  const sort   = searchParams.get('sort') || 'newest'
  const search = searchParams.get('search') || ''
  const page   = parseInt(searchParams.get('page') || '1', 10)

  // Map URL category to backend gender format if needed
  const getBackendGender = (cat) => {
    if (!cat) return ''
    const lower = cat.toLowerCase()
    if (lower === 'men') return 'MENS'
    if (lower === 'women') return 'WOMENS'
    if (lower === 'kids') return 'KIDS'
    return cat.toUpperCase()
  }

  const fetchProducts = async (isMore = false) => {
    isMore ? setLoadingMore(true) : setLoading(true)
    try {
      const params = new URLSearchParams()
      
      const backendGender = getBackendGender(category)
      if (backendGender) params.append('gender', backendGender)
      if (subcategory) params.append('sub', subcategory)
      
      if (size)   params.append('size', size)
      if (sort)   params.append('sort', sort)
      if (search) params.append('search', search)
      
      params.append('page', isMore ? page + 1 : 1)
      params.append('per_page', 12)

      // Fallback mapping if backend expects exact ?category=men&subcategory=oversized as mentioned in prompt
      params.append('category', category || '')
      params.append('subcategory', subcategory || '')

      const res = await api.get(`/products?${params.toString()}`)
      isMore ? setProducts(p => [...p, ...res.data.items]) : setProducts(res.data.items)
      setHasMore(res.data.has_more)
      setTotal(res.data.total)

      if (isMore) setSearchParams(p => { p.set('page', res.data.page); return p }, { replace: true })
    } catch (err) {
      console.error(err)
    } finally {
      isMore ? setLoadingMore(false) : setLoading(false)
    }
  }

  useEffect(() => { 
    fetchProducts() 
  }, [category, subcategory, size, sort, search])

  const setFilter = (key, value) => {
    setSearchParams(p => {
      if (value) p.set(key, value)
      else p.delete(key)
      p.set('page', '1')
      return p
    })
  }

  const currentSortLabel = SORT_OPTIONS.find(o => o.value === sort)?.label || 'Newest First'

  const formattedCategory = category ? category.charAt(0).toUpperCase() + category.slice(1) : ''
  const formattedSubcategory = subcategory ? subcategory.charAt(0).toUpperCase() + subcategory.slice(1) : ''

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-[#0A0A0A]">
      <Navbar />

      <main className="flex-1 pt-24 pb-32">
        
        {/* Header & Breadcrumbs */}
        <div className="max-w-[1440px] mx-auto px-6 mb-12">
          <nav className="text-xs font-medium uppercase tracking-widest text-[#888888] mb-6 flex items-center gap-2">
            <span>Home</span>
            <span>/</span>
            <span>{formattedCategory}</span>
            {formattedSubcategory && (
              <>
                <span>/</span>
                <span className="text-[#0A0A0A]">{formattedSubcategory}</span>
              </>
            )}
            {search && (
              <>
                <span>/</span>
                <span className="text-[#0A0A0A]">Search: "{search}"</span>
              </>
            )}
          </nav>
          <h1 className="text-4xl md:text-5xl font-light uppercase tracking-tight">
            {formattedSubcategory || formattedCategory || 'Shop All'}
          </h1>
        </div>

        {/* Filter + Sort Bar */}
        <div className="sticky top-20 z-30 bg-white/90 backdrop-blur-md border-y border-[#F5F5F5] py-4 px-6 mb-8">
          <div className="max-w-[1440px] mx-auto flex items-center justify-between">
            
            {/* Left: Desktop Filters */}
            <div className="hidden md:flex items-center gap-6">
              <span className="text-sm font-light text-[#888888] mr-4">{total} Products</span>
              
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest mr-2">Size</span>
                {SIZES.map(s => (
                  <button
                    key={s}
                    onClick={() => setFilter('size', size === s ? '' : s)}
                    className={`w-10 h-10 rounded-full text-xs font-medium transition-all duration-300 ${
                      size === s 
                        ? 'bg-black text-white' 
                        : 'bg-[#F5F5F5] text-[#555555] hover:bg-gray-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Filter Trigger */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="md:hidden flex items-center gap-2 text-sm uppercase tracking-widest font-medium"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filter ({total})
            </button>

            {/* Right: Sort */}
            <div className="relative">
              <button
                onClick={() => setSortOpen(v => !v)}
                className="flex items-center gap-2 text-sm uppercase tracking-widest font-medium hover:text-gray-500 transition-colors"
              >
                Sort: <span className="font-light">{currentSortLabel}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${sortOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {sortOpen && (
                <div className="absolute right-0 top-full mt-4 w-56 bg-white border border-[#F5F5F5] shadow-lg rounded-xl overflow-hidden z-50">
                  {SORT_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => { setFilter('sort', opt.value); setSortOpen(false) }}
                      className={`w-full text-left px-5 py-3 text-sm transition-colors duration-200 ${
                        sort === opt.value ? 'bg-gray-50 font-medium' : 'text-[#555555] hover:bg-gray-50 hover:text-black'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Grid - 4 Desktop, 3 Tablet, 2 Mobile */}
        <div className="max-w-[1440px] mx-auto px-6">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-12">
              {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="py-32 text-center">
              <h2 className="text-2xl font-light mb-4">No products found.</h2>
              <p className="text-[#888888]">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-12">
                {products.map((product, i) => (
                  <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {hasMore && (
                <div className="mt-20 flex justify-center">
                  <button
                    onClick={() => fetchProducts(true)}
                    disabled={loadingMore}
                    className="h-14 px-12 bg-transparent border border-black text-black text-sm font-medium uppercase tracking-widest rounded-xl hover:bg-black hover:text-white transition-all duration-300 disabled:opacity-50"
                  >
                    {loadingMore ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
          <div className="relative bg-white w-full p-6 rounded-t-3xl transform transition-transform duration-300">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-light uppercase tracking-wide">Filters</h3>
              <button onClick={() => setMobileFiltersOpen(false)} className="p-2 bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
            </div>

            <div className="mb-8">
              <h4 className="text-xs font-bold uppercase tracking-widest mb-4">Size</h4>
              <div className="flex flex-wrap gap-3">
                {SIZES.map(s => (
                  <button
                    key={s}
                    onClick={() => setFilter('size', size === s ? '' : s)}
                    className={`h-12 min-w-[3rem] px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                      size === s ? 'bg-black text-white' : 'bg-[#F5F5F5] text-[#555555]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full h-14 bg-black text-white rounded-xl text-sm font-medium uppercase tracking-widest"
            >
              Show {total} Products
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
