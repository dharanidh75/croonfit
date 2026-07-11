import React, { useState } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { DataTable } from '../../components/admin/ui/DataTable'
import { Search, Filter, Download } from 'lucide-react'

export function AdminCustomers() {
  const [customers] = useState([
    { id: '1001', name: 'Emily Chen', email: 'emily.chen@example.com', orders: 12, spent: 42500, last_active: '2026-07-10T14:30:00Z', status: 'Active' },
    { id: '1002', name: 'Marcus Johnson', email: 'marcus.j@example.com', orders: 3, spent: 8500, last_active: '2026-07-05T09:15:00Z', status: 'Active' },
    { id: '1003', name: 'Sarah Williams', email: 'sarah.w@example.com', orders: 0, spent: 0, last_active: '2026-06-20T11:45:00Z', status: 'Inactive' },
    { id: '1004', name: 'David Lee', email: 'david.lee@example.com', orders: 8, spent: 28900, last_active: '2026-07-11T08:20:00Z', status: 'Active' },
  ])

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
      header: 'Orders', 
      accessorKey: 'orders', 
      align: 'right',
      cell: row => <span className="font-medium text-[#111111]">{row.orders}</span> 
    },
    { 
      header: 'Amount Spent', 
      accessorKey: 'spent', 
      align: 'right',
      cell: row => <span className="font-medium text-[#111111]">₹{row.spent.toLocaleString()}</span> 
    },
    { 
      header: 'Last Active', 
      accessorKey: 'last_active', 
      cell: row => <span className="text-[#666666]">{new Date(row.last_active).toLocaleDateString()}</span> 
    },
    { 
      header: 'Status', 
      accessorKey: 'status', 
      cell: row => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest ${
          row.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
        }`}>
          {row.status}
        </span>
      )
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
        <div className="flex gap-1 overflow-x-auto p-1 border-b sm:border-b-0 sm:border-r border-[#E5E5E5] hide-scrollbar">
          <button className="px-3 py-1.5 text-sm font-medium bg-[#111111] text-white rounded-md whitespace-nowrap">All Customers</button>
          <button className="px-3 py-1.5 text-sm font-medium text-[#666666] hover:bg-[#F5F5F5] rounded-md whitespace-nowrap">New</button>
          <button className="px-3 py-1.5 text-sm font-medium text-[#666666] hover:bg-[#F5F5F5] rounded-md whitespace-nowrap">Returning</button>
        </div>
        <div className="relative flex-1 min-w-[200px] mx-2">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            className="w-full h-9 pl-9 pr-4 bg-transparent outline-none text-sm placeholder:text-[#888888] text-[#111111]"
          />
        </div>
        <button className="h-9 px-3 text-sm font-medium text-[#666666] hover:text-[#111111] flex items-center justify-center gap-2 border sm:border-none border-[#E5E5E5] rounded-md">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      <DataTable columns={columns} data={customers} />
    </AdminLayout>
  )
}
