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
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`)
      closeSearch()
      setQuery('')
    }
  }

  if (!isSearchOpen) return null

  return (
    <div className="fixed inset-0 z-[100] bg-base/95 backdrop-blur-md flex items-start justify-center pt-24 md:pt-32 px-6">
      <button 
        onClick={closeSearch}
        className="absolute top-6 right-6 p-2 text-text hover:text-muted transition-colors duration-[150ms] linear"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="w-full max-w-3xl animate-in fade-in slide-in-from-top-4 duration-[200ms] ease-linear">
        <form onSubmit={handleSubmit} className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="WHAT ARE YOU LOOKING FOR?"
            className="w-full bg-transparent border-b-2 border-text text-3xl md:text-5xl font-heading font-black uppercase tracking-tighter pb-4 outline-none placeholder:text-gray-mid text-text"
          />
          <button 
            type="submit"
            className="absolute right-0 bottom-4 text-text hover:text-muted transition-colors duration-[150ms] linear"
          >
            <Search className="w-8 h-8 md:w-10 md:h-10" />
          </button>
        </form>
        <div className="mt-8 flex flex-wrap gap-4 font-body text-sm text-muted">
          <span>POPULAR:</span>
          <button onClick={() => { navigate('/shop?search=hoodie'); closeSearch() }} className="hover:text-text uppercase tracking-wider transition-colors duration-[150ms] linear">Hoodies</button>
          <button onClick={() => { navigate('/shop?search=jogger'); closeSearch() }} className="hover:text-text uppercase tracking-wider transition-colors duration-[150ms] linear">Joggers</button>
          <button onClick={() => { navigate('/shop?category=mens'); closeSearch() }} className="hover:text-text uppercase tracking-wider transition-colors duration-[150ms] linear">Men's New</button>
        </div>
      </div>
    </div>
  )
}
