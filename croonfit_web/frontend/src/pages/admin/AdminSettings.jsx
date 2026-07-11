import React from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { Card, CardHeader, CardContent } from '../../components/admin/ui/Card'
import { Settings, Shield, Bell, CreditCard, Mail, Store, Users } from 'lucide-react'

export function AdminSettings() {
  const settingModules = [
    { title: 'Store Details', description: 'Manage your store name, contact email, and address.', icon: Store },
    { title: 'Payment Providers', description: 'Configure Stripe, Razorpay, or custom gateways.', icon: CreditCard },
    { title: 'Notifications', description: 'Manage email templates and SMS alerts for customers.', icon: Bell },
    { title: 'Staff Roles', description: 'Add staff members and configure their permissions.', icon: Users },
    { title: 'Security', description: 'Two-factor authentication and access logs.', icon: Shield },
    { title: 'Emails', description: 'SMTP configuration and sender domains.', icon: Mail },
  ]

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111111]">Settings</h1>
          <p className="text-sm text-[#666666] mt-1">Configure your store settings and admin preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingModules.map((module, idx) => {
          const Icon = module.icon
          return (
            <Card key={idx} className="group hover:border-[#111111] transition-colors cursor-pointer">
              <CardContent className="p-6 flex items-start gap-4 h-full">
                <div className="w-10 h-10 rounded-lg bg-[#F5F5F5] flex items-center justify-center flex-shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#111111] text-base mb-1 group-hover:underline">{module.title}</h3>
                  <p className="text-sm text-[#666666] leading-relaxed">{module.description}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </AdminLayout>
  )
}
