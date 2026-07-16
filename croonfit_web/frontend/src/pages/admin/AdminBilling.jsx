import React, { useEffect, useState } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { DataTable } from '../../components/admin/DataTable'
import { StatusPill } from '../../components/admin/StatusPill'
import { adminApi } from '../../lib/api'
export function AdminBilling() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  const fetchPayments = (p = page) => {
    setLoading(true)
    adminApi.get(`/admin/billing?page=${p}&per_page=20`)
      .then(res => {
        setPayments(res.data)
        setPage(p)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchPayments()
    // eslint-disable-next-line
  }, [])

  const columns = [
    { header: 'Payment ID', render: (row) => row.gateway_payment_id },
    { header: 'Order ID', render: (row) => <span className="font-bold">#{row.order_id}</span> },
    { header: 'Date', render: (row) => new Date(row.created_at).toLocaleString() },
    { header: 'Amount', render: (row) => `₹${row.amount.toFixed(2)}` },
    { header: 'Method', accessor: 'payment_method' },
    { header: 'Status', render: (row) => <StatusPill type="payment" status={row.status} /> },
  ]

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="font-heading font-black text-2xl uppercase tracking-wider mb-8">Billing Ledger</h1>

        <DataTable
          columns={columns}
          data={payments}
          loading={loading}
          pagination={{
            page,
            perPage: 20,
            total: payments.length >= 20 ? (page * 20) + 1 : (page - 1) * 20 + payments.length,
            hasMore: payments.length === 20,
            onPageChange: (p) => fetchPayments(p)
          }}
        />
      </div>
    </AdminLayout>
  )
}
