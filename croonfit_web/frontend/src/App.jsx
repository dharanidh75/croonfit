import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AnimatePresence } from 'framer-motion'

// Customer Pages
import { Home }           from './pages/Home'
import { About }          from './pages/About'
import { Retail }         from './pages/Retail'
import { Wholesale }      from './pages/Wholesale'
import { Category }       from './pages/Category'
import { ProductListing } from './pages/ProductListing'
import { ProductDetail }  from './pages/ProductDetail'
import { Wishlist }       from './pages/Wishlist'
import { Cart }           from './pages/Cart'
import { Checkout }       from './pages/Checkout'
import { OrderSuccess }   from './pages/OrderSuccess'
import { Account }        from './pages/Account'
import { Login }          from './pages/Login'
import { NotFound }       from './pages/NotFound'

import { PageTransition } from './components/layout/PageTransition'

// Admin Pages (Lazy — keep admin bundle separate)
const AdminLogin     = React.lazy(() => import('./pages/admin/AdminLogin').then(m     => ({ default: m.AdminLogin })))
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })))
const AdminProducts = React.lazy(() => import('./pages/admin/AdminProducts').then(module => ({ default: module.AdminProducts })))
const AdminOrders   = React.lazy(() => import('./pages/admin/AdminOrders').then(module => ({ default: module.AdminOrders })))
const AdminBilling  = React.lazy(() => import('./pages/admin/AdminBilling').then(module => ({ default: module.AdminBilling })))

// Admin Phase 2
const ProductForm   = React.lazy(() => import('./pages/admin/products/ProductForm').then(module => ({ default: module.ProductForm })))
const Categories    = React.lazy(() => import('./pages/admin/products/Categories').then(module => ({ default: module.Categories })))

// Admin Phase 4, 5, 6
const AdminCustomers = React.lazy(() => import('./pages/admin/AdminCustomers').then(module => ({ default: module.AdminCustomers })))
const AdminDealers   = React.lazy(() => import('./pages/admin/AdminDealers').then(module => ({ default: module.AdminDealers })))
const AdminInventory = React.lazy(() => import('./pages/admin/AdminInventory').then(module => ({ default: module.AdminInventory })))

// Admin Phase 7, 8, 9
const AdminDiscounts = React.lazy(() => import('./pages/admin/AdminDiscounts').then(module => ({ default: module.AdminDiscounts })))
const AdminCMS       = React.lazy(() => import('./pages/admin/AdminCMS').then(module => ({ default: module.AdminCMS })))
const AdminAnalytics = React.lazy(() => import('./pages/admin/AdminAnalytics').then(module => ({ default: module.AdminAnalytics })))

// Admin Phase 10
const AdminSettings  = React.lazy(() => import('./pages/admin/AdminSettings').then(module => ({ default: module.AdminSettings })))

const AdminFallback = (
  <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
    <span className="font-heading font-bold text-sm uppercase tracking-wider text-[#888888]">Loading...</span>
  </div>
)

const AdminComingSoon = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
    <h2 className="text-2xl font-bold text-[#111111] mb-2">Coming Soon</h2>
    <p className="text-[#666666] text-sm">This module will be built in an upcoming phase.</p>
  </div>
)

// Wrapper for AdminLayout to use with ComingSoon
import { AdminLayout } from './components/admin/AdminLayout'
const ComingSoonPage = () => <AdminLayout><AdminComingSoon /></AdminLayout>

// Wrapper for AnimatePresence to work with useLocation
function AnimatedRoutes() {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* ── Customer Routes ──────────────────────────────────────────── */}
        <Route path="/"                            element={<PageTransition><Home /></PageTransition>} />
        <Route path="/about"                       element={<PageTransition><About /></PageTransition>} />
        <Route path="/retail"                      element={<PageTransition><Retail /></PageTransition>} />
        <Route path="/wholesale"                   element={<PageTransition><Wholesale /></PageTransition>} />
        <Route path="/product/:slug"               element={<PageTransition><ProductDetail /></PageTransition>} />
        <Route path="/wishlist"                    element={<PageTransition><Wishlist /></PageTransition>} />
        <Route path="/cart"                        element={<PageTransition><Cart /></PageTransition>} />
        <Route path="/checkout"                    element={<PageTransition><Checkout /></PageTransition>} />
        <Route path="/order-success"               element={<PageTransition><OrderSuccess /></PageTransition>} />
        <Route path="/account"                     element={<PageTransition><Account /></PageTransition>} />
        <Route path="/login"                       element={<PageTransition><Login /></PageTransition>} />
        
        {/* Global Products / Search Route */}
        <Route path="/products"                    element={<PageTransition><ProductListing /></PageTransition>} />

        {/* Dynamic Category Routes - Put after static routes to avoid shadowing */}
        <Route path="/:category"                   element={<PageTransition><Category /></PageTransition>} />
        <Route path="/:category/:subcategory"      element={<PageTransition><ProductListing /></PageTransition>} />

        {/* ── Admin Routes (lazy) ────────────────────────────────────── */}
        <Route path="/admin/login"    element={<Suspense fallback={AdminFallback}><AdminLogin /></Suspense>} />
        <Route path="/admin"          element={<Suspense fallback={AdminFallback}><AdminDashboard /></Suspense>} />
        
        {/* Phase 2: Products Module */}
        <Route path="/admin/products"            element={<Suspense fallback={AdminFallback}><AdminProducts /></Suspense>} />
        <Route path="/admin/products/new"        element={<Suspense fallback={AdminFallback}><ProductForm /></Suspense>} />
        <Route path="/admin/products/categories" element={<Suspense fallback={AdminFallback}><Categories /></Suspense>} />

        <Route path="/admin/orders"   element={<Suspense fallback={AdminFallback}><AdminOrders /></Suspense>} />
        <Route path="/admin/billing"  element={<Suspense fallback={AdminFallback}><AdminBilling /></Suspense>} />
        
        {/* Phases 4, 5, 6 */}
        <Route path="/admin/customers"    element={<Suspense fallback={AdminFallback}><AdminCustomers /></Suspense>} />
        <Route path="/admin/dealers"      element={<Suspense fallback={AdminFallback}><AdminDealers /></Suspense>} />
        <Route path="/admin/inventory"    element={<Suspense fallback={AdminFallback}><AdminInventory /></Suspense>} />
        
        {/* Phases 7, 8, 9 */}
        <Route path="/admin/discounts"    element={<Suspense fallback={AdminFallback}><AdminDiscounts /></Suspense>} />
        <Route path="/admin/cms"          element={<Suspense fallback={AdminFallback}><AdminCMS /></Suspense>} />
        <Route path="/admin/analytics"    element={<Suspense fallback={AdminFallback}><AdminAnalytics /></Suspense>} />
        
        {/* Phase 10 */}
        <Route path="/admin/settings"     element={<Suspense fallback={AdminFallback}><AdminSettings /></Suspense>} />

        {/* ── 404 ──────────────────────────────────────────────────────── */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  )
}

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
            fontFamily: '"Inter", sans-serif',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            fontSize: '12px',
            letterSpacing: '0.05em',
          },
        }}
      />
      <AnimatedRoutes />
    </BrowserRouter>
  )
}

export default App
