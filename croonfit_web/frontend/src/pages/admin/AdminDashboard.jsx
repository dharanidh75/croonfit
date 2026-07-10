import React, { useEffect, useState } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { adminApi } from '../../lib/api'
import { useNavigate } from 'react-router-dom'
import { Package, ShoppingBag, IndianRupee, AlertTriangle } from 'lucide-react'

export function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    adminApi.get('/admin/stats')
      .then(res => setStats(res.data))
      .catch(err => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate('/admin/login')
        }
      })
      .finally(() => setLoading(false))
  }, [navigate])

  if (loading) {
    return <AdminLayout><div className="p-8 text-muted">Loading dashboard...</div></AdminLayout>
  }

  if (!stats) return null

  const statCards = [
    { title: 'Total Revenue', value: `₹${stats.revenue.toFixed(2)}`, icon: IndianRupee },
    { title: 'Total Orders', value: stats.orders.total, icon: ShoppingBag },
    { title: 'Pending Orders', value: stats.orders.pending, icon: Package },
  ]

  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="font-heading font-black text-2xl uppercase tracking-wider mb-8">Dashboard</h1>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {statCards.map((card, i) => {
            const Icon = card.icon
            return (
              <div key={i} className="bg-white border border-border p-6 flex items-center justify-between">
                <div>
                  <p className="font-heading font-bold text-xs uppercase tracking-wider text-muted mb-2">{card.title}</p>
                  <p className="font-body font-bold text-3xl">{card.value}</p>
                </div>
                <div className="bg-surface p-3 text-text">
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            )
          })}
        </div>

        {/* Low Stock Alerts */}
        <div>
          <h2 className="font-heading font-bold text-lg uppercase tracking-wider mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-accent" /> Low Stock Alerts
          </h2>
          {stats.low_stock_variants.length === 0 ? (
            <div className="bg-surface p-6 border border-border text-muted font-body text-sm">
              All items are sufficiently stocked.
            </div>
          ) : (
            <div className="bg-white border border-border overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-border bg-surface text-xs font-heading font-bold uppercase text-muted">
                    <th className="py-3 px-4">SKU</th>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Size/Color</th>
                    <th className="py-3 px-4 text-right">Remaining Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.low_stock_variants.map((v, i) => (
                    <tr key={i} className="border-b border-border font-body text-sm hover:bg-surface transition-colors duration-[150ms] linear">
                      <td className="py-3 px-4 text-muted">{v.sku}</td>
                      <td className="py-3 px-4 font-bold">{v.product}</td>
                      <td className="py-3 px-4">{v.size} / {v.color}</td>
                      <td className="py-3 px-4 text-right font-bold text-accent">{v.qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
