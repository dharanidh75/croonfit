import React, { useState } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { DataTable } from '../../components/admin/ui/DataTable'
import { Plus, Search, Filter } from 'lucide-react'

export function AdminDiscounts() {
  const [discounts] = useState([
    { code: 'SUMMER2026', type: 'Percentage', value: '20%', usage: 145, status: 'Active', end_date: '2026-08-31' },
    { code: 'WELCOME10', type: 'Percentage', value: '10%', usage: 1024, status: 'Active', end_date: 'No Expiry' },
    { code: 'FREESHIP', type: 'Free Shipping', value: 'Shipping', usage: 45, status: 'Scheduled', end_date: '2026-12-31' },
    { code: 'FLASH50', type: 'Fixed Amount', value: '₹500', usage: 200, status: 'Expired', end_date: '2026-05-01' },
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [advancedFilters, setAdvancedFilters] = useState({ status: 'all' })
  const [showCreateModal, setShowCreateModal] = useState(false)

  const filteredDiscounts = discounts.filter(d => {
    let matchesSearch = true
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      matchesSearch = d.code.toLowerCase().includes(q)
    }

    let matchesStatus = true
    if (advancedFilters.status !== 'all') {
      matchesStatus = d.status.toLowerCase() === advancedFilters.status.toLowerCase()
    }

    return matchesSearch && matchesStatus
  })

  const columns = [
    { 
      header: 'Discount Code', 
      accessorKey: 'code', 
      cell: row => <span className="font-bold font-mono tracking-widest text-[#111111]">{row.code}</span> 
    },
    { 
      header: 'Type / Value', 
      accessorKey: 'value', 
      cell: row => (
        <div>
          <p className="font-medium text-[#111111]">{row.value}</p>
          <p className="text-xs text-[#666666]">{row.type}</p>
        </div>
      )
    },
    { 
      header: 'Status', 
      accessorKey: 'status', 
      cell: row => {
        const colors = {
          'Active': 'bg-green-50 text-green-700',
          'Scheduled': 'bg-blue-50 text-blue-700',
          'Expired': 'bg-gray-100 text-gray-600',
        }
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest ${colors[row.status]}`}>
            {row.status}
          </span>
        )
      }
    },
    { 
      header: 'Usage', 
      accessorKey: 'usage', 
      align: 'right',
      cell: row => <span className="text-[#111111]">{row.usage} times</span> 
    },
    { header: 'End Date', accessorKey: 'end_date', cell: row => <span className="text-[#666666]">{row.end_date}</span> }
  ]

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">Discounts</h1>
          <p className="text-sm text-[#666666] mt-1">Manage promotional codes and automatic discounts.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="h-9 px-4 bg-[#111111] text-white rounded-lg text-sm font-medium hover:bg-[#333333] transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create Discount
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#E5E5E5] rounded-xl mb-6 p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" />
          <input 
            type="text" 
            placeholder="Search discounts..." 
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
                  <option value="active">Active</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="expired">Expired</option>
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

      <DataTable columns={columns} data={filteredDiscounts} emptyMessage="No discounts found." />

      {/* Create Discount Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E5E5E5]">
              <h3 className="text-lg font-bold text-[#111111]">Create Discount</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#111111] mb-1">Discount Code *</label>
                  <input type="text" placeholder="e.g. SUMMER2026" className="w-full h-10 px-3 border border-[#E5E5E5] rounded-lg text-sm outline-none focus:border-[#111111]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#111111] mb-1">Type</label>
                    <select className="w-full h-10 px-3 border border-[#E5E5E5] rounded-lg text-sm outline-none focus:border-[#111111]">
                      <option>Percentage</option>
                      <option>Fixed Amount</option>
                      <option>Free Shipping</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#111111] mb-1">Value</label>
                    <input type="text" placeholder="e.g. 20" className="w-full h-10 px-3 border border-[#E5E5E5] rounded-lg text-sm outline-none focus:border-[#111111]" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-[#666666] hover:text-[#111111]"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    alert("Discount created successfully!")
                    setShowCreateModal(false)
                  }}
                  className="px-5 py-2 bg-[#111111] text-white text-sm font-medium rounded-lg hover:bg-black"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
