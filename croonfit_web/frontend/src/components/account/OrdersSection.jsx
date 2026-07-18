import React, { useEffect, useState } from 'react'
import { ArrowLeft, Package } from 'lucide-react'
import { Link } from 'react-router-dom'
import { StatusPill } from '../../components/admin/StatusPill'
import { ImageWithFallback } from '../../components/ui/ImageWithFallback'
import api from '../../lib/api'

export function OrdersSection({ onBack }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/orders/me')
      .then(res => setOrders(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="animate-fade-in-up">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#888888] hover:text-black transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Account
      </button>

      <div className="bg-[#F9F9F9] border border-[#EBEBEB] rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-[#EBEBEB]">
          <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-xl uppercase tracking-wide">My Orders</h2>
            <p className="text-sm text-[#888888]">Track, return, or buy things again</p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-muted font-body">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white border border-[#E5E5E5] p-12 text-center rounded-2xl">
            <Package className="w-12 h-12 text-[#888888] mx-auto mb-4 opacity-50" />
            <p className="font-body text-[#555555] mb-6">You haven't placed any orders yet.</p>
            <Link to="/retail" className="inline-block px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-gray-900 transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white border border-[#E5E5E5] rounded-2xl p-6 hover:shadow-sm transition-shadow duration-300">
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
                    <div key={item.id} className="flex gap-4 bg-[#F9F9F9] border border-[#EBEBEB] p-3 rounded-xl w-full md:w-[320px]">
                      <div className="w-16 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0">
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
    </div>
  )
}
