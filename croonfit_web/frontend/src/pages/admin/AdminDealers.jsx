import React, { useState } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { DataTable } from '../../components/admin/ui/DataTable'
import { Search, Filter, Plus } from 'lucide-react'

export function AdminDealers() {
  const [dealers, setDealers] = useState([
    { id: 'W001', company: 'Urban Thread Co.', contact: 'Michael Chang', email: 'mike@urbanthread.com', status: 'Approved', total_orders: 45, ytd_spend: 1250000 },
    { id: 'W002', company: 'FitStyle Retailers', contact: 'Sarah Jenkins', email: 'sarah@fitstyle.com', status: 'Pending', total_orders: 0, ytd_spend: 0 },
    { id: 'W003', company: 'Core Athletics', contact: 'David Rossi', email: 'd.rossi@coreathletics.it', status: 'Approved', total_orders: 112, ytd_spend: 4500000 },
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [advancedFilters, setAdvancedFilters] = useState({ status: 'all' })
  const [showAddPartner, setShowAddPartner] = useState(false)

  const filteredDealers = dealers.filter(d => {
    let matchesSearch = true
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      matchesSearch = d.company.toLowerCase().includes(q) || d.id.toLowerCase().includes(q) || d.email.toLowerCase().includes(q)
    }

    let matchesStatus = true
    if (advancedFilters.status !== 'all') {
      matchesStatus = d.status.toLowerCase() === advancedFilters.status.toLowerCase()
    }

    return matchesSearch && matchesStatus
  })

  const columns = [
    { 
      header: 'Company / Partner', 
      accessorKey: 'company', 
      cell: row => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-[#111111] flex items-center justify-center text-white font-bold text-sm">
            {row.company.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-[#111111]">{row.company}</p>
            <p className="text-xs text-[#666666]">{row.id} &middot; {row.contact}</p>
          </div>
        </div>
      )
    },
    { header: 'Email', accessorKey: 'email', cell: row => <span className="text-[#666666]">{row.email}</span> },
    { 
      header: 'YTD Spend', 
      accessorKey: 'ytd_spend', 
      align: 'right',
      cell: row => <span className="font-medium text-[#111111]">₹{row.ytd_spend.toLocaleString()}</span> 
    },
    { 
      header: 'Status', 
      accessorKey: 'status', 
      cell: row => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest ${
          row.status === 'Approved' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
        }`}>
          {row.status}
        </span>
      )
    }
  ]

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">Wholesale Partners</h1>
          <p className="text-sm text-[#666666] mt-1">Manage B2B dealers, review applications, and set tiers.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button 
            onClick={() => setShowAddPartner(true)}
            className="h-9 px-4 bg-[#111111] text-white rounded-lg text-sm font-medium hover:bg-[#333333] transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Partner
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#E5E5E5] rounded-xl mb-6 p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" />
          <input 
            type="text" 
            placeholder="Search by company or ID..." 
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
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
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

      <DataTable columns={columns} data={filteredDealers} emptyMessage="No partners found." />

      {/* Add Partner Modal */}
      {showAddPartner && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E5E5E5]">
              <h3 className="text-lg font-bold text-[#111111]">Add New Partner</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#111111] mb-1">Company Name *</label>
                  <input type="text" className="w-full h-10 px-3 border border-[#E5E5E5] rounded-lg text-sm outline-none focus:border-[#111111]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#111111] mb-1">Contact Person *</label>
                  <input type="text" className="w-full h-10 px-3 border border-[#E5E5E5] rounded-lg text-sm outline-none focus:border-[#111111]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#111111] mb-1">Email *</label>
                  <input type="email" className="w-full h-10 px-3 border border-[#E5E5E5] rounded-lg text-sm outline-none focus:border-[#111111]" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button 
                  onClick={() => setShowAddPartner(false)}
                  className="px-4 py-2 text-sm font-medium text-[#666666] hover:text-[#111111]"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    alert("Partner created successfully!")
                    setShowAddPartner(false)
                  }}
                  className="px-5 py-2 bg-[#111111] text-white text-sm font-medium rounded-lg hover:bg-black"
                >
                  Add Partner
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
