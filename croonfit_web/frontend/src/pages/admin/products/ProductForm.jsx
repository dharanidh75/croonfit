import React from 'react'
import { AdminLayout } from '../../../components/admin/AdminLayout'
import { Card, CardHeader, CardContent } from '../../../components/admin/ui/Card'
import { UploadCloud, X } from 'lucide-react'

export function ProductForm() {
  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">Add Product</h1>
          <p className="text-sm text-[#666666] mt-1">Create a new product in your catalog.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="h-9 px-4 bg-white border border-[#E5E5E5] text-[#111111] rounded-lg text-sm font-medium hover:bg-[#F9F9F9] transition-colors">
            Discard
          </button>
          <button className="h-9 px-6 bg-[#111111] text-white rounded-lg text-sm font-medium hover:bg-[#333333] transition-colors">
            Save Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-8">
          
          <Card>
            <CardHeader title="Basic Details" />
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-2">Product Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Oversized Heavyweight Tee" 
                  className="w-full h-10 px-3 bg-white border border-[#E5E5E5] rounded-lg text-sm focus:border-[#111111] focus:ring-1 focus:ring-[#111111] outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-2">Description</label>
                <textarea 
                  rows={4}
                  placeholder="Detailed product description..." 
                  className="w-full p-3 bg-white border border-[#E5E5E5] rounded-lg text-sm focus:border-[#111111] focus:ring-1 focus:ring-[#111111] outline-none transition-all resize-none"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Media" description="Upload product images." />
            <CardContent>
              <div className="border-2 border-dashed border-[#E5E5E5] rounded-xl p-10 flex flex-col items-center justify-center text-center hover:bg-[#F9F9F9] transition-colors cursor-pointer group">
                <div className="w-12 h-12 bg-white border border-[#E5E5E5] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-6 h-6 text-[#111111]" />
                </div>
                <p className="text-sm font-semibold text-[#111111]">Click to upload or drag and drop</p>
                <p className="text-xs text-[#888888] mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Pricing & Inventory" />
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#111111] mb-2">Price (₹)</label>
                  <input type="number" className="w-full h-10 px-3 bg-white border border-[#E5E5E5] rounded-lg text-sm focus:border-[#111111] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#111111] mb-2">Compare at Price (₹)</label>
                  <input type="number" className="w-full h-10 px-3 bg-white border border-[#E5E5E5] rounded-lg text-sm focus:border-[#111111] outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 border-t border-[#E5E5E5] pt-6">
                <div>
                  <label className="block text-sm font-semibold text-[#111111] mb-2">SKU</label>
                  <input type="text" className="w-full h-10 px-3 bg-white border border-[#E5E5E5] rounded-lg text-sm focus:border-[#111111] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#111111] mb-2">Barcode</label>
                  <input type="text" className="w-full h-10 px-3 bg-white border border-[#E5E5E5] rounded-lg text-sm focus:border-[#111111] outline-none" />
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Column - Organization */}
        <div className="lg:col-span-1 space-y-8">
          
          <Card>
            <CardHeader title="Status" />
            <CardContent>
              <select className="w-full h-10 px-3 bg-white border border-[#E5E5E5] rounded-lg text-sm focus:border-[#111111] outline-none">
                <option>Active</option>
                <option>Draft</option>
                <option>Archived</option>
              </select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Organization" />
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-2">Category</label>
                <select className="w-full h-10 px-3 bg-white border border-[#E5E5E5] rounded-lg text-sm focus:border-[#111111] outline-none">
                  <option>T-Shirts</option>
                  <option>Hoodies</option>
                  <option>Accessories</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-2">Product Type</label>
                <input type="text" placeholder="e.g. Topwear" className="w-full h-10 px-3 bg-white border border-[#E5E5E5] rounded-lg text-sm focus:border-[#111111] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-2">Tags</label>
                <input type="text" placeholder="Summer, Essential..." className="w-full h-10 px-3 bg-white border border-[#E5E5E5] rounded-lg text-sm focus:border-[#111111] outline-none" />
              </div>
            </CardContent>
          </Card>

        </div>

      </div>
    </AdminLayout>
  )
}
