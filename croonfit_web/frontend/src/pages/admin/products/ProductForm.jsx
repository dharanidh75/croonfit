import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminLayout } from '../../../components/admin/AdminLayout'
import { Card, CardHeader, CardContent } from '../../../components/admin/ui/Card'
import { UploadCloud, Plus, Minus } from 'lucide-react'
import { adminApi } from '../../../lib/api'

const GENDER_LABELS = {
  MENS: "Men's",
  WOMENS: "Women's",
  KIDS: "Kids'",
  UNISEX: "Unisex",
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export function ProductForm() {
  const navigate = useNavigate()
  const [allCategories, setAllCategories] = useState([])
  const [selectedGender, setSelectedGender] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    compare_price: '',
    category_id: '',
    is_active: true,
    is_featured: false,
    tags: '',
  })

  // Variants — at least one
  const [variants, setVariants] = useState([
    { size: 'M', color: 'Black', color_hex: '#000000', stock_qty: 10, sku: '' }
  ])
  const [images, setImages] = useState([
    { url: '', is_primary: true }
  ])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    adminApi.get('/products/categories')
      .then(res => setAllCategories(res.data))
      .catch(err => console.error(err))
  }, [])

  // Unique genders from fetched categories
  const availableGenders = [...new Set(allCategories.map(c => c.gender))].sort()

  // Filter sub-categories by selected gender
  const subCategories = allCategories.filter(c => c.gender === selectedGender)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Auto slug from product name
      ...(name === 'name'
        ? { slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }
        : {}),
    }))
  }

  const handleGenderChange = (e) => {
    setSelectedGender(e.target.value)
    setFormData(prev => ({ ...prev, category_id: '' })) // reset sub-cat
  }

  const handleVariantChange = (index, field, value) => {
    setVariants(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      // Auto-generate SKU
      if (field === 'size' || field === 'color') {
        const slug = formData.slug || 'product'
        const size = field === 'size' ? value : updated[index].size
        const color = field === 'color' ? value : updated[index].color
        updated[index].sku = `${slug}-${size}-${color}`.toLowerCase().replace(/\s+/g, '-')
      }
      return updated
    })
  }

  const addVariant = () => {
    setVariants(prev => [
      ...prev,
      { size: 'M', color: 'Black', color_hex: '#000000', stock_qty: 0, sku: '' }
    ])
  }

  const removeVariant = (index) => {
    if (variants.length === 1) return
    setVariants(prev => prev.filter((_, i) => i !== index))
  }

  const handleImageChange = (index, value) => {
    setImages(prev => {
      const updated = [...prev]
      updated[index].url = value
      return updated
    })
  }
  
  const addImage = () => setImages(prev => [...prev, { url: '', is_primary: prev.length === 0 }])
  const removeImage = (index) => setImages(prev => prev.filter((_, i) => i !== index))

  const handleSubmit = async () => {
    if (!formData.name || !formData.price || !formData.category_id) {
      alert('Please fill in product name, price, and select a category.')
      return
    }

    setSaving(true)
    try {
      const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-')
      const payload = {
        ...formData,
        slug,
        price: parseFloat(formData.price),
        compare_price: formData.compare_price ? parseFloat(formData.compare_price) : null,
        category_id: parseInt(formData.category_id),
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        images: images.filter(i => i.url.trim()),
        variants: variants.map((v, i) => ({
          ...v,
          stock_qty: parseInt(v.stock_qty),
          sku: v.sku || `${slug}-${v.size}-${v.color}-${i}`.toLowerCase().replace(/\s+/g, '-'),
        })),
      }
      await adminApi.post('/admin/products', payload)
      navigate('/admin/products')
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.detail || 'Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">Add Product</h1>
          <p className="text-sm text-[#666666] mt-1">Create a new product in your catalog.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button onClick={() => navigate('/admin/products')} className="h-9 px-4 bg-white border border-[#E5E5E5] text-[#111111] rounded-lg text-sm font-medium hover:bg-[#F9F9F9] transition-colors">
            Discard
          </button>
          <button onClick={handleSubmit} disabled={saving} className="h-9 px-6 bg-[#111111] text-white rounded-lg text-sm font-medium hover:bg-[#333333] transition-colors disabled:opacity-60">
            {saving ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT — main details */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader title="Basic Details" />
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-2">Product Title *</label>
                <input
                  name="name" value={formData.name} onChange={handleChange}
                  type="text" placeholder="e.g. Oversized Heavyweight Tee"
                  className="w-full h-10 px-3 bg-white border border-[#E5E5E5] rounded-lg text-sm focus:border-[#111111] focus:ring-1 focus:ring-[#111111] outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-2">Slug</label>
                <input
                  name="slug" value={formData.slug} onChange={handleChange}
                  type="text" placeholder="auto-generated-from-name"
                  className="w-full h-10 px-3 bg-white border border-[#E5E5E5] rounded-lg text-sm font-mono focus:border-[#111111] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-2">Description</label>
                <textarea
                  name="description" value={formData.description} onChange={handleChange}
                  rows={4} placeholder="Detailed product description..."
                  className="w-full p-3 bg-white border border-[#E5E5E5] rounded-lg text-sm focus:border-[#111111] focus:ring-1 focus:ring-[#111111] outline-none transition-all resize-none"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Pricing" />
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#111111] mb-2">Price (₹) *</label>
                  <input name="price" value={formData.price} onChange={handleChange} type="number" min="0"
                    className="w-full h-10 px-3 bg-white border border-[#E5E5E5] rounded-lg text-sm focus:border-[#111111] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#111111] mb-2">Compare at Price (₹)</label>
                  <input name="compare_price" value={formData.compare_price} onChange={handleChange} type="number" min="0"
                    className="w-full h-10 px-3 bg-white border border-[#E5E5E5] rounded-lg text-sm focus:border-[#111111] outline-none" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Variants */}
          <Card>
            <CardHeader title="Variants (Size, Color, Stock)" />
            <CardContent className="space-y-4">
              {variants.map((v, i) => (
                <div key={i} className="grid grid-cols-5 gap-3 items-end p-4 bg-[#FAFAFA] rounded-xl border border-[#E5E5E5]">
                  <div>
                    <label className="block text-xs font-semibold text-[#666666] mb-1">Size</label>
                    <select
                      value={v.size} onChange={e => handleVariantChange(i, 'size', e.target.value)}
                      className="w-full h-9 px-2 border border-[#E5E5E5] rounded-lg text-sm bg-white outline-none"
                    >
                      {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#666666] mb-1">Color</label>
                    <input
                      value={v.color} onChange={e => handleVariantChange(i, 'color', e.target.value)}
                      type="text" placeholder="Black"
                      className="w-full h-9 px-2 border border-[#E5E5E5] rounded-lg text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#666666] mb-1">Hex</label>
                    <div className="flex items-center gap-1.5">
                      <input type="color" value={v.color_hex} onChange={e => handleVariantChange(i, 'color_hex', e.target.value)}
                        className="w-9 h-9 rounded-lg border border-[#E5E5E5] cursor-pointer p-0.5"
                      />
                      <span className="text-xs font-mono text-[#666666]">{v.color_hex}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#666666] mb-1">Stock</label>
                    <input
                      value={v.stock_qty} onChange={e => handleVariantChange(i, 'stock_qty', e.target.value)}
                      type="number" min="0"
                      className="w-full h-9 px-2 border border-[#E5E5E5] rounded-lg text-sm outline-none"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => removeVariant(i)}
                      disabled={variants.length === 1}
                      className="w-9 h-9 flex items-center justify-center bg-white border border-[#E5E5E5] rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors disabled:opacity-30"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={addVariant}
                className="w-full h-10 border border-dashed border-[#CCCCCC] rounded-xl text-sm text-[#666666] hover:border-[#111111] hover:text-[#111111] transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Variant
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Images (URLs)" />
            <CardContent className="space-y-4">
              {images.map((img, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex-1">
                    <input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={img.url}
                      onChange={(e) => handleImageChange(i, e.target.value)}
                      className="w-full h-10 px-3 bg-white border border-[#E5E5E5] rounded-lg text-sm focus:border-[#111111] outline-none"
                    />
                  </div>
                  <button
                    onClick={() => removeImage(i)}
                    className="w-10 h-10 flex items-center justify-center bg-white border border-[#E5E5E5] rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={addImage}
                className="w-full h-10 border border-dashed border-[#CCCCCC] rounded-xl text-sm text-[#666666] hover:border-[#111111] hover:text-[#111111] transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Image URL
              </button>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT — organization */}
        <div className="lg:col-span-1 space-y-8">
          <Card>
            <CardHeader title="Organization" />
            <CardContent className="space-y-5">

              {/* Step 1: Gender */}
              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-2">Gender *</label>
                <select
                  value={selectedGender} onChange={handleGenderChange}
                  className="w-full h-10 px-3 bg-white border border-[#E5E5E5] rounded-lg text-sm focus:border-[#111111] outline-none"
                >
                  <option value="">Select Gender</option>
                  {availableGenders.map(g => (
                    <option key={g} value={g}>{GENDER_LABELS[g] || g}</option>
                  ))}
                </select>
              </div>

              {/* Step 2: Sub-category (visible only after gender chosen) */}
              {selectedGender && (
                <div>
                  <label className="block text-sm font-semibold text-[#111111] mb-2">Category *</label>
                  {subCategories.length === 0 ? (
                    <div className="text-sm text-[#888888] p-3 bg-[#F5F5F5] rounded-lg">
                      No categories for {GENDER_LABELS[selectedGender]}. <br />
                      <a href="/admin/products/categories" className="underline text-[#111111]">Add one first →</a>
                    </div>
                  ) : (
                    <select
                      name="category_id" value={formData.category_id} onChange={handleChange}
                      className="w-full h-10 px-3 bg-white border border-[#E5E5E5] rounded-lg text-sm focus:border-[#111111] outline-none"
                    >
                      <option value="">Select Sub-Category</option>
                      {subCategories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-2">Tags</label>
                <input
                  name="tags" value={formData.tags} onChange={handleChange}
                  type="text" placeholder="new, bestseller, summer..."
                  className="w-full h-10 px-3 bg-white border border-[#E5E5E5] rounded-lg text-sm focus:border-[#111111] outline-none"
                />
                <p className="text-xs text-[#888888] mt-1">Comma-separated</p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox" id="is_active" checked={formData.is_active}
                  onChange={e => setFormData(p => ({ ...p, is_active: e.target.checked }))}
                  className="w-4 h-4 accent-black"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-[#111111]">Active (visible in store)</label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox" id="is_featured" checked={formData.is_featured}
                  onChange={e => setFormData(p => ({ ...p, is_featured: e.target.checked }))}
                  className="w-4 h-4 accent-black"
                />
                <label htmlFor="is_featured" className="text-sm font-medium text-[#111111]">Featured</label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
