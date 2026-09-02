import React, { useEffect, useState } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { DataTable } from '../../components/admin/ui/DataTable'
import { adminApi } from '../../lib/api'
import { Search, Filter, Download, X } from 'lucide-react'
import { ImageWithFallback } from '../../components/ui/ImageWithFallback'

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
  
  const [selectedOrder, setSelectedOrder] = useState(null)

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
      const searchStr = `${order.id} ${order.shipping_address?.full_name} ${order.user_id}`.toLowerCase()
      matchesSearch = searchStr.includes(q)
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
      header: 'Order ID',
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
      accessorKey: 'customer',
      cell: row => {
        const name = row.shipping_address?.full_name || `User #${row.user_id}`
        return (
          <div>
            <p className="font-bold text-[#111111]">{name}</p>
            {row.shipping_address?.phone && <p className="text-xs text-[#888888]">{row.shipping_address.phone}</p>}
          </div>
        )
      }
    },
    {
      header: 'Total Amount',
      accessorKey: 'total',
      align: 'right',
      cell: row => <span className="font-medium">₹{(row.total || 0).toFixed(2)}</span>
    },
    {
      header: 'Payment Status',
      accessorKey: 'payment_status',
      cell: row => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest ${
          row.payment_status === 'PAID' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {row.payment_status || 'UNPAID'}
        </span>
      )
    },
    {
      header: 'Status',
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
            placeholder="Search orders by ID, Customer Name, or Email..."
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
                <label className="block text-xs font-bold text-[#888888] uppercase tracking-wider mb-2">Order Status</label>
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
        <DataTable 
          columns={columns} 
          data={filteredOrders} 
          emptyMessage="No orders found matching your criteria."
          onRowClick={setSelectedOrder}
        />
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-fade-in-up">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5]">
              <div>
                <h3 className="text-lg font-bold text-[#111111]">Order #{selectedOrder.id}</h3>
                <p className="text-xs text-[#666666]">{new Date(selectedOrder.created_at).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 text-[#888888] hover:text-[#111111] transition-colors rounded-full hover:bg-[#F5F5F5]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Customer Details */}
                <div>
                  <h4 className="text-xs font-bold text-[#888888] uppercase tracking-widest mb-3">Customer Details</h4>
                  <div className="bg-[#F9F9F9] rounded-xl p-4 border border-[#E5E5E5] space-y-2">
                    <p className="text-sm font-bold text-[#111111]">{selectedOrder.shipping_address?.full_name || `User #${selectedOrder.user_id}`}</p>
                    {selectedOrder.shipping_address?.phone && <p className="text-sm text-[#666666]">{selectedOrder.shipping_address.phone}</p>}
                  </div>
                </div>

                {/* Shipping Details */}
                <div>
                  <h4 className="text-xs font-bold text-[#888888] uppercase tracking-widest mb-3">Shipping Address</h4>
                  <div className="bg-[#F9F9F9] rounded-xl p-4 border border-[#E5E5E5]">
                    {selectedOrder.shipping_address ? (
                      <div className="text-sm text-[#666666] leading-relaxed">
                        <p>{selectedOrder.shipping_address.line1}</p>
                        {selectedOrder.shipping_address.line2 && <p>{selectedOrder.shipping_address.line2}</p>}
                        <p>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.pin}</p>
                        <p>{selectedOrder.shipping_address.country}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-[#666666] leading-relaxed">No shipping address provided.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="text-xs font-bold text-[#888888] uppercase tracking-widest mb-3">Order Items</h4>
                <div className="border border-[#E5E5E5] rounded-xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-[#F9F9F9] border-b border-[#E5E5E5]">
                      <tr>
                        <th className="py-2 px-4 text-[10px] font-bold text-[#888888] uppercase tracking-widest">Product</th>
                        <th className="py-2 px-4 text-[10px] font-bold text-[#888888] uppercase tracking-widest text-right">Qty</th>
                        <th className="py-2 px-4 text-[10px] font-bold text-[#888888] uppercase tracking-widest text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E5E5]">
                      {selectedOrder.items?.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-md bg-[#F0F0F0] overflow-hidden flex-shrink-0 border border-[#E5E5E5]">
                                {item.image_url ? (
                                  <img src={item.image_url} alt={item.product_name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-[#CCCCCC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-[#111111]">{item.product_name}</p>
                                {(item.color || item.size) && (
                                  <p className="text-xs text-[#888888] mt-0.5">{item.color} {item.color && item.size ? '/' : ''} {item.size}</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-right font-medium">{item.quantity}</td>
                          <td className="py-3 px-4 text-sm text-right font-medium">₹{item.price || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary */}
              <div className="flex justify-end">
                <div className="w-full md:w-1/2 space-y-2">
                  <div className="flex justify-between text-sm text-[#666666]">
                    <span>Subtotal</span>
                    <span>₹{(selectedOrder.subtotal || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#666666]">
                    <span>Shipping</span>
                    <span>{selectedOrder.shipping_cost === 0 ? 'Free' : `₹${selectedOrder.shipping_cost.toFixed(2)}`}</span>
                  </div>
                  <div className="border-t border-[#E5E5E5] pt-2 mt-2 flex justify-between font-bold text-[#111111]">
                    <span>Total</span>
                    <span>₹{(selectedOrder.total || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

            </div>

            <div className="px-6 py-4 border-t border-[#E5E5E5] flex justify-end">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-[#111111] text-white text-sm font-bold uppercase tracking-widest rounded-lg hover:bg-black transition-colors"
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
