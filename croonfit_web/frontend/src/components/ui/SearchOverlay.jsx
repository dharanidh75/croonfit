import React, { useState, useEffect, useRef } from 'react'
import { X, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store'

export function SearchOverlay() {
  const { isSearchOpen, closeSearch } = useStore()
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100)
    }
  }, [isSearchOpen])

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeSearch()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [closeSearch])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`)
      closeSearch()
      setQuery('')
    }
  }

  if (!isSearchOpen) return null

  return (
    <>
      <div 
        className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm animate-in fade-in"
        onClick={closeSearch}
      />
      <div className="fixed top-0 left-0 w-full z-[100] bg-white shadow-2xl flex flex-col items-center pt-24 pb-12 px-6 animate-in slide-in-from-top-12 duration-300">
        <button 
          onClick={closeSearch}
          className="absolute top-6 right-6 p-2 text-black hover:text-gray-500 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="w-full max-w-3xl">
          <form onSubmit={handleSubmit} className="relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-transparent border-b-2 border-black text-2xl md:text-4xl font-bold uppercase tracking-tight pb-4 outline-none placeholder:text-gray-400 text-black"
            />
            <button 
              type="submit"
              className="absolute right-0 bottom-4 text-black hover:text-gray-500 transition-colors"
            >
              <Search className="w-6 h-6 md:w-8 md:h-8" />
            </button>
          </form>
          <div className="mt-8 flex flex-wrap gap-4 text-sm text-gray-500 font-medium">
            <span>POPULAR:</span>
            <button onClick={() => { navigate('/products?search=hoodie'); closeSearch() }} className="hover:text-black uppercase tracking-wider transition-colors">Hoodies</button>
            <button onClick={() => { navigate('/products?search=jogger'); closeSearch() }} className="hover:text-black uppercase tracking-wider transition-colors">Joggers</button>
            <button onClick={() => { navigate('/category/mens'); closeSearch() }} className="hover:text-black uppercase tracking-wider transition-colors">Men's New</button>
          </div>
        </div>
      </div>
    </>
  )
}
