import React, { useState } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { DataTable } from '../../components/admin/ui/DataTable'
import { Search, Filter, Download, X } from 'lucide-react'

export function AdminCustomers() {
  const [customers] = useState([
    { id: '1001', name: 'Emily Chen', email: 'emily.chen@example.com', phone: '+91 9876543210', address: '123 Main St, Apartment 4B, Mumbai, Maharashtra, 400001', orders: 12, spent: 42500, last_active: '2026-07-10T14:30:00Z', joined: '2025-01-15T10:00:00Z', status: 'Active', order_history: [{ id: '1042', date: '2026-07-10', total: 3398, status: 'DELIVERED', items: 2 }, { id: '984', date: '2026-05-12', total: 1499, status: 'DELIVERED', items: 1 }] },
    { id: '1002', name: 'Marcus Johnson', email: 'marcus.j@example.com', phone: '+91 9876543211', address: '45 Park Avenue, Bangalore, Karnataka, 560001', orders: 3, spent: 8500, last_active: '2026-07-05T09:15:00Z', joined: '2026-03-22T11:00:00Z', status: 'Active', order_history: [{ id: '1035', date: '2026-07-05', total: 4250, status: 'SHIPPED', items: 3 }] },
    { id: '1003', name: 'Sarah Williams', email: 'sarah.w@example.com', phone: '+91 9876543212', address: 'No address provided', orders: 0, spent: 0, last_active: '2026-06-20T11:45:00Z', joined: '2026-06-15T09:30:00Z', status: 'Inactive', order_history: [] },
    { id: '1004', name: 'David Lee', email: 'david.lee@example.com', phone: '+91 9876543213', address: '88 Tech Park Rd, Hyderabad, Telangana, 500081', orders: 8, spent: 28900, last_active: '2026-07-11T08:20:00Z', joined: '2025-11-05T14:20:00Z', status: 'Active', order_history: [{ id: '1045', date: '2026-07-11', total: 5500, status: 'PLACED', items: 4 }] },
  ])

  const [selectedCustomer, setSelectedCustomer] = useState(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [advancedFilters, setAdvancedFilters] = useState({ status: 'all' })

  const filteredCustomers = customers.filter(c => {
    let matchesSearch = true
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      matchesSearch = c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    }

    let matchesStatus = true
    if (advancedFilters.status !== 'all') {
      matchesStatus = c.status.toLowerCase() === advancedFilters.status.toLowerCase()
    }

    return matchesSearch && matchesStatus
  })

  const columns = [
    { 
      header: 'Customer', 
      accessorKey: 'name', 
      cell: row => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center text-[#111111] font-bold text-sm">
            {row.name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-[#111111]">{row.name}</p>
            <p className="text-xs text-[#666666]">{row.email}</p>
          </div>
        </div>
      )
    },
    { 
      header: 'Joined', 
      accessorKey: 'joined', 
      cell: row => <span className="text-[#666666]">{new Date(row.joined).toLocaleDateString()}</span> 
    },
    { 
      header: 'Phone', 
      accessorKey: 'phone', 
      cell: row => <span className="text-[#666666]">{row.phone}</span> 
    },
    { 
      header: 'Orders', 
      accessorKey: 'orders', 
      align: 'right',
      cell: row => <span className="font-medium text-[#111111]">{row.orders}</span> 
    },
    { 
      header: 'Total Spend', 
      accessorKey: 'spent', 
      align: 'right',
      cell: row => <span className="font-medium text-[#111111]">₹{row.spent.toLocaleString()}</span> 
    },
    { 
      header: 'Last Order', 
      accessorKey: 'last_active', 
      cell: row => <span className="text-[#666666]">{new Date(row.last_active).toLocaleDateString()}</span> 
    }
  ]

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">Customers</h1>
          <p className="text-sm text-[#666666] mt-1">Manage retail customers and view purchase history.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="h-9 px-4 bg-white border border-[#E5E5E5] text-[#111111] rounded-lg text-sm font-medium hover:bg-[#F9F9F9] transition-colors flex items-center justify-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#E5E5E5] rounded-xl mb-6 p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
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
                  <option value="inactive">Inactive</option>
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

      <DataTable columns={columns} data={filteredCustomers} emptyMessage="No customers found." onRowClick={setSelectedCustomer} />

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-fade-in-up">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#111111] flex items-center justify-center text-white font-bold text-lg">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#111111]">{selectedCustomer.name}</h3>
                  <p className="text-xs text-[#666666]">Customer since {new Date(selectedCustomer.joined).toLocaleDateString()}</p>
                </div>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="p-2 text-[#888888] hover:text-[#111111] transition-colors rounded-full hover:bg-[#F5F5F5]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Contact Details */}
                <div>
                  <h4 className="text-xs font-bold text-[#888888] uppercase tracking-widest mb-3">Contact Details</h4>
                  <div className="bg-[#F9F9F9] rounded-xl p-4 border border-[#E5E5E5] space-y-3">
                    <div>
                      <p className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Email</p>
                      <p className="text-sm font-medium text-[#111111] mt-0.5">{selectedCustomer.email}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Phone</p>
                      <p className="text-sm font-medium text-[#111111] mt-0.5">{selectedCustomer.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Default Address */}
                <div>
                  <h4 className="text-xs font-bold text-[#888888] uppercase tracking-widest mb-3">Default Address</h4>
                  <div className="bg-[#F9F9F9] rounded-xl p-4 border border-[#E5E5E5] h-full">
                    <p className="text-sm text-[#666666] leading-relaxed">
                      {selectedCustomer.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order History Summary */}
              <div>
                <h4 className="text-xs font-bold text-[#888888] uppercase tracking-widest mb-3">Recent Order History</h4>
                
                {selectedCustomer.order_history?.length > 0 ? (
                  <div className="border border-[#E5E5E5] rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-[#F9F9F9] border-b border-[#E5E5E5]">
                        <tr>
                          <th className="py-2 px-4 text-[10px] font-bold text-[#888888] uppercase tracking-widest">Order</th>
                          <th className="py-2 px-4 text-[10px] font-bold text-[#888888] uppercase tracking-widest">Date</th>
                          <th className="py-2 px-4 text-[10px] font-bold text-[#888888] uppercase tracking-widest">Status</th>
                          <th className="py-2 px-4 text-[10px] font-bold text-[#888888] uppercase tracking-widest text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5E5E5]">
                        {selectedCustomer.order_history.map((order, idx) => (
                          <tr key={idx}>
                            <td className="py-3 px-4 text-sm font-medium text-[#111111]">#{order.id}</td>
                            <td className="py-3 px-4 text-sm text-[#666666]">{new Date(order.date).toLocaleDateString()}</td>
                            <td className="py-3 px-4">
                              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                {order.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-right font-medium">₹{order.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-sm text-[#888888] p-4 bg-[#F9F9F9] rounded-xl border border-[#E5E5E5] text-center">
                    This customer has not placed any orders yet.
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-[#E5E5E5] bg-[#F9F9F9] flex justify-end">
              <button 
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2 bg-[#111111] text-white text-sm font-bold rounded-lg hover:bg-black transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
