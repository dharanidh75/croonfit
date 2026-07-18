import React, { useEffect, useState } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { DataTable } from '../../components/admin/ui/DataTable'
import { adminApi } from '../../lib/api'
import { Search, Filter, Download } from 'lucide-react'

export function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [advancedFilters, setAdvancedFilters] = useState({
    payment: 'all',
    fulfillment: 'all'
  })

  const fetchOrders = () => {
    setLoading(true)
    adminApi.get(`/admin/orders?page=1&per_page=50`)
      .then(res => setOrders(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const filteredOrders = orders.filter(order => {
    let matchesTab = true
    if (activeTab === 'unfulfilled') {
      matchesTab = ['PENDING', 'PLACED'].includes(order.status)
    } else if (activeTab === 'unpaid') {
      matchesTab = order.payment_status && order.payment_status.toUpperCase() !== 'PAID'
    } else if (activeTab === 'returns') {
      matchesTab = order.status === 'RETURNED'
    }

    let matchesSearch = true
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      matchesSearch = String(order.id).includes(q) || String(order.user_id).includes(q)
    }
    
    let matchesAdvanced = true
    if (advancedFilters.payment !== 'all') {
      const isPaid = order.payment_status && order.payment_status.toUpperCase() === 'PAID'
      if (advancedFilters.payment === 'paid' && !isPaid) matchesAdvanced = false
      if (advancedFilters.payment === 'unpaid' && isPaid) matchesAdvanced = false
    }
    if (advancedFilters.fulfillment !== 'all') {
      if (order.status !== advancedFilters.fulfillment) matchesAdvanced = false
    }

    return matchesTab && matchesSearch && matchesAdvanced
  })

  const columns = [
    {
      header: 'Order',
      accessorKey: 'id',
      cell: row => <span className="font-bold text-[#111111]">#{row.id}</span>
    },
    {
      header: 'Date',
      accessorKey: 'created_at',
      cell: row => <span className="text-[#666666]">{new Date(row.created_at).toLocaleDateString()}</span>
    },
    {
      header: 'Customer',
      accessorKey: 'user_id',
      cell: row => <span className="text-[#111111]">User #{row.user_id}</span>
    },
    {
      header: 'Total',
      accessorKey: 'total',
      align: 'right',
      cell: row => <span className="font-medium">₹{row.total.toFixed(2)}</span>
    },
    {
      header: 'Payment Status',
      accessorKey: 'payment_status',
      cell: () => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest bg-green-50 text-green-700">
          Paid
        </span>
      )
    },
    {
      header: 'Fulfillment',
      accessorKey: 'status',
      cell: row => {
        const colors = {
          PENDING: 'bg-yellow-50 text-yellow-700',
          PLACED: 'bg-blue-50 text-blue-700',
          SHIPPED: 'bg-purple-50 text-purple-700',
          DELIVERED: 'bg-green-50 text-green-700',
          CANCELLED: 'bg-red-50 text-red-700',
        }
        const color = colors[row.status] || 'bg-gray-50 text-gray-700'
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest ${color}`}>
            {row.status}
          </span>
        )
      }
    }
  ]

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">Orders</h1>
          <p className="text-sm text-[#666666] mt-1">Manage retail and wholesale orders.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="h-9 px-4 bg-white border border-[#E5E5E5] text-[#111111] rounded-lg text-sm font-medium hover:bg-[#F9F9F9] transition-colors flex items-center justify-center gap-2">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#E5E5E5] rounded-xl mb-6 p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="flex gap-1 overflow-x-auto p-1 border-b sm:border-b-0 sm:border-r border-[#E5E5E5] hide-scrollbar">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'unfulfilled', label: 'Unfulfilled' },
            { id: 'unpaid', label: 'Unpaid' },
            { id: 'returns', label: 'Returns' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                activeTab === tab.id 
                  ? 'bg-[#111111] text-white' 
                  : 'text-[#666666] hover:bg-[#F5F5F5]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[200px] mx-2">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" />
          <input
            type="text"
            placeholder="Search orders by ID or User ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 bg-transparent outline-none text-sm placeholder:text-[#888888] text-[#111111]"
          />
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="h-9 px-3 text-sm font-medium text-[#666666] hover:text-[#111111] flex items-center justify-center gap-2 border sm:border-none border-[#E5E5E5] rounded-md"
          >
            <Filter className="w-4 h-4" /> Filter
          </button>
          
          {showFilters && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-[#E5E5E5] rounded-xl shadow-lg z-50 p-4">
              <div className="mb-4">
                <label className="block text-xs font-bold text-[#888888] uppercase tracking-wider mb-2">Payment Status</label>
                <select 
                  value={advancedFilters.payment}
                  onChange={(e) => setAdvancedFilters({...advancedFilters, payment: e.target.value})}
                  className="w-full h-9 px-3 bg-[#F9F9F9] border border-[#E5E5E5] rounded-lg text-sm outline-none"
                >
                  <option value="all">All</option>
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-bold text-[#888888] uppercase tracking-wider mb-2">Fulfillment Status</label>
                <select 
                  value={advancedFilters.fulfillment}
                  onChange={(e) => setAdvancedFilters({...advancedFilters, fulfillment: e.target.value})}
                  className="w-full h-9 px-3 bg-[#F9F9F9] border border-[#E5E5E5] rounded-lg text-sm outline-none"
                >
                  <option value="all">All</option>
                  <option value="PENDING">Pending</option>
                  <option value="PLACED">Placed</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button 
                  onClick={() => {
                    setAdvancedFilters({ payment: 'all', fulfillment: 'all' })
                    setActiveTab('all')
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
        <div className="p-8 text-center text-[#888888] text-sm font-medium">Loading orders...</div>
      ) : (
        <DataTable columns={columns} data={filteredOrders} emptyMessage="No orders found matching your criteria." />
      )}
    </AdminLayout>
  )
}
