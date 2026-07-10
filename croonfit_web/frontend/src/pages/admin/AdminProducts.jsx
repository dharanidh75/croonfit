import React, { useEffect, useState } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { DataTable } from '../../components/admin/DataTable'
import { adminApi } from '../../lib/api'
import { Search } from 'lucide-react'

export function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, hasMore: false })
  const perPage = 20

  const fetchProducts = (p = page, q = search) => {
    setLoading(true)
    adminApi.get(`/admin/products?page=${p}&per_page=${perPage}&search=${encodeURIComponent(q)}`)
      .then(res => {
        setProducts(res.data.items)
        setPagination({ total: res.data.total, hasMore: res.data.has_more })
        setPage(p)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchProducts()
    // eslint-disable-next-line
  }, [])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    fetchProducts(1, search)
  }

  const columns = [
    { header: 'Image', render: (row) => <img src={row.primary_image} alt="" className="w-10 h-12 object-cover bg-surface mix-blend-multiply" /> },
    { header: 'Name', accessor: 'name' },
    { header: 'Category', render: (row) => row.category?.name },
    { header: 'Price', render: (row) => `₹${row.price}` },
    { header: 'Status', render: (row) => row.is_active ? <span className="text-accent">Active</span> : <span className="text-muted line-through">Inactive</span> },
  ]

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="font-heading font-black text-2xl uppercase tracking-wider">Products</h1>
          
          <div className="flex gap-4 w-full md:w-auto">
            <form onSubmit={handleSearchSubmit} className="flex relative w-full md:w-64">
              <input 
                type="text" 
                placeholder="Search products..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-field py-2 pr-10"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text">
                <Search className="w-4 h-4" />
              </button>
            </form>
            <button className="btn-primary px-6 whitespace-nowrap">NEW PRODUCT</button>
          </div>
        </div>

        <DataTable 
          columns={columns} 
          data={products} 
          loading={loading}
          pagination={{
            page,
            perPage,
            total: pagination.total,
            hasMore: pagination.hasMore,
            onPageChange: (p) => fetchProducts(p, search)
          }}
        />
      </div>
    </AdminLayout>
  )
}
