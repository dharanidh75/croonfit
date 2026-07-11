import React from 'react'
import { AdminLayout } from '../../../components/admin/AdminLayout'
import { DataTable } from '../../../components/admin/ui/DataTable'
import { Plus } from 'lucide-react'

export function Categories() {
  const columns = [
    { header: 'Category Name', accessorKey: 'name', cell: row => <span className="font-bold">{row.name}</span> },
    { header: 'Products Count', accessorKey: 'count', cell: row => <span className="text-[#666666]">{row.count} products</span> },
    { header: 'Status', accessorKey: 'status', cell: () => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest bg-green-50 text-green-700">
          Visible
        </span>
    )}
  ]

  const mockCategories = [
    { name: 'T-Shirts', count: 12 },
    { name: 'Hoodies', count: 8 },
    { name: 'Bottoms', count: 5 },
    { name: 'Accessories', count: 24 },
  ]

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">Categories</h1>
          <p className="text-sm text-[#666666] mt-1">Manage product categories and subcategories.</p>
        </div>
        <button className="h-9 px-4 bg-[#111111] text-white rounded-lg text-sm font-medium hover:bg-[#333333] transition-colors flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <DataTable columns={columns} data={mockCategories} />
    </AdminLayout>
  )
}
