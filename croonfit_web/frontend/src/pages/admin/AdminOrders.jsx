import React, { useEffect, useState } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { DataTable } from '../../components/admin/DataTable'
import { StatusPill } from '../../components/admin/StatusPill'
import { adminApi } from '../../lib/api'
import toast from 'react-hot-toast'

export function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')

  const fetchOrders = (p = page, s = statusFilter) => {
    setLoading(true)
    adminApi.get(`/admin/orders?page=${p}&per_page=20${s ? `&status=${s}` : ''}`)
      .then(res => {
        setOrders(res.data)
        setPage(p)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchOrders()
    // eslint-disable-next-line
  }, [])

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminApi.patch(`/admin/orders/${orderId}/status`, { status: newStatus, note: "Updated by admin" })
      toast.success("Order status updated")
      // Update local state without refetching all
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
    } catch (err) {
      toast.error("Failed to update status")
    }
  }

  const columns = [
    { header: 'Order ID', render: (row) => <span className="font-bold">#{row.id}</span> },
    { header: 'Date', render: (row) => new Date(row.created_at).toLocaleString() },
    { header: 'Items', render: (row) => row.items.length },
    { header: 'Total', render: (row) => `₹${row.total.toFixed(2)}` },
    { header: 'Status', render: (row) => <StatusPill status={row.status} /> },
    { header: 'Action', render: (row) => (
      <select 
        value={row.status}
        onChange={(e) => handleStatusChange(row.id, e.target.value)}
        className="border border-border bg-surface text-xs font-heading font-bold uppercase p-1 outline-none focus:border-accent"
        onClick={e => e.stopPropagation()} // Prevent row click if we had one
      >
        <option value="PENDING">PENDING</option>
        <option value="PLACED">PLACED</option>
        <option value="SHIPPED">SHIPPED</option>
        <option value="DELIVERED">DELIVERED</option>
        <option value="CANCELLED">CANCELLED</option>
      </select>
    ) },
  ]

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="font-heading font-black text-2xl uppercase tracking-wider">Orders</h1>
          
          <select 
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              fetchOrders(1, e.target.value)
            }}
            className="input-field py-2 w-full md:w-48"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PLACED">Placed</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <DataTable 
          columns={columns} 
          data={orders} 
          loading={loading}
          pagination={{
            page,
            perPage: 20,
            total: orders.length >= 20 ? (page * 20) + 1 : (page - 1) * 20 + orders.length, // Simplified total since we didn't add it to API response wrapper for orders
            hasMore: orders.length === 20,
            onPageChange: (p) => fetchOrders(p, statusFilter)
          }}
        />
      </div>
    </AdminLayout>
  )
}
