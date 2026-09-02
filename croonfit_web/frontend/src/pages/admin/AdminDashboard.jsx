import React, { useEffect, useState } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { useNavigate, Link } from 'react-router-dom'
import { adminApi } from '../../lib/api'
import { Package, ShoppingBag, IndianRupee, AlertCircle, ArrowRight, Users } from 'lucide-react'
import { KPICard } from '../../components/admin/ui/KPICard'
import { SimpleChart } from '../../components/admin/ui/SimpleChart'
import { DataTable } from '../../components/admin/ui/DataTable'
import { Card, CardHeader, CardContent } from '../../components/admin/ui/Card'

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
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <span className="w-6 h-6 border-2 border-[#E5E5E5] border-t-[#111111] rounded-full animate-spin"></span>
        </div>
      </AdminLayout>
    )
  }

  if (!stats) return null

  const chartData = stats.revenue_chart || []

  const lowStockCols = [
    { header: 'Product', accessorKey: 'product', cell: (row) => <span className="font-medium">{row.product}</span> },
    { header: 'SKU', accessorKey: 'sku', cell: (row) => <span className="text-[#666666]">{row.sku}</span> },
    { header: 'Variant', accessorKey: 'variant', cell: (row) => `${row.size} / ${row.color}` },
    {
      header: 'Qty', accessorKey: 'qty', align: 'right', cell: (row) => (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
          {row.qty}
        </span>
      )
    }
  ]

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">Dashboard</h1>
          <p className="text-sm text-[#666666] mt-1">Overview of your store's performance.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard
          title="Total Revenue"
          value={`₹${stats.revenue.toFixed(2)}`}
          trend={stats.trends?.revenue >= 0 ? "up" : "down"}
          trendValue={`${Math.abs(stats.trends?.revenue || 0).toFixed(1)}%`}
          icon={IndianRupee}
        />
        <KPICard
          title="Total Orders"
          value={stats.orders.total}
          trend={stats.trends?.orders >= 0 ? "up" : "down"}
          trendValue={`${Math.abs(stats.trends?.orders || 0).toFixed(1)}%`}
          icon={ShoppingBag}
        />
        <KPICard
          title="Pending Orders"
          value={stats.orders.pending}
          trend="neutral"
          trendValue="0%"
          icon={Package}
        />
        <KPICard
          title="Active Customers"
          value={stats.active_customers || 0}
          trend="neutral"
          trendValue="90-Day"
          icon={Users}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Main Chart */}
        <div className="lg:col-span-2">
          <SimpleChart
            title="Revenue Overview"
            data={chartData}
            height={256}
          />
        </div>

        {/* Recent Activity Feed */}
        <div className="lg:col-span-1">
          <Card className="h-full flex flex-col">
            <CardHeader title="Recent Activity" />
            <CardContent className="flex-1">
              <div className="space-y-6">
                {(stats.recent_activity || []).map((item, i) => (
                  <div key={i} className="flex gap-4 relative">
                    {i !== (stats.recent_activity?.length - 1) && <div className="absolute top-6 bottom-[-24px] left-1.5 w-px bg-[#E5E5E5]"></div>}
                    <div className="w-3 h-3 rounded-full bg-[#111111] mt-1.5 shrink-0 z-10 ring-4 ring-white"></div>
                    <div>
                      <p className="text-sm font-medium text-[#111111]">{item.text}</p>
                      <p className="text-xs text-[#888888] mt-0.5">{new Date(item.time).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold tracking-tight text-[#111111] flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Low Stock Alerts
            </h2>
            <Link to="/admin/inventory" className="text-sm font-medium text-[#666666] hover:text-[#111111] flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <DataTable
            columns={lowStockCols}
            data={stats.low_stock_variants}
            emptyMessage="All items are sufficiently stocked."
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold tracking-tight text-[#111111]">
              Recent Orders
            </h2>
            <Link to="/admin/orders" className="text-sm font-medium text-[#666666] hover:text-[#111111] flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <DataTable
            columns={[
              { header: 'Order ID', accessorKey: 'id', cell: row => <span className="font-medium">#{row.id}</span> },
              { header: 'Customer', accessorKey: 'customer' },
              {
                header: 'Status', accessorKey: 'status', cell: row => {
                  const colors = {
                    PENDING: 'bg-yellow-50 text-yellow-700',
                    PLACED: 'bg-blue-50 text-blue-700',
                    SHIPPED: 'bg-purple-50 text-purple-700',
                    DELIVERED: 'bg-green-50 text-green-700',
                    CANCELLED: 'bg-red-50 text-red-700',
                  };
                  const color = colors[row.status] || 'bg-gray-50 text-gray-700';
                  return (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${color}`}>
                      {row.status}
                    </span>
                  )
                }
              },
              { header: 'Total', accessorKey: 'total', align: 'right', cell: row => <span className="font-medium">₹{(row.total || 0).toFixed(2)}</span> }
            ]}
            data={stats.recent_sales}
            emptyMessage="No recent orders."
          />
        </div>
      </div>

    </AdminLayout>
  )
}
