import React, { useState, useEffect } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { DataTable } from '../../components/admin/ui/DataTable'
import { Plus, Search, Filter, Pencil, Trash2 } from 'lucide-react'
import api from '../../lib/api'
import toast from 'react-hot-toast'

export function AdminDiscounts() {
  const [discounts, setDiscounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [advancedFilters, setAdvancedFilters] = useState({ status: 'all' })
  
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('create') // 'create' | 'edit'
  
  const [formData, setFormData] = useState({
    id: null,
    code: '',
    type: 'PERCENTAGE',
    percentage_off: '',
    fixed_amount_off: '',
    usage_cap: '',
    expires_at: '',
    is_active: true
  })
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    fetchDiscounts()
  }, [])

  const fetchDiscounts = async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/discounts?per_page=100')
      setDiscounts(res.data.items || [])
    } catch (err) {
      toast.error('Failed to load discounts')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenCreate = () => {
    setModalMode('create')
    setFormData({
      id: null,
      code: '',
      type: 'PERCENTAGE',
      percentage_off: '',
      fixed_amount_off: '',
      usage_cap: '',
      expires_at: '',
      is_active: true
    })
    setShowModal(true)
  }

  const handleOpenEdit = (discount) => {
    setModalMode('edit')
    setFormData({
      id: discount.id,
      code: discount.code,
      type: discount.type,
      percentage_off: discount.percentage_off || '',
      fixed_amount_off: discount.fixed_amount_off || '',
      usage_cap: discount.usage_cap || '',
      expires_at: discount.expires_at ? discount.expires_at.split('T')[0] : '', // simple date input format
      is_active: discount.is_active
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete or deactivate this discount?')) return
    try {
      const res = await api.delete(`/admin/discounts/${id}`)
      toast.success(res.data.message || 'Discount processed')
      fetchDiscounts()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to delete discount')
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)
    
    // Clean payload
    const payload = {
      code: formData.code.toUpperCase(),
      type: formData.type,
      is_active: formData.is_active
    }
    
    if (formData.type === 'PERCENTAGE') {
      payload.percentage_off = parseFloat(formData.percentage_off)
    } else if (formData.type === 'FIXED_AMOUNT') {
      payload.fixed_amount_off = parseFloat(formData.fixed_amount_off)
    }
    
    if (formData.usage_cap) payload.usage_cap = parseInt(formData.usage_cap, 10)
    if (formData.expires_at) payload.expires_at = new Date(formData.expires_at).toISOString()

    try {
      if (modalMode === 'create') {
        await api.post('/admin/discounts', payload)
        toast.success('Discount created successfully!')
      } else {
        // Edit mode
        // code and type shouldn't change generally, but we can send update payload
        const updatePayload = {
          is_active: formData.is_active,
          usage_cap: payload.usage_cap || null,
          expires_at: payload.expires_at || null
        }
        await api.put(`/admin/discounts/${formData.id}`, updatePayload)
        toast.success('Discount updated successfully!')
      }
      setShowModal(false)
      fetchDiscounts()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'An error occurred')
    } finally {
      setFormLoading(false)
    }
  }

  const filteredDiscounts = discounts.filter(d => {
    let matchesSearch = true
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      matchesSearch = d.code.toLowerCase().includes(q)
    }

    let matchesStatus = true
    if (advancedFilters.status !== 'all') {
      if (advancedFilters.status === 'active') matchesStatus = d.is_active === true
      if (advancedFilters.status === 'inactive') matchesStatus = d.is_active === false
    }

    return matchesSearch && matchesStatus
  })

  const columns = [
    { 
      header: 'Discount Code', 
      accessorKey: 'code', 
      cell: row => <span className="font-bold font-mono tracking-widest text-[#111111]">{row.code}</span> 
    },
    { 
      header: 'Type / Value', 
      accessorKey: 'type', 
      cell: row => {
        let valStr = ''
        if (row.type === 'PERCENTAGE') valStr = `${row.percentage_off}% OFF`
        else if (row.type === 'FIXED_AMOUNT') valStr = `₹${row.fixed_amount_off} OFF`
        else valStr = 'FREE SHIPPING'
        
        return (
          <div>
            <p className="font-medium text-[#111111]">{valStr}</p>
            <p className="text-xs text-[#666666]">{row.type.replace('_', ' ')}</p>
          </div>
        )
      }
    },
    { 
      header: 'Status', 
      accessorKey: 'is_active', 
      cell: row => {
        const isExpired = row.expires_at && new Date(row.expires_at) < new Date()
        const isCapped = row.usage_cap && row.current_usage >= row.usage_cap
        
        let status = 'Active'
        let color = 'bg-green-50 text-green-700'
        
        if (!row.is_active) {
          status = 'Inactive'
          color = 'bg-gray-100 text-gray-600'
        } else if (isExpired) {
          status = 'Expired'
          color = 'bg-red-50 text-red-700'
        } else if (isCapped) {
          status = 'Capped'
          color = 'bg-orange-50 text-orange-700'
        }

        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest ${color}`}>
            {status}
          </span>
        )
      }
    },
    { 
      header: 'Usage', 
      accessorKey: 'current_usage', 
      align: 'right',
      cell: row => (
        <span className="text-[#111111]">
          {row.current_usage} {row.usage_cap ? `/ ${row.usage_cap}` : ''}
        </span>
      ) 
    },
    { 
      header: 'End Date', 
      accessorKey: 'expires_at', 
      cell: row => (
        <span className="text-[#666666]">
          {row.expires_at ? new Date(row.expires_at).toLocaleDateString() : 'No Expiry'}
        </span>
      ) 
    },
    {
      header: '',
      accessorKey: 'actions',
      align: 'right',
      cell: row => (
        <div className="flex justify-end gap-2">
          <button onClick={() => handleOpenEdit(row)} className="p-1.5 text-[#888888] hover:text-[#111111] transition-colors rounded-md hover:bg-gray-100">
            <Pencil className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(row.id)} className="p-1.5 text-[#888888] hover:text-red-600 transition-colors rounded-md hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ]

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">Discounts</h1>
          <p className="text-sm text-[#666666] mt-1">Manage promotional codes and automatic discounts.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button 
            onClick={handleOpenCreate}
            className="h-9 px-4 bg-[#111111] text-white rounded-lg text-sm font-medium hover:bg-[#333333] transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create Discount
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#E5E5E5] rounded-xl mb-6 p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" />
          <input 
            type="text" 
            placeholder="Search discounts..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 bg-transparent outline-none text-sm placeholder:text-[#888888] text-[#111111]"
          />
        </div>
        <div className="w-px h-6 bg-[#E5E5E5] mx-1 hidden sm:block"></div>
        <div className="relative">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="h-9 px-3 text-sm font-medium text-[#666666] hover:text-[#111111] flex items-center justify-center gap-2 border sm:border-none border-[#E5E5E5] rounded-md"
          >
            <Filter className="w-4 h-4" /> Filter
          </button>
          
          {showFilters && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#E5E5E5] rounded-xl shadow-lg z-50 p-4">
              <div className="mb-4">
                <label className="block text-xs font-bold text-[#888888] uppercase tracking-wider mb-2">Status</label>
                <select 
                  value={advancedFilters.status}
                  onChange={(e) => setAdvancedFilters({...advancedFilters, status: e.target.value})}
                  className="w-full h-9 px-3 bg-[#F9F9F9] border border-[#E5E5E5] rounded-lg text-sm outline-none"
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button 
                  onClick={() => {
                    setAdvancedFilters({ status: 'all' })
                    setSearchQuery('')
                    setShowFilters(false)
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-[#666666] hover:text-[#111111]"
                >
                  Clear All
                </button>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="px-4 py-1.5 bg-[#111111] text-white text-xs font-medium rounded-md hover:bg-black"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="w-8 h-8 border-2 border-[#111111] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <DataTable columns={columns} data={filteredDiscounts} emptyMessage="No discounts found." />
      )}

      {/* Create / Edit Discount Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E5E5E5]">
              <h3 className="text-lg font-bold text-[#111111]">
                {modalMode === 'create' ? 'Create Discount' : 'Edit Discount'}
              </h3>
            </div>
            <form onSubmit={handleFormSubmit} className="p-6">
              <div className="space-y-4">
                
                {/* Code */}
                <div>
                  <label className="block text-sm font-semibold text-[#111111] mb-1">Discount Code *</label>
                  <input 
                    type="text" 
                    required
                    disabled={modalMode === 'edit'}
                    placeholder="e.g. SUMMER2026" 
                    value={formData.code}
                    onChange={e => setFormData({...formData, code: e.target.value})}
                    className="w-full h-10 px-3 border border-[#E5E5E5] rounded-lg text-sm outline-none focus:border-[#111111] disabled:bg-gray-50 disabled:text-gray-500 uppercase" 
                  />
                </div>
                
                {/* Type and Value */}
                {modalMode === 'create' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#111111] mb-1">Type *</label>
                      <select 
                        value={formData.type}
                        onChange={e => {
                          setFormData({
                            ...formData, 
                            type: e.target.value,
                            percentage_off: '',
                            fixed_amount_off: ''
                          })
                        }}
                        className="w-full h-10 px-3 border border-[#E5E5E5] rounded-lg text-sm outline-none focus:border-[#111111]"
                      >
                        <option value="PERCENTAGE">Percentage</option>
                        <option value="FIXED_AMOUNT">Fixed Amount</option>
                        <option value="FREE_SHIPPING">Free Shipping</option>
                      </select>
                    </div>
                    <div>
                      {formData.type === 'PERCENTAGE' && (
                        <>
                          <label className="block text-sm font-semibold text-[#111111] mb-1">Percentage Off (%) *</label>
                          <input 
                            type="number" step="0.01" min="0.01" max="100" required
                            placeholder="e.g. 20" 
                            value={formData.percentage_off}
                            onChange={e => setFormData({...formData, percentage_off: e.target.value})}
                            className="w-full h-10 px-3 border border-[#E5E5E5] rounded-lg text-sm outline-none focus:border-[#111111]" 
                          />
                        </>
                      )}
                      {formData.type === 'FIXED_AMOUNT' && (
                        <>
                          <label className="block text-sm font-semibold text-[#111111] mb-1">Amount Off (₹) *</label>
                          <input 
                            type="number" step="0.01" min="0.01" required
                            placeholder="e.g. 500" 
                            value={formData.fixed_amount_off}
                            onChange={e => setFormData({...formData, fixed_amount_off: e.target.value})}
                            className="w-full h-10 px-3 border border-[#E5E5E5] rounded-lg text-sm outline-none focus:border-[#111111]" 
                          />
                        </>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Usage Cap & Expiry */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#111111] mb-1">Usage Cap (Optional)</label>
                    <input 
                      type="number" min="1" step="1"
                      placeholder="e.g. 100" 
                      value={formData.usage_cap}
                      onChange={e => setFormData({...formData, usage_cap: e.target.value})}
                      className="w-full h-10 px-3 border border-[#E5E5E5] rounded-lg text-sm outline-none focus:border-[#111111]" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#111111] mb-1">Expiry Date (Optional)</label>
                    <input 
                      type="date"
                      value={formData.expires_at}
                      onChange={e => setFormData({...formData, expires_at: e.target.value})}
                      className="w-full h-10 px-3 border border-[#E5E5E5] rounded-lg text-sm outline-none focus:border-[#111111]" 
                    />
                  </div>
                </div>
                
                {/* Is Active Toggle */}
                <div className="pt-2 flex items-center gap-3">
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={formData.is_active}
                        onChange={e => setFormData({...formData, is_active: e.target.checked})}
                      />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${formData.is_active ? 'bg-[#111111]' : 'bg-gray-300'}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.is_active ? 'transform translate-x-4' : ''}`}></div>
                    </div>
                    <div className="ml-3 text-sm font-semibold text-[#111111]">
                      Active Status
                    </div>
                  </label>
                </div>

              </div>
              
              <div className="flex justify-end gap-3 mt-8">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-[#666666] hover:text-[#111111]"
                  disabled={formLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2 bg-[#111111] text-white text-sm font-medium rounded-lg hover:bg-black disabled:opacity-50"
                >
                  {formLoading ? 'Saving...' : (modalMode === 'create' ? 'Create' : 'Save Changes')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
