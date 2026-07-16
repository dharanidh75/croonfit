import React, { useState, useEffect } from 'react'
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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    try {
      await adminApi.delete(`/admin/products/${id}`)
      fetchProducts() // Refresh table
    } catch (err) {
      console.error('Failed to delete product', err)
      alert('Failed to delete product')
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
      align: 'right',
      cell: row => <span className="font-medium">₹{row.price}</span>
    },
    {
      header: 'Stock',
      accessorKey: 'stock',
      align: 'right',
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
      cell: (row) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest ${row.is_active ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'}`}>
          {row.is_active ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: (row) => (
        <button
          onClick={() => handleDelete(row.id)}
          className="text-red-600 hover:text-red-800 text-xs font-bold uppercase tracking-widest"
        >
          Delete
        </button>
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
            className="w-full h-9 pl-9 pr-4 bg-transparent outline-none text-sm placeholder:text-[#888888] text-[#111111]"
          />
        </div>
        <div className="w-px h-6 bg-[#E5E5E5] mx-1"></div>
        <button className="h-9 px-3 text-sm font-medium text-[#666666] hover:text-[#111111] flex items-center gap-2">
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-[#888888] text-sm font-medium">Loading products...</div>
      ) : (
        <DataTable columns={columns} data={products} emptyMessage="No products found. Create one!" />
      )}
    </AdminLayout>
  )
}
