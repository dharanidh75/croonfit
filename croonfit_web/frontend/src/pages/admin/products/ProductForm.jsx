import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import { AdminLayout } from '../../../components/admin/AdminLayout'
import { Card, CardHeader, CardContent } from '../../../components/admin/ui/Card'
import { UploadCloud, Plus, Minus } from 'lucide-react'
import { adminApi } from '../../../lib/api'
import { getHexFromName, getNameFromHex } from '../../../utils/colors'

const GENDER_LABELS = {
  MENS: "Men",
  WOMENS: "Women",
  KIDS: "Kids",
  UNISEX: "Unisex",
}



export function ProductForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)

  const [allCategories, setAllCategories] = useState([])
  const [selectedGender, setSelectedGender] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    compare_price: '',
    category_id: '',
    status: 'DRAFT',
    is_featured: false,
    tags: '',
    sku: '',
  })

  const [variants, setVariants] = useState([
    { size: '', color: '', color_hex: '#000000', stock_qty: '', sku: '', price: '', image_file: null }
  ])
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    adminApi.get('/admin/categories')
      .then(res => setAllCategories(res.data))
      .catch(err => console.error(err))

    if (isEditing) {
      adminApi.get(`/admin/products/${id}`)
        .then(res => {
          const p = res.data
          setFormData({
            name: p.name || '',
            slug: p.slug || '',
            description: p.description || '',
            price: p.price || '',
            compare_price: p.compare_price || '',
            category_id: p.category_id || '',
            sku: p.sku || '',
            status: p.is_active ? 'PUBLISHED' : 'DRAFT',
            is_featured: p.is_featured,
            tags: p.tags ? p.tags.join(', ') : '',
          })
          if (p.category && p.category.gender) {
            setSelectedGender(p.category.gender)
          }
          if (p.thumbnail_url) {
            setThumbnailUrl(p.thumbnail_url)
          }
          if (p.variants && p.variants.length > 0) {
            setVariants(p.variants.map(v => ({
              id: v.id,
              size: v.size || 'M',
              color: v.color || 'Black',
              color_hex: v.color_hex || '#000000',
              stock_qty: v.stock_qty || 0,
              sku: v.sku || '',
              price: v.price || '',
              images: v.images || [], // {id, url, is_primary, sort_order}
              newImages: [] // Array of File objects
            })))
          }
        })
        .catch(err => console.error(err))
    }
  }, [id, isEditing])

  // Always show Men, Women, Kids in the dropdown
  const availableGenders = ['MENS', 'WOMENS', 'KIDS']

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
      
      // Auto-sync color hex and name
      if (field === 'color') {
        const hex = getHexFromName(value)
        if (hex) updated[index].color_hex = hex
      } else if (field === 'color_hex') {
        const name = getNameFromHex(value)
        if (name) updated[index].color = name
      }
      
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
      { size: '', color: '', color_hex: '#000000', stock_qty: '', sku: '', price: '', image_file: null }
    ])
  }

  const removeVariant = (index) => {
    if (variants.length === 1) return
    setVariants(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!formData.name || !formData.price || !formData.category_id) {
      toast.error('Please fill in product name, price, and select a category.')
      return
    }

    setSaving(true)
    try {
      const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-')
      let finalThumbnailUrl = thumbnailUrl
      if (thumbnailFile) {
        const fData = new FormData()
        fData.append('file', thumbnailFile)
        const res = await adminApi.post('/admin/upload', fData)
        finalThumbnailUrl = res.data.url
      }

      const uploadedVariants = []
      for (let i = 0; i < variants.length; i++) {
        const v = variants[i]
        const variantImages = [...(v.images || [])]
        let maxSort = variantImages.length > 0 ? Math.max(...variantImages.map(img => img.sort_order || 0)) : -1
        
        for (let j = 0; j < (v.newImages || []).length; j++) {
          const file = v.newImages[j]
          const fData = new FormData()
          fData.append('file', file)
          const res = await adminApi.post('/admin/upload', fData)
          maxSort++
          variantImages.push({ url: res.data.url, is_primary: variantImages.length === 0, sort_order: maxSort })
        }

        uploadedVariants.push({
          id: v.id,
          size: v.size,
          color: v.color,
          color_hex: v.color_hex,
          stock_qty: parseInt(v.stock_qty || 0),
          sku: v.sku || `${slug}-${v.size}-${v.color}-${i}`.toLowerCase().replace(/\s+/g, '-'),
          price: v.price ? parseFloat(v.price) : null,
          images: variantImages
        })
      }

      const payload = {
        ...formData,
        slug,
        price: parseFloat(formData.price),
        compare_price: formData.compare_price ? parseFloat(formData.compare_price) : null,
        category_id: formData.category_id,
        is_active: formData.status === 'PUBLISHED',
        status: formData.status,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        thumbnail_url: finalThumbnailUrl,
        variants: uploadedVariants,
      }
      
      if (isEditing) {
        await adminApi.put(`/admin/products/${id}`, payload)
        toast.success('Product updated successfully!')
      } else {
        await adminApi.post('/admin/products', payload)
        toast.success('Product created successfully!')
      }
      
      navigate('/admin/products')
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.detail || 'Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">{isEditing ? 'Edit Product' : 'Add Product'}</h1>
          <p className="text-sm text-[#666666] mt-1">{isEditing ? 'Update your product details.' : 'Create a new product in your catalog.'}</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <select 
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="h-9 px-3 bg-white border border-[#E5E5E5] text-[#111111] rounded-lg text-sm font-medium outline-none"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
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
                <label className="block text-sm font-semibold text-[#111111] mb-2">Master SKU (Stock Keeping Unit)</label>
                <input
                  name="sku" value={formData.sku} onChange={handleChange}
                  type="text" placeholder="e.g. CRN-TEE-001"
                  className="w-full h-10 px-3 bg-white border border-[#E5E5E5] rounded-lg text-sm font-mono focus:border-[#111111] outline-none uppercase"
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
                  <label className="block text-sm font-semibold text-[#111111] mb-2">
                    Price (₹) * <span className="text-[#888888] font-normal ml-1">(e.g. 1499)</span>
                  </label>
                  <input name="price" value={formData.price} onChange={handleChange} type="number" min="0" placeholder="1499"
                    className="w-full h-10 px-3 bg-white border border-[#E5E5E5] rounded-lg text-sm focus:border-[#111111] outline-none placeholder:text-[#CCCCCC]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#111111] mb-2">
                    Compare at Price (₹) <span className="text-[#888888] font-normal ml-1">(e.g. 2999)</span>
                  </label>
                  <input name="compare_price" value={formData.compare_price} onChange={handleChange} type="number" min="0" placeholder="2999"
                    className="w-full h-10 px-3 bg-white border border-[#E5E5E5] rounded-lg text-sm focus:border-[#111111] outline-none placeholder:text-[#CCCCCC]" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Variants */}
          <Card>
            <CardHeader title="Variants (Size, Color, Stock)" />
            <CardContent className="space-y-4">
              {variants.map((v, i) => (
                <div key={i} className="flex flex-col gap-4 p-4 bg-[#FAFAFA] rounded-xl border border-[#E5E5E5]">
                  <div className="grid grid-cols-6 gap-3 items-end">
                    <div>
                      <label className="block text-xs font-semibold text-[#666666] mb-1">Size</label>
                      <input
                        value={v.size} onChange={e => handleVariantChange(i, 'size', e.target.value)}
                        type="text" placeholder="e.g. XL"
                        className="w-full h-9 px-2 border border-[#E5E5E5] rounded-lg text-sm bg-white outline-none placeholder:text-[#CCCCCC]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#666666] mb-1">Color</label>
                      <input
                        value={v.color} onChange={e => handleVariantChange(i, 'color', e.target.value)}
                        type="text" placeholder="e.g. Black"
                        className="w-full h-9 px-2 border border-[#E5E5E5] rounded-lg text-sm outline-none placeholder:text-[#CCCCCC]"
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
                      <label className="block text-xs font-semibold text-[#666666] mb-1">Price (₹)</label>
                      <input
                        value={v.price} onChange={e => handleVariantChange(i, 'price', e.target.value)}
                        type="number" min="0" placeholder="Optional"
                        className="w-full h-9 px-2 border border-[#E5E5E5] rounded-lg text-sm outline-none placeholder:text-[#CCCCCC]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#666666] mb-1">Stock</label>
                      <input
                        value={v.stock_qty} onChange={e => handleVariantChange(i, 'stock_qty', e.target.value)}
                        type="number" min="0" placeholder="0"
                        className="w-full h-9 px-2 border border-[#E5E5E5] rounded-lg text-sm outline-none placeholder:text-[#CCCCCC]"
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
                  
                  <div className="pt-3 border-t border-[#E5E5E5]">
                    <p className="block text-xs font-semibold text-[#666666] mb-2">Variant Images</p>
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                      {(v.images || []).map((img, idx) => (
                        <div key={`v-${i}-exist-${idx}`} className="relative aspect-square rounded-lg border border-[#E5E5E5] overflow-hidden group bg-[#FAFAFA]">
                          <img src={img.url?.startsWith('http') ? img.url : `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:8000'}${img.url}`} alt="variant" className="w-full h-full object-cover" />
                          <button 
                            onClick={() => {
                              const newVs = [...variants];
                              newVs[i].images = newVs[i].images.filter((_, filterIdx) => filterIdx !== idx);
                              setVariants(newVs);
                            }}
                            className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      {(v.newImages || []).map((file, idx) => (
                        <div key={`v-${i}-new-${idx}`} className="relative aspect-square rounded-lg border border-[#E5E5E5] overflow-hidden group bg-[#FAFAFA]">
                          <img src={URL.createObjectURL(file)} alt="variant" className="w-full h-full object-cover" />
                          <button 
                            onClick={() => {
                              const newVs = [...variants];
                              newVs[i].newImages = newVs[i].newImages.filter((_, filterIdx) => filterIdx !== idx);
                              setVariants(newVs);
                            }}
                            className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <label className="flex flex-col items-center justify-center aspect-square rounded-lg border border-dashed border-[#CCCCCC] bg-[#FAFAFA] hover:border-[#111111] hover:text-[#111111] text-[#888888] cursor-pointer transition-colors">
                        <Plus className="w-4 h-4 mb-1" />
                        <span className="text-[10px] font-semibold text-center leading-tight">Add<br/>Images</span>
                        <input 
                          type="file" 
                          multiple 
                          accept="image/*"
                          className="hidden" 
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              const newVs = [...variants];
                              newVs[i].newImages = [...(newVs[i].newImages || []), ...Array.from(e.target.files)];
                              setVariants(newVs);
                            }
                          }} 
                        />
                      </label>
                    </div>
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
        </div>

        {/* RIGHT — organization */}
        <div className="lg:col-span-1 space-y-8">
          <Card>
            <CardHeader title="Product Thumbnail" />
            <CardContent className="space-y-4">
              <div className="w-full aspect-[3/4] rounded-lg border border-[#E5E5E5] overflow-hidden group bg-[#FAFAFA] relative">
                {(thumbnailFile || thumbnailUrl) ? (
                  <>
                    <img 
                      src={thumbnailFile ? URL.createObjectURL(thumbnailFile) : (thumbnailUrl?.startsWith('http') ? thumbnailUrl : `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:8000'}${thumbnailUrl}`)} 
                      alt="thumbnail" 
                      className="w-full h-full object-cover" 
                    />
                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <span className="px-4 py-2 bg-white text-[#111111] font-bold text-xs rounded-lg">Change Thumbnail</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setThumbnailFile(e.target.files[0])
                        }
                      }} />
                    </label>
                  </>
                ) : (
                  <label className="absolute inset-0 flex flex-col items-center justify-center text-[#888888] cursor-pointer hover:bg-[#F5F5F5] transition-colors">
                    <Plus className="w-8 h-8 mb-3" />
                    <span className="text-sm font-semibold">Upload Thumbnail</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setThumbnailFile(e.target.files[0])
                      }
                    }} />
                  </label>
                )}
              </div>
              <p className="text-xs text-[#888888] leading-relaxed">
                These images appear on the main product card and product page carousel.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Organization" />
            <CardContent className="space-y-5">

              {/* Step 1: Gender */}
              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-2">For *</label>
                <select
                  value={selectedGender} onChange={handleGenderChange}
                  className="w-full h-10 px-3 bg-white border border-[#E5E5E5] rounded-lg text-sm focus:border-[#111111] outline-none"
                >
                  <option value="">Select Audience</option>
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

              <div className="flex items-center gap-3 mt-4">
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
