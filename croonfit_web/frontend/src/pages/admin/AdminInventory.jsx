import React, { useState } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { DataTable } from '../../components/admin/ui/DataTable'
import { Search, Filter, AlertCircle, ArrowUpRight } from 'lucide-react'

export function AdminInventory() {
  const [inventory] = useState([
    { id: 'SKU-TEE-01-M', product: 'Oversized Heavyweight Tee', variant: 'Black / M', stock: 145, incoming: 0, status: 'In Stock' },
    { id: 'SKU-TEE-01-L', product: 'Oversized Heavyweight Tee', variant: 'Black / L', stock: 12, incoming: 50, status: 'Low Stock' },
    { id: 'SKU-HOD-02-S', product: 'Essential Zip Hoodie', variant: 'Heather Grey / S', stock: 0, incoming: 100, status: 'Out of Stock' },
    { id: 'SKU-HOD-02-M', product: 'Essential Zip Hoodie', variant: 'Heather Grey / M', stock: 45, incoming: 0, status: 'In Stock' },
    { id: 'SKU-ACC-05-OS', product: 'Signature Dad Cap', variant: 'Navy / OS', stock: 5, incoming: 0, status: 'Low Stock' },
  ])

  const columns = [
    { 
      header: 'Product / Variant', 
      accessorKey: 'product', 
      cell: row => (
        <div>
          <p className="font-bold text-[#111111]">{row.product}</p>
          <p className="text-xs text-[#666666]">{row.variant}</p>
        </div>
      )
    },
    { header: 'SKU', accessorKey: 'id', cell: row => <span className="font-mono text-xs text-[#888888]">{row.id}</span> },
    { 
      header: 'Status', 
      accessorKey: 'status', 
      cell: row => {
        const colors = {
          'In Stock': 'bg-green-50 text-green-700',
          'Low Stock': 'bg-yellow-50 text-yellow-700',
          'Out of Stock': 'bg-red-50 text-red-700',
        }
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest ${colors[row.status]}`}>
            {row.status}
          </span>
        )
      }
    },
    { 
      header: 'Available', 
      accessorKey: 'stock', 
      align: 'right',
      cell: row => <span className={`font-bold ${row.stock < 20 ? 'text-red-600' : 'text-[#111111]'}`}>{row.stock}</span> 
    },
    { 
      header: 'Incoming', 
      accessorKey: 'incoming', 
      align: 'right',
      cell: row => <span className="text-[#666666]">{row.incoming > 0 ? `+${row.incoming}` : '-'}</span> 
    },
    { 
      header: 'Action', 
      accessorKey: 'action', 
      align: 'right',
      cell: () => (
        <button className="text-sm font-medium text-blue-600 hover:text-blue-800">Adjust</button>
      )
    }
  ]

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">Inventory</h1>
          <p className="text-sm text-[#666666] mt-1">Track and adjust stock levels across variants.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="h-9 px-4 bg-white border border-[#E5E5E5] text-[#111111] rounded-lg text-sm font-medium hover:bg-[#F9F9F9] transition-colors flex items-center justify-center gap-2">
            Receive Transfer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#666666]">Total Value</span>
          </div>
          <p className="text-2xl font-bold text-[#111111]">₹4,250,000</p>
        </div>
        <div className="bg-white border border-red-200 rounded-xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-red-50 rounded-bl-full flex items-start justify-end p-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-red-800">Low Stock Variants</span>
          </div>
          <p className="text-2xl font-bold text-red-600">24</p>
        </div>
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#666666]">Incoming</span>
          </div>
          <p className="text-2xl font-bold text-[#111111]">1,450 <span className="text-sm font-normal text-[#888888]">units</span></p>
        </div>
      </div>

      <div className="bg-white border border-[#E5E5E5] rounded-xl mb-6 p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="relative flex-1 min-w-[200px] mx-2">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" />
          <input 
            type="text" 
            placeholder="Scan or search SKU, product..." 
            className="w-full h-9 pl-9 pr-4 bg-transparent outline-none text-sm placeholder:text-[#888888] text-[#111111]"
          />
        </div>
        <button className="h-9 px-3 text-sm font-medium text-[#666666] hover:text-[#111111] flex items-center justify-center gap-2 border sm:border-none border-[#E5E5E5] rounded-md">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      <DataTable columns={columns} data={inventory} />
    </AdminLayout>
  )
}
