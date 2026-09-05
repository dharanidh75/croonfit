import React, { useEffect, useState } from 'react'
import { AdminLayout } from '../../../components/admin/AdminLayout'
import { Plus, Pencil, Trash2, X, Check, AlertCircle } from 'lucide-react'
import { adminApi } from '../../../lib/api'

const GENDERS = ['MENS', 'WOMENS', 'KIDS', 'UNISEX']

const EMPTY_FORM = { name: '', slug: '', gender: 'MENS', cover_image_url: '' }

export function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null) // null = create, obj = edit
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null) // id to delete
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')

  const fetchCategories = () => {
    setLoading(true)
    adminApi.get('/admin/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchCategories() }, [])

  const openCreate = () => {
    setEditTarget(null)
    setForm(EMPTY_FORM)
    setError('')
    setModalOpen(true)
  }

  const openEdit = (cat) => {
    setEditTarget(cat)
    setForm({
      name: cat.name,
      slug: cat.slug,
      gender: cat.gender,
      cover_image_url: cat.cover_image_url || '',
    })
    setError('')
    setModalOpen(true)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value,
      // Auto-generate slug from name only when creating
      ...(name === 'name' && !editTarget
        ? { slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }
        : {}),
    }))
  }

  const handleSave = async () => {
    if (!form.name || !form.slug || !form.gender) {
      setError('Name, slug and gender are required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      if (editTarget) {
        await adminApi.put(`/admin/categories/${editTarget.id}`, form)
      } else {
        await adminApi.post('/admin/categories', form)
      }
      setModalOpen(false)
      fetchCategories()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save category.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    setIsDeleting(true)
    try {
      await adminApi.delete(`/admin/categories/${id}`)
      setDeleteConfirm(null)
      fetchCategories()
    } catch (err) {
      alert(err.response?.data?.detail || 'Cannot delete category.')
    } finally {
      setIsDeleting(false)
    }
  }

  const genderBadge = (g) => {
    const colors = {
      MENS: 'bg-blue-50 text-blue-700',
      WOMENS: 'bg-pink-50 text-pink-700',
      KIDS: 'bg-yellow-50 text-yellow-700',
      UNISEX: 'bg-purple-50 text-purple-700',
    }
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest ${colors[g] || 'bg-gray-50 text-gray-700'}`}>
        {g}
      </span>
    )
  }

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">Categories</h1>
          <p className="text-sm text-[#666666] mt-1">Manage product categories and subcategories.</p>
        </div>
        <button
          onClick={openCreate}
          className="h-9 px-4 bg-[#111111] text-white rounded-lg text-sm font-medium hover:bg-[#333333] transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-[#888888] text-sm">Loading categories...</div>
      ) : categories.length === 0 ? (
        <div className="py-16 text-center text-[#888888] text-sm">No categories yet. Add one above.</div>
      ) : (
        <div className="border border-[#E5E5E5] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#F9F9F9] border-b border-[#E5E5E5]">
              <tr>
                <th className="text-left px-6 py-3 font-semibold text-[#111111]">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-[#111111]">Slug</th>
                <th className="text-left px-4 py-3 font-semibold text-[#111111]">Gender</th>
                <th className="text-left px-4 py-3 font-semibold text-[#111111]">Products</th>
                <th className="text-right px-6 py-3 font-semibold text-[#111111]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, i) => (
                <tr key={cat.id} className={`border-b border-[#F5F5F5] hover:bg-[#FAFAFA] transition-colors ${i % 2 === 0 ? '' : 'bg-[#FEFEFE]'}`}>
                  <td className="px-6 py-4 font-semibold text-[#111111]">{cat.name}</td>
                  <td className="px-4 py-4 text-[#666666] font-mono text-xs">{cat.slug}</td>
                  <td className="px-4 py-4">{genderBadge(cat.gender)}</td>
                  <td className="px-4 py-4 text-[#666666]">{cat.product_count ?? 0} products</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => openEdit(cat)}
                        className="p-2 rounded-lg hover:bg-[#F0F0F0] text-[#666666] hover:text-[#111111] transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(cat.id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-[#666666] hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#111111]">{editTarget ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-[#F5F5F5] rounded-lg transition-colors">
                <X className="w-5 h-5 text-[#666666]" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-2">Name *</label>
                <input
                  name="name" value={form.name} onChange={handleChange}
                  placeholder="e.g. Polo Shirts"
                  className="w-full h-10 px-3 border border-[#E5E5E5] rounded-lg text-sm focus:border-[#111111] focus:ring-1 focus:ring-[#111111] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-2">Slug *</label>
                <input
                  name="slug" value={form.slug} onChange={handleChange}
                  placeholder="e.g. polo-shirts"
                  className="w-full h-10 px-3 border border-[#E5E5E5] rounded-lg text-sm font-mono focus:border-[#111111] focus:ring-1 focus:ring-[#111111] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-2">Gender *</label>
                <select
                  name="gender" value={form.gender} onChange={handleChange}
                  className="w-full h-10 px-3 border border-[#E5E5E5] rounded-lg text-sm focus:border-[#111111] outline-none bg-white"
                >
                  {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-2">Cover Image (Optional)</label>
                <div className="flex items-center gap-4">
                  {form.cover_image_url ? (
                    <div className="flex items-center gap-4">
                      <img 
                        src={form.cover_image_url.startsWith('http') ? form.cover_image_url : `${(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace('/api', '')}${form.cover_image_url}`} 
                        alt="preview" 
                        className="w-16 h-16 rounded-lg object-cover border border-[#E5E5E5]"
                      />
                      <button 
                        onClick={() => setForm(p => ({ ...p, cover_image_url: '' }))}
                        className="text-xs text-red-600 hover:underline font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={async (e) => {
                        if (!e.target.files?.[0]) return
                        const fData = new FormData()
                        fData.append('file', e.target.files[0])
                        try {
                          const res = await adminApi.post('/admin/upload', fData)
                          setForm(p => ({ ...p, cover_image_url: res.data.url }))
                        } catch (err) {
                          alert('Upload failed')
                        }
                      }}
                      className="block w-full text-sm text-[#666666] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#111111] file:text-white hover:file:bg-[#333333] transition-colors cursor-pointer"
                    />
                  )}
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 h-10 bg-white border border-[#E5E5E5] text-[#111111] rounded-lg text-sm font-medium hover:bg-[#F9F9F9] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 h-10 bg-[#111111] text-white rounded-lg text-sm font-medium hover:bg-[#333333] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {saving ? 'Saving...' : <><Check className="w-4 h-4" /> {editTarget ? 'Save Changes' : 'Create'}</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 mx-4 text-center">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <Trash2 className="w-7 h-7 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-[#111111] mb-2">Delete Category?</h2>
            <p className="text-sm text-[#666666] mb-6">This action cannot be undone. Categories with products cannot be deleted.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 h-10 border border-[#E5E5E5] rounded-lg text-sm font-medium text-[#111111] hover:bg-[#F9F9F9] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={isDeleting}
                className="flex-1 h-10 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
