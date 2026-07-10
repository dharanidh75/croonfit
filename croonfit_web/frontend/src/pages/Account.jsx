import React, { useEffect, useState } from 'react'
import { Layout } from '../components/layout/Layout'
import { useStore } from '../store'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { LogOut, Package } from 'lucide-react'
import { StatusPill } from '../components/admin/StatusPill'

export function Account() {
  const { user, logout, isAuthenticated } = useStore()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    api.get('/orders')
      .then(res => setOrders(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [isAuthenticated, navigate])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (!isAuthenticated) return null

  return (
    <Layout>
      <div className="max-w-[1280px] mx-auto px-6 py-section-mob md:py-section-desk">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-border pb-6">
          <div>
            <h1 className="font-heading font-black text-4xl uppercase tracking-tighter mb-2">My Account</h1>
            <p className="font-body text-muted text-sm">Welcome back, {user?.full_name}</p>
            <p className="font-body text-muted text-sm mt-1">{user?.email}</p>
          </div>
          
          <button 
            onClick={handleLogout}
            className="mt-6 md:mt-0 flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-wider text-danger hover:text-text transition-colors duration-[150ms] linear"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        <div>
          <h2 className="font-heading font-bold text-2xl uppercase tracking-wider mb-6 flex items-center gap-3">
            <Package className="w-6 h-6" /> Order History
          </h2>

          {loading ? (
            <div className="py-12 text-center text-muted font-body">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="bg-surface p-12 text-center border border-border">
              <p className="font-body text-muted mb-4">You haven't placed any orders yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="border border-border p-6 hover:bg-surface transition-colors duration-[150ms] linear">
                  <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 pb-4 border-b border-border gap-4">
                    <div>
                      <div className="font-heading font-bold uppercase tracking-wider text-sm mb-1">
                        Order #{order.id}
                      </div>
                      <div className="font-body text-xs text-muted">
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-4 items-center">
                      <div className="text-right">
                        <div className="font-body font-bold text-sm">₹{order.total.toFixed(2)}</div>
                        <div className="font-body text-xs text-muted">{order.items.length} items</div>
                      </div>
                      <StatusPill status={order.status} />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    {order.items.map(item => (
                      <div key={item.id} className="flex gap-4 bg-white border border-border p-2 w-full md:w-[300px]">
                        <img 
                          src={item.product_snapshot.image || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&q=80"} 
                          alt={item.product_snapshot.name} 
                          className="w-16 h-20 object-cover mix-blend-multiply bg-surface"
                        />
                        <div className="flex-1">
                          <div className="font-heading font-bold text-xs uppercase mb-1">{item.product_snapshot.name}</div>
                          <div className="font-body text-[10px] text-muted">{item.product_snapshot.size} / {item.product_snapshot.color}</div>
                          <div className="font-body text-[10px] text-muted mt-1">Qty: {item.quantity}</div>
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
    </Layout>
  )
}
