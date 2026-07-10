import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Customer Pages
import { Home }          from './pages/Home'
import { Shop }          from './pages/Shop'
import { UserType }      from './pages/UserType'
import { CategoryHub }   from './pages/CategoryHub'
import { ProductDetail } from './pages/ProductDetail'
import { Checkout }      from './pages/Checkout'
import { OrderSuccess }  from './pages/OrderSuccess'
import { Wishlist }      from './pages/Wishlist'
import { Lookbook }      from './pages/Lookbook'
import { Account }       from './pages/Account'
import { Login }         from './pages/Login'
import { NotFound }      from './pages/NotFound'

// Admin Pages (Lazy — keep admin bundle separate)
const AdminLogin     = React.lazy(() => import('./pages/admin/AdminLogin').then(m     => ({ default: m.AdminLogin })))
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })))
const AdminProducts  = React.lazy(() => import('./pages/admin/AdminProducts').then(m  => ({ default: m.AdminProducts })))
const AdminOrders    = React.lazy(() => import('./pages/admin/AdminOrders').then(m    => ({ default: m.AdminOrders })))
const AdminBilling   = React.lazy(() => import('./pages/admin/AdminBilling').then(m   => ({ default: m.AdminBilling })))

const AdminFallback = (
  <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
    <span className="font-heading font-bold text-sm uppercase tracking-wider text-[#888888]">Loading...</span>
  </div>
)

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: '0',
            background: '#0A0A0A',
            color: '#fff',
            fontFamily: '"Space Grotesk", sans-serif',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            fontSize: '12px',
            letterSpacing: '0.05em',
          },
        }}
      />

      <Routes>
        {/* ── Customer Routes ──────────────────────────────────────────── */}
        <Route path="/"               element={<Home />} />
        <Route path="/type"           element={<UserType />} />
        <Route path="/categories"     element={<CategoryHub />} />
        <Route path="/shop"           element={<Shop />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/checkout"       element={<Checkout />} />
        <Route path="/order-success"  element={<OrderSuccess />} />
        <Route path="/wishlist"       element={<Wishlist />} />
        <Route path="/lookbook"       element={<Lookbook />} />
        <Route path="/account"        element={<Account />} />
        <Route path="/login"          element={<Login />} />

        {/* ── Admin Routes (lazy) ────────────────────────────────────── */}
        <Route path="/admin/login"    element={<Suspense fallback={AdminFallback}><AdminLogin /></Suspense>} />
        <Route path="/admin"          element={<Suspense fallback={AdminFallback}><AdminDashboard /></Suspense>} />
        <Route path="/admin/products" element={<Suspense fallback={AdminFallback}><AdminProducts /></Suspense>} />
        <Route path="/admin/orders"   element={<Suspense fallback={AdminFallback}><AdminOrders /></Suspense>} />
        <Route path="/admin/billing"  element={<Suspense fallback={AdminFallback}><AdminBilling /></Suspense>} />

        {/* ── 404 ──────────────────────────────────────────────────────── */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
