import React, { useState } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { Card, CardHeader, CardContent } from '../../components/admin/ui/Card'
import { Layout, Image as ImageIcon, Type, Globe } from 'lucide-react'

export function AdminCMS() {
  const sections = [
    { title: 'Hero Banner', icon: ImageIcon, status: 'Published', lastUpdated: '2 hours ago' },
    { title: 'About Us', icon: Type, status: 'Draft', lastUpdated: '1 day ago' },
    { title: 'Home Collection', icon: Layout, status: 'Published', lastUpdated: '3 days ago' },
    { title: 'Footer Links', icon: Globe, status: 'Published', lastUpdated: '1 week ago' },
  ]

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">Content Management</h1>
          <p className="text-sm text-[#666666] mt-1">Manage landing pages, banners, and static content.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="h-9 px-4 bg-[#111111] text-white rounded-lg text-sm font-medium hover:bg-[#333333] transition-colors flex items-center justify-center">
            Create New Page
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section, idx) => {
          const Icon = section.icon
          return (
            <Card key={idx} className="group hover:border-[#111111] transition-colors cursor-pointer">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="w-10 h-10 rounded-lg bg-[#F5F5F5] flex items-center justify-center mb-4 group-hover:bg-black group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-[#111111] text-lg mb-1">{section.title}</h3>
                <div className="flex items-center gap-2 mt-auto pt-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    section.status === 'Published' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                  }`}>
                    {section.status}
                  </span>
                  <span className="text-xs text-[#888888]">Updated {section.lastUpdated}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </AdminLayout>
  )
}
