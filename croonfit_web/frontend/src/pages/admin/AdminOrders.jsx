import React, { useEffect, useState } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { DataTable } from '../../components/admin/ui/DataTable'
import { adminApi } from '../../lib/api'
import { Search, Filter, Download } from 'lucide-react'

export function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

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
          <button className="px-3 py-1.5 text-sm font-medium bg-[#111111] text-white rounded-md whitespace-nowrap">All Orders</button>
          <button className="px-3 py-1.5 text-sm font-medium text-[#666666] hover:bg-[#F5F5F5] rounded-md whitespace-nowrap">Unfulfilled</button>
          <button className="px-3 py-1.5 text-sm font-medium text-[#666666] hover:bg-[#F5F5F5] rounded-md whitespace-nowrap">Unpaid</button>
          <button className="px-3 py-1.5 text-sm font-medium text-[#666666] hover:bg-[#F5F5F5] rounded-md whitespace-nowrap">Returns</button>
        </div>
        <div className="relative flex-1 min-w-[200px] mx-2">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" />
          <input
            type="text"
            placeholder="Search orders..."
            className="w-full h-9 pl-9 pr-4 bg-transparent outline-none text-sm placeholder:text-[#888888] text-[#111111]"
          />
        </div>
        <button className="h-9 px-3 text-sm font-medium text-[#666666] hover:text-[#111111] flex items-center justify-center gap-2 border sm:border-none border-[#E5E5E5] rounded-md">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-[#888888] text-sm font-medium">Loading orders...</div>
      ) : (
        <DataTable columns={columns} data={orders} emptyMessage="No orders found." />
      )}
    </AdminLayout>
  )
}
