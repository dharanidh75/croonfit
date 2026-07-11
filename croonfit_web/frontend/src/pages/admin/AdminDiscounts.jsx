import React, { useState } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { DataTable } from '../../components/admin/ui/DataTable'
import { Plus, Search, Filter } from 'lucide-react'

export function AdminDiscounts() {
  const [discounts] = useState([
    { code: 'SUMMER2026', type: 'Percentage', value: '20%', usage: 145, status: 'Active', end_date: '2026-08-31' },
    { code: 'WELCOME10', type: 'Percentage', value: '10%', usage: 1024, status: 'Active', end_date: 'No Expiry' },
    { code: 'FREESHIP', type: 'Free Shipping', value: 'Shipping', usage: 45, status: 'Scheduled', end_date: '2026-12-31' },
    { code: 'FLASH50', type: 'Fixed Amount', value: '₹500', usage: 200, status: 'Expired', end_date: '2026-05-01' },
  ])

  const columns = [
    { 
      header: 'Discount Code', 
      accessorKey: 'code', 
      cell: row => <span className="font-bold font-mono tracking-widest text-[#111111]">{row.code}</span> 
    },
    { 
      header: 'Type / Value', 
      accessorKey: 'value', 
      cell: row => (
        <div>
          <p className="font-medium text-[#111111]">{row.value}</p>
          <p className="text-xs text-[#666666]">{row.type}</p>
        </div>
      )
    },
    { 
      header: 'Status', 
      accessorKey: 'status', 
      cell: row => {
        const colors = {
          'Active': 'bg-green-50 text-green-700',
          'Scheduled': 'bg-blue-50 text-blue-700',
          'Expired': 'bg-gray-100 text-gray-600',
        }
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest ${colors[row.status]}`}>
            {row.status}
          </span>
        )
      }
    },
    { 
      header: 'Usage', 
      accessorKey: 'usage', 
      align: 'right',
      cell: row => <span className="text-[#111111]">{row.usage} times</span> 
    },
    { header: 'End Date', accessorKey: 'end_date', cell: row => <span className="text-[#666666]">{row.end_date}</span> }
  ]

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">Discounts</h1>
          <p className="text-sm text-[#666666] mt-1">Manage promotional codes and automatic discounts.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="h-9 px-4 bg-[#111111] text-white rounded-lg text-sm font-medium hover:bg-[#333333] transition-colors flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Create Discount
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#E5E5E5] rounded-xl mb-6 p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="relative flex-1 min-w-[200px] mx-2">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" />
          <input 
            type="text" 
            placeholder="Search discounts..." 
            className="w-full h-9 pl-9 pr-4 bg-transparent outline-none text-sm placeholder:text-[#888888] text-[#111111]"
          />
        </div>
        <button className="h-9 px-3 text-sm font-medium text-[#666666] hover:text-[#111111] flex items-center justify-center gap-2 border sm:border-none border-[#E5E5E5] rounded-md">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      <DataTable columns={columns} data={discounts} />
    </AdminLayout>
  )
}
