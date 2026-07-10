import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { ProductCard } from '../components/product/ProductCard'
import { ProductSkeleton } from '../components/ui/Skeleton'
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react'
import api from '../lib/api'

// Sub-category configs per gender
const SUB_CATEGORIES = {
  MENS: [
    { label: 'T-Shirts', slug: 'tshirt', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400&auto=format&fit=crop' },
    { label: 'Shirts',   slug: 'shirt',  image: 'https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?q=80&w=400&auto=format&fit=crop' },
    { label: 'Hoodies',  slug: 'hoodie', image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=400&auto=format&fit=crop' },
    { label: 'Joggers',  slug: 'jogger', image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=400&auto=format&fit=crop' },
    { label: 'Shorts',   slug: 'short',  image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=400&auto=format&fit=crop' },
  ],
  WOMENS: [
    { label: 'Tops',     slug: 'top',    image: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?q=80&w=400&auto=format&fit=crop' },
    { label: 'Leggings', slug: 'legging',image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b0a3f?q=80&w=400&auto=format&fit=crop' },
  ],
  KIDS: [
    { label: 'T-Shirts', slug: 'tshirt', image: 'https://images.unsplash.com/photo-1622290291165-80a8daf8bfd2?q=80&w=400&auto=format&fit=crop' },
    { label: 'Shirts',   slug: 'shirt',  image: 'https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?q=80&w=400&auto=format&fit=crop' },
    { label: 'Pants',    slug: 'pant',   image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=400&auto=format&fit=crop' },
    { label: 'Joggers',  slug: 'jogger', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=400&auto=format&fit=crop' },
  ],
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

const GENDER_LABELS = { MENS: "Men's", WOMENS: "Women's", KIDS: "Kids'" }

export function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [total, setTotal] = useState(0)
  const [activeFilters, setActiveFilters] = useState([])
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)

  const gender  = searchParams.get('gender') || ''
  const size    = searchParams.get('size') || ''
  const sort    = searchParams.get('sort') || 'newest'
  const search  = searchParams.get('search') || ''
  const subCat  = searchParams.get('sub') || ''
  const page    = parseInt(searchParams.get('page') || '1', 10)

  const subcats = gender ? (SUB_CATEGORIES[gender] || []) : []

  // Build active filters list for the pill display
  useEffect(() => {
    const pills = []
    if (size)   pills.push({ key: 'size', label: `Size: ${size}` })
    if (subCat) pills.push({ key: 'sub', label: subCat })
    setActiveFilters(pills)
  }, [size, subCat])

  const fetchProducts = async (isMore = false) => {
    isMore ? setLoadingMore(true) : setLoading(true)
    try {
      const params = new URLSearchParams()
      if (gender) params.append('gender', gender)
      if (size)   params.append('size', size)
      if (sort)   params.append('sort', sort)
      if (search) params.append('search', search)
      params.append('page', isMore ? page + 1 : 1)
      params.append('per_page', 20)

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

  useEffect(() => { fetchProducts() }, [gender, size, sort, search, subCat])

  const setFilter = (key, value) => {
    setSearchParams(p => {
      if (value) p.set(key, value)
      else p.delete(key)
      p.set('page', '1')
      return p
    })
  }

  const removeFilter = (key) => setFilter(key, '')

  const SORT_OPTIONS = [
    { value: 'newest',    label: 'Newest First' },
    { value: 'popular',   label: 'Popularity' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc',label: 'Price: High to Low' },
  ]

  const currentSortLabel = SORT_OPTIONS.find(o => o.value === sort)?.label || 'Newest First'

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1" style={{ paddingTop: '104px' }}>

        {/* ── Breadcrumb ────────────────────────────────────────────────── */}
        <div className="px-6 max-w-[1280px] mx-auto pt-6 pb-0">
          <nav className="text-xs font-body text-[#888888] mb-0" aria-label="Breadcrumb">
            <span>Home</span>
            {gender && <><span className="mx-2">/</span><span>{GENDER_LABELS[gender] || gender}</span></>}
            {search && <><span className="mx-2">/</span><span>"{search}"</span></>}
          </nav>
        </div>

        {/* ── Sub-category button row ───────────────────────────────────── */}
        {subcats.length > 0 && (
          <div className="px-6 max-w-[1280px] mx-auto mt-6">
            <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
              {subcats.map(cat => (
                <button
                  key={cat.slug}
                  onClick={() => setFilter('sub', subCat === cat.slug ? '' : cat.slug)}
                  className={`group relative flex-shrink-0 w-[160px] md:w-[180px] h-[220px] md:h-[260px] overflow-hidden transition-all duration-150 ${
                    subCat === cat.slug ? 'ring-2 ring-[#000000]' : ''
                  }`}
                >
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:opacity-90 transition-opacity duration-150"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className="absolute bottom-3 left-0 right-0 text-center font-heading font-bold text-xs uppercase tracking-wider text-white">
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Filter + Sort sticky bar ──────────────────────────────────── */}
        <div className="sticky top-[104px] z-30 bg-white border-y border-[#EEEEEE] px-6 py-3">
          <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-4">

            {/* Left: result count + quick filters */}
            <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar flex-1">
              <span className="text-xs font-body text-[#888888] whitespace-nowrap flex-shrink-0">
                {total} results
              </span>

              {/* Active filter pills */}
              {activeFilters.map(f => (
                <button
                  key={f.key}
                  onClick={() => removeFilter(f.key)}
                  className="flex items-center gap-1.5 h-7 px-3 border border-[#0A0A0A] bg-[#0A0A0A] text-white text-[11px] font-heading font-bold uppercase tracking-wider whitespace-nowrap flex-shrink-0"
                >
                  {f.label} <X className="w-3 h-3" />
                </button>
              ))}

              {/* Quick size chips */}
              <div className="flex gap-1.5">
                {SIZES.map(s => (
                  <button
                    key={s}
                    onClick={() => setFilter('size', size === s ? '' : s)}
                    className={`h-7 px-2.5 border text-[11px] font-body font-bold transition-all duration-150 whitespace-nowrap ${
                      size === s
                        ? 'border-[#0A0A0A] bg-[#0A0A0A] text-white'
                        : 'border-[#CCCCCC] text-[#444444] hover:border-[#0A0A0A]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {activeFilters.length > 0 && (
                <button
                  onClick={() => { removeFilter('size'); removeFilter('sub') }}
                  className="text-[11px] font-body text-[#888888] hover:text-[#0A0A0A] underline whitespace-nowrap transition-colors duration-150"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Right: Sort dropdown + mobile filter btn */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="md:hidden flex items-center gap-1.5 text-xs font-heading font-bold uppercase tracking-wider border border-[#CCCCCC] px-3 h-8"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" /> Filter
              </button>

              {/* Sort */}
              <div className="relative">
                <button
                  onClick={() => setSortOpen(v => !v)}
                  className="flex items-center gap-1.5 text-xs font-heading font-bold uppercase tracking-wider text-[#0A0A0A] hover:text-[#888888] transition-colors duration-150"
                >
                  Sort: {currentSortLabel}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${sortOpen ? 'rotate-180' : ''}`} />
                </button>
                {sortOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-[#CCCCCC] z-50 shadow-sm">
                    {SORT_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => { setFilter('sort', opt.value); setSortOpen(false) }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-body transition-colors duration-150 ${
                          sort === opt.value ? 'bg-[#F5F5F5] font-bold text-[#0A0A0A]' : 'text-[#444444] hover:bg-[#F5F5F5]'
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
        </div>

        {/* ── Product Grid ──────────────────────────────────────────────── */}
        <div className="max-w-[1280px] mx-auto px-6 py-8">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
              {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-heading font-bold text-2xl uppercase mb-3">Nothing saved yet.</p>
              <p className="font-body text-[#888888]">Try adjusting your filters or start scrolling.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
                {products.map((product, i) => (
                  <div
                    key={product.id}
                    style={{
                      animation: `fadeUp 300ms ease ${i * 60}ms both`,
                    }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="mt-14 flex justify-center">
                  <button
                    onClick={() => fetchProducts(true)}
                    disabled={loadingMore}
                    className="px-12 py-3 border border-[#0A0A0A] font-heading font-bold text-sm uppercase tracking-wider hover:bg-[#0A0A0A] hover:text-white transition-all duration-150 disabled:opacity-50"
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
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="relative bg-white w-full max-h-[80vh] overflow-y-auto p-6 rounded-t-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-heading font-bold text-lg uppercase">Filters</h3>
              <button onClick={() => setMobileFiltersOpen(false)}><X className="w-5 h-5" /></button>
            </div>

            <div className="mb-6">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider mb-3">Size</h4>
              <div className="flex flex-wrap gap-2">
                {SIZES.map(s => (
                  <button
                    key={s}
                    onClick={() => setFilter('size', size === s ? '' : s)}
                    className={`h-10 px-4 border text-sm font-body font-bold transition-all duration-150 ${
                      size === s ? 'border-[#0A0A0A] bg-[#0A0A0A] text-white' : 'border-[#CCCCCC] text-[#444444]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full h-12 bg-[#000000] text-white font-heading font-bold text-sm uppercase tracking-wider"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      <Footer />

      {/* Keyframe for card stagger */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
