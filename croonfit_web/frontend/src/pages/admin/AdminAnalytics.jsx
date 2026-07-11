import React from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { SimpleChart } from '../../components/admin/ui/SimpleChart'
import { Card, CardHeader, CardContent } from '../../components/admin/ui/Card'
import { TrendingUp, Users, ShoppingBag, ArrowUpRight } from 'lucide-react'

export function AdminAnalytics() {
  const chartData = [12, 19, 15, 25, 22, 30, 28]

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">Analytics</h1>
          <p className="text-sm text-[#666666] mt-1">Review business performance and sales metrics.</p>
        </div>
        <select className="h-9 px-3 bg-white border border-[#E5E5E5] text-[#111111] rounded-lg text-sm font-medium outline-none">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>Year to Date</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="flex items-center text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                +14.5% <ArrowUpRight className="w-3 h-3 ml-1" />
              </span>
            </div>
            <p className="text-sm font-medium text-[#666666] mb-1">Total Revenue</p>
            <h3 className="text-3xl font-black text-[#111111]">₹4,250,000</h3>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="flex items-center text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                +8.2% <ArrowUpRight className="w-3 h-3 ml-1" />
              </span>
            </div>
            <p className="text-sm font-medium text-[#666666] mb-1">Total Orders</p>
            <h3 className="text-3xl font-black text-[#111111]">1,248</h3>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                <Users className="w-5 h-5" />
              </div>
              <span className="flex items-center text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                +22.4% <ArrowUpRight className="w-3 h-3 ml-1" />
              </span>
            </div>
            <p className="text-sm font-medium text-[#666666] mb-1">New Customers</p>
            <h3 className="text-3xl font-black text-[#111111]">842</h3>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Revenue Overview" description="Daily sales performance." />
          <CardContent>
            <div className="h-[300px] w-full pt-4">
              <SimpleChart data={chartData} color="#111111" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Top Products" description="Best selling items by volume." />
          <CardContent>
            <div className="space-y-6 pt-4">
              {[
                { name: 'Oversized Heavyweight Tee', sales: 450, rev: '₹427,500' },
                { name: 'Essential Zip Hoodie', sales: 320, rev: '₹956,800' },
                { name: 'Signature Dad Cap', sales: 215, rev: '₹212,850' },
                { name: 'Training Shorts', sales: 180, rev: '₹322,200' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-[#111111]">{item.name}</p>
                    <p className="text-sm text-[#666666]">{item.sales} units sold</p>
                  </div>
                  <span className="font-bold text-[#111111]">{item.rev}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
