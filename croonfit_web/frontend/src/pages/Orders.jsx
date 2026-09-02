import React, { useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { useStore } from '../store'
import { useNavigate, Link } from 'react-router-dom'
import { Package, ArrowLeft } from 'lucide-react'
import { StatusPill } from '../components/admin/StatusPill'
import api from '../lib/api'
import { ImageWithFallback } from '../components/ui/ImageWithFallback'

export function Orders() {
  const { isAuthenticated } = useStore()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    api.get('/orders/me')
      .then(res => setOrders(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-white font-sans text-[#0A0A0A] flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-32">
        <div className="max-w-[1000px] mx-auto px-6">
          
          <Link to="/account" className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-[#888888] hover:text-[#0A0A0A] transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Account
          </Link>

          <h1 className="font-heading font-black text-3xl uppercase tracking-tighter mb-8 flex items-center gap-3">
            <Package className="w-6 h-6" /> My Orders
          </h1>

          {loading ? (
            <div className="py-12 text-center text-muted font-body">Loading orders...</div>
          ) : orders.filter(o => o.status !== 'PENDING').length === 0 ? (
            <div className="bg-[#F5F5F5] p-12 text-center rounded-2xl">
              <Package className="w-12 h-12 text-[#888888] mx-auto mb-4 opacity-50" />
              <p className="font-body text-[#555555] mb-6">You haven't placed any orders yet.</p>
              <Link to="/retail" className="inline-block px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-gray-900 transition-colors">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.filter(o => o.status !== 'PENDING').map(order => (
                <div key={order.id} className="border border-[#E5E5E5] rounded-2xl p-6 hover:shadow-sm transition-shadow duration-300">
                  <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 pb-4 border-b border-[#F5F5F5] gap-4">
                    <div>
                      <div className="font-heading font-bold uppercase tracking-wider text-sm mb-1">
                        Order #{order.id}
                      </div>
                      <div className="font-body text-xs text-[#888888]">
                        Placed on {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-4 items-center">
                      <div className="text-right">
                        <div className="font-body font-bold text-sm">₹{order.total.toFixed(2)}</div>
                        <div className="font-body text-xs text-[#888888]">{order.items.length} items</div>
                      </div>
                      <StatusPill status={order.status} />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    {order.items.map(item => (
                      <div key={item.id} className="flex gap-4 bg-white border border-[#E5E5E5] p-3 rounded-xl w-full md:w-[320px]">
                        <div className="w-16 h-20 bg-[#F5F5F5] rounded-lg overflow-hidden flex-shrink-0">
                          {/* ImageWithFallback doesn't have the image url in item currently (unless backend includes it). We'll assume backend sends it or we use a fallback */}
                          <ImageWithFallback
                            src={item.product_image || ''}
                            alt={item.product_name}
                            className="w-full h-full object-cover mix-blend-multiply"
                          />
                        </div>
                        <div className="flex-1 py-1">
                          <div className="font-heading font-bold text-xs uppercase mb-1 line-clamp-1">{item.product_name}</div>
                          <div className="font-body text-[10px] text-[#888888] mb-1">{item.variant_label}</div>
                          <div className="font-body text-[10px] font-bold text-[#555555]">Qty: {item.quantity}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
