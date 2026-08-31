import React, { useState } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { Search, Filter, AlertCircle, ChevronRight, ChevronDown } from 'lucide-react'

export function AdminInventory() {
  const [products] = useState([])

  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [advancedFilters, setAdvancedFilters] = useState({ status: 'all' })
  const [expandedRows, setExpandedRows] = useState(new Set())

  const toggleRow = (id) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  const filteredProducts = products.filter(product => {
    let matchesSearch = true
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      // match product name or any variant SKU
      matchesSearch = product.name.toLowerCase().includes(q) || 
                      product.variants.some(v => v.sku.toLowerCase().includes(q) || v.name.toLowerCase().includes(q))
    }

    let matchesStatus = true
    if (advancedFilters.status !== 'all') {
      const statusValue = product.status.toLowerCase().replace(/\s+/g, '-')
      matchesStatus = statusValue === advancedFilters.status
    }

    return matchesSearch && matchesStatus
  })

  const StatusBadge = ({ status }) => {
    const colors = {
      'In Stock': 'bg-green-50 text-green-700',
      'Low Stock': 'bg-yellow-50 text-yellow-700',
      'Out of Stock': 'bg-red-50 text-red-700',
    }
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${colors[status] || 'bg-gray-100 text-gray-700'}`}>
        {status}
      </span>
    )
  }

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">Inventory</h1>
          <p className="text-sm text-[#666666] mt-1">View current stock levels for all product variants.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#666666]">Total Value</span>
          </div>
          <p className="text-2xl font-bold text-[#111111]">₹4,250,000</p>
        </div>
        <div className="bg-white border border-red-200 rounded-xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-red-50 rounded-bl-full flex items-start justify-end p-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-red-800">Low Stock Variants</span>
          </div>
          <p className="text-2xl font-bold text-red-600">24</p>
        </div>
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#666666]">Incoming</span>
          </div>
          <p className="text-2xl font-bold text-[#111111]">1,450 <span className="text-sm font-normal text-[#888888]">units</span></p>
        </div>
      </div>

      <div className="bg-white border border-[#E5E5E5] rounded-xl mb-6 p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" />
          <input 
            type="text" 
            placeholder="Search products or SKUs..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 bg-transparent outline-none text-sm placeholder:text-[#888888] text-[#111111]"
          />
        </div>
        <div className="w-px h-6 bg-[#E5E5E5] mx-1 hidden sm:block"></div>
        <div className="relative">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="h-9 px-3 text-sm font-medium text-[#666666] hover:text-[#111111] flex items-center justify-center gap-2 border sm:border-none border-[#E5E5E5] rounded-md"
          >
            <Filter className="w-4 h-4" /> Filter
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
                  <option value="in-stock">In Stock</option>
                  <option value="low-stock">Low Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button 
                  onClick={() => {
                    setAdvancedFilters({ status: 'all' })
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

      <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="bg-[#F9F9F9] border-b border-[#E5E5E5]">
              <tr>
                <th className="py-3 px-4 text-xs font-bold text-[#888888] uppercase tracking-wider w-12"></th>
                <th className="py-3 px-4 text-xs font-bold text-[#888888] uppercase tracking-wider min-w-[250px]">Product</th>
                <th className="py-3 px-4 text-xs font-bold text-[#888888] uppercase tracking-wider">Variant</th>
                <th className="py-3 px-4 text-xs font-bold text-[#888888] uppercase tracking-wider">SKU</th>
                <th className="py-3 px-4 text-xs font-bold text-[#888888] uppercase tracking-wider text-right">Total Stock</th>
                <th className="py-3 px-4 text-xs font-bold text-[#888888] uppercase tracking-wider text-right">Available</th>
                <th className="py-3 px-4 text-xs font-bold text-[#888888] uppercase tracking-wider text-right">Sold</th>
                <th className="py-3 px-4 text-xs font-bold text-[#888888] uppercase tracking-wider text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-8 text-center text-sm text-[#888888]">
                    No inventory items found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => (
                  <React.Fragment key={product.id}>
                    {/* Master Product Row */}
                    <tr 
                      className={`transition-colors group cursor-pointer ${expandedRows.has(product.id) ? 'bg-[#FAFAFA]' : 'hover:bg-[#FAFAFA]'}`}
                      onClick={() => toggleRow(product.id)}
                    >
                      <td className="py-3 px-4 text-center">
                        <button className="text-[#888888] group-hover:text-[#111111] transition-colors p-1 rounded hover:bg-[#E5E5E5]">
                          {expandedRows.has(product.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-[#F5F5F5] flex-shrink-0 flex items-center justify-center text-[10px] text-[#888888] border border-[#E5E5E5]">IMG</div>
                          <div>
                            <p className="font-bold text-[#111111] text-sm">{product.name}</p>
                            <p className="text-xs text-[#666666]">{product.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-[#666666]">{product.variants.length} Variants</td>
                      <td className="py-3 px-4 text-sm font-medium text-[#888888]">Multiple</td>
                      <td className="py-3 px-4 text-sm font-bold text-[#111111] text-right">{product.totalStock}</td>
                      <td className="py-3 px-4 text-sm font-bold text-[#111111] text-right">{product.available}</td>
                      <td className="py-3 px-4 text-sm text-[#666666] text-right">{product.sold}</td>
                      <td className="py-3 px-4 text-center">
                        <StatusBadge status={product.status} />
                      </td>
                    </tr>
                    
                    {/* Variant Rows (Expanded) */}
                    {expandedRows.has(product.id) && product.variants.map(variant => (
                      <tr key={variant.id} className="bg-[#FAFAFA] border-t border-dashed border-[#E5E5E5] hover:bg-[#F5F5F5] transition-colors">
                        <td className="py-3 px-4"></td>
                        <td className="py-3 px-4 pl-14">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-[#EEEEEE] flex-shrink-0 flex items-center justify-center text-[8px] text-[#AAAAAA] border border-[#E5E5E5]">VAR</div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm font-bold text-[#111111]">{variant.name}</td>
                        <td className="py-3 px-4 font-mono text-xs text-[#888888]">{variant.sku}</td>
                        <td className="py-3 px-4 text-sm text-[#111111] text-right">{variant.stock}</td>
                        <td className="py-3 px-4 text-sm font-bold text-[#111111] text-right">{variant.available}</td>
                        <td className="py-3 px-4 text-sm text-[#666666] text-right">{variant.sold}</td>
                        <td className="py-3 px-4 text-center">
                          <StatusBadge status={variant.status} />
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
