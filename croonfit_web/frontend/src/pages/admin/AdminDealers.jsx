import React, { useState } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { DataTable } from '../../components/admin/ui/DataTable'
import { Search, Filter, Plus } from 'lucide-react'

export function AdminDealers() {
  const [dealers] = useState([
    { id: 'W001', company: 'Urban Thread Co.', contact: 'Michael Chang', email: 'mike@urbanthread.com', tier: 'Gold', status: 'Approved', total_orders: 45, ytd_spend: 1250000 },
    { id: 'W002', company: 'FitStyle Retailers', contact: 'Sarah Jenkins', email: 'sarah@fitstyle.com', tier: 'Silver', status: 'Pending', total_orders: 0, ytd_spend: 0 },
    { id: 'W003', company: 'Core Athletics', contact: 'David Rossi', email: 'd.rossi@coreathletics.it', tier: 'Platinum', status: 'Approved', total_orders: 112, ytd_spend: 4500000 },
  ])

  const columns = [
    { 
      header: 'Company / Partner', 
      accessorKey: 'company', 
      cell: row => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-[#111111] flex items-center justify-center text-white font-bold text-sm">
            {row.company.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-[#111111]">{row.company}</p>
            <p className="text-xs text-[#666666]">{row.id} &middot; {row.contact}</p>
          </div>
        </div>
      )
    },
    { header: 'Email', accessorKey: 'email', cell: row => <span className="text-[#666666]">{row.email}</span> },
    { 
      header: 'Tier', 
      accessorKey: 'tier', 
      cell: row => {
        const colors = {
          Gold: 'bg-yellow-100 text-yellow-800',
          Silver: 'bg-gray-200 text-gray-800',
          Platinum: 'bg-slate-800 text-white',
        }
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${colors[row.tier]}`}>
            {row.tier}
          </span>
        )
      }
    },
    { 
      header: 'YTD Spend', 
      accessorKey: 'ytd_spend', 
      align: 'right',
      cell: row => <span className="font-medium text-[#111111]">₹{row.ytd_spend.toLocaleString()}</span> 
    },
    { 
      header: 'Status', 
      accessorKey: 'status', 
      cell: row => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest ${
          row.status === 'Approved' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
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
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">Wholesale Partners</h1>
          <p className="text-sm text-[#666666] mt-1">Manage B2B dealers, review applications, and set tiers.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="h-9 px-4 bg-[#111111] text-white rounded-lg text-sm font-medium hover:bg-[#333333] transition-colors flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Add Partner
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#E5E5E5] rounded-xl mb-6 p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="flex gap-1 overflow-x-auto p-1 border-b sm:border-b-0 sm:border-r border-[#E5E5E5] hide-scrollbar">
          <button className="px-3 py-1.5 text-sm font-medium bg-[#111111] text-white rounded-md whitespace-nowrap">All Partners</button>
          <button className="px-3 py-1.5 text-sm font-medium text-[#666666] hover:bg-[#F5F5F5] rounded-md whitespace-nowrap">Pending Applications</button>
        </div>
        <div className="relative flex-1 min-w-[200px] mx-2">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" />
          <input 
            type="text" 
            placeholder="Search by company or ID..." 
            className="w-full h-9 pl-9 pr-4 bg-transparent outline-none text-sm placeholder:text-[#888888] text-[#111111]"
          />
        </div>
        <button className="h-9 px-3 text-sm font-medium text-[#666666] hover:text-[#111111] flex items-center justify-center gap-2 border sm:border-none border-[#E5E5E5] rounded-md">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      <DataTable columns={columns} data={dealers} />
    </AdminLayout>
  )
}
