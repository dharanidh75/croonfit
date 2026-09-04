import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { ImageWithFallback } from '../../components/ui/ImageWithFallback'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { DataTable } from '../../components/admin/ui/DataTable'
import { Link } from 'react-router-dom'
import { adminApi } from '../../lib/api'
import { Plus, Search, Filter } from 'lucide-react'

export function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = () => {
    adminApi.get('/admin/products')
      .then(res => {
        setProducts(res.data.items)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }

  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [advancedFilters, setAdvancedFilters] = useState({ status: 'all', stock: 'all' })
  const [productToDelete, setProductToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filteredProducts = products.filter(p => {
    let matchesSearch = true
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      matchesSearch = p.name.toLowerCase().includes(q) || (p.sku && p.sku.toLowerCase().includes(q))
    }
    
    let matchesAdvanced = true
    if (advancedFilters.status !== 'all') {
      const wantActive = advancedFilters.status === 'active'
      if (p.is_active !== wantActive) matchesAdvanced = false
    }
    if (advancedFilters.stock !== 'all') {
      const inStock = p.stock > 0
      if (advancedFilters.stock === 'in_stock' && !inStock) matchesAdvanced = false
      if (advancedFilters.stock === 'out_of_stock' && inStock) matchesAdvanced = false
    }
    
    return matchesSearch && matchesAdvanced
  })

  const handleDelete = async () => {
    if (!productToDelete) return
    setIsDeleting(true)
    try {
      await adminApi.delete(`/admin/products/${productToDelete}`)
      toast.success('Product deleted')
      setProductToDelete(null)
      fetchProducts() // Refresh table
    } catch (err) {
      console.error('Failed to delete product', err)
      toast.error('Failed to delete product')
      setProductToDelete(null)
    } finally {
      setIsDeleting(false)
    }
  }

  const columns = [
    {
      header: 'Product',
      accessorKey: 'name',
      cell: row => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-[#F5F5F5] overflow-hidden flex-shrink-0">
            {row.primary_image ? <ImageWithFallback src={row.primary_image} className="w-full h-full object-cover" alt="" /> : null}
          </div>
          <div>
            <p className="font-bold text-[#111111]">{row.name}</p>
            <p className="text-xs text-[#888888]">{row.sku || 'No SKU'}</p>
          </div>
        </div>
      )
    },
    { header: 'Category', accessorKey: 'category_name' },
    {
      header: 'Price',
      accessorKey: 'price',
      align: 'center',
      cell: row => <span className="font-medium">₹{row.price}</span>
    },
    {
      header: 'Stock',
      accessorKey: 'stock',
      align: 'center',
      cell: row => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${row.stock > 10 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
          {row.stock} in stock
        </span>
      )
    },
    {
      header: 'Status',
      accessorKey: 'is_active',
      align: 'center',
      cell: (row) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest ${row.is_active ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'}`}>
          {row.is_active ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      align: 'center',
      cell: (row) => (
        <div className="flex items-center justify-center gap-2">
          <Link
            to={`/admin/products/${row.id}`}
            className="px-3 py-1.5 bg-white border border-[#E5E5E5] text-[#111111] hover:bg-[#F9F9F9] rounded-md text-[10px] font-bold uppercase tracking-widest transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={() => setProductToDelete(row.id)}
            className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md text-[10px] font-bold uppercase tracking-widest transition-colors"
          >
            Delete
          </button>
        </div>
      )
    }
  ]

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">Products</h1>
          <p className="text-sm text-[#666666] mt-1">Manage your catalogue, pricing, and stock.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Link to="/admin/products/categories" className="h-9 px-4 bg-white border border-[#E5E5E5] text-[#111111] rounded-lg text-sm font-medium hover:bg-[#F9F9F9] transition-colors flex items-center justify-center">
            Categories
          </Link>
          <Link to="/admin/products/new" className="h-9 px-4 bg-[#111111] text-white rounded-lg text-sm font-medium hover:bg-[#333333] transition-colors flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        </div>
      </div>

      <div className="bg-white border border-[#E5E5E5] rounded-xl mb-6 p-2 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" />
          <input
            type="text"
            placeholder="Search products by name, SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 bg-transparent outline-none text-sm placeholder:text-[#888888] text-[#111111]"
          />
        </div>
        <div className="w-px h-6 bg-[#E5E5E5] mx-1"></div>
        <div className="relative">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="h-9 px-3 text-sm font-medium text-[#666666] hover:text-[#111111] flex items-center gap-2"
          >
            <Filter className="w-4 h-4" /> Filters
          </button>
          
          {showFilters && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#E5E5E5] rounded-xl shadow-lg z-50 p-4">
              <div className="mb-4">
                <label className="block text-xs font-bold text-[#888888] uppercase tracking-wider mb-2">Status</label>
                <select 
                  value={advancedFilters.status}
                  onChange={(e) => setAdvancedFilters({...advancedFilters, status: e.target.value})}
                  className="w-full h-9 px-3 bg-[#F9F9F9] border border-[#E5E5E5] rounded-lg text-sm outline-none"
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-bold text-[#888888] uppercase tracking-wider mb-2">Stock</label>
                <select 
                  value={advancedFilters.stock}
                  onChange={(e) => setAdvancedFilters({...advancedFilters, stock: e.target.value})}
                  className="w-full h-9 px-3 bg-[#F9F9F9] border border-[#E5E5E5] rounded-lg text-sm outline-none"
                >
                  <option value="all">All</option>
                  <option value="in_stock">In Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button 
                  onClick={() => {
                    setAdvancedFilters({ status: 'all', stock: 'all' })
                    setSearchQuery('')
                    setShowFilters(false)
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-[#666666] hover:text-[#111111]"
                >
                  Clear All
                </button>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="px-4 py-1.5 bg-[#111111] text-white text-xs font-medium rounded-md hover:bg-black"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-[#888888] text-sm font-medium">Loading products...</div>
      ) : (
        <DataTable columns={columns} data={filteredProducts} emptyMessage="No products found. Create one!" />
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-black tracking-tight text-[#111111] mb-2 uppercase">Delete Product?</h3>
            <p className="text-sm text-[#666666] mb-6 leading-relaxed">
              Are you completely sure you want to delete this product? This action is permanent and cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setProductToDelete(null)} 
                className="px-4 py-2.5 text-sm font-bold text-[#666666] hover:text-[#111111] uppercase tracking-wider"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete} 
                disabled={isDeleting}
                className="px-5 py-2.5 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 uppercase tracking-wider shadow-sm flex items-center justify-center min-w-[100px] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
