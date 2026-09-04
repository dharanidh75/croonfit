import re

with open("frontend/src/pages/admin/products/ProductForm.jsx", "r") as f:
    content = f.read()

# 1. State changes
content = content.replace(
    "const [existingImages, setExistingImages] = useState([])\n  const [mainImages, setMainImages] = useState([])",
    "const [thumbnailUrl, setThumbnailUrl] = useState('')\n  const [thumbnailFile, setThumbnailFile] = useState(null)"
)

# 2. productData mapping
mapping_old = """          if (p.images && p.images.length > 0) {
            setExistingImages(p.images)
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
              image_url: v.image_url || '',
            })))
          }"""
mapping_new = """          if (p.thumbnail_url) {
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
          }"""
content = content.replace(mapping_old, mapping_new)

# 3. addVariant
add_variant_old = """  const addVariant = () => {
    setVariants([...variants, {
      id: null,
      size: '',
      color: '',
      color_hex: '#000000',
      stock_qty: 0,
      sku: '',
      price: '',
      image_file: null
    }])
  }"""
add_variant_new = """  const addVariant = () => {
    setVariants([...variants, {
      id: null,
      size: '',
      color: '',
      color_hex: '#000000',
      stock_qty: 0,
      sku: '',
      price: '',
      images: [],
      newImages: []
    }])
  }"""
content = content.replace(add_variant_old, add_variant_new)

# 4. handleSubmit image uploads
submit_old = """      const uploadedImages = [...existingImages]
      let maxSort = uploadedImages.length > 0 ? Math.max(...uploadedImages.map(img => img.sort_order || 0)) : -1
      
      for (let i = 0; i < mainImages.length; i++) {
        const file = mainImages[i]
        const fData = new FormData()
        fData.append('file', file)
        const res = await adminApi.post('/admin/upload', fData)
        maxSort++
        uploadedImages.push({ url: res.data.url, is_primary: uploadedImages.length === 0, sort_order: maxSort })
      }

      const uploadedVariants = []
      for (let i = 0; i < variants.length; i++) {
        const v = variants[i]
        let uploadedUrl = null
        if (v.image_file) {
          const fData = new FormData()
          fData.append('file', v.image_file)
          const res = await adminApi.post('/admin/upload', fData)
          uploadedUrl = res.data.url
        }
        uploadedVariants.push({
          id: v.id,
          size: v.size,
          color: v.color,
          color_hex: v.color_hex,
          stock_qty: parseInt(v.stock_qty || 0),
          sku: v.sku || `${slug}-${v.size}-${v.color}-${i}`.toLowerCase().replace(/\s+/g, '-'),
          price: v.price ? parseFloat(v.price) : null,
          image_url: uploadedUrl || v.image_url
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
        images: uploadedImages,
        variants: uploadedVariants,
      }"""
submit_new = """      let finalThumbnailUrl = thumbnailUrl
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
      }"""
content = content.replace(submit_old, submit_new)

# 5. Variant UI (image_file to newImages array)
variant_ui_old = """                        <p className="text-xs font-semibold text-[#111111] mb-2">Variant Image (.webp only)</p>
                        {(v.image_url || v.image_file) ? (
                          <div className="flex items-center gap-4">
                            <img 
                              src={v.image_file ? URL.createObjectURL(v.image_file) : (v.image_url.startsWith('http') ? v.image_url : `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:8000'}${v.image_url}`)} 
                              alt="variant" 
                              className="w-12 h-12 rounded-lg object-cover border border-[#E5E5E5]"
                            />
                            <div className="flex items-center gap-2">
                              <label className="cursor-pointer px-3 py-1.5 text-xs font-semibold bg-[#111111] text-white rounded-lg hover:bg-[#333333] transition-colors">
                                Replace
                                <input 
                                  type="file" 
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => e.target.files && handleVariantChange(i, 'image_file', e.target.files[0])}
                                />
                              </label>
                              <button
                                onClick={() => handleVariantChange(i, 'image_file', null)}
                                className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ) : (
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => e.target.files && handleVariantChange(i, 'image_file', e.target.files[0])}
                            className="block w-full text-sm text-[#666666] file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#111111] file:text-white hover:file:bg-[#333333] transition-colors cursor-pointer"
                          />
                        )}"""
variant_ui_new = """                        <p className="text-xs font-semibold text-[#111111] mb-2">Variant Images</p>
                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                          {(v.images || []).map((img, idx) => (
                            <div key={`v-${i}-exist-${idx}`} className="relative aspect-square rounded-lg border border-[#E5E5E5] overflow-hidden group bg-[#FAFAFA]">
                              <img src={img.url.startsWith('http') ? img.url : `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:8000'}${img.url}`} alt="variant" className="w-full h-full object-cover" />
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
                            <Plus className="w-4 h-4" />
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
                        </div>"""
content = content.replace(variant_ui_old, variant_ui_new)

# 6. Main Product Image UI (change multiple to single thumbnail)
right_panel_old = """        {/* RIGHT — organization */}
        <div className="lg:col-span-1 space-y-8">
          <Card>
            <CardHeader title="Product Images" />
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {existingImages.map((img, i) => (
                  <div key={`exist-${i}`} className="relative aspect-square rounded-lg border border-[#E5E5E5] overflow-hidden group bg-[#FAFAFA]">
                    <img src={img.url.startsWith('http') ? img.url : `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:8000'}${img.url}`} alt="product" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => setExistingImages(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {mainImages.map((img, i) => (
                  <div key={`new-${i}`} className="relative aspect-square rounded-lg border border-[#E5E5E5] overflow-hidden group bg-[#FAFAFA]">
                    <img src={URL.createObjectURL(img)} alt="product" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => setMainImages(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <label className="flex flex-col items-center justify-center aspect-square rounded-lg border border-dashed border-[#CCCCCC] bg-[#FAFAFA] hover:border-[#111111] hover:text-[#111111] text-[#888888] cursor-pointer transition-colors">
                  <Plus className="w-6 h-6 mb-2" />
                  <span className="text-xs font-semibold">Upload</span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => {
                    if (e.target.files) {
                      setMainImages(prev => [...prev, ...Array.from(e.target.files)])
                    }
                  }} />
                </label>
              </div>
            </CardContent>
          </Card>"""
right_panel_new = """        {/* RIGHT — organization */}
        <div className="lg:col-span-1 space-y-8">
          <Card>
            <CardHeader title="Product Thumbnail" />
            <CardContent className="space-y-4">
              <div className="w-full aspect-[3/4] rounded-lg border border-[#E5E5E5] overflow-hidden group bg-[#FAFAFA] relative">
                {(thumbnailFile || thumbnailUrl) ? (
                  <>
                    <img 
                      src={thumbnailFile ? URL.createObjectURL(thumbnailFile) : (thumbnailUrl.startsWith('http') ? thumbnailUrl : `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:8000'}${thumbnailUrl}`)} 
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
              <p className="text-xs text-[#666666] text-center">
                This image will be used on the catalog and home pages.
              </p>
            </CardContent>
          </Card>"""
content = content.replace(right_panel_old, right_panel_new)

with open("frontend/src/pages/admin/products/ProductForm.jsx", "w") as f:
    f.write(content)
