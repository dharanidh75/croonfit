import React, { useState } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { DataTable } from '../../components/admin/ui/DataTable'
import { Search, Filter, AlertCircle, ArrowUpRight } from 'lucide-react'

export function AdminInventory() {
  const [inventory, setInventory] = useState([
    { id: 'SKU-TEE-01-M', product: 'Oversized Heavyweight Tee', variant: 'Black / M', stock: 145, incoming: 0, status: 'In Stock' },
    { id: 'SKU-TEE-01-L', product: 'Oversized Heavyweight Tee', variant: 'Black / L', stock: 12, incoming: 50, status: 'Low Stock' },
    { id: 'SKU-HOD-02-S', product: 'Essential Zip Hoodie', variant: 'Heather Grey / S', stock: 0, incoming: 100, status: 'Out of Stock' },
    { id: 'SKU-HOD-02-M', product: 'Essential Zip Hoodie', variant: 'Heather Grey / M', stock: 45, incoming: 0, status: 'In Stock' },
    { id: 'SKU-ACC-05-OS', product: 'Signature Dad Cap', variant: 'Navy / OS', stock: 5, incoming: 0, status: 'Low Stock' },
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [advancedFilters, setAdvancedFilters] = useState({ status: 'all' })
  
  const [showAdjustModal, setShowAdjustModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [adjustAmount, setAdjustAmount] = useState('')

  const filteredInventory = inventory.filter(item => {
    let matchesSearch = true
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      matchesSearch = item.product.toLowerCase().includes(q) || item.id.toLowerCase().includes(q)
    }

    let matchesStatus = true
    if (advancedFilters.status !== 'all') {
      const statusValue = item.status.toLowerCase().replace(/\s+/g, '-')
      matchesStatus = statusValue === advancedFilters.status
    }

    return matchesSearch && matchesStatus
  })

  const handleAdjustSubmit = () => {
    if (!adjustAmount || isNaN(adjustAmount)) return
    
    setInventory(prev => prev.map(item => {
      if (item.id === selectedItem.id) {
        const newStock = Math.max(0, item.stock + parseInt(adjustAmount))
        return {
          ...item,
          stock: newStock,
          status: newStock === 0 ? 'Out of Stock' : newStock < 20 ? 'Low Stock' : 'In Stock'
        }
      }
      return item
    }))
    
    setShowAdjustModal(false)
    setSelectedItem(null)
    setAdjustAmount('')
  }

  const columns = [
    { 
      header: 'Product / Variant', 
      accessorKey: 'product', 
      cell: row => (
        <div>
          <p className="font-bold text-[#111111]">{row.product}</p>
          <p className="text-xs text-[#666666]">{row.variant}</p>
        </div>
      )
    },
    { header: 'SKU', accessorKey: 'id', cell: row => <span className="font-mono text-xs text-[#888888]">{row.id}</span> },
    { 
      header: 'Status', 
      accessorKey: 'status', 
      cell: row => {
        const colors = {
          'In Stock': 'bg-green-50 text-green-700',
          'Low Stock': 'bg-yellow-50 text-yellow-700',
          'Out of Stock': 'bg-red-50 text-red-700',
        }
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest ${colors[row.status]}`}>
            {row.status}
          </span>
        )
      }
    },
    { 
      header: 'Available', 
      accessorKey: 'stock', 
      align: 'right',
      cell: row => <span className={`font-bold ${row.stock < 20 ? 'text-red-600' : 'text-[#111111]'}`}>{row.stock}</span> 
    },
    { 
      header: 'Incoming', 
      accessorKey: 'incoming', 
      align: 'right',
      cell: row => <span className="text-[#666666]">{row.incoming > 0 ? `+${row.incoming}` : '-'}</span> 
    },
    { 
      header: 'Action', 
      accessorKey: 'action', 
      align: 'right',
      cell: (row) => (
        <button 
          onClick={() => {
            setSelectedItem(row)
            setShowAdjustModal(true)
          }}
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          Adjust
        </button>
      )
    }
  ]

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">Inventory</h1>
          <p className="text-sm text-[#666666] mt-1">Track and adjust stock levels across variants.</p>
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
            placeholder="Scan or search SKU, product..." 
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

      <DataTable columns={columns} data={filteredInventory} emptyMessage="No variants found." />

      {/* Adjust Stock Modal */}
      {showAdjustModal && selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E5E5E5]">
              <h3 className="text-lg font-bold text-[#111111]">Adjust Stock</h3>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <p className="font-bold text-[#111111] text-lg">{selectedItem.product}</p>
                <p className="text-[#666666] text-sm mt-1">{selectedItem.variant} &middot; <span className="font-mono">{selectedItem.id}</span></p>
              </div>
              
              <div className="bg-[#F9F9F9] rounded-lg p-4 mb-6 flex justify-between items-center border border-[#E5E5E5]">
                <span className="text-sm font-medium text-[#666666]">Current Stock</span>
                <span className="text-xl font-bold text-[#111111]">{selectedItem.stock}</span>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-2">Adjustment (use negative to decrease)</label>
                <input 
                  type="number" 
                  value={adjustAmount}
                  onChange={e => setAdjustAmount(e.target.value)}
                  placeholder="e.g. 50 or -10"
                  className="w-full h-10 px-3 border border-[#E5E5E5] rounded-lg text-sm outline-none focus:border-[#111111]" 
                />
              </div>
              
              <div className="flex justify-end gap-3 mt-8">
                <button 
                  onClick={() => setShowAdjustModal(false)}
                  className="px-4 py-2 text-sm font-medium text-[#666666] hover:text-[#111111]"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAdjustSubmit}
                  disabled={!adjustAmount}
                  className="px-5 py-2 bg-[#111111] text-white text-sm font-medium rounded-lg hover:bg-black disabled:opacity-50"
                >
                  Save Adjustment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
